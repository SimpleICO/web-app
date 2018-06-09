import { Contract } from '@model/contract.model';
import { Wallet } from '@model/wallet.model';

declare var require: any

const SimpleTokenInterface = require('@abi/simpletoken.abi.json')

const contract = require('truffle-contract')
const ethers = require('ethers')
const Web3 = require('web3')
const BigNumber = ethers.BigNumber

export class SimpleToken extends Contract {

  name: string

  symbol: string

  decimals: number = 18

  supply: any

  web3: any

  constructor(
    wallet: Wallet,
    name: string,
    symbol: string) {

    super(wallet)

    this.name = name
    this.symbol = symbol

    this.web3 = wallet.web3
  }

  connect(){

    let _contract = new this.web3.eth.Contract(SimpleTokenInterface.abi)

    this.instance = _contract

    console.log(this.instance)

    return this
  }

  async deploy(supply: any){

    let txOptions = {
    }

    console.log(this.name, this.symbol, this.decimals, supply, txOptions)

    try {
      return this.instance.deploy({
        data: SimpleTokenInterface.bytecode,
        arguments: [this.name, this.symbol, this.decimals, supply]
      })
    } catch (error) {
      console.log(error)
    }

  }

}
