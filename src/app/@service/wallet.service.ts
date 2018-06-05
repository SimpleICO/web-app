import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Wallet } from '@model/wallet.model';

@Injectable()
export class WalletService {

  accounts: Array<string> = []

  address: string

  onNewWallet: Subject<Wallet> = new Subject<Wallet>()

  onUnlockError: Subject<any> = new Subject<any>()
  onUnlockSuccess: Subject<any> = new Subject<any>()

  wallet: Wallet

  constructor() {}

  generateWallet(){
    let wallet = new Wallet()

    let result = wallet.createRandom()

    this.onNewWallet.next(result)

    return result
  }

  unlock(seed: string){
    if (!seed) {
      this.onUnlockError.next({
        message: 'No input detected'
      })

      return false
    }

    seed = seed.trim().replace(/\s\s+/g, ' ')

    if (seed.split(' ').length == 12) {
      return this.unlockFromMnemonic(seed)
    }

    return this.unlockFromPrivateKey(seed)
  }

  unlockFromMnemonic(mnemonic: string){
    let instance = new Wallet()

    try {
      this.wallet = instance.unlockFromMnemonic(mnemonic)
      this.onUnlockSuccess.next(true)
    } catch (error) {
      this.onUnlockError.next({
        message: error.message
      })
    }
  }

  unlockFromPrivateKey(privateKey: string){
    let instance = new Wallet()

    try {
      this.wallet = instance.unlockFromPrivateKey(privateKey)
      this.onUnlockSuccess.next(true)
    } catch (error) {
      this.onUnlockError.next({
        message: error.message
      })
    }
  }
}
