import { NgModule, ModuleWithProviders } from '@angular/core';
import { WalletService } from './@service/wallet.service';
import merge from 'deepmerge';

export const Config = {
  wallet: {
    networks: {
      mainnet: 'https://mainnet.infura.io/TNxOmHzkTOUaNtxDBxia',
      testnet: 'https://ropsten.infura.io/TNxOmHzkTOUaNtxDBxia',
      local: 'HTTP://127.0.0.1:7545',
    }
  }
}

@NgModule({
  imports: [
  ],
  declarations: [],
  exports: [],
})

export class SCUILibModule {
  static forRoot(_config: any): ModuleWithProviders {
    let config = merge(Config, _config)
    return {
      ngModule: SCUILibModule,
      providers: [{ provide: 'config', useValue: config }]
    }
  }
}
