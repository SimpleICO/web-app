import { Component, OnInit } from '@angular/core';
import { SimpleICO } from '@model/simpleico.model';
import { WalletService } from '@service/wallet.service';
import { ContainerComponent as CrowdsaleIndexComponent } from '../crowdsale-index/container.component';

@Component({
  selector: 'app-crowdsale-by-address',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent extends CrowdsaleIndexComponent {

  address: string

  constructor(
    public wallet: WalletService){

    super(wallet)

  }

  ngOnInit() {
    this.simpleICO = new SimpleICO(this.wallet.getInstance())
    this.simpleICO.connect()

    this.address = this.wallet.getAddress()
  }

  ngAfterViewInit(){
    this.getCrowdsalesByAddress()
  }

  async getCrowdsalesByAddress(){
    let crowdsales = await this.simpleICO.instance.methods.getCrowdsalesByAddress(this.address).call()
    console.log(crowdsales)

    this.initCrowdsales(crowdsales)
  }

}
