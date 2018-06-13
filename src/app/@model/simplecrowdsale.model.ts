import { Contract } from '@model/contract.model';
import { Wallet } from '@model/wallet.model';
import { SimpleToken } from '@model/simpletoken.model';
import { environment as env } from '@environment/environment';

declare var require: any

const ethers = require('ethers')
const RATE = ethers.utils.bigNumberify(1)
const SimpleCrowdsaleInterface = require('@abi/simplecrowdsale.abi.json')
const Web3 = require('web3')

export class SimpleCrowdsale extends Contract {

  instance: any

  web3: any

  txObject: any

  ethRaised: string = '0.0'

  address: string

  tokens: string

  websocket: string

  token: SimpleToken

  constructor(
    wallet: Wallet) {

    super(wallet)

    this.web3 = wallet.web3

    if (env.local) {
      this.websocket = 'ws://localhost:7545'
    } else if (env.staging) {
      this.websocket = 'wss://ropsten.infura.io/ws'
    } else {
      this.websocket = ''
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

  async getAvailableTokens(token: SimpleToken){
    this.tokens = await token.instance.methods.balanceOf(this.address).call()
  }

  async setToken(){
    let address = await this.instance.methods.token().call()
    this.token = new SimpleToken(this.wallet)
    this.token.connect()
    this.token.setAddress(address)
    this.token.crowdsale = this.getAddress()

    return this
  }

  getToken(): SimpleToken {
    return this.token
  }

  connect(){
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