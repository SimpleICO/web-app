import { Component, OnInit } from '@angular/core';
import { WalletService } from '@service/wallet.service';
import { SharedService } from '@service/shared.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  constructor(
    public wallet: WalletService,
    public shared: SharedService) {}

  ngOnInit() {
  }

}
