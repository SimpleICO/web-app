import { Component, OnInit } from '@angular/core';
import { WalletService } from '@service/wallet.service';
import { SimpleICO } from '@model/simpleico.model';
import { SimpleCrowdsale } from '@model/simplecrowdsale.model';

declare var require: any

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  simpleICO: SimpleICO

  crowdsales: Array<SimpleCrowdsale> = []

  constructor(public wallet: WalletService) {}

  ngOnInit() {
    this.simpleICO = new SimpleICO(this.wallet.getInstance())
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

    let crowdsale = new SimpleCrowdsale(this.wallet.getInstance())
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
