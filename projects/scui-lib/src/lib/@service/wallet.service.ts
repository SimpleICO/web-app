import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(
    @Inject('config') private config: any) {
    console.log(config)
  }
}
