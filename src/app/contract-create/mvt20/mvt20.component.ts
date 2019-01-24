import { Component, OnInit, Input } from '@angular/core';
import { ContractDeploymentFactory } from '@decentralizedtechnologies/scui-lib';
import { Router } from '@angular/router';
import { EthereumService } from '@decentralizedtechnologies/scui-lib';
import { MVT20Contract } from '@contract/MVT20.contract';

@Component({
  selector: 'app-mvt20',
  templateUrl: './mvt20.component.html',
  styleUrls: ['./mvt20.component.scss']
})
export class MVT20Component implements OnInit {

  deployer: any

  @Input() token: MVT20Contract

  isInvalid: boolean = false
  errorMessage: string

  constructor(
    public eth: EthereumService,
    private contractFactory: ContractDeploymentFactory,
    private router: Router) {
    this.deployer = this.contractFactory.deployer
  }

  ngOnInit() {
    this.deployer.createToken()
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
