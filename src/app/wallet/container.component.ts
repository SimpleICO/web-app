import { Component, OnInit } from '@angular/core';
import { WalletService } from 'scui-lib';
import { SharedService } from '@service/shared.service';
import { EthereumService } from '@service/ethereum.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  constructor(
    public wallet: WalletService,
    public eth: EthereumService,
    public shared: SharedService) { }

  ngOnInit() {
  }

}
