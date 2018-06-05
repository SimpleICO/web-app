declare var require: any

const ethers = require('ethers')
const $wallet = ethers.Wallet

export class Wallet {

  instance: any

  address: string

  privateKey: string

  mnemonic: string

  provider: any

  constructor(){}

  createRandom(){
    return $wallet.createRandom()
  }
}
