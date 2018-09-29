import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EthereumService } from '@decentralizedtechnologies/scui-lib';
import { WalletService } from '@decentralizedtechnologies/scui-lib';
import { SharedService } from '@service/shared.service';
import { SettingsService } from '@service/settings.service';
import { SimpleTokenContract } from '@contract/simpletoken.contract';

@Component({
  selector: 'app-detailed-erc20',
  templateUrl: './detailed-erc20.component.html',
  styleUrls: ['./detailed-erc20.component.scss']
})
export class DetailedErc20Component implements OnInit {

  contractAddress: string

  contractType: string

  ethRaised: string = '0.0'

  token: SimpleTokenContract

  constructor(
    public route: ActivatedRoute,
    public eth: EthereumService,
    public settings: SettingsService,
    public shared: SharedService,
    public wallet: WalletService) { }

  ngOnInit() {
    this.route.params.subscribe(({ contractAddress, contractType }) => {
      this.contractAddress = contractAddress
      this.contractType = contractType

      this.token = new SimpleTokenContract(this.wallet.getInstance())
      this.token.connect()
      this.token.setAddress(contractAddress)

      this.getTokenData()
    })
  }

  async getTokenData() {
    this.token.getName()
    this.token.getSymbol()
  }
}
