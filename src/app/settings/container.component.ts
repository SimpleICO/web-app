import { Component, OnInit, Input } from '@angular/core';
import { WalletService } from '@service/wallet.service';
import { Network } from '@model/network.model';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  @Input() network: string

  networks: Array<string> = [
    Network.mainnet,
    Network.testnet
  ]

  constructor(private wallet: WalletService) {
    this.network = wallet.network
  }

  ngOnInit() {
  }

  selectNetwork(){
    this.wallet.setProviderByNetwork(this.network)
  }

}
