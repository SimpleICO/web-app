import { Component, OnInit } from '@angular/core';
import { MVT20Component as PrivateMVT20Component } from '../../contract-show/mvt20/mvt20.component';
import { Wallet } from '@decentralizedtechnologies/scui-lib';
import { Member } from '@model/member.model';

declare const window: any

const Web3 = require('web3');

@Component({
  selector: 'app-mvt20',
  templateUrl: './mvt20.component.html',
  styleUrls: ['./mvt20.component.scss']
})
export class MVT20Component extends PrivateMVT20Component implements OnInit {

  member: Member = new Member('')

  ngOnInit() {
    this.settings.onNetworkChange.subscribe((networkChanged) => {
      super.ngOnInit()
    })
    super.ngOnInit()

    this.init()
  }

  async init() {
    try {
      await this.enableEthereumBrowser()
      this.token.getBalanceOf()
      this.token.setMember()
    } catch (error) {
      console.error(error)
    }
  }

  detectAccountChange() {
    const wallet: Wallet = this.wallet.getInstance()
    wallet.web3.currentProvider.publicConfigStore.on('update', (account) => {
      wallet.setAddress(account.selectedAddress)
      this.token.setMember()
    })
  }

  enableEthereumBrowser() {
    const wallet: Wallet = this.wallet.getInstance()

    return new Promise(async (resolve, reject) => {
      if (window.ethereum) {
        this.token.instance.setProvider(window.ethereum)
        wallet.setProvider(window.ethereum)
        window.web3 = wallet.web3
        try {
          await window.ethereum.enable()
          wallet.setAddress(wallet.web3.givenProvider.selectedAddress)
          this.detectAccountChange()
          resolve(true)
        } catch (error) {
          reject(error)
        }
      } else if (window.web3) {
        this.token.instance.setProvider(window.web3.givenProvider)
        wallet.setProvider(window.web3.givenProvider)
        window.web3 = wallet.web3
        if (navigator.userAgent.match(/Trust/i)) {
          wallet.setAddress(wallet.web3.eth.defaultAccount)
        } else {
          wallet.setAddress(wallet.web3.givenProvider.selectedAddress)
        }
        resolve(true)
      } else {
        reject('No-Ethereum browser detected. You should consider trying MetaMask!')
      }
    })
  }

  async requestMembership() {
    try {
      const receipt = await this.token.requestMembership()
      console.log(receipt)
    } catch (error) {
      console.error(error)
    }
  }

  async removeWhitelisted() { }
  async renounceWhitelisted() { }
  async renounceWhitelistAdmin() { }
  async addWhitelisted() { }
  async transfer() { }
}
