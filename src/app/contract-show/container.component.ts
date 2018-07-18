import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EthereumService } from '@service/ethereum.service';
import { WalletService } from '@service/wallet.service';
import { SharedService } from '@service/shared.service';
import { SimpleCrowdsaleContract } from '@contract/simplecrowdsale.contract';
import { SimpleTokenContract } from '@contract/simpletoken.contract';

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
    public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(({ contractAddress, contractType }) => {
      this.contractAddress = contractAddress
      this.contractType = contractType
    })
  }
}
