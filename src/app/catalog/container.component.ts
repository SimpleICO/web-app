import { Component, OnInit } from '@angular/core';

import { FixedSupplyCrowdsale } from '@factory/fixed-supply.crowdsale';
import { ExistingToken } from '@factory/existing-token';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  ExistingToken: string = ExistingToken._type
  FixedSupplyCrowdsale: string = FixedSupplyCrowdsale._type

  constructor() {}

  ngOnInit() {}

}
