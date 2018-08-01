import { Crowdsale } from '@model/crowdsale.model';
import { Wallet } from '@model/wallet.model';
import { SimpleTokenContract } from '@contract/simpletoken.contract';
import { environment as env } from '@environment/environment';
import { Network } from '@model/network.model';

declare var require: any

const ethers = require('ethers')
const RATE = ethers.utils.bigNumberify(1)
const SimpleCrowdsaleInterface = require('@abi/simplecrowdsale.abi.json')
const Web3 = require('web3')

export class SimpleCrowdsaleContract extends Crowdsale {

  static readonly WEBSOCKET_PRIVATE = 'ws://localhost:7545'
  static readonly WEBSOCKET_TESTNET = 'wss://ropsten.infura.io/ws'
  static readonly WEBSOCKET_MAINNET = 'wss://mainnet.infura.io/ws'

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
  }

  setWebsocketByNetwork(){
    let websockets = {}
    websockets[Network.mainnet] = SimpleCrowdsaleContract.WEBSOCKET_MAINNET
    websockets[Network.testnet] = SimpleCrowdsaleContract.WEBSOCKET_TESTNET
    websockets[Network.private] = SimpleCrowdsaleContract.WEBSOCKET_PRIVATE

    this.websocket = websockets[this.wallet.network]

    return this
  }

  subscribeToEvents(){
    this.setWebsocketByNetwork()

    let provider = new Web3.providers.WebsocketProvider(this.websocket)
    let web3 = new Web3(provider)

    return web3.eth.subscribe('logs', {
      address: this.address,
      topics: null,
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

    return this
  }

  async deploy(tokenPrice: number, tokenAddress: string){

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
