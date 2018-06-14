import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@environment/environment';
import { WalletService } from '@service/wallet.service';
import { Contract } from '@model/contract.model';
import { SimpleToken } from '@model/simpletoken.model';
import { SimpleCrowdsale } from '@model/simplecrowdsale.model';
import { SimpleICO } from '@model/simpleico.model';
import { Subject } from 'rxjs';
import { InsufficientFundsError } from '@error/insufficient-funds.error';


declare var require: any

const MAX_USD_CAP = 100.00
const DUMMY_ADDRESS = '0x7af6C0ce41aFaf675e5430193066a8d57701A9AC'
const CONTRACT_DUMMY_ADDRESS = '0x523a34E0A5FABDFaa39B3889D80b19Fe77F73aA6'
const GAS_INCREMENT = 1000
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

  simpleToken: SimpleToken

  simpleCrowdsale: SimpleCrowdsale

  simpleICO: SimpleICO

  etherscanURL: string = 'https://ropsten.etherscan.io'

  constructor(
    private wallet: WalletService,
    private http: HttpClient) {

    if (env.production) {
      this.etherscanURL = 'https://etherscan.io'
    }

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

  async createToken(name: string, symbol: string){

    this.onTokenDeployment.next({
      displayModal: true,
      onTxnCostCalc: true,
      onInsufficientFunds: false,
      onBeforeTokenDeployment: false,
      onTokenDeployment: false,
      onAfterTokenDeployment: false,
      onError: false,
    })

    this.simpleToken = new SimpleToken(this.wallet.getInstance(), name, symbol)

    this.simpleToken.connect()

    try {
      await this.estimateTransactionCosts()

      this.onTokenDeployment.next({
        displayModal: true,
        onTxnCostCalc: false,
        onInsufficientFunds: false,
        onBeforeTokenDeployment: true,
        onTokenDeployment: false,
        onAfterTokenDeployment: false,
        onError: false,
      })
    } catch (error) {
      console.log(error)
      if (error instanceof InsufficientFundsError) {
        console.log(error instanceof InsufficientFundsError)
        this.onTokenDeployment.next({
          displayModal: true,
          onTxnCostCalc: false,
          onInsufficientFunds: true,
          onBeforeTokenDeployment: true,
          onTokenDeployment: false,
          onAfterTokenDeployment: false,
          onError: false,
        })
      } else {
        this.onTokenDeployment.next({
          displayModal: true,
          onTxnCostCalc: false,
          onInsufficientFunds: false,
          onBeforeTokenDeployment: false,
          onTokenDeployment: false,
          onAfterTokenDeployment: false,
          onError: true,
        })
      }
    }
  }

  async estimateTransactionCosts(){
    await this.estimateTokenDeploymentCost()
    await this.estimateCrowdaleCost()
    await this.estimateTokenTransferCost()
    await this.estimateSimpleICOCost()
    await this.wallet.getAccountBalance()

    let hasInsufficientFunds = ethers.utils.bigNumberify(this.txCost.cost).gt(this.wallet.balance)

    console.log(hasInsufficientFunds, this.txCost.cost, this.wallet.balance)

    if (hasInsufficientFunds) {
      throw new InsufficientFundsError(InsufficientFundsError.MESSAGE)
    }
  }

  async estimateTokenDeploymentCost(){
    let usdToEth = await this.convertCurrency('USD', 'ETH')
    console.log(usdToEth)

    let supply = ethers.utils.parseEther((usdToEth.ETH * MAX_USD_CAP).toString())
    this.simpleToken.supply = supply

    let txObject = await this.simpleToken.deploy(supply)
    this.simpleToken.txObject = txObject
    console.log(txObject)

    let gas = await this.simpleToken.txObject.estimateGas()
    this.gas = gas + GAS_INCREMENT
    console.log(gas)

    let txCost = await this.getTxCost(gas, this.defaultGasPrice)
    this.txCost = txCost
    console.log(txCost)
  }

  async estimateCrowdaleCost(){
    let simpleCrowdsale = new SimpleCrowdsale(this.wallet.getInstance())

    simpleCrowdsale.connect()

    simpleCrowdsale.txObject = await simpleCrowdsale.deploy(DUMMY_ADDRESS)

    let gas = await simpleCrowdsale.txObject.estimateGas()
    this.gas += gas + GAS_INCREMENT
    console.log(this.gas)

    let txCost = await this.getTxCost(this.gas, this.defaultGasPrice)

    let cost = ethers.utils.bigNumberify(this.txCost.cost)
    cost = cost.add(ethers.utils.bigNumberify(txCost.cost))

    this.txCost.ETH = ethers.utils.formatEther(cost.toString())
    this.txCost.USD = (Number(this.txCost.USD) + Number(txCost.USD)).toFixed(2).toString()
    console.log(this.txCost)
  }

  async estimateTokenTransferCost(){
    this.simpleToken.setAddress(CONTRACT_DUMMY_ADDRESS)

    let txObject = this.simpleToken.instance.methods.transfer(this.wallet.getAddress(), this.simpleToken.supply.toString())
    console.log(txObject)

    let gas = await txObject.estimateGas()
    this.gas += gas + GAS_INCREMENT
    console.log(this.gas)

    let txCost = await this.getTxCost(this.gas, this.defaultGasPrice)

    let cost = ethers.utils.bigNumberify(this.txCost.cost)
    cost = cost.add(ethers.utils.bigNumberify(txCost.cost))

    this.txCost.ETH = ethers.utils.formatEther(cost.toString())
    this.txCost.USD = (Number(this.txCost.USD) + Number(txCost.USD)).toFixed(2).toString()
    console.log(this.txCost)
  }

  async estimateSimpleICOCost(){
    this.simpleICO = new SimpleICO(this.wallet.getInstance())

    this.simpleICO.connect()

    this.simpleICO.txObject = await this.simpleICO.instance.methods.addCrowdsale(CONTRACT_DUMMY_ADDRESS)

    let gas = await this.simpleICO.txObject.estimateGas()
    this.gas += gas + GAS_INCREMENT
    console.log(this.gas)

    let txCost = await this.getTxCost(this.gas, this.defaultGasPrice)

    let cost = ethers.utils.bigNumberify(this.txCost.cost)
    cost = cost.add(ethers.utils.bigNumberify(txCost.cost))

    this.txCost.ETH = ethers.utils.formatEther(cost.toString())
    this.txCost.USD = (Number(this.txCost.USD) + Number(txCost.USD)).toFixed(2).toString()
    console.log(this.txCost)
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
      onInsufficientFunds: false,
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

      this.simpleToken.setAddress(receipt.contractAddress)

      let tokenSupply = await this.simpleToken.instance.methods.totalSupply().call()
      this.simpleToken.supply = tokenSupply

      await this.createCrowdsale(this.simpleToken.getAddress())

      this.deployCrowdsale()

    } catch (error) {
      console.log(error)

      this.onTokenDeployment.next({
        displayModal: true,
        onTxnCostCalc: false,
        onInsufficientFunds: false,
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

      this.simpleCrowdsale.setAddress(receipt.contractAddress)

      let crowdsaleBeneficiary = await this.simpleCrowdsale.instance.methods.wallet().call()
      console.log(crowdsaleBeneficiary)

      this.transferTokensToCrowdsale()
    } catch (error) {
      console.log(error)

      this.onTokenDeployment.next({
        displayModal: true,
        onTxnCostCalc: false,
        onInsufficientFunds: false,
        onBeforeTokenDeployment: false,
        onTokenDeployment: false,
        onAfterTokenDeployment: false,
        onError: true,
      })
    }
  }

  async transferTokensToCrowdsale(){
    console.log(this.gas, this.simpleToken.supply, this.simpleCrowdsale.getAddress(), this.simpleToken.getAddress(), this.wallet.getAddress())

    try {
      let txObject = this.simpleToken.instance.methods.transfer(this.simpleCrowdsale.getAddress(), this.simpleToken.supply)

      let txOptions = {
        from: this.wallet.getAddress(),
        to: this.simpleToken.getAddress(),
        value: '0x0',
        gas: Web3.utils.toHex(this.gas),
        gasLimit: Web3.utils.toHex(this.gas),
        gasPrice: Web3.utils.toHex(this.defaultGasPrice),
        data: txObject.encodeABI(),
      }

      let signedTx = await this.simpleToken.web3.eth.accounts.signTransaction(txOptions, this.wallet.getInstance().privateKey)
      console.log(signedTx)
      let receipt = await this.simpleToken.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      console.log(receipt)

      let balanceOfCrowdsale = await this.simpleToken.instance.methods.balanceOf(this.simpleCrowdsale.getAddress()).call()
      console.log(balanceOfCrowdsale)

      this.addCrowdsaleToSimpleICOContract()
    } catch (error) {
      console.log(error)

      this.onTokenDeployment.next({
        displayModal: true,
        onTxnCostCalc: false,
        onInsufficientFunds: false,
        onBeforeTokenDeployment: false,
        onTokenDeployment: false,
        onAfterTokenDeployment: false,
        onError: true,
      })
    }
  }

  async addCrowdsaleToSimpleICOContract(){
    try {
      let txObject = this.simpleICO.instance.methods.addCrowdsale(this.simpleCrowdsale.getAddress())

      let txOptions = {
        from: this.wallet.getAddress(),
        to: this.simpleICO.getAddress(),
        value: '0x0',
        gas: Web3.utils.toHex(this.gas),
        gasLimit: Web3.utils.toHex(this.gas),
        gasPrice: Web3.utils.toHex(this.defaultGasPrice),
        data: txObject.encodeABI(),
      }

      let signedTx = await this.simpleICO.web3.eth.accounts.signTransaction(txOptions, this.wallet.getInstance().privateKey)
      console.log(signedTx)
      let receipt = await this.simpleICO.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      console.log(receipt)

      let crowdsales = await this.simpleICO.instance.methods.getCrowdsales().call()
      console.log(crowdsales)
      let crowdsalesByAddress = await this.simpleICO.instance.methods.getCrowdsalesByAddress(this.wallet.getAddress()).call()
      console.log(crowdsalesByAddress)

      this.onTokenDeployment.next({
        displayModal: true,
        onTxnCostCalc: false,
        onInsufficientFunds: false,
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
        onInsufficientFunds: false,
        onBeforeTokenDeployment: false,
        onTokenDeployment: false,
        onAfterTokenDeployment: false,
        onError: true,
      })
    }
  }
}





