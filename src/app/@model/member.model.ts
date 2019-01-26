import { Address, Wallet } from '@decentralizedtechnologies/scui-lib';

export enum MembershipLevel {
  admin = 'admin',
  member = 'member',
  pending = 'pending',
}

export class Member {

  address: Address
  wallet: Wallet
  level: MembershipLevel

  constructor(address: string, level?: MembershipLevel) {
    this.address = new Address(address)
    this.level = level
  }

  setAddress(address: string) {
    this.address = new Address(address)
  }

  setWallet(wallet: Wallet) {
    this.wallet = wallet
    return this
  }

  isValid(): boolean {
    return this.address.isValid()
  }

}
