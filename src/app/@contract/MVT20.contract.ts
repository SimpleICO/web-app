import { Token } from '@model/token.model';
import { Wallet } from '@decentralizedtechnologies/scui-lib';

const MVT20Interface = require('@abi/MVT20.abi.json')
const Web3 = require('web3')

export class MVT20Contract extends Token {

  bytecode = MVT20Interface.bytecode
  crowdsale: string
  members = []
  adminMembers = []
  pendingMembers = []

  constructor(
    wallet: Wallet) {
    super(wallet)
  }

  setAddress(address: string) {
    this.instance.options.address = address
    this.instance._address = address
    this.address = address
    return this
  }

  getAddress() {
    return this.address
  }

  async getBalanceOf() {
    const balanceOf = await this.instance.methods.balanceOf(this.wallet.address).call()
    this.balanceOf = balanceOf
  }

  async getName() {
    this.name = await this.instance.methods.name().call()
  }

  async getSymbol() {
    this.symbol = await this.instance.methods.symbol().call()
  }

  async getTotalSupply() {
    this.supply = await this.instance.methods.totalSupply().call()
  }

  async getAdminMembers() {
    const members = await this.instance.methods.adminMembers().call()
    this.adminMembers = members.map(member => {
      if (this._isAddress(member)) {
        return member.toUpperCase()
      }
    }).filter(member => member !== undefined)
  }

  async getMembers() {
    const members = await this.instance.methods.members().call()
    this.members = members.map(member => {
      if (this._isAddress(member)) {
        return member.toUpperCase()
      }
    }).filter(member => member !== undefined)
  }

  async getPendingRequests() {
    const members = await this.instance.methods.pendingWhitelistRequests().call()
    this.pendingMembers = members.map(member => {
      if (this._isAddress(member)) {
        return member.toUpperCase()
      }
    }).filter(member => member !== undefined)
  }

  connect() {
    const contract = new this.web3.eth.Contract(MVT20Interface.abi, {
      from: this.wallet.address,
      data: MVT20Interface.bytecode,
    })
    this.instance = contract
    return this
  }

  async deploy() {
    try {
      return this.instance.deploy({
        arguments: [this.supply, this.name, this.symbol, this.decimals]
      })
    } catch (error) {
      console.error(error)
    }
  }

  isAdminMember(): boolean {
    return this.adminMembers.indexOf(this.wallet.address) !== -1
  }

  isMember(): boolean {
    return this.members.indexOf(this.wallet.address) !== -1
  }

  isPendingMember(): boolean {
    return this.pendingMembers.indexOf(this.wallet.address) !== -1
  }

  isGuest(): boolean {
    return !this.isAdminMember() && !this.isMember() && !this.isPendingMember()
  }

  async requestMembership() {
    return new Promise(async (resolve, reject) => {
      try {
        const txObject = await this.instance.methods.requestMembership()
        const tx = txObject.send({
          from: this.wallet.address,
          value: '0x0',
        })
        tx.on('transactionHash', hash => {
          this.tx = hash
        })
        tx.on('error', error => {
          reject(error)
        })
        tx.on('receipt', async receipt => {
          resolve(receipt)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}
