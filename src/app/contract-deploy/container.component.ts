import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CrowdsaleDeploymentFactory } from '@factory/crowdsale-deployment.factory';
import { WalletService } from '@service/wallet.service';

import { FixedSupplyCrowdsale } from '@factory/fixed-supply.crowdsale';
import { ExistingTokenCrowdsale } from '@factory/existing-token.crowdsale';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  contractType: string

  withExistingToken: boolean = false

  ExistingTokenCrowdsale: string = ExistingTokenCrowdsale._type
  FixedSupplyCrowdsale: string = FixedSupplyCrowdsale._type

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private crowdsaleFactory: CrowdsaleDeploymentFactory,
    public wallet: WalletService) {}

  ngOnInit() {
    this.route.params.subscribe(({ contractType }) => {
      this.contractType = contractType
    })
  }

  cancel(){
    return this.router.navigate([`/contract/${this.contractType}/create`])
  }

}
