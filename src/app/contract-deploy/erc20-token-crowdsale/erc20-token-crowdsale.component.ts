import { Component, OnInit, Input } from '@angular/core';
import { ContractDeployment } from '@factory/contract-deployment';
import { ERC20TokenCrowdsaleDeployment } from '@factory/token-crowdsale.deployment';
import { ContractDeploymentFactory } from '@factory/contract-deployment.factory';
import { Crowdsale } from '@model/crowdsale.model';
import { Token } from '@model/token.model';
import { WalletService } from 'scui-lib';
import { EthereumService } from 'scui-lib';
import { SharedService } from '@service/shared.service';
import { Router } from '@angular/router';
import { InsufficientFundsError } from '@error/insufficient-funds.error';
import { SimpleTokenContract } from '@contract/simpletoken.contract';

declare var require: any
const ethers = require('ethers')
const Web3 = require('web3')

@Component({
  selector: 'app-erc20-token-crowdsale',
  templateUrl: './erc20-token-crowdsale.component.html',
  styleUrls: ['./erc20-token-crowdsale.component.scss']
})
export class Erc20TokenCrowdsaleComponent implements OnInit {

  deployer: ERC20TokenCrowdsaleDeployment

  token: Token

  crowdsale: Crowdsale

  stepCount: number = 0

  @Input() gasPrice: number

  steps: any = {
    crowdsaleSetup: {
      step: 1,
      isCurrent: true,
      isComplete: false,
      hasError: false,
      errorMessage: '',
    },
    estimateTxCosts: {
      step: 2,
      isCurrent: false,
      isComplete: false,
      hasError: false,
      estimates: []
    },
    deployCrowdsale: {
      step: 3,
      isCurrent: false,
      isComplete: false,
      hasError: false,
      errorMessage: '',
    },
    transferToken: {
      step: 4,
      isCurrent: false,
      isComplete: false,
      hasError: false,
      errorMessage: '',
    }
  }

  constructor(
    private contractFactory: ContractDeploymentFactory,
    public wallet: WalletService,
    public eth: EthereumService,
    private router: Router,
    public shared: SharedService) {

    this.deployer = contractFactory.deployer as ERC20TokenCrowdsaleDeployment
    this.gasPrice = Web3.utils.fromWei(eth.defaultGasPrice.toString(), 'gwei')
  }

  ngOnInit() {
    this.token = this.deployer.getToken()
    this.crowdsale = this.deployer.getCrowdsale()
    this.crowdsale.token = this.token as SimpleTokenContract

    this.stepCount = Object.keys(this.steps).length
  }

  updateGasPrice() {
    this.deployer.gas = 0
    this.eth.updateGasPrice(this.gasPrice)
    this.estimateTransactionCosts()
  }

  reset() {
    Object.keys(this.steps).forEach(key => {
      const step = this.steps[key]
      step.isCurrent = false
      step.isComplete = false
      step.hasError = false
    })

    this.steps.crowdsaleSetup.isCurrent = true
    this.steps.estimateTxCosts.estimates = []
  }

  setBeneficiary() {
    const beneficiary = this.deployer.wallet.address
    this.crowdsale.setBeneficiary(beneficiary)
  }

  finish() {
    try {
      this.deployer.addCrowdsaleToSimpleICOContract()

      return this.router.navigate([`/contract/${this.crowdsale.address}/show/${this.deployer.type}`])
    } catch (error) {
      console.log(error)
    }
  }

