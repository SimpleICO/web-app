import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from 'scui-lib';
import { Wallet } from 'scui-lib';
import { SimpleICOContract } from '@contract/simpleico.contract';

import { FixedSupplyDeployment } from '@factory/fixed-supply.deployment';
import { ExistingTokenDeployment } from '@factory/existing-token.deployment';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  contractType: string

  ExistingTokenDeployment: string = ExistingTokenDeployment._type
  FixedSupplyDeployment: string = FixedSupplyDeployment._type

  constructor(
    private route: ActivatedRoute,
    private wallet: WalletService) { }

  ngOnInit() {
    this.wallet.setProviderByNetwork()

    this.route.params.subscribe(({ contractType }) => {
      this.contractType = contractType
    })
  }
}
