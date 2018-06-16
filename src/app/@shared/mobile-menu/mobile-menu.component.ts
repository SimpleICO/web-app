import { Component, OnInit } from '@angular/core';
import { SharedService } from '@service/shared.service';
import { WalletService } from '@service/wallet.service';
import { EthereumService } from '@service/ethereum.service';

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

    new clipboard(`.copy`, {
      text: function(trigger) {

        self.updateCopyTrigger(trigger)

        return self.wallet.getAddress()
      }
    })
  }

  updateCopyTrigger(trigger){
    trigger.innerHTML = '<i class="icon-checkmark-circle"></i>'
    setTimeout(() => {
      trigger.innerHTML = '<i class="icon-copy"></i>'
    }, 2000);
  }

}
