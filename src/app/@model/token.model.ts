import { Wallet } from 'scui-lib';

declare var require: any

export abstract class Token {

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

  balanceOf: number

  constructor(wallet: Wallet) {
    this.wallet = wallet
  }

  abstract connect()
  abstract getAddress()
  abstract setAddress(addres: string)
  abstract async getName()
  abstract async getSymbol()
  abstract async getTotalSupply()
  abstract async deploy()
  abstract async getBalanceOf()

}
