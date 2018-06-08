import { Injectable } from '@angular/core';
import { environment as env } from '@environment/environment';
import { WalletService } from '@service/wallet.service';
import * as SimpleTokenABI from '@abi/simpletoken.abi.json';
import * as SimpleCrowdsaleABI from '@abi/simplecrowdsale.abi.json';

declare var require: any

const JSON_RPC_PROVIDER = 'HTTP://127.0.0.1:7545'
const Eth = require('ethers')
const Web3 = require('web3')
const Providers = Eth.providers

@Injectable()
export class EthereumService {

  provider: any

  constructor(private wallet: WalletService) {
    if (env.local) {
      this.setJsonRpcProvider()
    }

    // if (env.staging) {
    //   this.setRopstenProvider()
    // }
  }

  async getAccountBalance(address: string = this.wallet.getAddress()){
    let balance = await this.provider.getBalance(address)
    return balance
  }

  setJsonRpcProvider(){
    this.provider = new Providers.JsonRpcProvider(JSON_RPC_PROVIDER, 'unspecified')
    this.wallet.setProvider(this.provider)
  }

  setRopstenProvider(){
    this.provider = new Providers.InfuraProvider(Providers.networks.ropsten)
    this.wallet.setProvider(this.provider)
  }

}
