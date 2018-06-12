import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EthereumService } from '@service/ethereum.service';
import { WalletService } from '@service/wallet.service';
import { SimpleCrowdsale } from '@model/simplecrowdsale.model';
import { SimpleToken } from '@model/simpletoken.model';

declare var require: any

const ethers = require('ethers')

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  crowdsaleAddress: string

  ethRaised: string = '0.0'

  crowdsale: SimpleCrowdsale

  token: SimpleToken

  constructor(
    private route: ActivatedRoute,
    public eth: EthereumService,
    private wallet: WalletService) {}

  ngOnInit() {
    this.route.params.subscribe(({ crowdsaleAddress }) => {
      this.crowdsaleAddress = crowdsaleAddress

      this.crowdsale = new SimpleCrowdsale(this.wallet.getInstance())
      this.crowdsale.connect()
      this.crowdsale.setAddress(this.crowdsaleAddress)
      // this.crowdsale.subscribeToEvents()
      console.log(this.crowdsale)

      this.token = new SimpleToken(this.wallet.getInstance())
      this.token.connect()

      this.getCrowdsaleData()
      this.getTokenData()
    })
  }

  async getCrowdsaleData(){
    this.crowdsale.getEthRaised()

    this.getTokenData()
  }

  async getTokenData(){
    let tokenAddress = await this.crowdsale.instance.methods.token().call()
    this.token.setAddress(tokenAddress)

    this.token.getName()
    this.token.getSymbol()
  }
}
