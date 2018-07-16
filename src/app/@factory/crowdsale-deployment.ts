import { Wallet } from '@model/wallet.model';
import { Contract } from '@model/contract.model';
import { EthereumService } from '@service/ethereum.service';
import { Crowdsale } from '@model/crowdsale.model';
import { Token } from '@model/token.model';
import { SimpleICO } from '@model/simpleico.model';

declare var require: any

const ethers = require('ethers')
const Web3 = require('web3')

export abstract class CrowdsaleDeployment {

  static readonly CONTRACT_DUMMY_ADDRESS: string = '0x523a34E0A5FABDFaa39B3889D80b19Fe77F73aA6'
  static readonly DUMMY_ADDRESS: string = '0x7af6C0ce41aFaf675e5430193066a8d57701A9AC'

  wallet: Wallet

  eth: EthereumService

  token: Token

  crowdsale: Crowdsale

  simpleICO: Contract

  type: string

  txCost: any

  gas: number = 0

  gasIncrement: number = 1000

  constructor(wallet: Wallet, eth: EthereumService){
    this.wallet = wallet
    this.eth = eth
  }

  getToken(){
    return this.token
  }

  getCrowdsale(){
    return this.crowdsale
  }

  getSimpleICO(){
    return this.simpleICO
  }


  abstract createToken()
  abstract createCrowdsale()
  abstract async deployToken()
  abstract async deployCrowdsale()
  abstract async transferToken()
  abstract async addCrowdsaleToSimpleICOContract()

  async getTokenSupply(){
    let tokenSupply = await this.token.instance.methods.totalSupply().call()
    this.token.supply = tokenSupply
  }

  async estimateTokenDeploymentCost(){

    let txObject = await this.token.deploy()
    console.log(txObject)

    let gas = await txObject.estimateGas()
    this.gas += gas + this.gasIncrement
    console.log(gas)

    let txCost = await this.eth.getTxCost(gas)
    this.txCost = txCost
    console.log(txCost)

    return txCost
  }

  async estimateCrowdsaleDeploymentCost(){

    let txObject = await this.crowdsale.deploy(this.token.price, CrowdsaleDeployment.DUMMY_ADDRESS)
    console.log(txObject)

    let gas = await txObject.estimateGas()
    this.gas += gas + this.gasIncrement
    console.log(gas)

    let txCost = await this.eth.getTxCost(gas)
    console.log(txCost)

    this.sumTxCost(txCost)

    return txCost
  }

  async estimateTokenTransferCost(){

    console.log(this.token)

    let txObject = this.token.instance.methods.transfer(this.wallet.address, this.token.supply.toString())
    console.log(txObject)

    let gas = await txObject.estimateGas()
    this.gas += gas + this.gasIncrement
    console.log(gas)

    let txCost = await this.eth.getTxCost(gas)
    console.log(txCost)

    this.sumTxCost(txCost)

    return txCost
  }

  async estimateSimpleICOCost(){

    console.log(this.simpleICO)

    let txObject = await this.simpleICO.instance.methods.addCrowdsale(CrowdsaleDeployment.CONTRACT_DUMMY_ADDRESS)
    console.log(txObject)

    let gas = await txObject.estimateGas()
    this.gas += gas + this.gasIncrement
    console.log(gas)

    let txCost = await this.eth.getTxCost(gas)
    console.log(txCost)

    this.sumTxCost(txCost)

    return txCost
  }

  createSimpleICO(){
    this.simpleICO = new SimpleICO(this.wallet)
    this.simpleICO.connect()
  }

  async getTxCost(){
    let txCost = await this.eth.getTxCost(0)
    this.txCost = txCost
    console.log(txCost)
  }

  sumTxCost(txCost){
    this.txCost.cost = this.txCost.cost.add(txCost.cost)
    this.txCost.ETH = ethers.utils.formatEther(this.txCost.cost.toString())
    this.txCost.WEI = ethers.utils.parseEther(this.txCost.ETH)
    this.txCost.USD = (Number(this.txCost.USD) + Number(txCost.USD)).toFixed(2).toString()
  }

}
