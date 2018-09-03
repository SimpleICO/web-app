import { Crowdsale } from '@model/crowdsale.model';
import { Wallet } from 'scui-lib';

declare var require: any

const ethers = require('ethers')
const RATE = ethers.utils.bigNumberify(1)
const OwnedCrowdsaleInterface = require('@abi/OwnedCrowdsale.json')

export class OwnedCrowdsaleContract extends Crowdsale {

  constructor(
    wallet: Wallet) {

    super(wallet)

    this.web3 = wallet.web3
  }

  async getAvailableTokens() {
    this.allowance = await this.token.instance.methods.allowance(this.beneficiary, this.address).call()
  }

  async setPrice(price: number) {
    await this.instance.methods.setPrice(price)
    return this
  }

  connect() {
    const _contract = new this.web3.eth.Contract(OwnedCrowdsaleInterface.abi)

    this.instance = _contract

    return this
  }

  async deploy() {

    const beneficiary = this.beneficiary || this.wallet.address

    try {
      return this.instance.deploy({
        data: OwnedCrowdsaleInterface.bytecode,
        arguments: [RATE, beneficiary, this.token.getAddress()]
      })
    } catch (error) {
      console.log(error)
    }
  }
}
