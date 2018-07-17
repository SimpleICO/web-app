import { Injectable } from '@angular/core';
import { WalletService } from '@service/wallet.service';
import { ContractDeployment } from '@factory/contract-deployment';
import { EthereumService } from '@service/ethereum.service';

import { FixedSupply } from '@factory/fixed-supply.deployment';
import { ExistingTokenDeployment } from '@factory/existing-token.deployment';

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

    this.deployment[FixedSupply._type] = FixedSupply
    this.deployment[ExistingTokenDeployment._type] = ExistingTokenDeployment

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
