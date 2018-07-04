import { Contract } from '@model/contract.model';
import { Wallet } from '@model/wallet.model';
import { environment as env } from '@environment/environment';

declare var require: any

const SimpleICOInterface = require('@abi/simpleico.abi.json')

export class SimpleICO extends Contract {

  web3: any

  txObject: any

  bytecode = SimpleICOInterface.bytecode

  address: string

  tx: string

  constructor(wallet: Wallet) {

    super(wallet)

    this.web3 = wallet.web3

    if (env.local) {
      this.address = '0x346785fe19f197c0184310add71abed4be7ed9e8'
    } else if (env.staging) {
      this.address = '0x9b240271e1331e084afaedf3a94e5030db4c8adb'
    } else {
      this.address = '0x1911b2c5279a54a1b00ddc7d7990fca926a59a2b'
    }
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

    this.setAddress(this.getAddress())

    console.log(this.instance)

    return this
  }

}
