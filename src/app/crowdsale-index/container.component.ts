import { Component, OnInit } from '@angular/core';
import { WalletService } from '@service/wallet.service';
import { SimpleICOContract } from '@contract/simpleico.contract';
import { SimpleCrowdsaleContract } from '@contract/simplecrowdsale.contract';

import { FixedSupplyDeployment } from '@factory/fixed-supply.deployment';
import { ExistingTokenDeployment } from '@factory/existing-token.deployment';

declare var require: any

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  simpleICO: SimpleICOContract

  crowdsales: Array<SimpleCrowdsaleContract> = []

  ExistingTokenDeployment: string = ExistingTokenDeployment._type
  FixedSupplyDeployment: string = FixedSupplyDeployment._type

  constructor(public wallet: WalletService) {}

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
