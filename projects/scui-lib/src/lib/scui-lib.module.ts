import { NgModule, ModuleWithProviders } from '@angular/core';
import { Network } from './@model/network.model';
import merge from 'deepmerge';

const config$ = {
  network: Network.mainnet,
  wallet: {
    networks: {}
  }
}

config$.wallet.networks[Network.mainnet] = 'https://mainnet.infura.io/TNxOmHzkTOUaNtxDBxia'
config$.wallet.networks[Network.testnet] = 'https://ropsten.infura.io/TNxOmHzkTOUaNtxDBxia'
config$.wallet.networks[Network.private] = 'HTTP://127.0.0.1:7545'

export const Config = config$

@NgModule({
  imports: [
  ],
  declarations: [],
  exports: [],
})

export class SCUILibModule {
  static forRoot(_config: any): ModuleWithProviders {
    const config = merge(Config, _config)
    return {
      ngModule: SCUILibModule,
      providers: [{ provide: 'config', useValue: config }]
    }
  }
}
