import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EthereumService } from '@decentralizedtechnologies/scui-lib';
import { WalletService } from '@decentralizedtechnologies/scui-lib';
import { SharedService } from '@service/shared.service';
import { SettingsService } from '@service/settings.service';
import { MVT20Contract } from '@contract/MVT20.contract';

@Component({
  selector: 'app-mvt20',
  templateUrl: './mvt20.component.html',
  styleUrls: ['./mvt20.component.scss']
})
export class MVT20Component implements OnInit {

  contractAddress: string
  contractType: string
  token: MVT20Contract

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

      this.token = new MVT20Contract(this.wallet.getInstance())
      this.token.connect()
      this.token.setAddress(contractAddress)

      this.getTokenData()
    })
  }

  async getTokenData() {
    this.token.getName()
    this.token.getSymbol()
    this.token.getTotalSupply()
    this.token.getAdminMembers()
    this.token.getMembers()
    this.token.getPendingRequests()
  }
}
