import { Component } from '@angular/core';
import { Erc20TokenCrowdsaleComponent as PrivateErc20TokenCrowdsaleComponent } from '../../contract-show/erc20-token-crowdsale/erc20-token-crowdsale.component';
import { SimpleCrowdsaleContract } from '@contract/simplecrowdsale.contract';
import { SimpleTokenContract } from '@contract/simpletoken.contract';

@Component({
  selector: 'app-erc20-token-crowdsale',
  templateUrl: './erc20-token-crowdsale.component.html',
  styleUrls: ['./erc20-token-crowdsale.component.scss']
})
export class Erc20TokenCrowdsaleComponent extends PrivateErc20TokenCrowdsaleComponent {

  ngOnInit() {
    this.settings.onNetworkChange.subscribe((networkChanged) => {
      super.ngOnInit()
    })

    super.ngOnInit()
  }

}
