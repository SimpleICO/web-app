import { ContractDeployment } from '@factory/contract-deployment';
import { SimpleTokenContract } from '@contract/simpletoken.contract';
import { Wallet } from '@decentralizedtechnologies/scui-lib';
import { EthereumService } from '@decentralizedtechnologies/scui-lib';

declare var require: any

const Web3 = require('web3')

export class DetailedERC20Deployment extends ContractDeployment {

  static readonly _type: string = 'detailed-erc20'

  type: string

  constructor(wallet: Wallet, eth: EthereumService) {
    super(wallet, eth)
    this.type = DetailedERC20Deployment._type
  }

  createToken() {
    this.token = new SimpleTokenContract(this.wallet)

    this.token.connect()

    return this
  }

  async deployToken() {

    return new Promise(async (resolve, reject) => {

      try {

        const nonce = await this.eth.getNonce(this.token)

        const txObject = await this.token.deploy()

        const txOptions = {
          from: this.wallet.address.toChecksumAddress(),
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
