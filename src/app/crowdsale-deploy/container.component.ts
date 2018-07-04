import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrowdsaleDeploymentFactory } from '@factory/crowdsale-deployment.factory';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  crowdsaleType: string

  constructor(
    private route: ActivatedRoute,
    private crowdsaleFactory: CrowdsaleDeploymentFactory) {}

  ngOnInit() {
    this.route.params.subscribe(({ crowdsaleType }) => {
      this.crowdsaleType = crowdsaleType
    })
  }

}
