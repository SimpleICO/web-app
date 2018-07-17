import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractDeploymentFactory } from '@factory/contract-deployment.factory';

import { FixedSupplyCrowdsale } from '@factory/fixed-supply.crowdsale';
import { ExistingToken } from '@factory/existing-token';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  contractType: string

  ExistingToken: string = ExistingToken._type
  FixedSupplyCrowdsale: string = FixedSupplyCrowdsale._type

  constructor(
    private route: ActivatedRoute,
    private contractFactory: ContractDeploymentFactory) {

  }

  ngOnInit() {
    this.route.params.subscribe(({ contractType }) => {
      this.contractType = contractType

      let deployer = this.contractFactory.init(contractType)

      console.log(deployer, deployer.type)
    })
  }

}
