import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FixedSupplyDeployment } from '@factory/fixed-supply.deployment';
import { ExistingTokenDeployment } from '@factory/existing-token.deployment';

declare var require: any

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
    public route: ActivatedRoute) {}

  ngOnInit(){
    this.route.params.subscribe(({ contractType }) => {
      this.contractType = contractType
    })
  }

}
