import { Token } from '@model/token.model';
import { Wallet, Address } from '@decentralizedtechnologies/scui-lib';
import { Member, MembershipLevel } from '@model/member.model';

const MVT20Interface = require('@abi/MVT20.abi.json')

export class MVT20Contract extends Token {

  bytecode = MVT20Interface.bytecode
  crowdsale: string
  members: Array<Member> = []
  adminMembers: Array<Member> = []
  pendingMembers: Array<Member> = []
  address: Address

  private _member: Member

  constructor(
    wallet: Wallet) {
    super(wallet)
  }

  setAddress(address: string) {
    this.instance.options.address = address
    this.instance._address = address
    this.address = new Address(address)
    return this
  }

  getAddress(): Address {
    return this.address
  }

  setMember() {
    this._member = new Member(this.wallet.address.toString())
    return this
  }

  get member(): Member {
    return this._member
  }

  async getBalanceOf() {
    const address: Address = this.wallet.address.toChecksumAddress()
    const balanceOf = await this.instance.methods.balanceOf(address).call()
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
    this.adminMembers = members.map(_member => {
      const member = new Member(_member, MembershipLevel.admin)
      member.setWallet(this.wallet)
      return member
    }).filter((member: Member) => member.isValid())
  }

  async getMembers() {
    const members = await this.instance.methods.members().call()
    this.members = members.map(_member => {
      const member = new Member(_member, MembershipLevel.member)
      member.setWallet(this.wallet)
      return member
    }).filter((member: Member) => member.isValid())
  }

  async getPendingRequests() {
    const members = await this.instance.methods.pendingWhitelistRequests().call()
    this.pendingMembers = members.map(_member => {
      const member = new Member(_member, MembershipLevel.pending)
      member.setWallet(this.wallet)
      return member
    }).filter((member: Member) => member.isValid())
  }

  isAdminMember(member: Member): boolean {
    return member.level === MembershipLevel.admin
  }

  isMember(member: Member): boolean {
    return member.level === MembershipLevel.member
  }

  isPendingMember(member: Member): boolean {
    return member.level === MembershipLevel.pending
  }

  isThisMember(member: Member): boolean {
    return this.isMember(member) &&
      this.address.toUpperCase() === this.wallet.address.toUpperCase()
  }

  isGuest(member: Member): boolean {
    return !this.isAdminMember(member) && !this.isMember(member) && !this.isPendingMember(member)
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
