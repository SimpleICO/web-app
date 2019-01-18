import { Component, OnInit } from '@angular/core';

import { DetailedERC20Deployment } from '@factory/detailed-erc20.deployment';
import { ERC20TokenCrowdsaleDeployment } from '@factory/token-crowdsale.deployment';

@Component({
  selector: 'app-catalog-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {

  DetailedERC20Deployment: string = DetailedERC20Deployment._type
  ERC20TokenCrowdsaleDeployment: string = ERC20TokenCrowdsaleDeployment._type

  constructor() { }

  ngOnInit() {
  }

}
