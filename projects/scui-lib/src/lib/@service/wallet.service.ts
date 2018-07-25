import { Injectable, Inject } from '@angular/core';
import { Wallet } from '../@model/wallet.model';
import { Network } from '../@model/network.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  wallet: Wallet

  network: string

  constructor(
    @Inject('config') private config: any) {
    console.log(config)

    this.setEmptyWallet()
    this.setNetwork(config.network)
    this.setProviderByNetwork(config.network)
  }

  setNetwork(network: string = Network.mainnet){
    this.network = network
    this.wallet.setNetwork(network)
    return this
  }

  setEmptyWallet(){
    this.wallet = new Wallet()
    this.wallet.setLockedInstance()
    return this
  }

  setProviderByNetwork(network: string = Network.mainnet){

    let providerSetters = {}
    providerSetters[Network.mainnet] = this.wallet.setMainnetProvider
    providerSetters[Network.testnet] = this.wallet.setRopstenProvider
    providerSetters[Network.private] = this.wallet.setJsonRpcProvider

    providerSetters[network].call(this.wallet, this.config.wallet.networks[network])

    return this
  }
}
