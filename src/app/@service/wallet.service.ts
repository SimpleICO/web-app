import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Wallet } from '@model/wallet.model';
import { Network } from '@model/network.model';
import { Router } from '@angular/router';
import { ErrorTrackingService } from '@service/error-tracking.service';

declare var require: any

const Eth = require('ethers')
const Web3 = require('web3')

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  accounts: Array<string> = []

  onNewWallet: Subject<Wallet> = new Subject<Wallet>()

  onUnlockError: Subject<any> = new Subject<any>()
  onUnlockSuccess: Subject<any> = new Subject<any>()

  wallet: Wallet

  isLocked: boolean = true

  balance = Eth.BigNumber
  ethBalance: number

  network: string

  version: string = '5.0.0'

  constructor(
    private router: Router,
    private errorTracking: ErrorTrackingService) {

    this.setEmptyWallet()
    this.setNetwork()
  }

  setNetwork(network: string = Network.mainnet) {
    this.network = network
    this.wallet.setNetwork(network)
    return this
  }

  setBeneficiaryAddress(address: string) {
    if (!Web3.utils.isAddress(address)) { return false }

    this.wallet.setBeneficiary(address)

    return this
  }

  async getAccountBalance(address: string = this.getAddress()) {
    const balance = await this.getInstance().getBalance()
    this.balance = balance
    this.ethBalance = Eth.utils.formatEther(balance)
    return balance
  }

  setEmptyWallet() {
    this.wallet = new Wallet()
    this.wallet.setLockedInstance()
    return this
  }

  getInstance(): Wallet {
    return this.wallet
  }

  generateWallet() {
    const wallet = new Wallet()

    const result = wallet.createRandom()

    this.onNewWallet.next(result)

    return result
  }

  getAddress() {
    return this.wallet ? this.wallet.address : '0x00000000000000000'
  }

  resolve() {
    if (!this.isUnlocked()) {
      return this.router.navigateByUrl('/login');
    }

    return this.isUnlocked()
  }

  isUnlocked() {
    return this.wallet !== undefined &&
      this.wallet != null &&
      !this.isLocked
  }

  lock() {
    this.wallet = null

    return this.router.navigateByUrl('/login')
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
      return this.unlockFromMnemonic(seed)
    }

    return this.unlockFromPrivateKey(seed)
  }

  setProviderByNetwork(network: string = Network.mainnet) {


    const providerSetters = {}
    providerSetters[Network.mainnet] = this.wallet.setMainnetProvider
    providerSetters[Network.testnet] = this.wallet.setRopstenProvider
    providerSetters[Network.private] = this.wallet.setJsonRpcProvider

    providerSetters[network].call(this.wallet)

    return this
  }

  private _afterUnlockSuccess() {
    this.isLocked = false
    this.setNetwork()
    this.setProviderByNetwork()
    this.onUnlockSuccess.next(true)
    this.errorTracking.setUserContext({ address: this.getAddress() })
  }

  private _onUnlockError(error) {
    this.isLocked = true
    this.onUnlockError.next({
      message: error.message
    })
  }

  unlockFromMnemonic(mnemonic: string) {
    const instance = new Wallet()

    try {
      this.wallet = instance.unlockFromMnemonic(mnemonic)
      this._afterUnlockSuccess()
    } catch (error) {
      this._onUnlockError(error)
    }
  }

  unlockFromPrivateKey(privateKey: string) {
    const instance = new Wallet()

    try {
      this.wallet = instance.unlockFromPrivateKey(privateKey)
      this._afterUnlockSuccess()
    } catch (error) {
      this._onUnlockError(error)
    }
  }
}
