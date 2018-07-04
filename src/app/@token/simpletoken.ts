import { Token } from '@model/token.model';
import { Wallet } from '@model/wallet.model';

declare var require: any

const ethers = require('ethers')

const SimpleTokenInterface = require('@abi/simpletoken.abi.json')

export class SimpleToken extends Token {

  name: string = ''

  symbol: string = ''

  decimals: number = 18

  supply: any = 10

  price: any = '0.0001'

  web3: any

  truffleContract: any

  txObject: any

  bytecode = SimpleTokenInterface.bytecode

  address: string

  crowdsale: string

  tx: string

  constructor(
    wallet: Wallet) {

    super(wallet)

    this.web3 = wallet.web3
  }

  setAddress(address: string){
    this.instance.options.address = address
    this.instance._address = address
    this.address = address

    return this
  }

  getAddress(){
    return this.address
  }

  async getName(){
    this.name = await this.instance.methods.name().call()
  }

  async getSymbol(){
    this.symbol = await this.instance.methods.symbol().call()
  }

  onTransfer(){
    this.truffleContract.Transfer().watch((error, result) => {
      if (error) console.log(error)

      console.log(result)
    })
  }

  connect(){
    let _contract = new this.web3.eth.Contract(SimpleTokenInterface.abi)

    this.instance = _contract

    console.log(this.instance)

    return this
  }

  async deploy(){

    console.log(this.decimals, this.supply)

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
