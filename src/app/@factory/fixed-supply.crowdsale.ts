import { CrowdsaleDeployment } from '@factory/crowdsale-deployment';
import { SimpleToken } from '@token/simpletoken';
import { SimpleCrowdsale } from '@crowdsale/simplecrowdsale';
import { Wallet } from '@model/wallet.model';
import { EthereumService } from '@service/ethereum.service';

export class FixedSupplyCrowdsale extends CrowdsaleDeployment {

  static readonly _type: string = 'fixed-supply'

  type: string

  token: SimpleToken

  crowdsale: SimpleCrowdsale

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

  async estimateTokenDeploymentCost(){
    let txObject = await this.token.deploy()
    this.token.txObject = txObject
    console.log(txObject)

    let gas = await this.token.txObject.estimateGas()
    this.gas = gas + this.gasIncrement
    console.log(gas)

    let txCost = await this.eth.getTxCost(gas)
    this.txCost = txCost
    console.log(txCost)
  }

}
