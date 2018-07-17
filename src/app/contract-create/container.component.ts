import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractDeploymentFactory } from '@factory/contract-deployment.factory';

import { FixedSupply } from '@factory/fixed-supply.deployment';
import { ExistingTokenDeployment } from '@factory/existing-token.deployment';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  contractType: string

  ExistingTokenDeployment: string = ExistingTokenDeployment._type
  FixedSupply: string = FixedSupply._type

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
