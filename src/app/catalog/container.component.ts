import { Component, OnInit } from '@angular/core';

import { FixedSupply } from '@factory/fixed-supply.deployment';
import { ExistingTokenDeployment } from '@factory/existing-token.deployment';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  ExistingTokenDeployment: string = ExistingTokenDeployment._type
  FixedSupply: string = FixedSupply._type

  constructor() {}

  ngOnInit() {}

}
