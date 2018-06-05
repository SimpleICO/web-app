declare var require: any

const ethers = require('ethers')
const $wallet = ethers.Wallet

export class Wallet {

  instance: any

  address: string

  privateKey: string

  mnemonic: string

  provider: any

  constructor(){
    this.instance = $wallet
  }

  unlockFromMnemonic(mnemonic: string){
    try {
      let wallet = this.instance.fromMnemonic(mnemonic)
      this.mnemonic = mnemonic
      console.log(wallet)
      return this
    } catch (error) {
      console.log(error)
      throw new Error('Text is an invalid mnemonic seed phrase')
    }
  }

  unlockFromPrivateKey(privateKey: string){
    try {
      let wallet = new this.instance(privateKey)
      this.privateKey = wallet.privateKey
      console.log(wallet)
      return this
    } catch (error) {
      console.log(error)
      throw new Error('Invalid private key or mnemonic seed phrase')
    }
  }

  createRandom(){
    return $wallet.createRandom()
  }
}
