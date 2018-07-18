import { ContractDeployment } from '@factory/contract-deployment';
import { SimpleTokenContract } from '@contract/simpletoken.contract';
import { SimpleCrowdsaleContract } from '@contract/simplecrowdsale.contract';
import { Wallet } from '@model/wallet.model';
import { SimpleICOContract } from '@contract/simpleico.contract';
import { EthereumService } from '@service/ethereum.service';
import { Subject } from 'rxjs';

declare var require: any

const ethers = require('ethers')
const Web3 = require('web3')

export class FixedSupplyDeployment extends ContractDeployment {

  static readonly _type: string = 'fixed-supply'

  type: string

  constructor(wallet: Wallet, eth: EthereumService){
    super(wallet, eth)

    this.type = FixedSupplyDeployment._type
  }

  createToken(){
    this.token = new SimpleTokenContract(this.wallet)

    this.token.connect()

    return this
  }

  createCrowdsale(){
    this.crowdsale = new SimpleCrowdsaleContract(this.wallet)

    this.crowdsale.connect()

    return this
  }

  async addCrowdsaleToSimpleICOContract(){

    return new Promise(async (resolve, reject) => {

      try {

        let nonce = await this.eth.getNonce(this.simpleICO)
        console.log(`simpleico nonce: ${nonce}`)

        let txObject = this.simpleICO.instance.methods.addCrowdsale(this.crowdsale.getAddress())

        let txOptions = {
          from: this.wallet.address,
          to: this.simpleICO.getAddress(),
          value: '0x0',
          gas: Web3.utils.toHex(this.gas),
          gasLimit: Web3.utils.toHex(this.gas),
          gasPrice: Web3.utils.toHex(this.eth.defaultGasPrice),
          data: txObject.encodeABI(),
          nonce: Web3.utils.toHex(nonce)
        }

        let signedTx = await this.simpleICO.web3.eth.accounts.signTransaction(txOptions, this.wallet.privateKey)
        console.log(signedTx)

        let tx = this.simpleICO.web3.eth.sendSignedTransaction(signedTx.rawTransaction)

        tx.on('transactionHash', hash => {
          console.log(hash)
          this.simpleICO.tx = hash
        })

        tx.on('error', error => {
          reject(error)
        })

        tx.on('receipt', async receipt => {
          console.log(receipt)
          resolve(receipt)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  async deployToken(){

    return new Promise(async (resolve, reject) => {

      try {

        let nonce = await this.eth.getNonce(this.token)
        console.log(`token nonce: ${nonce}`)

        let txObject = await this.token.deploy()

        let txOptions = {
          from: this.wallet.address,
          value: '0x0',
          gas: Web3.utils.toHex(this.gas),
          gasLimit: Web3.utils.toHex(this.gas),
          gasPrice: Web3.utils.toHex(this.eth.defaultGasPrice),
          data: txObject.encodeABI(),
          nonce: Web3.utils.toHex(nonce)
        }

        console.log(txOptions)

        let signedTx = await this.token.web3.eth.accounts.signTransaction(txOptions, this.wallet.privateKey)
        console.log(signedTx)

        let tx = this.token.web3.eth.sendSignedTransaction(signedTx.rawTransaction)

        tx.on('transactionHash', hash => {
          console.log(hash)
          this.token.tx = hash
        })

        tx.on('error', error => {
          reject(error)
        })

        tx.on('receipt', receipt => {
          console.log(receipt)
          resolve(receipt)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  async deployCrowdsale(){

    return new Promise(async (resolve, reject) => {

      try {
        let txObject = await this.crowdsale.deploy(this.token.price, this.token.getAddress())

        let nonce = await this.eth.getNonce(this.crowdsale)
        console.log(`crowdsale nonce: ${nonce}`)

        let txOptions = {
          from: this.wallet.address,
          value: '0x0',
          gas: Web3.utils.toHex(this.gas),
          gasLimit: Web3.utils.toHex(this.gas),
          gasPrice: Web3.utils.toHex(this.eth.defaultGasPrice),
          data: txObject.encodeABI(),
          nonce: Web3.utils.toHex(nonce)
        }

        let signedTx = await this.crowdsale.web3.eth.accounts.signTransaction(txOptions, this.wallet.privateKey)
        console.log(signedTx)

        let tx = this.crowdsale.web3.eth.sendSignedTransaction(signedTx.rawTransaction)

        tx.on('transactionHash', hash => {
          console.log(hash)
          this.crowdsale.tx = hash
        })

        tx.on('error', error => {
          reject(error)
        })

        tx.on('receipt', async receipt => {
          console.log(receipt)
          this.crowdsale.setAddress(receipt.contractAddress)
          resolve(receipt)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  async transferToken(){

    return new Promise(async (resolve, reject) => {

      try {

        console.log(this.gas, this.token.supply, this.crowdsale.getAddress(), this.token.getAddress(), this.wallet.address)

        let nonce = await this.eth.getNonce(this.token)
        console.log(`transfer token nonce: ${nonce}`)

        let txObject = this.token.instance.methods.transfer(this.crowdsale.getAddress(), this.token.supply)

        let txOptions = {
          from: this.wallet.address,
          to: this.token.getAddress(),
          value: '0x0',
          gas: Web3.utils.toHex(this.gas),
          gasLimit: Web3.utils.toHex(this.gas),
          gasPrice: Web3.utils.toHex(this.eth.defaultGasPrice),
          data: txObject.encodeABI(),
          nonce: Web3.utils.toHex(nonce)
        }

        let signedTx = await this.token.web3.eth.accounts.signTransaction(txOptions, this.wallet.privateKey)
        console.log(signedTx)

        let tx = this.token.web3.eth.sendSignedTransaction(signedTx.rawTransaction)

        tx.on('transactionHash', hash => {
          console.log(hash)
          this.token.tx = hash
        })

        tx.on('error', error => {
          reject(error)
        })

        tx.on('receipt', async receipt => {
          console.log(receipt)
          resolve(receipt)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}
