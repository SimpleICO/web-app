import { Injectable } from '@angular/core';
import { WalletService } from '@service/wallet.service';
import { ContractDeployment } from '@factory/contract-deployment';
import { EthereumService } from '@service/ethereum.service';

import { FixedSupplyCrowdsale } from '@factory/fixed-supply.crowdsale';
import { ExistingToken } from '@factory/existing-token';

@Injectable({
  providedIn: 'root'
})
export class ContractDeploymentFactory {

  crowdsaleType: string

  deployer: ContractDeployment

  deployment: any = {}

  constructor(
    private wallet: WalletService,
    private eth: EthereumService) {

    this.deployment[FixedSupplyCrowdsale._type] = FixedSupplyCrowdsale
    this.deployment[ExistingToken._type] = ExistingToken

  }

  /**
   *
   * @param {string} crowdsaleType [description]
   * @return ContractDeployment
   */
  init(crowdsaleType: string): ContractDeployment {

    let deployer = new this.deployment[crowdsaleType](this.wallet.getInstance(), this.eth)

    this.deployer = deployer

    return deployer
  }

}
