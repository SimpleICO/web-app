import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@environment/environment';
import { WalletService } from '@service/wallet.service';
import { Contract } from '@model/contract.model';
import { SimpleToken } from '@model/simpletoken.model';
import { SimpleCrowdsale } from '@model/simplecrowdsale.model';

declare var require: any

const eth = require('truffle-contract')
const MAX_USD_CAP = 100.00
const ethers = require('ethers')


@Injectable()
export class EthereumService {

  contracts: Array<Contract> = []

  ethPrice: string = '0.0'

  constructor(
    private wallet: WalletService,
    private http: HttpClient) {

  }

  async getTotalEthInUsd(){
    let ethToUsd = await this.convertCurrency('ETH', 'USD')
    let total = this.wallet.ethBalance * ethToUsd.USD
    this.ethPrice = total.toFixed(2)
  }

  async convertCurrency(currency, to, amount?): Promise<any> {
    return this.http
      .get(`https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=${to}`)
      .toPromise()
  }

  async createToken(){

    let simpleToken = new SimpleToken(this.wallet.getInstance(), 'My SimpleToken', 'MST')

    simpleToken.connect()

    let usdToEth = await this.convertCurrency('USD', 'ETH')
    console.log(usdToEth)

    let supply = ethers.utils.parseEther((usdToEth.ETH * MAX_USD_CAP).toString())

    let contract = await simpleToken.deploy(supply)
    console.log(contract)

    let gas = await contract.estimateGas()
    console.log(gas)

    let tx = await contract.send({
      from: this.wallet.getAddress(),
      gas: gas,
      gasPrice: 32000000000,
    })

    console.log(tx)

    await this.wallet.getAccountBalance()
    this.getTotalEthInUsd()
  }

}





