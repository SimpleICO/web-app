import { Component, OnInit, Input } from '@angular/core';
import { EthereumService } from '@service/ethereum.service';
import { WalletService } from '@service/wallet.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  @Input() token: any = {
    name: '',
    symbol: '',
    supply: '',
    price: '',
  }

  isInvalid: boolean = false
  errorMessage: string

  constructor(
    public eth: EthereumService,
    public wallet: WalletService) {}

  ngOnInit() {}

  onCreateCrowdsale(){
    if (this.token.name.length <= 0) {
      this.isInvalid = true
      this.errorMessage = 'No token name was specified'
      return false
    }

    if (this.token.symbol.length <= 0) {
      this.isInvalid = true
      this.errorMessage = 'No token symbol was specified'
      return false
    }

    if (isNaN(Number(this.token.supply)) || this.token.supply <= 0) {
      this.isInvalid = true
      this.errorMessage = 'Supply value must be an integer greater than 0'
      return false
    }

    if (isNaN(Number(this.token.price)) || this.token.price <= 0) {
      this.isInvalid = true
      this.errorMessage = 'Price value must be in ETH and be greater than 0'
      return false
    }

    this.isInvalid = false
    this.errorMessage = ''

    this.eth.createToken(this.token.name, this.token.symbol, this.token.supply, this.token.price)
  }
}




