import { Component, OnInit } from '@angular/core';
import { WalletService } from '@service/wallet.service';
import { Wallet } from '@model/wallet.model';
import { SimpleICOContract } from '@contract/simpleico.contract';
import { ContainerComponent as CrowdsaleIndexComponent } from '../crowdsale-index/container.component';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent extends CrowdsaleIndexComponent {

  ngOnInit() {
    this.wallet.setEmptyWallet()
    this.wallet.setProvider()

    this.simpleICO = new SimpleICOContract(this.wallet.getInstance())
    this.simpleICO.connect()
  }


}
