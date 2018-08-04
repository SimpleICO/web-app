import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CookieService } from '@service/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AcceptTermsRouteGuard implements CanActivate {

  constructor(
    private cookie: CookieService,
    private router: Router) { }

  canActivate() {
    if (!this.cookie.hasAcceptedTerms()) {
      this.router.navigateByUrl('/accept-terms')
      return false
    }

    return this.cookie.hasAcceptedTerms()
  }
}
