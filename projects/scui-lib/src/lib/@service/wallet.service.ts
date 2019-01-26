import { Injectable, Inject } from '@angular/core';
import { Wallet } from '../@model/wallet.model';
import { Network } from '../@model/network.model';
import { Subject } from 'rxjs';

const Web3 = require('web3')
const Eth = require('ethers')
@Injectable({
  providedIn: 'root'
})
export class WalletService {

  version: string = '5.0.0'

  wallet: Wallet

  network: string

  onNewWallet: Subject<Wallet> = new Subject<Wallet>()

  onUnlockError: Subject<any> = new Subject<any>()
  onUnlockSuccess: Subject<any> = new Subject<any>()

  onLockSuccess: Subject<any> = new Subject<any>()

  isLocked: boolean = true

  balance = Eth.BigNumber
  ethBalance: number

  constructor(
    @Inject('config') private config: any) {
    console.log(config)

    this.setEmptyWallet()
    this.setNetwork(config.network)
    this.setProviderByNetwork()
  }

  setNetwork(network: string = Network.mainnet) {
    this.network = network
    this.wallet.setNetwork(network)
    return this
  }

  setEmptyWallet() {
    this.wallet = new Wallet()
    this.wallet.setLockedInstance()
    this.setNetwork(this.config.network)
    this.setProviderByNetwork()
    return this
  }

  generateWallet() {
    const wallet = new Wallet()
    const result = wallet.createRandom()
    this.onNewWallet.next(result)
    return result
  }

  setProviderByNetwork() {
    const networkURL = this.config.wallet.networks[this.network]
    this.wallet.setProvider(new Web3.providers.HttpProvider(networkURL))
    return this
  }

  async getAccountBalance(address: string = this.getAddress()) {
    const balance = await this.getInstance().getBalance()
    this.balance = balance
    this.ethBalance = Eth.utils.formatEther(balance)
    return balance
  }

  getInstance(): Wallet {
    return this.wallet
  }

  getAddress() {
    return this.wallet ? this.wallet.address.toString() : '0x00000000000000000'
  }

  unlock(seed: string) {
    if (!seed) {
      this.onUnlockError.next({
        message: 'No input detected'
      })

      return false
    }

    seed = seed.trim().replace(/\s\s+/g, ' ')

    if (seed.split(' ').length === 12) {
      return this._unlockFromMnemonic(seed)
    }

    return this._unlockFromPrivateKey(seed)
  }

  isUnlocked() {
    return this.wallet !== undefined &&
      this.wallet != null &&
      !this.isLocked
  }

  lock() {
    this.wallet = null
    this.onLockSuccess.next(true)
    return this
  }

  private _unlockFromMnemonic(mnemonic: string) {
    const instance = new Wallet()

    try {
      this.wallet = instance.unlockFromMnemonic(mnemonic)
      this._afterUnlockSuccess()
    } catch (error) {
      this._onUnlockError(error)
    }
  }

  private _unlockFromPrivateKey(privateKey: string) {
    const instance = new Wallet()

    try {
      this.wallet = instance.unlockFromPrivateKey(privateKey)
      this._afterUnlockSuccess()
    } catch (error) {
      this._onUnlockError(error)
    }
  }

  private _afterUnlockSuccess() {
    this.isLocked = false
    this.setProviderByNetwork()
    this.setNetwork(this.config.network)
    this.onUnlockSuccess.next(true)
  }

  private _onUnlockError(error) {
    this.isLocked = true
    this.onUnlockError.next({
      message: error.message
    })
  }
}
