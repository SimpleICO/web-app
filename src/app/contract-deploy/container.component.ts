import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WalletService } from '@service/wallet.service';

import { FixedSupplyDeployment } from '@factory/fixed-supply.deployment';
import { ExistingTokenDeployment } from '@factory/existing-token.deployment';
import { DetailedERC20Deployment } from '@factory/detailed-erc20.deployment';
import { ERC20TokenCrowdsaleDeployment } from '@factory/token-crowdsale.deployment';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  contractType: string

  ExistingTokenDeployment: string = ExistingTokenDeployment._type
  FixedSupplyDeployment: string = FixedSupplyDeployment._type
  DetailedERC20Deployment: string = DetailedERC20Deployment._type
  ERC20TokenCrowdsaleDeployment: string = ERC20TokenCrowdsaleDeployment._type

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public wallet: WalletService) { }

  ngOnInit() {
    this.route.params.subscribe(({ contractType }) => {
      this.contractType = contractType
    })
  }

  cancel() {
    return this.router.navigate([`/contract/${this.contractType}/create`])
  }

}
