import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrowdsaleDeploymentFactory } from '@factory/crowdsale-deployment.factory';
import { CrowdsaleDeployment } from '@factory/crowdsale-deployment';

import { FixedSupplyCrowdsale } from '@factory/fixed-supply.crowdsale';
import { ExistingTokenCrowdsale } from '@factory/existing-token.crowdsale';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  crowdsaleType: string

  ExistingTokenCrowdsale: string = ExistingTokenCrowdsale._type
  FixedSupplyCrowdsale: string = FixedSupplyCrowdsale._type

  constructor(
    private route: ActivatedRoute,
    private crowdsaleFactory: CrowdsaleDeploymentFactory) {

  }

  ngOnInit() {
    this.route.params.subscribe(({ crowdsaleType }) => {
      this.crowdsaleType = crowdsaleType

      let deployer = this.crowdsaleFactory.init(crowdsaleType)

      console.log(deployer, deployer.type)
    })
  }

}
