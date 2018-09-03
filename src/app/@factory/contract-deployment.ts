import { Wallet } from 'scui-lib';
import { SimpleICO } from '@model/simpleico.model';
import { EthereumService } from '@service/ethereum.service';
import { Crowdsale } from '@model/crowdsale.model';
import { Token } from '@model/token.model';
import { SimpleICOContract } from '@contract/simpleico.contract';

declare var require: any

const ethers = require('ethers')
const Web3 = require('web3')

export interface ContractDeploymentInterface { }

export abstract class ContractDeployment {

  static readonly CONTRACT_DUMMY_ADDRESS: string = '0x523a34E0A5FABDFaa39B3889D80b19Fe77F73aA6'
  static readonly DUMMY_ADDRESS: string = '0x7af6C0ce41aFaf675e5430193066a8d57701A9AC'

  wallet: Wallet

  eth: EthereumService

  token: Token

  crowdsale: Crowdsale

  simpleICO: SimpleICO

  abstract type: string

  txCost: any

  gas: number = 0

  gasIncrement: number = 1000

  constructor(wallet: Wallet, eth: EthereumService) {
    this.wallet = wallet
    this.eth = eth
  }

  createToken?()
  createCrowdsale?()
  async deployToken?(): Promise<any>
  async deployCrowdsale?(): Promise<any>
  async transferToken?(): Promise<any>

  getToken() {
    return this.token
  }

  getCrowdsale() {
    return this.crowdsale
  }

  getSimpleICO() {
    return this.simpleICO
  }

  async getTokenSupply() {
    const tokenSupply = await this.token.instance.methods.totalSupply().call()
    this.token.supply = tokenSupply
  }

  async estimateTokenDeploymentCost() {

    const txObject = await this.token.deploy()

    const gas = await txObject.estimateGas()
    this.gas += gas + this.gasIncrement

    const txCost = await this.eth.getTxCost(gas)
    this.txCost = txCost

    return txCost
  }

  async estimateCrowdsaleDeploymentCost() {

    const txObject = await this.crowdsale.deploy(this.token.price, ContractDeployment.DUMMY_ADDRESS)

    const gas = await txObject.estimateGas()
    this.gas += gas + this.gasIncrement

    const txCost = await this.eth.getTxCost(gas)

    this.sumTxCost(txCost)

    return txCost
  }

  async estimateTokenTransferCost() {

    const txObject = this.token.instance.methods.transfer(this.wallet.address, this.token.supply.toString())

    const gas = await txObject.estimateGas()
    this.gas += gas + this.gasIncrement

    const txCost = await this.eth.getTxCost(gas)

    this.sumTxCost(txCost)

    return txCost
  }

  async estimateSimpleICOCost() {

    const txObject = await this.simpleICO.instance.methods.addCrowdsale(ContractDeployment.CONTRACT_DUMMY_ADDRESS)

    const gas = await txObject.estimateGas()
    this.gas += gas + this.gasIncrement

    const txCost = await this.eth.getTxCost(gas)

    this.sumTxCost(txCost)

    return txCost
  }

  createSimpleICO() {
    this.simpleICO = new SimpleICOContract(this.wallet)
    this.simpleICO.connect()
  }

  async getTxCost() {
    const txCost = await this.eth.getTxCost(0)
    this.txCost = txCost
  }

  sumTxCost(txCost) {
    this.txCost.cost = this.txCost.cost.add(txCost.cost)
    this.txCost.ETH = ethers.utils.formatEther(this.txCost.cost.toString())
    this.txCost.WEI = ethers.utils.parseEther(this.txCost.ETH)
    this.txCost.USD = (Number(this.txCost.USD) + Number(txCost.USD)).toFixed(2).toString()
  }

  async addCrowdsaleToSimpleICOContract() {

    return new Promise(async (resolve, reject) => {

      try {

        const nonce = await this.eth.getNonce(this.simpleICO)

        const txObject = this.simpleICO.instance.methods.addCrowdsale(this.crowdsale.getAddress())

        const txOptions = {
          from: this.wallet.address,
          to: this.simpleICO.getAddress(),
          value: '0x0',
          gas: Web3.utils.toHex(this.gas),
          gasLimit: Web3.utils.toHex(this.gas),
          gasPrice: Web3.utils.toHex(this.eth.defaultGasPrice),
          data: txObject.encodeABI(),
          nonce: Web3.utils.toHex(nonce)
        }

        const signedTx = await this.simpleICO.web3.eth.accounts.signTransaction(txOptions, this.wallet.privateKey)

        const tx = this.simpleICO.web3.eth.sendSignedTransaction(signedTx.rawTransaction)

        tx.on('transactionHash', hash => {
          this.simpleICO.tx = hash
        })

        tx.on('error', error => {
          reject(error)
        })

        tx.on('receipt', async receipt => {
          resolve(receipt)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}
