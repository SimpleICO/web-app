import { Wallet, EthereumService, Address } from '@decentralizedtechnologies/scui-lib';

const Web3 = require('web3')

export class DetailedToken {

  name = ''
  symbol = ''
  decimals = 18
  supply: any

  price: any
  instance: any
  address: Address
  wallet: Wallet
  eth: EthereumService
  web3: any
  tx: string
  txObject: any
  balanceOf: number = 0

  constructor(wallet: Wallet) {
    this.setWallet(wallet)
  }

  setWallet(wallet: Wallet) {
    this.wallet = wallet
    this.web3 = wallet.web3
    return this
  }

  setEthereumService(eth: EthereumService) {
    this.eth = eth
    return this
  }

  _isAddress(address) {
    return address !== '0x0000000000000000000000000000000000000000' &&
      Web3.utils.isAddress(address)
  }

  setAddress(address: string) {
    this.instance.options.address = address
    this.instance._address = address
    this.address = new Address(address)
    return this
  }

  getAddress(): Address {
    return this.address
  }

  async getBalanceOf() {
    const address: string = this.wallet.address.toChecksumAddress()
    const balanceOf = await this.instance.methods.balanceOf(address).call()
    this.balanceOf = balanceOf
  }

  async getName() {
    this.name = await this.instance.methods.name().call()
  }

  async getSymbol() {
    this.symbol = await this.instance.methods.symbol().call()
  }

  async getTotalSupply() {
    this.supply = await this.instance.methods.totalSupply().call()
  }
}
