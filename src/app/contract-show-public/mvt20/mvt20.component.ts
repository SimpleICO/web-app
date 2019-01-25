import { Component, OnInit } from '@angular/core';
import { MVT20Component as PrivateMVT20Component } from '../../contract-show/mvt20/mvt20.component';

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

  async enableEthereumBrowser() {
    this.token.setEthereumService(this.eth)
    const wallet = this.wallet.getInstance()

    if (window.ethereum) {
      this.token.instance.setProvider(window.ethereum)
      wallet.setProvider(window.ethereum)
      window.web3 = wallet.web3
      try {
        const enable = await window.ethereum.enable()
        wallet.address = wallet.web3.givenProvider.selectedAddress
      } catch (error) {
        console.error(error)
      }
    } else if (window.web3) {
      this.token.instance.setProvider(window.web3.givenProvider)
      wallet.setProvider(window.web3.givenProvider)
      window.web3 = wallet.web3
      if (navigator.userAgent.match(/Trust/i)) {
        wallet.address = await wallet.web3.eth.getAccounts()
      } else {
        wallet.address = wallet.web3.givenProvider.selectedAddress
      }
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
}
