import { Component, OnInit } from '@angular/core';
import { WalletService } from '@service/wallet.service';
import { Router } from "@angular/router";

declare var require: any

const clipboard = require('clipboard')

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  address: string
  privateKey: string
  mnemonic: string

  display: boolean = false
  onNewWallet: boolean = false

  constructor(
    public wallet: WalletService,
    private router: Router) {
    wallet.onNewWallet.subscribe(result => {
      this.onNewWallet = true
      this.address = result.address
      this.privateKey = result.privateKey
      this.mnemonic = result.mnemonic

      setTimeout(() => {
        this.display = true
      }, 600)
    })

    wallet.onUnlockSuccess.subscribe(data => {
      return this.router.navigate(['/token/new'])
    })
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    let self = this

    new clipboard(`.copy-address`, {
      text: function(trigger) {

        self.updateTrigger(trigger)

        return self.address
      }
    })
    new clipboard(`.copy-private-key`, {
      text: function(trigger) {

        self.updateTrigger(trigger)

        return self.privateKey
      }
    })
    new clipboard(`.copy-mnemonic`, {
      text: function(trigger) {

        self.updateTrigger(trigger)

        return self.mnemonic
      }
    })
  }

  updateTrigger(trigger){
    trigger.innerHTML = '<i class="icon-checkmark-circle"></i>'
    trigger.classList.add('btn-success')
    trigger.classList.remove('btn-outline-white')
    setTimeout(() => {
      trigger.innerHTML = 'copy'
      trigger.classList.remove('copied')
      trigger.classList.add('btn-outline-white')
      trigger.classList.remove('btn-success')
    }, 2000);
  }

  generateWallet(){
    this.wallet.generateWallet()
  }

}