  async onCreateCrowdsale() {

    if (isNaN(Number(this.crowdsale.price)) || this.crowdsale.price <= 0) {
      this.steps.crowdsaleSetup.hasError = true
      this.steps.crowdsaleSetup.errorMessage = `Price value must be in ETH and be greater than 0`
      return false
    }

    if (isNaN(Number(this.crowdsale.percentage)) || this.crowdsale.percentage <= 0) {
      this.steps.crowdsaleSetup.hasError = true
      this.steps.crowdsaleSetup.errorMessage = `Percentage must be greater than 0`
      return false
    }

    if (!Web3.utils.isAddress(this.crowdsale.beneficiary)) {
      this.steps.crowdsaleSetup.hasError = true
      this.steps.crowdsaleSetup.errorMessage = `Beneficiary address is invalid`
      return false
    }

    this.steps.crowdsaleSetup.hasError = false
    this.steps.crowdsaleSetup.errorMessage = ''

    this.crowdsale.setBeneficiary(this.crowdsale.beneficiary)

    this.steps.crowdsaleSetup.isComplete = true
    this.estimateTransactionCosts()
  }

  async deployCrowdsale() {
    this.steps.estimateTxCosts.isCurrent = false
    this.steps.estimateTxCosts.isComplete = true

    this.steps.deployCrowdsale.isCurrent = true
    this.steps.deployCrowdsale.hasError = false

    try {
      await this.deployer.deployCrowdsale()
      await this.deployer.setTokenPrice()

      this.steps.deployCrowdsale.isComplete = true
    } catch (error) {
      console.log(error)
      this.steps.deployCrowdsale.hasError = true
      this.steps.deployCrowdsale.isComplete = false
      this.steps.deployCrowdsale.errorMessage = `Your crowdsale wasn't deployed but you didn't lose ETH funds.
      Retry this deployment or go to your token page`
    }
  }

  async approve() {
    this.steps.transferToken.isCurrent = true
    this.steps.transferToken.hasError = false
    this.steps.deployCrowdsale.isCurrent = false

    try {
      await this.token.getBalanceOf()
      const balanceOf = ethers.utils.bigNumberify(this.token.balanceOf)
      const percentage = ethers.utils.bigNumberify(this.crowdsale.percentage)
      const amount = balanceOf.mul(percentage).div(100)

      await this.deployer.approve(amount)

      this.steps.transferToken.isComplete = true
    } catch (error) {
      console.log(error)
      this.steps.transferToken.hasError = true
      this.steps.transferToken.isComplete = false
      this.steps.transferToken.errorMessage = `Something went wrong`
    }
  }

  async estimateTransactionCosts() {

    this.steps.crowdsaleSetup.isCurrent = false

    this.steps.estimateTxCosts.isCurrent = true
    this.steps.estimateTxCosts.isComplete = false
    this.steps.estimateTxCosts.hasError = false
    this.steps.estimateTxCosts.estimates = []

    try {
      await this.wallet.getAccountBalance()
      await this.deployer.getTxCost()

      this.steps.estimateTxCosts.estimates.push({
        text: 'Crowdsale contract deployment',
        txCost: '...'
      })
      const tx1 = await this.deployer.estimateCrowdsaleDeploymentCost()
      this.steps.estimateTxCosts.estimates[0].txCost = tx1.ETH

      this.steps.estimateTxCosts.estimates.push({
        text: 'Approve crowdsale to transfer the token percentage on your behalf',
        txCost: '...'
      })
      const tx2 = await this.deployer.estimateTokenTransferCost()
      const tx3 = await this.deployer.estimateSimpleICOCost()
      const txCost = tx2.cost.add(tx3.cost)
      this.steps.estimateTxCosts.estimates[1].txCost = ethers.utils.formatEther(txCost.toString())

      this.steps.estimateTxCosts.estimates.push({
        text: 'TOTAL',
        txCost: this.deployer.txCost.ETH
      })

      const wei = this.deployer.txCost.WEI
      const hasInsufficientFunds = wei.gt(this.wallet.balance)

      if (hasInsufficientFunds) {
        throw new InsufficientFundsError(InsufficientFundsError.MESSAGE)
      }

      this.steps.estimateTxCosts.isComplete = true

    } catch (error) {
      if (error instanceof InsufficientFundsError) {
        this.steps.estimateTxCosts.hasError = true
        this.steps.estimateTxCosts.isComplete = false
      }
    }
  }
}
