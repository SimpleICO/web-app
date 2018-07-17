import { Component, OnInit, Input } from '@angular/core';
import { ContractDeploymentFactory } from '@factory/contract-deployment.factory';
import { CrowdsaleDeployment } from '@factory/crowdsale-deployment';
import { SimpleToken } from '@token/simpletoken';
import { SimpleCrowdsale } from '@crowdsale/simplecrowdsale';
import { SimpleICO } from '@model/simpleico.model';
import { Contract } from '@model/contract.model';
import { InsufficientFundsError } from '@error/insufficient-funds.error';
import { WalletService } from '@service/wallet.service';
import { EthereumService } from '@service/ethereum.service';
import { SharedService } from '@service/shared.service';
import { Router } from "@angular/router";
import { Crowdsale } from '@model/crowdsale.model';
import { Token } from '@model/token.model';

declare var require: any
const ethers = require('ethers')

@Component({
  selector: 'app-existing-token',
  templateUrl: './existing-token.component.html',
  styleUrls: ['./existing-token.component.css']
})
export class ExistingTokenComponent implements OnInit {

  deployer: CrowdsaleDeployment

  token: Token

  crowdsale: Crowdsale

  stepCount: number = 0

  supply: string

  balanceOf: number = 0

  steps: any = {
    tokenInfo: {
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

  @Input() gasPrice: number

  constructor(
    private contractFactory: ContractDeploymentFactory,
    public wallet: WalletService,
    public eth: EthereumService,
    private router: Router,
    public shared: SharedService) {

    this.deployer = contractFactory.deployer
  }

  ngOnInit() {
    this.token = this.deployer.getToken()
    this.crowdsale = this.deployer.getCrowdsale()

    console.log(this.deployer, this.token, this.crowdsale)

    this.stepCount = Object.keys(this.steps).length

    this.init()
  }

  updateGasPrice(){

    this.deployer.gas = 0
    this.eth.updateGasPrice(this.gasPrice)
    this.estimateTransactionCosts()
  }

  reset(){
    Object.keys(this.steps).forEach(key => {
      let step = this.steps[key]
      step.isCurrent = false
      step.isComplete = false
      step.hasError = false
    })

    this.steps.tokenInfo.isCurrent = true
    this.steps.estimateTxCosts.estimates = []
  }

  async init(){

    this.reset()

    try {
      this.token.getName()
      this.token.getSymbol()
      await this.token.getBalanceOf()

      let balanceOf = ethers.utils.bigNumberify(this.token.balanceOf)
      let hasInsufficientOwnership = balanceOf.lte(ethers.utils.bigNumberify(0))

      console.log(hasInsufficientOwnership, balanceOf)

      if (hasInsufficientOwnership) {
        throw new InsufficientFundsError(InsufficientFundsError.MESSAGE)
      }

      this.balanceOf = ethers.utils.formatEther(this.token.balanceOf)

      await this.token.getTotalSupply()
      this.supply = ethers.utils.bigNumberify(this.token.supply).div(1e18.toString()).toString()

      this.steps.tokenInfo.isComplete = true

    } catch (error) {
      console.log(error)
      this.steps.tokenInfo.errorMessage = `You have insufficient percentage of the
        <a href="${this.eth.etherscanURL}/token/${this.token.address}" target="_blank" class="text-truncate d-inline-block" style="width: 98px; margin-bottom: -6px;">${this.token.address}</a> token`
      this.steps.tokenInfo.hasError = true
      this.steps.tokenInfo.isComplete = false
    }
  }

  finish(){
    try {
      this.deployer.addCrowdsaleToSimpleICOContract()

      return this.router.navigate([`/crowdsale/${this.crowdsale.address}/show`])
    } catch (error) {
      console.log(error)
    }
  }

  async deployCrowdsale(){
    this.steps.estimateTxCosts.isCurrent = false
    this.steps.estimateTxCosts.isComplete = true

    this.steps.deployCrowdsale.isCurrent = true
    this.steps.deployCrowdsale.hasError = false

    try {
      await this.deployer.deployCrowdsale()

      this.steps.deployCrowdsale.isComplete = true
    } catch (error) {
      console.log(error)
      this.steps.deployCrowdsale.hasError = true
      this.steps.deployCrowdsale.isComplete = false
      this.steps.deployCrowdsale.errorMessage = `Your crowdsale wasn't deployed but you didn't lose ETH funds. Retry this deployment or go to your token page`
    }
  }

  async transferToken(){
    this.steps.transferToken.isCurrent = true
    this.steps.transferToken.hasError = false
    this.steps.deployCrowdsale.isCurrent = false

    try {
      await this.deployer.transferToken()

      this.steps.transferToken.isComplete = true
    } catch (error) {
      console.log(error)
      this.steps.transferToken.hasError = true
      this.steps.transferToken.isComplete = false
      this.steps.transferToken.errorMessage = `Something went wrong`
    }
  }

  async estimateTransactionCosts(){
    this.steps.tokenInfo.isCurrent = false

    this.steps.estimateTxCosts.isCurrent = true
    this.steps.estimateTxCosts.isComplete = false
    this.steps.estimateTxCosts.hasError = false
    this.steps.estimateTxCosts.estimates = []

    try {
      await this.deployer.getTxCost()

      this.steps.estimateTxCosts.estimates.push({
        text: 'Crowdsale contract deployment',
        txCost: '...'
      })
      let txCost = await this.deployer.estimateCrowdsaleDeploymentCost()
      this.steps.estimateTxCosts.estimates[0].txCost = txCost.ETH

      this.steps.estimateTxCosts.estimates.push({
        text: 'Transfer token supply to crowdsale',
        txCost: '...'
      })
      txCost = await this.deployer.estimateTokenTransferCost()
      let simpleICOCost = await this.deployer.estimateSimpleICOCost()
      let cost = txCost.cost.add(simpleICOCost.cost)
      this.steps.estimateTxCosts.estimates[1].txCost = ethers.utils.formatEther(cost.toString())

      this.steps.estimateTxCosts.estimates.push({
        text: 'TOTAL',
        txCost: this.deployer.txCost.ETH
      })

      let wei = this.deployer.txCost.WEI
      let hasInsufficientFunds = wei.gt(this.wallet.balance)

      console.log(hasInsufficientFunds, wei.toString(), this.wallet.balance)

      if (hasInsufficientFunds) {
        throw new InsufficientFundsError(InsufficientFundsError.MESSAGE)
      }

      this.steps.estimateTxCosts.isComplete = true

    } catch (error) {
      if (error instanceof InsufficientFundsError) {
        this.steps.tokenInfo.hasError = true
        this.steps.estimateTxCosts.isComplete = false
      }
    }
  }
}
