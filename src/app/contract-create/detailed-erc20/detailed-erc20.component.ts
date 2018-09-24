import { Component, OnInit, Input } from '@angular/core';
import { ContractDeploymentFactory } from 'scui-lib';
import { Router } from '@angular/router';
import { Token } from '@model/token.model';
import { EthereumService } from 'scui-lib';

@Component({
  selector: 'app-detailed-erc20',
  templateUrl: './detailed-erc20.component.html',
  styleUrls: ['./detailed-erc20.component.css']
})
export class DetailedErc20Component implements OnInit {

  deployer: any

  @Input() token: Token

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

    this.token = this.deployer.getToken()
  }

  onCreateToken() {

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


    if (isNaN(Number(this.token.decimals)) || this.token.decimals <= 0) {
      this.isInvalid = true
      this.errorMessage = 'No token decimals were specified'
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

    this.isInvalid = false
    this.errorMessage = ''

    return this.router.navigate([`/contract/${this.deployer.type}/deploy`]);
  }

}
