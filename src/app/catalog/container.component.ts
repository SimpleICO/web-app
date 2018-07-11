import { Component, OnInit } from '@angular/core';

import { FixedSupplyCrowdsale } from '@factory/fixed-supply.crowdsale';
import { ExistingTokenCrowdsale } from '@factory/existing-token.crowdsale';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  ExistingTokenCrowdsale: string = ExistingTokenCrowdsale._type
  FixedSupplyCrowdsale: string = FixedSupplyCrowdsale._type

  constructor() {}

  ngOnInit() {}

}
