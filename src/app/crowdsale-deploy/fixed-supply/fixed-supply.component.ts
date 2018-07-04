import { Component, OnInit, NgZone } from '@angular/core';
import { CrowdsaleDeploymentFactory } from '@factory/crowdsale-deployment.factory';
import { CrowdsaleDeployment } from '@factory/crowdsale-deployment';
import { SimpleToken } from '@token/simpletoken';
import { SimpleCrowdsale } from '@crowdsale/simplecrowdsale';
import { InsufficientFundsError } from '@error/insufficient-funds.error';
import { WalletService } from '@service/wallet.service';

declare var require: any
const ethers = require('ethers')


@Component({
  selector: 'app-fixed-supply',
  templateUrl: './fixed-supply.component.html',
  styleUrls: ['./fixed-supply.component.css']
})
export class FixedSupplyComponent implements OnInit {

  deployer: CrowdsaleDeployment

  token: SimpleToken

  crowdsale: SimpleCrowdsale

  steps: any = {
    estimateTxCosts: {
      step: 1,
      isCurrent: true,
      isComplete: false,
      hasError: false,
      estimates: []
    }
  }

  constructor(
    private crowdsaleFactory: CrowdsaleDeploymentFactory,
    private wallet: WalletService,
    private zone: NgZone) {

    this.deployer = crowdsaleFactory.deployer
  }

  ngOnInit() {

    this.token = this.deployer.getToken()
    this.crowdsale = this.deployer.getCrowdsale()

    this.init()

  }

  async init(){
    try {
      await this.estimateTransactionCosts()
    } catch (error) {
      if (error instanceof InsufficientFundsError) {
        this.steps.estimateTxCosts.hasError = true
      }
    }
  }

  async estimateTransactionCosts(){
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
    txCost = await this.deployer.estimateTokenTransferCost()
    let simpleICOCost = await this.deployer.estimateSimpleICOCost()
    let cost = txCost.cost.add(simpleICOCost.cost)
    this.steps.estimateTxCosts.estimates[2].txCost = ethers.utils.formatEther(cost.toString())

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
    this.steps.estimateTxCosts.isCurrent = false
  }

}








