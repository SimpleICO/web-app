import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractDeploymentFactory } from '@factory/contract-deployment.factory';

import { FixedSupplyDeployment } from '@factory/fixed-supply.deployment';
import { ExistingTokenDeployment } from '@factory/existing-token.deployment';
import { DetailedERC20Deployment } from '@factory/detailed-erc20.deployment';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  contractType: string

  ExistingTokenDeployment: string = ExistingTokenDeployment._type
  FixedSupplyDeployment: string = FixedSupplyDeployment._type
  DetailedERC20Deployment: string = DetailedERC20Deployment._type

  constructor(
    private route: ActivatedRoute,
    private contractFactory: ContractDeploymentFactory) {

  }

  ngOnInit() {
    this.route.params.subscribe(({ contractType }) => {
      this.contractType = contractType

      const deployer = this.contractFactory.init(contractType)
    })
  }

}
