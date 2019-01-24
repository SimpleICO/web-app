import { ContractDeployment } from '@factory/contract-deployment';
import { Wallet } from '@decentralizedtechnologies/scui-lib';
import { EthereumService } from '@decentralizedtechnologies/scui-lib';
import { MVT20Contract } from '@contract/MVT20.contract';

const Web3 = require('web3')

export class MVT20Deployment extends ContractDeployment {

  static readonly _type: string = 'MVT20'
  type: string

  constructor(wallet: Wallet, eth: EthereumService) {
    super(wallet, eth)
    this.type = MVT20Deployment._type
  }

  createToken() {
    this.token = new MVT20Contract(this.wallet)
    this.token.connect()
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
}
