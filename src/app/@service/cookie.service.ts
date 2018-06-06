import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';

declare let require: any

let Cookies = require('cookies-js')

@Injectable()
export class CookieService {

  acceptedTermsCookieText: string = 'accepted-alpha-version-notice'

  domain: string = 'localhost'

  constructor() {
    if (environment.staging) {
      this.domain = 'simpleico-dev.firebaseapp.com'
    }
  }

  ngOnInit() {
  }

  acceptTerms(){
    Cookies.set(this.acceptedTermsCookieText, 'yes', { domain: this.domain });
  }

  declineTerms(){
    Cookies.set(this.acceptedTermsCookieText, 'no', { domain: this.domain });
  }

  hasAcceptedTerms(){
    return Cookies.get(this.acceptedTermsCookieText) &&
      Cookies.get(this.acceptedTermsCookieText) == 'yes'
  }

}
