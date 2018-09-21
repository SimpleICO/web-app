import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { WalletService } from 'scui-lib';
import { EthereumService } from 'scui-lib';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit, OnDestroy {

  errorMessage: string

  isInvalid: boolean = false

  @Input() seed: string

  onUnlockError: Subscription
  onUnlockSuccess: Subscription

  constructor(
    public wallet: WalletService,
    public eth: EthereumService,
    private router: Router) {

    this.onUnlockError = wallet.onUnlockError.subscribe(error => {
      this.isInvalid = true
      this.errorMessage = error.message
    })

    this.onUnlockSuccess = wallet.onUnlockSuccess.subscribe(data => {
      this.isInvalid = false
      this.errorMessage = ''
      this.wallet.getAccountBalance().then(balance => {
        this.eth.getTotalEthInUsd(this.wallet.ethBalance)
      })

      return this.router.navigate(['/catalog']);
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.onUnlockError.unsubscribe()
    this.onUnlockSuccess.unsubscribe()
  }

}
