import { Component, OnInit, Input } from '@angular/core';
import { CrowdsaleDeploymentFactory } from '@factory/crowdsale-deployment.factory';
import { CrowdsaleDeployment } from '@factory/crowdsale-deployment';
import { Router } from "@angular/router";
import { Crowdsale } from '@model/crowdsale.model';
import { Token } from '@model/token.model';

declare let require: any

const Web3 = require('web3')

@Component({
  selector: 'app-existing-token',
  templateUrl: './existing-token.component.html',
  styleUrls: ['./existing-token.component.css']
})
export class ExistingTokenComponent implements OnInit {

  deployer: CrowdsaleDeployment

  @Input() token: Token

  @Input() crowdsale: Crowdsale

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
      .createSimpleICO()

    this.token = this.deployer.getToken()
    this.crowdsale = this.deployer.getCrowdsale()
  }

  setBeneficiary(){
    let beneficiary = this.deployer.wallet.address
    this.crowdsale.setBeneficiary(beneficiary)
  }

  onCreateCrowdsale(){
    console.log(this.token, this.crowdsale)

    if (this.token.address.length <= 0) {
      this.isInvalid = true
      this.errorMessage = 'No token address was specified'
      return false
    }

    if (!Web3.utils.isAddress(this.token.address)) {
      this.isInvalid = true
      this.errorMessage = 'Invalid token address'
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

    this.token.setAddress(this.token.address)

    return this.router.navigate([`/crowdsale/${this.deployer.type}/deploy`]);
  }
}
