import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@environment/environment';
import { WalletService } from '@service/wallet.service';
import { Subject } from 'rxjs';
import { Network } from '@model/network.model';

declare var require: any

const ethers = require('ethers')
const Web3 = require('web3')

@Injectable({
  providedIn: 'root'
})
export class EthereumService {

  static readonly ETHERSCAN_MAINNET: string = 'https://etherscan.io'
  static readonly ETHERSCAN_TESTNET: string = 'https://ropsten.etherscan.io'

  ethPrice: string = '0.0'

  defaultGasPrice: number = 7500000000

  etherscanURL: string

  constructor(
    private wallet: WalletService,
    private http: HttpClient) {

    this.setEtherScanURLByNetwork()
  }

  setEtherScanURLByNetwork() {

    const networks = {}
    networks[Network.mainnet] = EthereumService.ETHERSCAN_MAINNET
    networks[Network.testnet] = EthereumService.ETHERSCAN_TESTNET

    this.etherscanURL = networks[this.wallet.network]

    return this
  }

  /**
   * [updateGasPrice Set the new gas price in gwei 1e9]
   * @param {number} price Price should enter as an integer, eg. 36
   */
  updateGasPrice(price: number) {

    this.defaultGasPrice = Web3.utils.toWei(price.toString(), 'gwei')
  }

  async getTxCost(gas, gasPrice = this.defaultGasPrice) {
    const { USD } = await this.convertCurrency('ETH', 'USD')
    const cost = gas * gasPrice
    const ETH = ethers.utils.formatEther(cost.toString())
    return {
      cost: ethers.utils.bigNumberify(cost.toString()),
      ETH: ETH,
      WEI: ethers.utils.parseEther(ETH),
      USD: (ETH * USD).toFixed(2)
    }
  }

  async getTotalEthInUsd(eth) {
    const { USD } = await this.convertCurrency('ETH', 'USD')
    const total = eth * USD
    this.ethPrice = total.toFixed(2)
  }

  async convertCurrency(currency, to, amount?): Promise<any> {
    return this.http
      .get(`https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=${to}`)
      .toPromise()
  }

  async getNonce(contract: any) {
    return await contract.web3.eth.getTransactionCount(this.wallet.getAddress(), 'pending')
  }
}
