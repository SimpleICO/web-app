import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@environment/environment';
import { WalletService } from '@service/wallet.service';
import { Contract } from '@model/contract.model';
import { SimpleToken } from '@model/simpletoken.model';
import { SimpleCrowdsale } from '@model/simplecrowdsale.model';
import { Subject } from 'rxjs';

declare var require: any

const eth = require('truffle-contract')
const MAX_USD_CAP = 100.00
const ethers = require('ethers')


@Injectable()
export class EthereumService {

  contracts: Array<Contract> = []

  ethPrice: string = '0.0'

  onTokenDeployment: Subject<any> = new Subject<any>()

  txCost: any

  defaultGasPrice: number = 15000000000

  gas: number

  currentTokenContract: any
  currentCrowdsaleContract: any

  constructor(
    private wallet: WalletService,
    private http: HttpClient) {

  }

  async getTxCost(gas, gasPrice){
    let { USD } = await this.convertCurrency('ETH', 'USD')
    let cost = gas * gasPrice
    let ETH = ethers.utils.formatEther(cost.toString())
    return {
      ETH: ETH,
      USD: ( ETH * USD ).toFixed(2)
    }
  }

  async getTotalEthInUsd(eth){
    let { USD } = await this.convertCurrency('ETH', 'USD')
    let total = eth * USD
    this.ethPrice = total.toFixed(2)
  }

  async convertCurrency(currency, to, amount?): Promise<any> {
    return this.http
      .get(`https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=${to}`)
      .toPromise()
  }

  async createToken(){

    this.onTokenDeployment.next({
      displayModal: true,
      onTxnCostCalc: true,
      onBeforeTokenDeployment: false,
      onTokenDeployment: false,
      onAfterTokenDeployment: false,
      onError: false,
    })

    let simpleToken = new SimpleToken(this.wallet.getInstance(), 'My SimpleToken', 'MST')

    simpleToken.connect()

    let usdToEth = await this.convertCurrency('USD', 'ETH')
    console.log(usdToEth)

    let supply = ethers.utils.parseEther((usdToEth.ETH * MAX_USD_CAP).toString())

    let contract = await simpleToken.deploy(supply)
    this.currentTokenContract = contract
    console.log(contract)

    let gas = await contract.estimateGas()
    this.gas = gas
    console.log(gas)

    let txCost = await this.getTxCost(gas, this.defaultGasPrice)
    this.txCost = txCost
    console.log(txCost)

    this.onTokenDeployment.next({
      displayModal: true,
      onTxnCostCalc: false,
      onBeforeTokenDeployment: true,
      onTokenDeployment: false,
      onAfterTokenDeployment: false,
      onError: false,
    })
  }

  async deployToken(){
    this.onTokenDeployment.next({
      displayModal: true,
      onTxnCostCalc: false,
      onBeforeTokenDeployment: false,
      onTokenDeployment: true,
      onAfterTokenDeployment: false,
      onError: false,
    })

    let txOptions = {
      from: this.wallet.getAddress(),
      gas: this.gas,
      gasPrice: this.defaultGasPrice,
    }

    console.log(txOptions)

    try {
      let tx = await this.currentTokenContract.send(txOptions)

      console.log(tx)

      this.onTokenDeployment.next({
        displayModal: true,
        onTxnCostCalc: false,
        onBeforeTokenDeployment: false,
        onTokenDeployment: false,
        onAfterTokenDeployment: true,
        onError: false,
      })

      await this.wallet.getAccountBalance()
      this.getTotalEthInUsd(this.wallet.ethBalance)

    } catch (error) {
      console.log(error)

      this.onTokenDeployment.next({
        displayModal: true,
        onTxnCostCalc: false,
        onBeforeTokenDeployment: false,
        onTokenDeployment: false,
        onAfterTokenDeployment: false,
        onError: true,
      })
    }
  }
}





