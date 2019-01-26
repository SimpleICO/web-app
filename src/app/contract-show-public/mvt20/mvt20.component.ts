import { Component, OnInit } from '@angular/core';
import { MVT20Component as PrivateMVT20Component } from '../../contract-show/mvt20/mvt20.component';
import { Wallet } from '@decentralizedtechnologies/scui-lib';

declare const window: any

const Web3 = require('web3');

@Component({
  selector: 'app-mvt20',
  templateUrl: './mvt20.component.html',
  styleUrls: ['./mvt20.component.scss']
})
export class MVT20Component extends PrivateMVT20Component implements OnInit {

  ngOnInit() {
    this.settings.onNetworkChange.subscribe((networkChanged) => {
      super.ngOnInit()
    })
    super.ngOnInit()

    this.enableEthereumBrowser()
  }

  detectAccountChange() {
    const wallet: Wallet = this.wallet.getInstance()
    wallet.web3.currentProvider.publicConfigStore.on('update', (account) => {
      wallet.setAddress(account.selectedAddress)
    })
  }

  async enableEthereumBrowser() {
    const wallet: Wallet = this.wallet.getInstance()

    if (window.ethereum) {
      this.token.instance.setProvider(window.ethereum)
      wallet.setProvider(window.ethereum)
      window.web3 = wallet.web3
      try {
        await window.ethereum.enable()
        wallet.setAddress(wallet.web3.givenProvider.selectedAddress)
        this.detectAccountChange()
      } catch (error) {
        console.error(error)
      }
    } else if (window.web3) {
      this.token.instance.setProvider(window.web3.givenProvider)
      wallet.setProvider(window.web3.givenProvider)
      window.web3 = wallet.web3
      if (navigator.userAgent.match(/Trust/i)) {
        const address = await wallet.web3.eth.getAccounts()
        wallet.setAddress(address)
      } else {
        wallet.setAddress(wallet.web3.givenProvider.selectedAddress)
      }
      this.detectAccountChange()
    } else {
      throw new Error('No-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async requestMembership() {
    try {
      const receipt = await this.token.requestMembership()
      console.log(receipt)
    } catch (error) {
      console.error(error)
    }
  }

  async removeMembership() { }
  async renounceMembership() { }
  async renounceAdminMembership() { }
  async transfer() { }
  async approve() { }
}
