import { Component } from '@angular/core';
import { DetailedErc20Component as PrivateDetailedERC20Component } from '../../contract-show/detailed-erc20/detailed-erc20.component';

@Component({
  selector: 'app-detailed-erc20',
  templateUrl: './detailed-erc20.component.html',
  styleUrls: ['./detailed-erc20.component.scss']
})

export class DetailedErc20Component extends PrivateDetailedERC20Component {

  ngOnInit() {
    this.settings.onNetworkChange.subscribe((networkChanged) => {
      super.ngOnInit()
    })

    super.ngOnInit()
  }

}
