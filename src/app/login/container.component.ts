import { Component, OnInit, Input } from '@angular/core';
import { WalletService } from '@service/wallet.service';
import { EthereumService } from '@service/ethereum.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  errorMessage: string

  isInvalid: boolean = false

  @Input() seed: string

  constructor(
    public wallet: WalletService,
    public eth: EthereumService,
    private router: Router) {
    wallet.onUnlockError.subscribe(error => {
      this.isInvalid = true
      this.errorMessage = error.message
    })

    wallet.onUnlockSuccess.subscribe(data => {
      this.isInvalid = false
      this.errorMessage = ''
      this.wallet.setProvider()
      this.wallet.getAccountBalance().then(balance => {
        this.eth.getTotalEthInUsd(this.wallet.ethBalance)
      })

      return this.router.navigate(['/token/new']);
    })
  }

  ngOnInit() {
  }

}
