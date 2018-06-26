import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DeploymentStateService {

  static readonly TOKEN_CREATION: string = 'creatingToken'
  static readonly TOKEN_CREATED: string = 'tokenCreated'
  static readonly CROWDSALE_CREATION: string = 'creatingCrowdsale'
  static readonly TOKEN_SUPPLY_TRANSFER: string = 'transferingToken'

  onDeploymentData: Subject<any> = new Subject<any>()

  constructor() { }

  setDeploymentData(state: string) {
    let states = {
      creatingToken: {
        isActive: false,
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

    states[state].isActive = true

    return states
  }

  updateDeploymentData(state: string, data?: any) {

    this.onDeploymentData.next(this.setDeploymentData(state))

  }

}
