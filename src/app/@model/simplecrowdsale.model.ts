import { Contract } from '@model/contract.model';
import { Wallet } from '@model/wallet.model';

declare var require: any

const ethers = require('ethers')
const RATE = ethers.utils.bigNumberify(1)
const SimpleCrowdsaleInterface = require('@abi/simplecrowdsale.abi.json')

export class SimpleCrowdsale extends Contract {

  instance: any

  web3: any

  txObject: any

  constructor(
    wallet: Wallet) {

    super(wallet)

    this.web3 = wallet.web3
  }

  connect(){
    // this.web3.setProvider(this.web3.givenProvider)

    let _contract = new this.web3.eth.Contract(SimpleCrowdsaleInterface.abi)

    this.instance = _contract

    console.log(this.instance)

    return this
  }

  async deploy(tokenAddress: string){

    try {
      return this.instance.deploy({
        data: SimpleCrowdsaleInterface.bytecode,
        arguments: [RATE, this.wallet.address, tokenAddress]
      })
    } catch (error) {
      console.log(error)
    }

  }
}
