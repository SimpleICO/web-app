import { Component, OnInit, Input } from '@angular/core';
import { ContractDeploymentFactory } from '@factory/contract-deployment.factory';
import { ContractDeployment } from '@factory/contract-deployment';
import { SimpleTokenContract } from '@contract/simpletoken.contract';
import { SimpleCrowdsaleContract } from '@contract/simplecrowdsale.contract';
import { SimpleICOContract } from '@contract/simpleico.contract';
import { InsufficientFundsError } from '@error/insufficient-funds.error';
import { WalletService } from '@service/wallet.service';
import { EthereumService } from '@service/ethereum.service';
import { SharedService } from '@service/shared.service';
import { Router } from '@angular/router';
import { Crowdsale } from '@model/crowdsale.model';
import { Token } from '@model/token.model';

declare var require: any
const ethers = require('ethers')
const Web3 = require('web3')


@Component({
  selector: 'app-fixed-supply',
  templateUrl: './fixed-supply.component.html',
  styleUrls: ['./fixed-supply.component.css']
})
export class FixedSupplyComponent implements OnInit {

  deployer: ContractDeployment

  token: Token

  crowdsale: Crowdsale

  stepCount: number = 0

  supply: string

  steps: any = {
    estimateTxCosts: {
      step: 1,
      isCurrent: true,
      isComplete: false,
      hasError: false,
      estimates: []
    },
    deployToken: {
      step: 2,
      isCurrent: false,
      isComplete: false,
      hasError: false,
      errorMessage: '',
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

  @Input() gasPrice: number

  constructor(
    private contractFactory: ContractDeploymentFactory,
    public wallet: WalletService,
    public eth: EthereumService,
    private router: Router,
    public shared: SharedService) {

    this.deployer = contractFactory.deployer

    this.gasPrice = ethers.utils.bigNumberify(eth.defaultGasPrice.toString()).div(1e9.toString()).toString()
  }

  ngOnInit() {
    this.token = this.deployer.getToken()
    this.crowdsale = this.deployer.getCrowdsale()

    this.stepCount = Object.keys(this.steps).length

    this.init()
  }

  updateGasPrice() {

    this.deployer.gas = 0
    this.eth.updateGasPrice(this.gasPrice)
    this.init()
  }

  finish() {
    try {
      this.deployer.addCrowdsaleToSimpleICOContract()

      return this.router.navigate([`/contract/${this.crowdsale.address}/show/${this.deployer.type}`])
    } catch (error) {
      console.log(error)
    }
  }

  reset() {

    Object.keys(this.steps).forEach(key => {
      const step = this.steps[key]
      step.isCurrent = false
      step.isComplete = false
      step.hasError = false
    })

    this.steps.estimateTxCosts.isCurrent = true
    this.steps.estimateTxCosts.estimates = []
  }

  async init() {
    this.reset()

    try {
      await this.wallet.getAccountBalance()
      await this.estimateTransactionCosts()
    } catch (error) {
      if (error instanceof InsufficientFundsError) {
        this.steps.estimateTxCosts.hasError = true
      }
    }
  }

  async deployToken() {
    this.supply = this.token.supply.toString()

    this.steps.estimateTxCosts.isCurrent = false
    this.steps.deployToken.isCurrent = true
    this.steps.deployToken.hasError = false

    try {
      const receipt = await this.deployer.deployToken()
      this.token.setAddress(receipt.contractAddress)

      await this.deployer.getTokenSupply()

      this.steps.deployToken.isComplete = true
    } catch (error) {
      console.log(error)
      this.steps.deployToken.hasError = true
      this.steps.deployToken.errorMessage = `Your token wasn't deployed but you didn't lose ETH funds.
        This may be caused by the network performance.
        If the <a href="${this.eth.etherscanURL}/address/${this.wallet.getAddress()}">transaction</a> is still running, wait before you retry.`
    }
  }

  async deployCrowdsale() {
    this.steps.deployToken.isCurrent = false
    this.steps.deployCrowdsale.isCurrent = true
    this.steps.deployCrowdsale.hasError = false

    try {
      await this.deployer.deployCrowdsale()

      this.steps.deployCrowdsale.isComplete = true
    } catch (error) {
      console.log(error)
      this.steps.deployCrowdsale.hasError = true
      this.steps.deployCrowdsale.errorMessage = `Your crowdsale wasn't deployed but you didn't lose ETH funds. Retry this deployment or go to your token page`
    }
  }

  async transferToken() {
    this.steps.transferToken.isCurrent = true
    this.steps.deployCrowdsale.isCurrent = false
    this.steps.transferToken.hasError = false

    try {
      await this.deployer.transferToken()

      this.steps.transferToken.isComplete = true
    } catch (error) {
      console.log(error)
      this.steps.transferToken.hasError = true
      this.steps.transferToken.errorMessage = `Something went wrong`
    }
  }

  async estimateTransactionCosts() {
    this.steps.estimateTxCosts.estimates.push({
      text: 'ERC20 token deployment',
      txCost: '...'
    })
    let txCost = await this.deployer.estimateTokenDeploymentCost()
    this.steps.estimateTxCosts.estimates[0].txCost = txCost.ETH

    this.steps.estimateTxCosts.estimates.push({
      text: 'Crowdsale contract deployment',
      txCost: '...'
    })
    txCost = await this.deployer.estimateCrowdsaleDeploymentCost()
    this.steps.estimateTxCosts.estimates[1].txCost = txCost.ETH

    this.steps.estimateTxCosts.estimates.push({
      text: 'Transfer token supply to crowdsale',
      txCost: '...'
    })
    this.token.setAddress(ContractDeployment.CONTRACT_DUMMY_ADDRESS)
    txCost = await this.deployer.estimateTokenTransferCost()
    const simpleICOCost = await this.deployer.estimateSimpleICOCost()
    const cost = txCost.cost.add(simpleICOCost.cost)
    this.steps.estimateTxCosts.estimates[2].txCost = ethers.utils.formatEther(cost.toString())

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
  }

}

