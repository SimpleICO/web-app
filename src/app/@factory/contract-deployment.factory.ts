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

  contractType: string

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
   * @param {string} contractType [description]
   * @return ContractDeployment
   */
  init(contractType: string): ContractDeployment {

    let deployer = new this.deployment[contractType](this.wallet.getInstance(), this.eth)

    this.deployer = deployer

    return deployer
  }

}
