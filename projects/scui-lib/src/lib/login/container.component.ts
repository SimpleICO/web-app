import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { WalletService } from '../@service/wallet.service';
import { EthereumService } from '../@service/ethereum.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ssc-login-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})

export class ContainerComponent implements OnInit, OnDestroy {

  errorMessage: string

  isInvalid: boolean = false

  @Input() seed: string

  _onUnlockSuccessFunc: any
  @Input()
  set onUnlockSuccessInput(onUnlockSuccessFunc) {
    this._onUnlockSuccessFunc = onUnlockSuccessFunc
  }

  onUnlockError: Subscription
  onUnlockSuccess: Subscription

  constructor(
    public wallet: WalletService,
    public eth: EthereumService,
    public router: Router) {

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

      return this._onUnlockSuccessFunc()
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.onUnlockError.unsubscribe()
    this.onUnlockSuccess.unsubscribe()
  }

}
