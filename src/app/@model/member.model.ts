import { Address, Wallet } from '@decentralizedtechnologies/scui-lib';

export class Member {

  address: Address
  wallet: Wallet

  constructor(address: string) {
    this.address = new Address(address)
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
