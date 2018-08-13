import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container.component';
import { SharedModule } from '@shared/shared.module';
import { FixedSupplyComponent } from './fixed-supply/fixed-supply.component';
import { DetailedErc20Component } from './detailed-erc20/detailed-erc20.component';
import { Erc20TokenCrowdsaleComponent } from './erc20-token-crowdsale/erc20-token-crowdsale.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ContainerComponent, FixedSupplyComponent, DetailedErc20Component, Erc20TokenCrowdsaleComponent]
})
export class ContractShowPublicModule { }
