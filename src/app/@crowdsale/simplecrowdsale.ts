import { Crowdsale } from '@model/crowdsale.model';
import { Wallet } from '@model/wallet.model';
import { SimpleTokenContract } from '@contract/simpletoken.contract';
import { environment as env } from '@environment/environment';

declare var require: any

const ethers = require('ethers')
const RATE = ethers.utils.bigNumberify(1)
const SimpleCrowdsaleInterface = require('@abi/simplecrowdsale.abi.json')
const Web3 = require('web3')

export class SimpleCrowdsale extends Crowdsale {

  instance: any

  web3: any

  txObject: any

  ethRaised: string = '0.0'

  address: string

  tokens: string

  websocket: string

  token: SimpleTokenContract

  beneficiary: string

  price: string

  tx: string

  constructor(
    wallet: Wallet) {

    super(wallet)

    this.web3 = wallet.web3

    if (env.local) {
      this.websocket = 'ws://localhost:7545'
    } else if (env.staging) {
      this.websocket = 'wss://ropsten.infura.io/ws'
    } else {
      this.websocket = 'wss://mainnet.infura.io/ws'
    }
  }

  subscribeToEvents(){
    let provider = new Web3.providers.WebsocketProvider(this.websocket)
    let web3 = new Web3(provider)

    return web3.eth.subscribe('logs', {
      address: this.address,
      topics: [],
    })
  }

  setAddress(address: string){
    this.instance.options.address = address
    this.instance._address = address
    this.address = address

    return this
  }

  getAddress(): string {
    return this.address
  }

  async getEthRaised(){
    let weiRaised = await this.instance.methods.weiRaised().call()
    this.ethRaised = ethers.utils.formatEther(weiRaised)
  }

  async getAvailableTokens(token: SimpleTokenContract){
    let wei = await token.instance.methods.balanceOf(this.address).call()
    this.tokens = ethers.utils.formatEther(wei)
  }

  setBeneficiary(address: string){
    this.beneficiary = address
  }

  async getBeneficiary(){
    this.beneficiary = await this.instance.methods.wallet().call()
  }

  async getPrice(){
    let price = await this.instance.methods.price().call()
    this.price = ethers.utils.formatEther(price)
  }

  async setToken(){
    let address = await this.instance.methods.token().call()
    this.token = new SimpleTokenContract(this.wallet)
    this.token.connect()
    this.token.setAddress(address)
    this.token.crowdsale = this.getAddress()

    return this
  }

  getToken(): SimpleTokenContract {
    return this.token
  }

  connect(){
    let _contract = new this.web3.eth.Contract(SimpleCrowdsaleInterface.abi)

    this.instance = _contract

    console.log(this.instance)

    return this
  }

  async deploy(tokenPrice: number, tokenAddress: string){

    console.log(tokenPrice)
    let price = ethers.utils.parseEther(tokenPrice.toString())

    let beneficiary = this.beneficiary || this.wallet.address

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
