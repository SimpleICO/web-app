import { Wallet } from '@model/wallet.model';

declare var require: any

const contract = require('truffle-contract')

export class Contract {

  instance: any

  address: string

  wallet: Wallet

  web3: any

  constructor(wallet: Wallet){
    this.wallet = wallet
  }

  connect(){}

}
