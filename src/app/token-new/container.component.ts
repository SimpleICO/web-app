import { Component, OnInit } from '@angular/core';
import { EthereumService } from '@service/ethereum.service';
import { WalletService } from '@service/wallet.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  constructor(
    public eth: EthereumService,
    public wallet: WalletService) {}

  ngOnInit() {}

  onCreateCrowdsale(){
    this.eth.createToken()
  }
}




