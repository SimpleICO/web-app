import { CrowdsaleDeployment } from '@factory/crowdsale-deployment';

export class FixedSupplyCrowdsale extends CrowdsaleDeployment {

  static readonly _type: string = 'fixed-supply'

  type: string

  constructor(){
    super()

    this.type = FixedSupplyCrowdsale._type
  }

}
