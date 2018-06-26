import { Component, OnInit } from '@angular/core';
import { EthereumService } from '@service/ethereum.service';
import { DeploymentStateService } from '@service/deployment-state.service';

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

  state: any = {
    creatingToken: {
      isActive: true,
    },
    tokenCreated: {
      isActive: false,
    },
    creatingCrowdsale: {
      isActive: false,
    },
    transferingToken: {
      isActive: false,
    },
  }

  stateLength: number
  currentState: number = 0

  constructor(
    public eth: EthereumService,
    private deploymentState: DeploymentStateService) {

    this.stateLength = Object.keys(this.state).length
    this.currentState = 0

    eth.onTokenDeployment.subscribe(data => {
      this.display = data.displayModal
      this.onTxnCostCalc = data.onTxnCostCalc
      this.onInsufficientFunds = data.onInsufficientFunds
      this.onBeforeTokenDeployment = data.onBeforeTokenDeployment
      this.onTokenDeployment = data.onTokenDeployment
      this.onAfterTokenDeployment = data.onAfterTokenDeployment
      this.onError = data.onError
    })

    deploymentState.onDeploymentData.subscribe(data => {
      this.currentState++

      this.state.creatingToken.isActive = data.creatingToken.isActive
      this.state.tokenCreated.isActive = data.tokenCreated.isActive
      this.state.creatingCrowdsale.isActive = data.creatingCrowdsale.isActive
      this.state.transferingToken.isActive = data.transferingToken.isActive
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
