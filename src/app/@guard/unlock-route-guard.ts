import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { WalletService } from 'scui-lib';
import { CookieService } from '@service/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class UnlockRouteGuard implements CanActivate {

  constructor(
    private wallet: WalletService,
    private cookie: CookieService,
    private router: Router) { }

  canActivate() {
    if (!this.cookie.hasAcceptedTerms()) {
      this.router.navigateByUrl('/accept-terms')
      return false
    }

    if (!this.wallet.isUnlocked()) {
      this.router.navigateByUrl('/login')
      return false
    }

    return this.wallet.isUnlocked()
  }
}
