import { Component, OnInit } from '@angular/core';
import { EthereumService } from '@service/ethereum.service';

@Component({
  selector: 'app-new-token-modal',
  templateUrl: './new-token-modal.component.html',
  styleUrls: ['./new-token-modal.component.css']
})

export class NewTokenModalComponent implements OnInit {

  display: boolean = false
  onTxnCostCalc: boolean = false
  onInsufficientFunds: boolean = false
  onBeforeTokenDeployment: boolean = false
  onTokenDeployment: boolean = false
  onAfterTokenDeployment: boolean = false
  onError: boolean = false

  constructor(public eth: EthereumService) {
    eth.onTokenDeployment.subscribe(data => {
      this.display = data.displayModal
      this.onTxnCostCalc = data.onTxnCostCalc
      this.onInsufficientFunds = data.onInsufficientFunds
      this.onBeforeTokenDeployment = data.onBeforeTokenDeployment
      this.onTokenDeployment = data.onTokenDeployment
      this.onAfterTokenDeployment = data.onAfterTokenDeployment
      this.onError = data.onError
    })
  }

  ngOnInit() {
  }

  reset(){
    this.display = false
    this.onTxnCostCalc = false
    this.onBeforeTokenDeployment = false
    this.onTokenDeployment = false
    this.onAfterTokenDeployment = false
    this.onError = false
  }

}
