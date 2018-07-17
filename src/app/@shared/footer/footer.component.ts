import { Component, OnInit } from '@angular/core';
import { WalletService } from '@service/wallet.service';
import { Network } from '@model/network.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  networks: Array<string> = [
    Network.mainnet,
    Network.testnet
  ]

  currentNetwork: number = 0

  constructor(public wallet: WalletService) {}

  ngOnInit() {
  }

  toggleNetwork(){
    this.currentNetwork = Number(!this.currentNetwork)
    this.wallet.setProviderByNetwork(this.networks[this.currentNetwork])
  }

}
