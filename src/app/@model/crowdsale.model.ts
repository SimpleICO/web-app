import { Wallet } from '@model/wallet.model';
import { Network } from '@model/network.model';
import { SimpleTokenContract } from '@contract/simpletoken.contract';

declare var require: any

const Web3 = require('web3')
const ethers = require('ethers')

export abstract class Crowdsale {

  static readonly WEBSOCKET_PRIVATE = 'ws://localhost:7545'
  static readonly WEBSOCKET_TESTNET = 'wss://ropsten.infura.io/ws'
  static readonly WEBSOCKET_MAINNET = 'wss://mainnet.infura.io/ws'

  instance: any

  address: string

  wallet: Wallet

  web3: any

  tx: string

  txObject: any

  beneficiary: string

  websocket: string

  ethRaised: string = '0.0'

  price: number

  token: SimpleTokenContract

  tokens: string

  allowance: number = 0

  percentage: number = 0

  constructor(wallet: Wallet) {
    this.wallet = wallet
  }

  setWebsocketByNetwork() {
    const websockets = {}
    websockets[Network.mainnet] = Crowdsale.WEBSOCKET_MAINNET
    websockets[Network.testnet] = Crowdsale.WEBSOCKET_TESTNET
    websockets[Network.private] = Crowdsale.WEBSOCKET_PRIVATE

    this.websocket = websockets[this.wallet.network]

    return this
  }

  subscribeToEvents() {
    this.setWebsocketByNetwork()

    const provider = new Web3.providers.WebsocketProvider(this.websocket)
    const web3 = new Web3(provider)

    return web3.eth.subscribe('logs', {
      address: this.address,
      topics: null,
    })
  }

  setAddress(address: string) {
    this.instance.options.address = address
    this.instance._address = address
    this.address = address

    return this
  }

  getAddress(): string {
    return this.address
  }

  setBeneficiary(address: string) {
    this.beneficiary = address
  }

  async getBeneficiary() {
    this.beneficiary = await this.instance.methods.wallet().call()
  }

  async getPrice() {
    const price = await this.instance.methods.price().call()
    this.price = ethers.utils.formatEther(price)
  }

  async getEthRaised() {
    const weiRaised = await this.instance.methods.weiRaised().call()
    this.ethRaised = ethers.utils.formatEther(weiRaised)
  }

  async setToken() {
    const address = await this.instance.methods.token().call()
    this.token = new SimpleTokenContract(this.wallet)
    this.token.connect()
    this.token.setAddress(address)
    this.token.crowdsale = this.getAddress()

    return this
  }

  getToken(): SimpleTokenContract {
    return this.token
  }

  abstract connect()
  abstract async deploy(tokenPrice?: number, tokenAddress?: string)
}
