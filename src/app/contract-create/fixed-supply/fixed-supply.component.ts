import { Component, OnInit, Input } from '@angular/core';
import { ContractDeploymentFactory } from '@factory/contract-deployment.factory';
import { ContractDeployment } from '@factory/contract-deployment';
import { Router } from '@angular/router';
import { Crowdsale } from '@model/crowdsale.model';
import { Token } from '@model/token.model';
import { EthereumService } from '@service/ethereum.service';

import { ExistingTokenDeployment } from '@factory/existing-token.deployment';

declare let require: any

const Web3 = require('web3')

@Component({
  selector: 'app-fixed-supply',
  templateUrl: './fixed-supply.component.html',
  styleUrls: ['./fixed-supply.component.css']
})
export class FixedSupplyComponent implements OnInit {

  ExistingTokenDeployment: string = ExistingTokenDeployment._type

  deployer: ContractDeployment

  @Input() token: Token

  @Input() crowdsale: Crowdsale

  isInvalid: boolean = false
  errorMessage: string

  constructor(
    public eth: EthereumService,
    private contractFactory: ContractDeploymentFactory,
    private router: Router) {

    this.deployer = contractFactory.deployer

  }

  ngOnInit() {

    this.deployer
      .createToken()
      .createCrowdsale()
      .createSimpleICO()

    this.token = this.deployer.getToken()
    this.crowdsale = this.deployer.getCrowdsale()
  }

  setBeneficiary() {
    const beneficiary = this.deployer.wallet.address
    this.crowdsale.setBeneficiary(beneficiary)
  }

  onCreateCrowdsale() {

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

    return this.router.navigate([`/contract/${this.deployer.type}/deploy`]);
  }
}
