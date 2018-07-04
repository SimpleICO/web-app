import { Wallet } from '@model/wallet.model';

declare var require: any

const contract = require('truffle-contract')

export abstract class Crowdsale {

  instance: any

  address: string

  wallet: Wallet

  web3: any

  tx: string

  txObject: any

  beneficiary: string

  constructor(wallet: Wallet){
    this.wallet = wallet
  }

  abstract connect()
  abstract getAddress()
  abstract setAddress(addres: string)
  abstract setBeneficiary(address: string)
  abstract async getBeneficiary()
  abstract async deploy(tokenPrice: number, tokenAddress: string)

}
