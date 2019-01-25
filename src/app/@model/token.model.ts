import { Wallet, EthereumService } from '@decentralizedtechnologies/scui-lib';

const Web3 = require('web3')
export abstract class Token {

  name = ''
  symbol = ''
  decimals = 18
  supply: any

  price: any
  instance: any
  address: string
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

  abstract connect()
  abstract getAddress()
  abstract setAddress(addres: string)
  abstract async getName()
  abstract async getSymbol()
  abstract async getTotalSupply()
  abstract async deploy()
  abstract async getBalanceOf()

}
