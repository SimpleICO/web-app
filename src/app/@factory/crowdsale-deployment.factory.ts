import { Injectable } from '@angular/core';
import { FixedSupplyCrowdsale } from '@factory/fixed-supply.crowdsale';
import { WalletService } from '@service/wallet.service';
import { CrowdsaleDeployment } from '@factory/crowdsale-deployment';
import { EthereumService } from '@service/ethereum.service';

@Injectable({
  providedIn: 'root'
})
export class CrowdsaleDeploymentFactory {

  crowdsaleType: string

  deployer: CrowdsaleDeployment

  deployment: any = {}

  constructor(
    private wallet: WalletService,
    private eth: EthereumService) {

    this.deployment[FixedSupplyCrowdsale._type] = FixedSupplyCrowdsale

  }

  /**
   *
   * @param {string} crowdsaleType [description]
   * @return CrowdsaleDeployment
   */
  init(crowdsaleType: string): CrowdsaleDeployment {

    let deployer = new this.deployment[crowdsaleType](this.wallet.getInstance(), this.eth)

    this.deployer = deployer

    return deployer
  }

}
