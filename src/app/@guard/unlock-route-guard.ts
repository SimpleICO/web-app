import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { WalletService } from '@service/wallet.service';

@Injectable()
export class UnlockRouteGuard implements CanActivate {

  constructor(
    private wallet: WalletService,
    private router: Router) {}

  canActivate() {
    if (!this.wallet.isUnlocked()) {
      this.router.navigateByUrl('/login')
      return false
    }

    return this.wallet.isUnlocked()
  }
}
