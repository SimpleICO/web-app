import { Component, OnInit, Input } from '@angular/core';
import { ContractDeploymentFactory } from '@factory/contract-deployment.factory';
import { ERC20TokenCrowdsaleDeployment } from '@factory/token-crowdsale.deployment';
import { Router, ActivatedRoute } from '@angular/router';
import { Crowdsale } from '@model/crowdsale.model';
import { Token } from '@model/token.model';
import { InsufficientFundsError } from '@error/insufficient-funds.error';

declare let require: any

const Web3 = require('web3')
const ethers = require('ethers')
@Component({
  selector: 'app-erc20-token-crowdsale',
  templateUrl: './erc20-token-crowdsale.component.html',
  styleUrls: ['./erc20-token-crowdsale.component.scss']
})
export class Erc20TokenCrowdsaleComponent implements OnInit {

  deployer: ERC20TokenCrowdsaleDeployment

  @Input() token: Token

  @Input() crowdsale: Crowdsale

  isInvalid: boolean = false
  errorMessage: string

  isTokenLoaded: boolean = false
  hasInsufficientTokenFunds: boolean = false

  supply: string

  balanceOf: number = 0

  percentage: number = 0

  constructor(
    private contractFactory: ContractDeploymentFactory,
    private route: ActivatedRoute,
    private router: Router) {

    this.deployer = contractFactory.deployer as ERC20TokenCrowdsaleDeployment
  }

  ngOnInit() {
    this.deployer
      .createToken()
      .createCrowdsale()
      .createSimpleICO()

    this.token = this.deployer.getToken()
    this.crowdsale = this.deployer.getCrowdsale()

    this.route.queryParams.subscribe(({ address }) => {
      this.token.address = address
    })
  }

  setBeneficiary() {
    const beneficiary = this.deployer.wallet.address
    this.crowdsale.setBeneficiary(beneficiary)
  }

  reset() {
    this.isTokenLoaded = false
    this.hasInsufficientTokenFunds = false
    this.isInvalid = false
    this.errorMessage = ''
  }

  async onLoadTokenInfo() {

    this.reset()

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

    this.isInvalid = false
    this.errorMessage = ''

    try {
      this.token.setAddress(this.token.address)
      await this.getTokenInfo()
      this.isTokenLoaded = true
    } catch (error) {
      console.log(error)

      if (error instanceof InsufficientFundsError) {
        this.isTokenLoaded = false
        this.hasInsufficientTokenFunds = true
        this.isInvalid = true
        this.errorMessage = `You don't have funds of ${this.token.symbol} token in order to create a crowdsale.`
        return false
      }

      this.isInvalid = true
      this.errorMessage = `The token contract address does not exist in the ${this.deployer.wallet.network} or the address is an invalid ERC20 contract`
    }
  }

  private async getTokenInfo() {

    this.token.getName()
    this.token.getSymbol()
    await this.token.getBalanceOf()

    const balanceOf = ethers.utils.bigNumberify(this.token.balanceOf)
    const hasInsufficientOwnership = balanceOf.lte(ethers.utils.bigNumberify(0))

    if (hasInsufficientOwnership) {
      throw new InsufficientFundsError(InsufficientFundsError.MESSAGE)
    }

    this.balanceOf = ethers.utils.formatEther(this.token.balanceOf)

    await this.token.getTotalSupply()
    this.supply = ethers.utils.bigNumberify(this.token.supply).div(1e18.toString()).toString()

    this.percentage = balanceOf.div(ethers.utils.bigNumberify(this.token.supply)).mul(100).toString()
  }

  onSetupCrowdsale() {
    return this.router.navigate([`/contract/${this.deployer.type}/deploy`]);
  }
}
