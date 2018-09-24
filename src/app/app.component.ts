import { Component, OnInit } from '@angular/core';
import { ContractDeploymentFactory } from 'scui-lib';
import { DetailedERC20Deployment } from '@factory/detailed-erc20.deployment';
import { ERC20TokenCrowdsaleDeployment } from '@factory/token-crowdsale.deployment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';

  constructor(private factory: ContractDeploymentFactory) { }

  ngOnInit() {
    this.factory.registerContractDeployment(DetailedERC20Deployment._type, DetailedERC20Deployment)
    this.factory.registerContractDeployment(ERC20TokenCrowdsaleDeployment._type, ERC20TokenCrowdsaleDeployment)
  }
}
