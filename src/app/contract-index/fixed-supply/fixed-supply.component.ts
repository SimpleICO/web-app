import { Component, OnInit } from '@angular/core';
import { WalletService } from '@service/wallet.service';
import { SettingsService } from '@service/settings.service';
import { SimpleICOContract } from '@contract/simpleico.contract';
import { SimpleCrowdsaleContract } from '@contract/simplecrowdsale.contract';

import { ERC20TokenCrowdsaleDeployment } from '@factory/token-crowdsale.deployment';

@Component({
  selector: 'app-fixed-supply',
  templateUrl: './fixed-supply.component.html',
  styleUrls: ['./fixed-supply.component.css']
})
export class FixedSupplyComponent implements OnInit {

  simpleICO: SimpleICOContract

  crowdsales: Array<SimpleCrowdsaleContract> = []

  ERC20TokenCrowdsaleDeployment: string = ERC20TokenCrowdsaleDeployment._type

  constructor(
    public wallet: WalletService,
    public settings: SettingsService) {

    settings.onNetworkChange.subscribe((networkChanged) => {
      this.crowdsales = []
      this.ngOnInit()
      this.getCrowdsales()
    })
  }

  ngOnInit() {
    this.simpleICO = new SimpleICOContract(this.wallet.getInstance())
    this.simpleICO.connect()
  }

  ngAfterViewInit() {
    this.getCrowdsales()
  }

  async getCrowdsales() {
    const crowdsales = await this.simpleICO.instance.methods.getCrowdsales().call()

    this.initCrowdsales(crowdsales)
  }

  async initCrowdsales(crowdsales: Array<string>) {
    if (crowdsales.length <= 0) {
      return false
    }

    const address = crowdsales.pop()

    const crowdsale = new SimpleCrowdsaleContract(this.wallet.getInstance())
    crowdsale.connect()
    crowdsale.setAddress(address)

    await crowdsale.setToken()

    const token = crowdsale.getToken()
    await token.getName()
    await token.getSymbol()

    this.crowdsales.push(crowdsale)

    this.initCrowdsales(crowdsales)
  }
}
