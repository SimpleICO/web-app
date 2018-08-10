import { ContractDeployment, ContractDeploymentInterface } from '@factory/contract-deployment';
import { SimpleTokenContract } from '@contract/simpletoken.contract';
import { OwnedCrowdsaleContract } from '@contract/owned-crowdsale.contract';
import { Wallet } from '@model/wallet.model';
import { EthereumService } from '@service/ethereum.service';

declare var require: any

const Web3 = require('web3')

export class ERC20TokenCrowdsaleDeployment
  extends ContractDeployment
  implements ContractDeploymentInterface {

  static readonly _type: string = 'erc20-token-crowdsale'

  type: string

  constructor(wallet: Wallet, eth: EthereumService) {
    super(wallet, eth)

    this.type = ERC20TokenCrowdsaleDeployment._type
  }

  createToken() {
    this.token = new SimpleTokenContract(this.wallet)

    this.token.connect()

    return this
  }

  createCrowdsale() {
    this.crowdsale = new OwnedCrowdsaleContract(this.wallet)

    this.crowdsale.connect()

    return this
  }

  async deployCrowdsale() {

    return new Promise(async (resolve, reject) => {

      try {

        const txObject = await this.crowdsale.deploy()

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

  async setTokenPrice() {

    return new Promise(async (resolve, reject) => {

      try {

        const price = Web3.utils.toWei(this.crowdsale.price, 'ether')
        const txObject = await this.crowdsale.instance.methods.setPrice(price)

        const nonce = await this.eth.getNonce(this.crowdsale)

        const txOptions = {
          from: this.wallet.address,
          to: this.crowdsale.address,
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
          resolve(receipt)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * @dev Approves the crowdsale to transfer N percentage of tokens in behalf the owner
   */
  async approve(amount: number) {

    return new Promise(async (resolve, reject) => {

      try {

        const nonce = await this.eth.getNonce(this.token)

        const txObject = this.token.instance.methods.approve(this.crowdsale.getAddress(), amount)

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

        tx.on('receipt', receipt => {
          resolve(receipt)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  async estimateTokenTransferCost() {

    const txObject = this.token.instance.methods.approve(this.wallet.address, this.token.balanceOf)

    const gas = await txObject.estimateGas({ from: this.wallet.address })
    this.gas += gas + this.gasIncrement

    const txCost = await this.eth.getTxCost(gas)

    this.sumTxCost(txCost)

    return txCost
  }
}
