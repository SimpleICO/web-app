import { Component, OnInit } from '@angular/core';
import { SharedService } from '@service/shared.service';
import { WalletService } from '@service/wallet.service';

declare var document: any
declare var require: any

const clipboard = require('clipboard')

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css']
})
export class MobileMenuComponent implements OnInit {

  display: boolean = false

  constructor(
    public shared: SharedService,
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
    })

    new clipboard(`.copy`, {
      text: function(trigger) {

        self.shared.updateCopyTrigger(trigger)

        return self.wallet.getAddress()
      }
    })
  }

}
