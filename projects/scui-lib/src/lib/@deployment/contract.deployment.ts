import { Wallet } from '../@model/wallet.model';
import { EthereumService } from '../@service/ethereum.service';

declare var require: any

const ethers = require('ethers')

export interface ContractDeploymentInterface {
  type: string
}

export abstract class ContractDeployment implements ContractDeploymentInterface {

  static readonly CONTRACT_DUMMY_ADDRESS: string = '0x523a34E0A5FABDFaa39B3889D80b19Fe77F73aA6'
  static readonly DUMMY_ADDRESS: string = '0x7af6C0ce41aFaf675e5430193066a8d57701A9AC'

  wallet: Wallet

  eth: EthereumService

  txCost: any

  gas: number = 0

  gasIncrement: number = 1000

  type: string

  constructor(wallet: Wallet, eth: EthereumService) {
    this.wallet = wallet
    this.eth = eth
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
}
