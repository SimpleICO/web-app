import { ContractDeployment, ContractDeploymentInterface } from '@factory/contract-deployment';
import { SimpleTokenContract } from '@contract/simpletoken.contract';
import { SimpleCrowdsaleContract } from '@contract/simplecrowdsale.contract';
import { Wallet } from 'scui-lib';
import { EthereumService } from 'scui-lib';

declare var require: any

const Web3 = require('web3')

export class FixedSupplyDeployment
  extends ContractDeployment
  implements ContractDeploymentInterface {

  static readonly _type: string = 'fixed-supply'

  type: string

  constructor(wallet: Wallet, eth: EthereumService) {
    super(wallet, eth)

    this.type = FixedSupplyDeployment._type
  }

  createToken() {
    this.token = new SimpleTokenContract(this.wallet)

    this.token.connect()

    return this
  }

  createCrowdsale() {
    this.crowdsale = new SimpleCrowdsaleContract(this.wallet)

    this.crowdsale.connect()

    return this
  }

  async deployToken() {

    return new Promise(async (resolve, reject) => {

      try {

        const nonce = await this.eth.getNonce(this.token)

        const txObject = await this.token.deploy()

        const txOptions = {
          from: this.wallet.address,
          value: '0x0',
          gas: Web3.utils.toHex(this.gas),
          gasLimit: Web3.utils.toHex(this.gas),
          gasPrice: Web3.utils.toHex(this.eth.defaultGasPrice),
          data: txObject.encodeABI(),
          nonce: Web3.utils.toHex(nonce)
        }

        const signedTx = await this.token.web3.eth.accounts.signTransaction(txOptions, this.wallet.privateKey)

        const tx = this.token.web3.eth.sendSignedTransaction(signedTx.rawTransaction)

        tx.on('transactionHash', hash => {
          this.token.tx = hash
        })

        tx.on('error', error => {
          reject(error)
        })

        tx.on('receipt', receipt => {
          resolve(receipt)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  async deployCrowdsale() {

    return new Promise(async (resolve, reject) => {

      try {
        const txObject = await this.crowdsale.deploy(this.token.price, this.token.getAddress())

        const nonce = await this.eth.getNonce(this.crowdsale)

        const txOptions = {
          from: this.wallet.address,
          value: '0x0',
          gas: Web3.utils.toHex(this.gas),
          gasLimit: Web3.utils.toHex(this.gas),
          gasPrice: Web3.utils.toHex(this.eth.defaultGasPrice),
          data: txObject.encodeABI(),
          nonce: Web3.utils.toHex(nonce)
        }

        const signedTx = await this.crowdsale.web3.eth.accounts.signTransaction(txOptions, this.wallet.privateKey)

        const tx = this.crowdsale.web3.eth.sendSignedTransaction(signedTx.rawTransaction)

        tx.on('transactionHash', hash => {
          this.crowdsale.tx = hash
        })

        tx.on('error', error => {
          reject(error)
        })

        tx.on('receipt', async receipt => {
          this.crowdsale.setAddress(receipt.contractAddress)
          resolve(receipt)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  async transferToken() {

    return new Promise(async (resolve, reject) => {

      try {

        const nonce = await this.eth.getNonce(this.token)

        const txObject = this.token.instance.methods.transfer(this.crowdsale.getAddress(), this.token.supply)

        const txOptions = {
          from: this.wallet.address,
          to: this.token.getAddress(),
          value: '0x0',
          gas: Web3.utils.toHex(this.gas),
          gasLimit: Web3.utils.toHex(this.gas),
          gasPrice: Web3.utils.toHex(this.eth.defaultGasPrice),
          data: txObject.encodeABI(),
          nonce: Web3.utils.toHex(nonce)
        }

        const signedTx = await this.token.web3.eth.accounts.signTransaction(txOptions, this.wallet.privateKey)

        const tx = this.token.web3.eth.sendSignedTransaction(signedTx.rawTransaction)

        tx.on('transactionHash', hash => {
          this.token.tx = hash
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
