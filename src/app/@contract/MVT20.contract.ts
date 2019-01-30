import { Wallet, Address } from '@decentralizedtechnologies/scui-lib';
import { Member } from '@model/member.model';
import { DetailedToken } from '@model/detailed-token.model';
import { IContract } from '@model/icontract.model';

const MVT20Interface = require('@abi/MVT20.abi.json')

export class MVT20Contract extends DetailedToken implements IContract {

  bytecode = MVT20Interface.bytecode
  crowdsale: string

  members: Array<Member> = []
  adminMembers: Array<Member> = []
  pendingMembers: Array<Member> = []
  _members = []
  _adminMembers = []
  _pendingMembers = []

  address: Address

  private _member: Member

  constructor(
    wallet: Wallet) {
    super(wallet)
  }

  setMember() {
    this._member = new Member(this.wallet.address.toString())
    return this
  }

  get member(): Member {
    return this._member
  }

  async getAdminMembers() {
    const members = await this.instance.methods.adminMembers().call()
    this.adminMembers = members.map((_member: string) => {
      this._adminMembers.push(_member.toUpperCase())
      const member = new Member(_member)
      member.setWallet(this.wallet)
      return member
    }).filter((member: Member) => member.isValid())
  }

  async getMembers() {
    const members = await this.instance.methods.members().call()
    this.members = members.map((_member: string) => {
      this._members.push(_member.toUpperCase())
      const member = new Member(_member)
      member.setWallet(this.wallet)
      return member
    }).filter((member: Member) => member.isValid())
  }

  async getPendingRequests() {
    const members = await this.instance.methods.pendingWhitelistRequests().call()
    this.pendingMembers = members.map((_member: string) => {
      this._pendingMembers.push(_member.toUpperCase())
      const member = new Member(_member)
      member.setWallet(this.wallet)
      return member
    }).filter((member: Member) => member.isValid())
  }

  isAdminMember(): boolean {
    return this._addressBelongsIn(this._adminMembers, this.wallet.address)
  }

  isMember(): boolean {
    return this._addressBelongsIn(this._members, this.wallet.address)
  }

  isPendingMember(): boolean {
    return this._addressBelongsIn(this._pendingMembers, this.wallet.address)
  }

  isThisMember(member: Member): boolean {
    return this.isMember() &&
      member.address.toUpperCase() === this.wallet.address.toUpperCase()
  }

  isGuest(): boolean {
    return !this.isAdminMember() && !this.isMember() && !this.isPendingMember()
  }

  _addressBelongsIn(members, address: Address): boolean {
    if (address === undefined) { return false }
    return members.includes(address.toUpperCase())
  }

  connect() {
    const contract = new this.web3.eth.Contract(MVT20Interface.abi, {
      from: this.wallet.address.toChecksumAddress(),
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

  async addWhitelisted(member: Member) {
    return new Promise(async (resolve, reject) => {
      try {
        const txObject = await this.instance.methods.addWhitelisted(member.address.toChecksumAddress())
        const tx = txObject.send({
          from: this.wallet.address.toChecksumAddress(),
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

  async revokeMembershipRequest(member: Member) {
    return new Promise(async (resolve, reject) => {
      try {
        const txObject = await this.instance.methods.revokeMembershipRequest(member.address.toChecksumAddress())
        const tx = txObject.send({
          from: this.wallet.address.toChecksumAddress(),
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

  async renounceWhitelisted() {
    return new Promise(async (resolve, reject) => {
      try {
        const txObject = await this.instance.methods.renounceWhitelisted()
        const tx = txObject.send({
          from: this.wallet.address.toChecksumAddress(),
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

  async renounceWhitelistAdmin() {
    return new Promise(async (resolve, reject) => {
      try {
        const txObject = await this.instance.methods.renounceWhitelistAdmin()
        const tx = txObject.send({
          from: this.wallet.address.toChecksumAddress(),
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

  async removeWhitelisted(member: Member) {
    return new Promise(async (resolve, reject) => {
      try {
        const txObject = await this.instance.methods.removeWhitelisted(member.address.toChecksumAddress())
        const tx = txObject.send({
          from: this.wallet.address.toChecksumAddress(),
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

  async transfer(to: Address, _value: any) {
    const value = this.wallet.web3.utils.toWei(_value, 'ether')
    return new Promise(async (resolve, reject) => {
      try {
        const txObject = await this.instance.methods.transfer(to.toChecksumAddress(), value)
        const tx = txObject.send({
          from: this.wallet.address.toChecksumAddress(),
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

  async requestMembership() {
    return new Promise(async (resolve, reject) => {
      try {
        const txObject = await this.instance.methods.requestMembership()
        const tx = txObject.send({
          from: this.wallet.address.toChecksumAddress(),
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
