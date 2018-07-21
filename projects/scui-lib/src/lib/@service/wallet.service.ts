import { Injectable, Inject } from '@angular/core';
import { Wallet } from '../@model/wallet.model';
import { Network } from '../@model/network.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  network: string

  constructor(
    @Inject('config') private config: any) {
    console.log(config)

    this.setNetwork(config.network)
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

    providerSetters[network](this.config.wallet.networks[network])

    return this
  }
}
