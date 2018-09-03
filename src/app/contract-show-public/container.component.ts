import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from 'scui-lib';

import { FixedSupplyDeployment } from '@factory/fixed-supply.deployment';
import { ExistingTokenDeployment } from '@factory/existing-token.deployment';
import { DetailedERC20Deployment } from '@factory/detailed-erc20.deployment';
import { ERC20TokenCrowdsaleDeployment } from '@factory/token-crowdsale.deployment';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})

export class ContainerComponent implements OnInit {

  contractAddress: string

  contractType: string

  ExistingTokenDeployment: string = ExistingTokenDeployment._type
  FixedSupplyDeployment: string = FixedSupplyDeployment._type
  DetailedERC20Deployment: string = DetailedERC20Deployment._type
  ERC20TokenCrowdsaleDeployment: string = ERC20TokenCrowdsaleDeployment._type

  constructor(
    public route: ActivatedRoute,
    public wallet: WalletService) { }

  ngOnInit() {
    this.wallet.setProviderByNetwork()

    this.route.params.subscribe(({ contractAddress, contractType }) => {
      this.contractAddress = contractAddress
      this.contractType = contractType
    })
  }

}
