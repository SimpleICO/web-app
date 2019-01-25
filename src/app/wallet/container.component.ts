import { Component, OnInit } from '@angular/core';
import { WalletService, Network } from '@decentralizedtechnologies/scui-lib';
import { SharedService } from '@service/shared.service';
import { EthereumService } from '@decentralizedtechnologies/scui-lib';
import { HttpClient } from '@angular/common/http';
import { DetailedERC20Deployment } from '@factory/detailed-erc20.deployment';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  tokens = []
  DetailedERC20Deployment = DetailedERC20Deployment._type

  constructor(
    public wallet: WalletService,
    public eth: EthereumService,
    private http: HttpClient,
    public shared: SharedService) { }

  ngOnInit() {
    if (this.wallet.network === Network.mainnet) {
      this.http.get(`http://api.ethplorer.io/getAddressInfo/${this.wallet.getAddress()}?apiKey=freekey`)
        .toPromise()
        .then((info: any) => {
          this.tokens = info.tokens
        }).catch(error => console.error(error))
    }
  }

}
