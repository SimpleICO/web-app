import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrowdsaleDeploymentFactory } from '@factory/crowdsale-deployment.factory';
import { WalletService } from '@service/wallet.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  crowdsaleType: string

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private crowdsaleFactory: CrowdsaleDeploymentFactory,
    public wallet: WalletService) {}

  ngOnInit() {
    this.route.params.subscribe(({ crowdsaleType }) => {
      this.crowdsaleType = crowdsaleType
    })
  }

  cancel(){
    return this.router.navigate([`/crowdsale/${this.crowdsaleType}/create`]);
  }

}
