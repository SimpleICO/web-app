import { CrowdsaleDeployment } from '@factory/crowdsale-deployment';
import { SimpleToken } from '@token/simpletoken';
import { SimpleCrowdsale } from '@crowdsale/simplecrowdsale';
import { Wallet } from '@model/wallet.model';
import { SimpleICO } from '@model/simpleico.model';
import { EthereumService } from '@service/ethereum.service';
import { Subject } from 'rxjs';

declare var require: any

const DUMMY_ADDRESS = '0x7af6C0ce41aFaf675e5430193066a8d57701A9AC'
const CONTRACT_DUMMY_ADDRESS = '0x523a34E0A5FABDFaa39B3889D80b19Fe77F73aA6'
const ethers = require('ethers')
const Web3 = require('web3')

export class FixedSupplyCrowdsale extends CrowdsaleDeployment {

  static readonly _type: string = 'fixed-supply'

  type: string

  token: SimpleToken

  crowdsale: SimpleCrowdsale

  simpleICO: SimpleICO

  onTxCost: Subject<any> = new Subject<any>()
  onTxCostError: Subject<any> = new Subject<any>()

  constructor(wallet: Wallet, eth: EthereumService){
    super(wallet, eth)

    this.type = FixedSupplyCrowdsale._type
  }

  getToken(){
    return this.token
  }

  getCrowdsale(){
    return this.crowdsale
  }

  createToken(){
    this.token = new SimpleToken(this.wallet)

    this.token.connect()

    return this
  }

  createCrowdsale(){
    this.crowdsale = new SimpleCrowdsale(this.wallet)

    this.crowdsale.connect()

    return this
  }

  sumTxCost(txCost){
    this.txCost.cost = this.txCost.cost.add(txCost.cost)
    this.txCost.ETH = ethers.utils.formatEther(this.txCost.cost.toString())
    this.txCost.WEI = ethers.utils.parseEther(this.txCost.ETH)
    this.txCost.USD = (Number(this.txCost.USD) + Number(txCost.USD)).toFixed(2).toString()
  }

  async deployToken(){

    let nonce = await this.eth.getNonce(this.token)
    console.log(`token nonce: ${nonce}`)

    let txOptions = {
      from: this.wallet.address,
      gas: Web3.utils.toHex(this.gas),
      gasLimit: Web3.utils.toHex(this.gas),
      gasPrice: Web3.utils.toHex(this.eth.defaultGasPrice),
      data: this.token.txObject.encodeABI(),
      nonce: Web3.utils.toHex(nonce)
    }

    console.log(txOptions)

    let signedTx = await this.token.web3.eth.accounts.signTransaction(txOptions, this.wallet.privateKey)
    console.log(signedTx)
    let receipt = await this.token.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    console.log(receipt)

    this.token.setAddress(receipt.contractAddress)

    let tokenSupply = await this.token.instance.methods.totalSupply().call()
    this.token.supply = tokenSupply
  }

  async estimateTokenDeploymentCost(){

    let txObject = await this.token.deploy()
    this.token.txObject = txObject
    console.log(txObject)

    let gas = await this.token.txObject.estimateGas()
    this.gas += gas + this.gasIncrement
    console.log(gas)

    let txCost = await this.eth.getTxCost(gas)
    this.txCost = txCost
    console.log(txCost)

    return txCost
  }

  async estimateCrowdsaleDeploymentCost(){

    let txObject = await this.crowdsale.deploy(this.token.price, DUMMY_ADDRESS)
    this.crowdsale.txObject = txObject
    console.log(txObject)

    let gas = await this.crowdsale.txObject.estimateGas()
    this.gas += gas + this.gasIncrement
    console.log(gas)

    let txCost = await this.eth.getTxCost(gas)
    console.log(txCost)

    this.sumTxCost(txCost)

    return txCost
  }

  async estimateTokenTransferCost(){
    this.token.setAddress(CONTRACT_DUMMY_ADDRESS)

    let txObject = this.token.instance.methods.transfer(this.wallet.address, this.token.supply.toString())
    this.crowdsale.txObject = txObject
    console.log(txObject)

    let gas = await this.crowdsale.txObject.estimateGas()
    this.gas += gas + this.gasIncrement
    console.log(gas)

    let txCost = await this.eth.getTxCost(gas)
    console.log(txCost)

    this.sumTxCost(txCost)

    return txCost
  }

  async estimateSimpleICOCost(){
    this.simpleICO = new SimpleICO(this.wallet)

    this.simpleICO.connect()

    let txObject = await this.simpleICO.instance.methods.addCrowdsale(CONTRACT_DUMMY_ADDRESS)

    this.simpleICO.txObject = txObject
    console.log(txObject)

    let gas = await this.simpleICO.txObject.estimateGas()
    this.gas += gas + this.gasIncrement
    console.log(gas)

    let txCost = await this.eth.getTxCost(gas)
    console.log(txCost)

    this.sumTxCost(txCost)

    return txCost
  }

}
