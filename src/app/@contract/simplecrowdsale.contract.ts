import { Crowdsale } from '@model/crowdsale.model';
import { Wallet } from 'scui-lib';
import { SimpleTokenContract } from '@contract/simpletoken.contract';

declare var require: any

const ethers = require('ethers')
const RATE = ethers.utils.bigNumberify(1)
const SimpleCrowdsaleInterface = require('@abi/simplecrowdsale.abi.json')

export class SimpleCrowdsaleContract extends Crowdsale {

  constructor(
    wallet: Wallet) {

    super(wallet)

    this.web3 = wallet.web3
  }

  async getAvailableTokens(token: SimpleTokenContract) {
    const wei = await token.instance.methods.balanceOf(this.address).call()
    this.tokens = ethers.utils.formatEther(wei)
  }

  connect() {
    const _contract = new this.web3.eth.Contract(SimpleCrowdsaleInterface.abi)

    this.instance = _contract

    return this
  }

  async deploy(tokenPrice: number, tokenAddress: string) {

    const price = ethers.utils.parseEther(tokenPrice.toString())

    const beneficiary = this.beneficiary || this.wallet.address

    try {
      return this.instance.deploy({
        data: SimpleCrowdsaleInterface.bytecode,
        arguments: [price, RATE, beneficiary, tokenAddress]
      })
    } catch (error) {
      console.log(error)
    }

  }
}
