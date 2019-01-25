import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ContainerComponent } from './container.component';
import { FixedSupplyComponent } from './fixed-supply/fixed-supply.component';
import { ExistingTokenComponent } from './existing-token/existing-token.component';
import { DetailedErc20Component } from './detailed-erc20/detailed-erc20.component';
import { Erc20TokenCrowdsaleComponent } from './erc20-token-crowdsale/erc20-token-crowdsale.component';
import { MVT20Component } from './mvt20/mvt20.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule
  ],
  declarations: [
    ContainerComponent,
    FixedSupplyComponent,
    ExistingTokenComponent,
    DetailedErc20Component,
    Erc20TokenCrowdsaleComponent,
    MVT20Component,
  ]
})
export class ContractDeployModule { }
