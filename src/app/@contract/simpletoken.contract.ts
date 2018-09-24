import { Token } from '@model/token.model';
import { Wallet } from 'scui-lib';

declare var require: any

const SimpleTokenInterface = require('@abi/simpletoken.abi.json')

export class SimpleTokenContract extends Token {

  name: string = ''

  symbol: string = ''

  decimals: number = 18

  supply: any = 10

  price: any = '0.0001'

  web3: any

  truffleContract: any

  txObject: any

  bytecode = SimpleTokenInterface.bytecode

  address: string = ''

  crowdsale: string

  tx: string

  balanceOf: number = 0

  constructor(
    wallet: Wallet) {

    super(wallet)

    this.web3 = wallet.web3
  }

  setAddress(address: string) {
    this.instance.options.address = address
    this.instance._address = address
    this.address = address

    return this
  }

  getAddress() {
    return this.address
  }

  async getBalanceOf() {
    const balanceOf = await this.instance.methods.balanceOf(this.wallet.address).call()
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

  connect() {
    const _contract = new this.web3.eth.Contract(SimpleTokenInterface.abi)

    this.instance = _contract

    return this
  }

  async deploy() {

    try {
      return this.instance.deploy({
        data: SimpleTokenInterface.bytecode,
        arguments: [this.name, this.symbol, this.decimals, this.supply]
      })
    } catch (error) {
      console.log(error)
    }
  }
}
