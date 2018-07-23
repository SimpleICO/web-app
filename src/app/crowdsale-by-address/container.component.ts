import { Component, OnInit } from '@angular/core';
import { SimpleICOContract } from '@contract/simpleico.contract';
import { WalletService } from '@service/wallet.service';
import { SettingsService } from '@service/settings.service';
import { SimpleCrowdsaleContract } from '@contract/simplecrowdsale.contract';

import { FixedSupplyDeployment } from '@factory/fixed-supply.deployment';

@Component({
  selector: 'app-crowdsale-by-address',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  simpleICO: SimpleICOContract

  address: string

  FixedSupplyDeployment: string = FixedSupplyDeployment._type

  crowdsales: Array<SimpleCrowdsaleContract> = []

  constructor(
    public wallet: WalletService,
    public settings: SettingsService){

    settings.onNetworkChange.subscribe((networkChanged) => {
      this.crowdsales = []
      this.ngOnInit()
      this.getCrowdsalesByAddress()
    })
  }

  ngOnInit() {
    this.simpleICO = new SimpleICOContract(this.wallet.getInstance())
    this.simpleICO.connect()

    this.address = this.wallet.getAddress()
  }

  ngAfterViewInit(){
    this.getCrowdsalesByAddress()
  }

  async getCrowdsalesByAddress(){
    let crowdsales = await this.simpleICO.instance.methods.getCrowdsalesByAddress(this.address).call()

    this.initCrowdsales(crowdsales)
  }

  async initCrowdsales(crowdsales: Array<string>){
    if (crowdsales.length <= 0) {
      return false
    }

    let address = crowdsales.pop()

    let crowdsale = new SimpleCrowdsaleContract(this.wallet.getInstance())
    crowdsale.connect()
    crowdsale.setAddress(address)

    await crowdsale.setToken()

    let token = crowdsale.getToken()
    await token.getName()
    await token.getSymbol()

    this.crowdsales.push(crowdsale)

    this.initCrowdsales(crowdsales)
  }
}
