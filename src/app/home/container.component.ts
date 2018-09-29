import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from '@decentralizedtechnologies/scui-lib';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})

export class ContainerComponent implements OnInit {

  private fragment: string

  constructor(
    private route: ActivatedRoute,
    private walletService: WalletService) {

  }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        document.querySelector(`#${fragment}`).scrollIntoView({ behavior: 'smooth' })
      }
    })
  }
}
