import { Component, OnInit, Input } from '@angular/core';
import { ContractDeployment } from '@factory/contract-deployment';
import { ContractDeploymentFactory } from '@factory/contract-deployment.factory';
import { Crowdsale } from '@model/crowdsale.model';
import { Token } from '@model/token.model';
import { WalletService } from '@service/wallet.service';
import { EthereumService } from '@service/ethereum.service';
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

  deployer: ContractDeployment

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

    this.deployer = contractFactory.deployer
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

  onCreateCrowdsale() {

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
      let txCost = await this.deployer.estimateCrowdsaleDeploymentCost()
      this.steps.estimateTxCosts.estimates[0].txCost = txCost.ETH

      this.steps.estimateTxCosts.estimates.push({
        text: 'Approve crowdsale to transfer the token percentage in your behalf',
        txCost: '...'
      })
      txCost = await this.deployer.estimateTokenTransferCost()
      const simpleICOCost = await this.deployer.estimateSimpleICOCost()
      const cost = txCost.cost.add(simpleICOCost.cost)
      this.steps.estimateTxCosts.estimates[1].txCost = ethers.utils.formatEther(cost.toString())

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
