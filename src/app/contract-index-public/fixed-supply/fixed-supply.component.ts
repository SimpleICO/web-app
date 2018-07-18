import { Component, OnInit } from '@angular/core';
import { FixedSupplyComponent as PrivateFixedSupplyComponent } from '../../contract-index/fixed-supply/fixed-supply.component';
import { SimpleICOContract } from '@contract/simpleico.contract';

import { FixedSupplyDeployment } from '@factory/fixed-supply.deployment';

@Component({
  selector: 'app-fixed-supply',
  templateUrl: './fixed-supply.component.html',
  styleUrls: ['./fixed-supply.component.css']
})
export class FixedSupplyComponent extends PrivateFixedSupplyComponent {

  FixedSupplyDeployment: string = FixedSupplyDeployment._type

  ngOnInit() {
    this.simpleICO = new SimpleICOContract(this.wallet.getInstance())
    this.simpleICO.connect()
  }

}
