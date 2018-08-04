import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ContainerComponent } from './container.component';
import { FixedSupplyComponent } from './fixed-supply/fixed-supply.component';
import { ExistingTokenComponent } from './existing-token/existing-token.component';
import { DetailedErc20Component } from './detailed-erc20/detailed-erc20.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    ContainerComponent,
    FixedSupplyComponent,
    ExistingTokenComponent,
    DetailedErc20Component,
  ]
})
export class ContractDeployModule { }
