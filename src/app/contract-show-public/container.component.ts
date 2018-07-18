import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from '@service/wallet.service';

import { FixedSupply } from '@factory/fixed-supply.deployment';
import { ExistingTokenDeployment } from '@factory/existing-token.deployment';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  contractAddress: string

  contractType: string

  ExistingTokenDeployment: string = ExistingTokenDeployment._type
  FixedSupply: string = FixedSupply._type

  constructor(
    public route: ActivatedRoute,
    public wallet: WalletService) {}

  ngOnInit() {
    this.wallet.setEmptyWallet()
    this.wallet.setProvider()

    this.route.params.subscribe(({ contractAddress, contractType }) => {
      this.contractAddress = contractAddress
      this.contractType = contractType
    })
  }

}
