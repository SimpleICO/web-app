import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractDeploymentFactory } from '@decentralizedtechnologies/scui-lib';

import { DetailedERC20Deployment } from '@factory/detailed-erc20.deployment';
import { ERC20TokenCrowdsaleDeployment } from '@factory/token-crowdsale.deployment';
import { MVT20Deployment } from '@factory/MVT20.deployment';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  contractType: string

  DetailedERC20Deployment: string = DetailedERC20Deployment._type
  ERC20TokenCrowdsaleDeployment: string = ERC20TokenCrowdsaleDeployment._type
  MVT20Deployment: string = MVT20Deployment._type

  constructor(
    private route: ActivatedRoute,
    private contractFactory: ContractDeploymentFactory) { }

  ngOnInit() {
    this.route.params.subscribe(({ contractType }) => {
      this.contractType = contractType
      const deployer = this.contractFactory.init(contractType)
    })
  }

}
