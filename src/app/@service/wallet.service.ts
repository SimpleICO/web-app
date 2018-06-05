import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Wallet } from '@model/wallet.model';

@Injectable()
export class WalletService {

  accounts: Array<string> = []

  address: string

  onNewWallet: Subject<Wallet> = new Subject<Wallet>()

  constructor() {}

  generateWallet(){
    let wallet = new Wallet()

    let result = wallet.createRandom()

    this.onNewWallet.next(result)

    console.log(result)

    return result
  }

}
