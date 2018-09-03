const ethers = require('ethers')
const Web3 = require('web3')
const $wallet = ethers.Wallet

export class Wallet {

  instance: any

  address: string

  privateKey: string

  mnemonic: string

  provider: any

  web3: any

  beneficiary: string

  network: string

  constructor() { }

  getBalance() {
    return this.web3.eth.getBalance(this.address)
  }

  setNetwork(network: string) {
    this.network = network

    return this
  }

  setBeneficiary(address: string) {
    this.beneficiary = address

    return this
  }

  setProvider(provider) {
    this.provider = provider
    this.instance.provider = provider
    this.web3 = new Web3(provider)
    return this
  }

  setLockedInstance() {
    this.instance = $wallet
    return this
  }

  unlockFromMnemonic(mnemonic: string) {
    try {
      const wallet = $wallet.fromMnemonic(mnemonic)
      this.instance = wallet
      this.mnemonic = mnemonic
      this.privateKey = wallet.privateKey
      this.address = wallet.address
      return this
    } catch (error) {
      console.log(error)
      throw new Error('Text is an invalid mnemonic seed phrase')
    }
  }

  unlockFromPrivateKey(privateKey: string) {
    try {
      const wallet = new $wallet(privateKey)
      this.instance = wallet
      this.privateKey = wallet.privateKey
      this.address = wallet.address
      return this
    } catch (error) {
      console.log(error)
      throw new Error('Invalid private key or mnemonic seed phrase')
    }
  }

  createRandom() {
    return $wallet.createRandom()
  }
}
