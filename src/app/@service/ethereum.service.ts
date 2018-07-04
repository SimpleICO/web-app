import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@environment/environment';
import { WalletService } from '@service/wallet.service';
import { DeploymentStateService } from '@service/deployment-state.service';
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

  defaultGasPrice: number = 49000000000

  gas: number

  simpleToken: SimpleToken

  simpleCrowdsale: SimpleCrowdsale

  simpleICO: SimpleICO

  etherscanURL: string = 'https://ropsten.etherscan.io'

  constructor(
    private wallet: WalletService,
    private http: HttpClient,
    private deploymentState: DeploymentStateService) {

    if (env.production) {
      this.etherscanURL = 'https://etherscan.io'
    }
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

  async getNonce(contract: Contract){
    return await contract.web3.eth.getTransactionCount(this.wallet.getAddress(), 'pending')
  }
}
