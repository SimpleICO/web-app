import { Component, OnInit } from '@angular/core';
import { SharedService } from '@service/shared.service';
import { WalletService } from 'scui-lib';
import { EthereumService } from '@service/ethereum.service';

import { FixedSupplyDeployment } from '@factory/fixed-supply.deployment';
import { ExistingTokenDeployment } from '@factory/existing-token.deployment';

declare var document: any
declare var require: any

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css']
})
export class MobileMenuComponent implements OnInit {

  display: boolean = false

  ExistingTokenDeployment: string = ExistingTokenDeployment._type
  FixedSupplyDeployment: string = FixedSupplyDeployment._type

  constructor(
    public shared: SharedService,
    public eth: EthereumService,
    public wallet: WalletService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let self = this

    document.querySelectorAll('#mobile-menu a').forEach(anchor => {
      anchor.onclick = (e) => {
        this.shared.toggleMobileMenu()
      }
    })

    this.shared.onMobileMenu.subscribe(data => {
      this.display = data.display

      this.wallet.getAccountBalance()
    })
  }
}
