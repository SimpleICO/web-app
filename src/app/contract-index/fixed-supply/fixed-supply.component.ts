import { Component, OnInit } from '@angular/core';
import { WalletService } from '@service/wallet.service';
import { SimpleICOContract } from '@contract/simpleico.contract';
import { SimpleCrowdsaleContract } from '@contract/simplecrowdsale.contract';

import { FixedSupplyDeployment } from '@factory/fixed-supply.deployment';

@Component({
  selector: 'app-fixed-supply',
  templateUrl: './fixed-supply.component.html',
  styleUrls: ['./fixed-supply.component.css']
})
export class FixedSupplyComponent implements OnInit {

  simpleICO: SimpleICOContract

  crowdsales: Array<SimpleCrowdsaleContract> = []

  FixedSupplyDeployment: string = FixedSupplyDeployment._type

  constructor(
    public wallet: WalletService) {}

  ngOnInit() {
    this.simpleICO = new SimpleICOContract(this.wallet.getInstance())
    this.simpleICO.connect()
  }

  ngAfterViewInit(){
    this.getCrowdsales()
  }

  async getCrowdsales(){
    let crowdsales = await this.simpleICO.instance.methods.getCrowdsales().call()
    console.log(crowdsales)

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
