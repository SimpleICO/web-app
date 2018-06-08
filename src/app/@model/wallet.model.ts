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

  setProvider(provider: any){
    this.instance.provider = provider
  }

  unlockFromMnemonic(mnemonic: string){
    try {
      let wallet = $wallet.fromMnemonic(mnemonic)
      this.instance = wallet
      this.mnemonic = mnemonic
      this.address = wallet.address
      console.log(wallet)
      return this
    } catch (error) {
      console.log(error)
      throw new Error('Text is an invalid mnemonic seed phrase')
    }
  }

  unlockFromPrivateKey(privateKey: string){
    try {
      let wallet = new $wallet(privateKey)
      this.instance = wallet
      this.privateKey = wallet.privateKey
      this.address = wallet.address
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
