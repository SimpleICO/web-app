import { Injectable } from '@angular/core';
import * as Raven from 'raven-js';

@Injectable({
  providedIn: 'root'
})
export class ErrorTrackingService {

  provider: any

  constructor() {
    Raven
      .config('https://11bd1ad2f6a94491bb60a751f793f8c0@sentry.io/1244323')
      .install()

    this.provider = Raven
  }

  handleError(error: any): void {
    this.provider.captureException(error)
  }

  setUserContext({ address }){
    this.provider.setUserContext({
      id: address
    })
  }
}
