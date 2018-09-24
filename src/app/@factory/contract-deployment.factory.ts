import { Injectable } from '@angular/core';
import { WalletService } from 'scui-lib';
import { EthereumService } from 'scui-lib';
import { DeploymentClassExistsError } from '@error/deployment-class-exists.error';

import { ContractDeployment, ContractDeploymentInterface } from '@factory/contract-deployment';

export interface Deployment {
  [key: string]: ContractDeploymentInterface
}

@Injectable({
  providedIn: 'root'
})
export class ContractDeploymentFactory {

  contractType: string

  deployer: ContractDeployment

  deployment: Deployment = {}

  constructor(
    private wallet: WalletService,
    private eth: EthereumService) {
  }

  registerContractDeployment(type: string, deployment: ContractDeploymentInterface) {

    const deploymentExists = this.deployment[type] !== undefined;
    if (deploymentExists) {
      throw new DeploymentClassExistsError(`Contract deployment ${type} has already been used`)
    }

    this.deployment[type] = deployment

    return this
  }

  /**
   *
   * @param {string} contractType [description]
   * @return ContractDeploymentInterface
   */
  init(contractType: string): ContractDeployment {

    const deployment: any = this.deployment[contractType]

    const deployer = new deployment(this.wallet.getInstance(), this.eth)

    this.deployer = deployer

    return deployer
  }

}
