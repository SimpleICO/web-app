import { Component, OnInit } from '@angular/core';
import { ContainerComponent as ContractShowComponent } from '../contract-show/container.component';
import { SimpleCrowdsaleContract } from '@contract/simplecrowdsale.contract';
import { SimpleTokenContract } from '@contract/simpletoken.contract';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent extends ContractShowComponent {

  ngOnInit() {
    this.wallet.setEmptyWallet()
    this.wallet.setProvider()

    this.route.params.subscribe(({ contractAddress }) => {
      this.contractAddress = contractAddress

      this.crowdsale = new SimpleCrowdsaleContract(this.wallet.getInstance())
      this.crowdsale.connect()
      this.crowdsale.setAddress(this.contractAddress)
      console.log(this.crowdsale)
      this.subscribe()

      this.token = new SimpleTokenContract(this.wallet.getInstance())
      this.token.connect()

      this.getCrowdsaleData()
      this.getTokenData()
    })
  }

}
