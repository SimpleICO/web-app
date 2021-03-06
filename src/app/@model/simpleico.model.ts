import { Wallet } from '@decentralizedtechnologies/scui-lib';

declare var require: any

export abstract class SimpleICO {

  instance: any

  address: string

  wallet: Wallet

  web3: any

  tx: string

  txObject: any

  name: string

  symbol: string

  decimals: number

  supply: any

  price: any

  constructor(wallet: Wallet) {
    this.wallet = wallet
  }

  abstract connect()
  abstract getAddress()
  abstract setAddress(addres: string)

}
