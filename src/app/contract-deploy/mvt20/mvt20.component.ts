import { Component, OnInit, Input } from '@angular/core';
import { ContractDeploymentFactory } from '@decentralizedtechnologies/scui-lib';
import { InsufficientFundsError } from '@error/insufficient-funds.error';
import { WalletService } from '@decentralizedtechnologies/scui-lib';
import { EthereumService } from '@decentralizedtechnologies/scui-lib';
import { SharedService } from '@service/shared.service';
import { Router } from '@angular/router';
import { MVT20Contract } from '@contract/MVT20.contract';
import { MVT20Deployment } from '@factory/MVT20.deployment';

const Web3 = require('web3')

@Component({
  selector: 'app-mvt20',
  templateUrl: './mvt20.component.html',
  styleUrls: ['./mvt20.component.scss']
})
export class MVT20Component implements OnInit {

  MVT20Deployment: string = MVT20Deployment._type

  deployer: any

  token: MVT20Contract

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
  }

  @Input() gasPrice: number

  constructor(
    private contractFactory: ContractDeploymentFactory,
    public wallet: WalletService,
    public eth: EthereumService,
    public shared: SharedService,
    private router: Router) {
    this.deployer = this.contractFactory.deployer
    this.gasPrice = Web3.utils.fromWei(eth.defaultGasPrice.toString(), 'gwei')
  }

  ngOnInit() {
    this.token = this.deployer.getToken()
    this.stepCount = Object.keys(this.steps).length
    this.init()
  }

  updateGasPrice() {
    this.deployer.gas = 0
    this.eth.updateGasPrice(this.gasPrice)
    this.init()
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

  finish() {
    try {
      return this.router.navigate([`/contract/${this.token.address}/show/${this.deployer.type}`])
    } catch (error) {
      console.log(error)
    }
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
        If the <a href="${this.eth.etherscanURL}/address/${this.wallet.getAddress()}" target="_blank">transaction</a>
        is still running, wait before you retry.`
    }
  }

  async estimateTransactionCosts() {
    this.steps.estimateTxCosts.estimates.push({
      text: 'MVT20 token deployment',
      txCost: '...'
    })
    const txCost = await this.deployer.estimateTokenDeploymentCost()
    this.steps.estimateTxCosts.estimates[0].txCost = txCost.ETH
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
