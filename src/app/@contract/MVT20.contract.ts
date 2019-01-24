import { Token } from '@model/token.model';
import { Wallet } from '@decentralizedtechnologies/scui-lib';

const MVT20Interface = require('@abi/MVT20.abi.json')
const Web3 = require('web3')

export class MVT20Contract extends Token {

  name: string = ''
  symbol: string = ''
  decimals: number = 18
  supply: any = 10
  price: any = '0.1'
  web3: any
  truffleContract: any
  txObject: any
  bytecode = MVT20Interface.bytecode
  address: string = ''
  crowdsale: string
  tx: string
  balanceOf: number = 0
  members = []
  adminMembers = []
  pendingMembers = []

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

  async getAdminMembers() {
    const members = await this.instance.methods.adminMembers().call()
    this.adminMembers = members.filter(member => {
      return this.isAddress(member)
    })
  }

  async getMembers() {
    const members = await this.instance.methods.members().call()
    this.members = members.filter(member => {
      return this.isAddress(member)
    })
  }

  async getPendingRequests() {
    const members = await this.instance.methods.pendingWhitelistRequests().call()
    this.pendingMembers = members.filter(member => {
      return this.isAddress(member)
    })
  }

  private isAddress(address) {
    return address !== '0x0000000000000000000000000000000000000000' &&
      Web3.utils.isAddress(address)
  }

  connect() {
    const contract = new this.web3.eth.Contract(MVT20Interface.abi, {
      from: this.wallet.address,
      data: MVT20Interface.bytecode,
    })
    this.instance = contract
    return this
  }

  async deploy() {
    try {
      return this.instance.deploy({
        arguments: [this.supply, this.name, this.symbol, this.decimals]
      })
    } catch (error) {
      console.error(error)
    }
  }
}
