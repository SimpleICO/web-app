import { Component } from '@angular/core';
import { FixedSupplyComponent as PrivateFixedSupplyComponent } from '../../contract-show/fixed-supply/fixed-supply.component';
import { SimpleCrowdsaleContract } from '@contract/simplecrowdsale.contract';
import { SimpleTokenContract } from '@contract/simpletoken.contract';

@Component({
  selector: 'app-fixed-supply',
  templateUrl: './fixed-supply.component.html',
  styleUrls: ['./fixed-supply.component.scss']
})
export class FixedSupplyComponent extends PrivateFixedSupplyComponent {

  ngOnInit() {
    this.settings.onNetworkChange.subscribe((networkChanged) => {
      this.ngOnInit()
    })

    this.route.params.subscribe(({ contractAddress, contractType }) => {
      this.contractAddress = contractAddress
      this.contractType = contractType

      this.crowdsale = new SimpleCrowdsaleContract(this.wallet.getInstance())
      this.crowdsale.connect()
      this.crowdsale.setAddress(this.contractAddress)
      this.subscribe()

      this.token = new SimpleTokenContract(this.wallet.getInstance())
      this.token.connect()

      this.getCrowdsaleData()
      this.getTokenData()
    })
  }
}
