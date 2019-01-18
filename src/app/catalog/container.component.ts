import { Component, OnInit } from '@angular/core';

import { ERC20TokenCrowdsaleDeployment } from '@factory/token-crowdsale.deployment';
@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})

export class ContainerComponent implements OnInit {

  ERC20TokenCrowdsaleDeployment: string = ERC20TokenCrowdsaleDeployment._type

  constructor() { }

  ngOnInit() { }

}
