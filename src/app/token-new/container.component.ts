import { Component, OnInit, Input } from '@angular/core';
import { EthereumService } from '@service/ethereum.service';
import { WalletService } from '@service/wallet.service';

declare let require: any

const Web3 = require('web3')

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  @Input() token: any = {
    name: '',
    symbol: '',
    supply: '10',
    price: '0.0001',
  }

  @Input() beneficiary: any = {
    address: '',
  }

  isInvalid: boolean = false
  errorMessage: string

  constructor(
    public eth: EthereumService,
    public wallet: WalletService) {

    this.beneficiary.address = wallet.getAddress()

  }

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

    if (String(this.token.supply).length > 18) {
      this.isInvalid = true
      this.errorMessage = 'Supply value must be an integer of maximum Ne18'
      return false
    }

    if (isNaN(Number(this.token.price)) || this.token.price <= 0) {
      this.isInvalid = true
      this.errorMessage = 'Price value must be in ETH and be greater than 0'
      return false
    }

    if (!Web3.utils.isAddress(this.beneficiary.address)) {
      this.isInvalid = true
      this.errorMessage = 'Beneficiary address is invalid'

      return false
    }

    this.isInvalid = false
    this.errorMessage = ''

    this.eth.createToken(this.token.name, this.token.symbol, this.token.supply, this.token.price)
    this.wallet.setBeneficiaryAddress(this.beneficiary.address)
  }
}




