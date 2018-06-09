import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Wallet } from '@model/wallet.model';
import { Router } from '@angular/router';
import { environment as env } from '@environment/environment';

declare var require: any

const Eth = require('ethers')
const Web3 = require('web3')
const Providers = Eth.providers

@Injectable()
export class WalletService {

  accounts: Array<string> = []

  onNewWallet: Subject<Wallet> = new Subject<Wallet>()

  onUnlockError: Subject<any> = new Subject<any>()
  onUnlockSuccess: Subject<any> = new Subject<any>()

  wallet: Wallet

  isLocked: boolean = true

  balance = Eth.BigNumber
  ethBalance: string
  onGetBalance: Subject<any> = new Subject<any>()

  constructor(
    private router: Router) {
    this.onGetBalance.subscribe(balance => {
      console.log(balance)
      this.balance = balance
      this.ethBalance = Eth.utils.formatEther(balance)
    })
  }

  async getAccountBalance(address: string = this.getAddress()){
    let balance = await this.getInstance().getBalance()
    this.onGetBalance.next(balance)
  }

  getInstance(): Wallet {
    return this.wallet
  }

  generateWallet(){
    let wallet = new Wallet()

    let result = wallet.createRandom()

    this.onNewWallet.next(result)

    return result
  }

  getAddress(){
    return this.wallet ? this.wallet.address : '0x00000000000000000'
  }

  resolve(){
    if (!this.isUnlocked()) {
      return this.router.navigateByUrl('/login');
    }

    return this.isUnlocked()
  }

  isUnlocked(){
    return this.wallet != undefined &&
          this.wallet != null &&
          !this.isLocked
  }

  lock(){
    this.wallet = null

    return this.router.navigateByUrl('/login')
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

  setProvider(){
    if (env.local) {
      this.wallet.setJsonRpcProvider()
    }
  }

  unlockFromMnemonic(mnemonic: string){
    let instance = new Wallet()

    try {
      this.wallet = instance.unlockFromMnemonic(mnemonic)
      this.isLocked = false
      this.onUnlockSuccess.next(true)
    } catch (error) {
      this.isLocked = true
      this.onUnlockError.next({
        message: error.message
      })
    }
  }

  unlockFromPrivateKey(privateKey: string){
    let instance = new Wallet()

    try {
      this.wallet = instance.unlockFromPrivateKey(privateKey)
      this.isLocked = false
      this.onUnlockSuccess.next(true)
    } catch (error) {
      this.isLocked = true
      this.onUnlockError.next({
        message: error.message
      })
    }
  }
}
