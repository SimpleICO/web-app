import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SharedService } from '@service/shared.service';
import { WalletService } from 'scui-lib';
import { EthereumService } from 'scui-lib';

import { FixedSupplyDeployment } from '@factory/fixed-supply.deployment';
import { ExistingTokenDeployment } from '@factory/existing-token.deployment';
import { Router } from '@angular/router';

declare var document: any

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css']
})
export class MobileMenuComponent implements OnInit, AfterViewInit {

  display: boolean = false

  ExistingTokenDeployment: string = ExistingTokenDeployment._type
  FixedSupplyDeployment: string = FixedSupplyDeployment._type

  constructor(
    public shared: SharedService,
    public eth: EthereumService,
    public router: Router,
    public wallet: WalletService) {

    wallet.onLockSuccess.subscribe(isLocked => {
      router.navigate(['/login'])
    })
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
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
