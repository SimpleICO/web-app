import { Component, OnInit } from '@angular/core';
import { MVT20Component as PrivateMVT20Component } from '../../contract-show/mvt20/mvt20.component';
import { Wallet, Address } from '@decentralizedtechnologies/scui-lib';
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
  display = false

  error = {
    display: false,
    msg: '',
  }

  payload = {
    receiver: '',
    amount: 0,
  }

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
      this.refresh()
    } catch (error) {
      console.error(error)
    }
  }

  detectAccountChange() {
    const wallet: Wallet = this.wallet.getInstance()
    wallet.web3.currentProvider.publicConfigStore.on('update', (account) => {
      wallet.setAddress(account.selectedAddress)
      this.refresh()
    })
  }

  refresh() {
    this.token.setMember()
    this.token.getBalanceOf()
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
          wallet.setAddress(wallet.web3.givenProvider.selectedAddress)
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

  async removeWhitelisted(member) {
    try {
      await this.token.removeWhitelisted(member)
    } catch (error) {
      console.error(error)
    }
  }

  async renounceWhitelisted() {
    try {
      await this.token.renounceWhitelisted()
    } catch (error) {
      console.error(error)
    }
  }

  async renounceWhitelistAdmin() {
    try {
      await this.token.renounceWhitelistAdmin()
    } catch (error) {
      console.error(error)
    }
  }

  async addWhitelisted(member: Member) {
    try {
      await this.token.addWhitelisted(member)
    } catch (error) {
      console.error(error)
    }
  }

  async revokeMembershipRequest(member: Member) {
    try {
      await this.token.revokeMembershipRequest(member)
    } catch (error) {
      console.error(error)
    }
  }

  async transfer() {
    try {
      const receiver = new Address(this.payload.receiver)
      const isMember = this.token._addressBelongsIn(this.token._members, receiver)
      if (!isMember) {
        this.error.display = true
        this.error.msg = `Address <span class="text-truncate address">${receiver.toChecksumAddress()}</span> is not a member`
        return false
      }

      if (isNaN(Number(this.payload.amount)) || this.payload.amount <= 0) {
        this.error.display = true
        this.error.msg = `Address <span class="text-truncate address">${receiver.toChecksumAddress()}</span> is not a member`
        return false
      }

      this.error.display = false
      this.error.msg = ''

      const receipt = await this.token.transfer(receiver, this.payload.amount)
    } catch (error) {
      console.error(error)
    }
  }

  displayModal() {
    this.display = true
  }

  resetModal() {
    this.display = false
  }
}
