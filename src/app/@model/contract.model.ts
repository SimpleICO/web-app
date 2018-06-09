import { Wallet } from '@model/wallet.model';

declare var require: any

const contract = require('truffle-contract')

export class Contract {

  instance: any

  address: string

  wallet: Wallet

  constructor(wallet: Wallet){
    this.wallet = wallet
  }

  connect(){}

}
