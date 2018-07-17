import { SimpleICO } from '@model/simpleico.model';
import { Wallet } from '@model/wallet.model';
import { Network } from '@model/network.model';
import { environment as env } from '@environment/environment';

declare var require: any

const SimpleICOInterface = require('@abi/simpleico.abi.json')

export class SimpleICOContract extends SimpleICO {

  static readonly PRIVATE: string = '0x346785fe19f197c0184310add71abed4be7ed9e8'
  static readonly TESTNET: string = '0x188a53e249d6f303e9bda1dd661c28fecba1593a'
  static readonly MAINNET: string = '0x1911b2c5279a54a1b00ddc7d7990fca926a59a2b'

  web3: any

  txObject: any

  bytecode = SimpleICOInterface.bytecode

  address: string

  tx: string

  constructor(wallet: Wallet) {

    super(wallet)

    this.web3 = wallet.web3
  }

  setContractAddressByNetwork(){
    if (this.wallet.network == Network.mainnet) {
      this.setAddress(SimpleICOContract.MAINNET)
    } else if (this.wallet.network == Network.testnet) {
      this.setAddress(SimpleICOContract.TESTNET)
    } else {
      this.setAddress(SimpleICOContract.PRIVATE)
    }

    return this
  }

  setAddress(address: string){
    this.instance.options.address = address
    this.instance._address = address
    this.address = address

    return this
  }

  getAddress(){
    return this.address
  }

  connect(){
    let _contract = new this.web3.eth.Contract(SimpleICOInterface.abi)

    this.instance = _contract

    this.setContractAddressByNetwork()

    console.log(this.instance)

    return this
  }

}
