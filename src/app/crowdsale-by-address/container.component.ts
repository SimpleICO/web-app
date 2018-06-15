import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimpleICO } from '@model/simpleico.model';
import { SimpleCrowdsale } from '@model/simplecrowdsale.model';
import { WalletService } from '@service/wallet.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  simpleICO: SimpleICO

  crowdsales: Array<SimpleCrowdsale> = []

  address: string

  constructor(
    private wallet: WalletService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.simpleICO = new SimpleICO(this.wallet.getInstance())
    this.simpleICO.connect()

    this.route.params.subscribe(({ address }) => {
        this.address = address
    })
  }

  ngAfterViewInit(){
    this.getCrowdsalesByAddress()
  }

  async getCrowdsalesByAddress(){
    let crowdsales = await this.simpleICO.instance.methods.getCrowdsalesByAddress(this.address).call()
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
