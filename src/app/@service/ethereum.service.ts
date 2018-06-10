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
const Web3 = require('web3')


@Injectable()
export class EthereumService {

  contracts: Array<Contract> = []

  ethPrice: string = '0.0'

  onTokenDeployment: Subject<any> = new Subject<any>()

  txCost: any

  defaultGasPrice: number = 15000000000

  gas: number

  currentCrowdsaleContract: any

  simpleToken: SimpleToken

  simpleCrowdsale: SimpleCrowdsale

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

    this.simpleToken = new SimpleToken(this.wallet.getInstance(), 'My SimpleToken', 'MST')

    this.simpleToken.connect()

    let usdToEth = await this.convertCurrency('USD', 'ETH')
    console.log(usdToEth)

    let supply = ethers.utils.parseEther((usdToEth.ETH * MAX_USD_CAP).toString())

    let txObject = await this.simpleToken.deploy(supply)
    this.simpleToken.txObject = txObject
    console.log(txObject)

    let gas = await this.simpleToken.txObject.estimateGas()
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

    simpleCrowdsale.txObject = await simpleCrowdsale.deploy('0x7af6C0ce41aFaf675e5430193066a8d57701A9AC')

    let gas = await simpleCrowdsale.txObject.estimateGas()
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

    this.simpleCrowdsale = new SimpleCrowdsale(this.wallet.getInstance())

    this.simpleCrowdsale.connect()

    this.simpleCrowdsale.txObject = await this.simpleCrowdsale.deploy(tokenAddress)
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
      gas: Web3.utils.toHex(this.gas),
      gasLimit: Web3.utils.toHex(this.gas),
      gasPrice: Web3.utils.toHex(this.defaultGasPrice),
      data: this.simpleToken.txObject.encodeABI()
    }

    console.log(txOptions)

    try {
      console.log(this.wallet.getInstance().privateKey)
      let signedTx = await this.simpleToken.web3.eth.accounts.signTransaction(txOptions, this.wallet.getInstance().privateKey)
      console.log(signedTx)
      let receipt = await this.simpleToken.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      console.log(receipt)

      this.simpleToken.instance._address = receipt.contractAddress

      let tokenSupply = await this.simpleToken.instance.methods.totalSupply().call()
      this.simpleToken.supply = tokenSupply

      await this.createCrowdsale(this.simpleToken.instance._address)

      this.deployCrowdsale()

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

  async deployCrowdsale(){
    let txOptions = {
      from: this.wallet.getAddress(),
      gas: Web3.utils.toHex(this.gas),
      gasLimit: Web3.utils.toHex(this.gas),
      gasPrice: Web3.utils.toHex(this.defaultGasPrice),
      data: this.simpleCrowdsale.txObject.encodeABI()
    }

    try {
      let signedTx = await this.simpleCrowdsale.web3.eth.accounts.signTransaction(txOptions, this.wallet.getInstance().privateKey)
      console.log(signedTx)
      let receipt = await this.simpleCrowdsale.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      console.log(receipt)

      this.simpleCrowdsale.instance._address = receipt.contractAddress

      await this.simpleToken.instance.methods.transfer(this.simpleCrowdsale.instance._address, this.simpleToken.supply)

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

  onDeploymentError(contract: any){
    contract.on('error', console.log)
  }
}





