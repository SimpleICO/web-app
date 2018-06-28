import { Injectable } from '@angular/core';
import { FixedSupplyCrowdsale } from '@factory/fixed-supply.crowdsale';
import { CrowdsaleDeployment } from '@factory/crowdsale-deployment';

@Injectable({
  providedIn: 'root'
})
export class CrowdsaleDeploymentFactory {

  crowdsaleType: string

  deployment: any = {}

  constructor() {

    this.deployment[FixedSupplyCrowdsale._type] = FixedSupplyCrowdsale

  }

  init(crowdsaleType: string): CrowdsaleDeployment {

    return new this.deployment[crowdsaleType]

  }

}
