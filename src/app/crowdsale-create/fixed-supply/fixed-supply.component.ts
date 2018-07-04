import { Component, OnInit, Input } from '@angular/core';
import { CrowdsaleDeploymentFactory } from '@factory/crowdsale-deployment.factory';
import { CrowdsaleDeployment } from '@factory/crowdsale-deployment';
import { SimpleToken } from '@token/simpletoken';
import { SimpleCrowdsale } from '@crowdsale/simplecrowdsale';
import { Router } from "@angular/router";

declare let require: any

const Web3 = require('web3')

@Component({
  selector: 'app-fixed-supply',
  templateUrl: './fixed-supply.component.html',
  styleUrls: ['./fixed-supply.component.css']
})
export class FixedSupplyComponent implements OnInit {

  deployer: CrowdsaleDeployment

  @Input() token: SimpleToken

  @Input() crowdsale: SimpleCrowdsale

  isInvalid: boolean = false
  errorMessage: string

  constructor(
    private crowdsaleFactory: CrowdsaleDeploymentFactory,
    private router: Router) {

    this.deployer = crowdsaleFactory.deployer

  }

  ngOnInit() {
    console.log(this.deployer)

    this.deployer
      .createToken()
      .createCrowdsale()

    this.token = this.deployer.getToken()
    this.crowdsale = this.deployer.getCrowdsale()
  }

  setBeneficiary(){
    let beneficiary = this.deployer.wallet.address
    this.crowdsale.setBeneficiary(beneficiary)
  }

  onCreateCrowdsale(){
    console.log(this.token, this.crowdsale)

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

    if (!Web3.utils.isAddress(this.crowdsale.beneficiary)) {
      this.isInvalid = true
      this.errorMessage = 'Beneficiary address is invalid'

      return false
    }

    this.isInvalid = false
    this.errorMessage = ''

    return this.router.navigate([`/crowdsale/${this.deployer.type}/deploy`]);
  }
}
