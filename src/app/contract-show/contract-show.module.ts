import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container.component';
import { SharedModule } from '@shared/shared.module';
import { FixedSupplyComponent } from './fixed-supply/fixed-supply.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ContainerComponent, FixedSupplyComponent]
})
export class ContractShowModule { }
