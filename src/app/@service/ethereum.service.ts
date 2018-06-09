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
      cost: cost.toString(),
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

    this.estimateCrowdaleCost()
  }

  async estimateCrowdaleCost(){
    let simpleCrowdsale = new SimpleCrowdsale(this.wallet.getInstance())

    simpleCrowdsale.connect()

    let contract = await simpleCrowdsale.deploy('0x7af6C0ce41aFaf675e5430193066a8d57701A9AC')
    this.currentCrowdsaleContract = contract
    console.log(contract)

    let gas = await contract.estimateGas()
    this.gas += gas
    console.log(this.gas)

    let txCost = await this.getTxCost(this.gas, this.defaultGasPrice)

    let cost = ethers.utils.bigNumberify(this.txCost.cost)
    cost = cost.add(ethers.utils.bigNumberify(txCost.cost))

    this.txCost.ETH = ethers.utils.formatEther(cost.toString())
    this.txCost.USD = (Number(this.txCost.USD) + Number(txCost.USD)).toFixed(2).toString()
    console.log(this.txCost)

    this.onTokenDeployment.next({
      displayModal: true,
      onTxnCostCalc: false,
      onBeforeTokenDeployment: true,
      onTokenDeployment: false,
      onAfterTokenDeployment: false,
      onError: false,
    })
  }

  async createCrowdsale(tokenAddress: string){

    let simpleCrowdsale = new SimpleCrowdsale(this.wallet.getInstance())

    simpleCrowdsale.connect()

    let contract = await simpleCrowdsale.deploy(tokenAddress)
    this.currentCrowdsaleContract = contract
    console.log(contract)
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
      let contract = await this.currentTokenContract.send(txOptions)
      this.currentTokenContract = contract
      console.log(contract)

      let crowdsale = await this.createCrowdsale(contract._address)
      crowdsale = await this.currentCrowdsaleContract.send(txOptions)
      this.currentCrowdsaleContract = crowdsale
      console.log(crowdsale)

      let tokenSupply = await this.currentTokenContract.methods.totalSupply().call()

      await this.currentTokenContract.methods.transfer(this.currentCrowdsaleContract._address, tokenSupply).call()

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





