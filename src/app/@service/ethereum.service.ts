import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@environment/environment';
import { WalletService } from '@service/wallet.service';
import { Subject } from 'rxjs';

declare var require: any

const ethers = require('ethers')
const Web3 = require('web3')

@Injectable({
  providedIn: 'root'
})
export class EthereumService {

  ethPrice: string = '0.0'

  defaultGasPrice: number = 49000000000

  etherscanURL: string = 'https://ropsten.etherscan.io'

  constructor(
    private wallet: WalletService,
    private http: HttpClient) {

    if (env.production) {
      this.etherscanURL = 'https://etherscan.io'
    }
  }

  /**
   * [updateGasPrice Set the new ghas price in gwei 1e9]
   * @param {number} price Price should enter as an integer, eg. 36
   */
  updateGasPrice(price: number){

    this.defaultGasPrice = Web3.utils.toWei(price.toString(), 'gwei')
  }

  async getTxCost(gas, gasPrice = this.defaultGasPrice){
    let { USD } = await this.convertCurrency('ETH', 'USD')
    let cost = gas * gasPrice
    let ETH = ethers.utils.formatEther(cost.toString())
    return {
      cost: ethers.utils.bigNumberify(cost.toString()),
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

  async getNonce(contract: any){
    return await contract.web3.eth.getTransactionCount(this.wallet.getAddress(), 'pending')
  }
}
