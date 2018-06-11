import { Component, OnInit, Input } from '@angular/core';
import { EthereumService } from '@service/ethereum.service';
import { WalletService } from '@service/wallet.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  @Input() token: any = {
    name: 'My Simple Token',
    symbol: 'MST'
  }

  constructor(
    public eth: EthereumService,
    public wallet: WalletService) {}

  ngOnInit() {}

  onCreateCrowdsale(){
    this.eth.createToken(this.token.name, this.token.symbol)
  }
}




