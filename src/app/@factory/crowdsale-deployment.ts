import { Wallet } from '@model/wallet.model';
import { EthereumService } from '@service/ethereum.service';

export abstract class CrowdsaleDeployment {

  wallet: Wallet

  eth: EthereumService

  type: string

  txCost: any

  gas: number = 0

  gasIncrement: number = 1000

  constructor(wallet: Wallet, eth: EthereumService){
    this.wallet = wallet
    this.eth = eth
  }

  abstract getToken()
  abstract getCrowdsale()
  abstract createToken()
  abstract async estimateTokenDeploymentCost()
  abstract async estimateCrowdsaleDeploymentCost()
  abstract async estimateTokenTransferCost()
  abstract async estimateSimpleICOCost()
  abstract async deployToken()
  abstract async deployCrowdsale()

}
