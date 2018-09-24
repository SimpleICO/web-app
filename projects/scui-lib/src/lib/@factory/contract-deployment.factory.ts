import { Injectable } from '@angular/core';
import { WalletService } from '../@service/wallet.service';
import { EthereumService } from '../@service/ethereum.service';
import { DeploymentClassExistsError } from '../@error/deployment-class-exists.error';

export interface Deployment {
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class ContractDeploymentFactory {

  contractType: string

  deployer: any

  deployment: Deployment = {}

  constructor(
    private wallet: WalletService,
    private eth: EthereumService) {
  }

  registerContractDeployment(type: string, deployment) {
    const deploymentExists = this.deployment[type] !== undefined;
    if (deploymentExists) {
      throw new DeploymentClassExistsError(`Contract deployment ${type} has already been used`)
    }
    this.deployment[type] = deployment
    return this
  }

  /**
   * init
   * @param contractType [description]
   * @return ContractDeploymentInterface
   */
  init(contractType: string) {
    const deployment: any = this.deployment[contractType]
    const deployer = new deployment(this.wallet.getInstance(), this.eth)
    this.deployer = deployer
    return deployer
  }
}
