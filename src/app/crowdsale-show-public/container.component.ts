import { Component, OnInit } from '@angular/core';
import { ContainerComponent as CrowdsaleShowComponent } from '../crowdsale-show/container.component';
// import { ActivatedRoute } from '@angular/router';
// import { WalletService } from '@service/wallet.service';
import { SimpleCrowdsale } from '@model/simplecrowdsale.model';
import { SimpleToken } from '@model/simpletoken.model';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent extends CrowdsaleShowComponent {

  ngOnInit() {
    this.wallet.setEmptyWallet()
    this.wallet.setProvider()

    this.route.params.subscribe(({ crowdsaleAddress }) => {
      this.crowdsaleAddress = crowdsaleAddress

      this.crowdsale = new SimpleCrowdsale(this.wallet.getInstance())
      this.crowdsale.connect()
      this.crowdsale.setAddress(this.crowdsaleAddress)
      console.log(this.crowdsale)
      this.subscribe()

      this.token = new SimpleToken(this.wallet.getInstance())
      this.token.connect()

      this.getCrowdsaleData()
      this.getTokenData()
    })
  }

}
