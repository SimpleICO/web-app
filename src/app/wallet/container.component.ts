import { Component, OnInit } from '@angular/core';
import { WalletService } from '@decentralizedtechnologies/scui-lib';
import { SharedService } from '@service/shared.service';
import { EthereumService } from '@decentralizedtechnologies/scui-lib';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  constructor(
    public wallet: WalletService,
    public eth: EthereumService,
    public shared: SharedService) { }

  ngOnInit() {
  }

}
