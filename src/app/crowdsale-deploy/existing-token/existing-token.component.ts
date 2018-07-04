import { Component, OnInit } from '@angular/core';
import { CrowdsaleDeploymentFactory } from '@factory/crowdsale-deployment.factory';
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

  constructor(
    private crowdsaleFactory: CrowdsaleDeploymentFactory,
    public wallet: WalletService,
    public eth: EthereumService,
    private router: Router,
    public shared: SharedService) {

    this.deployer = crowdsaleFactory.deployer
  }

  ngOnInit() {
    this.token = this.deployer.getToken()
    this.crowdsale = this.deployer.getCrowdsale()

    this.stepCount = Object.keys(this.steps).length

    this.init()
  }

  async init(){

    this.steps.tokenInfo.isCurrent = true
    this.steps.tokenInfo.isComplete = false
    this.steps.tokenInfo.hasError = false

    try {
      this.token.getName()
      this.token.getSymbol()

      await this.token.getTotalSupply()
      this.supply = ethers.utils.bigNumberify(this.token.supply).div(1e18.toString()).toString()

      this.steps.tokenInfo.isComplete = true

    } catch (error) {
      console.log(error)
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
      }
    }
  }
}
