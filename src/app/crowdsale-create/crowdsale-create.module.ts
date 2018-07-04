import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ContainerComponent } from './container.component';
import { FixedSupplyComponent } from './fixed-supply/fixed-supply.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    ContainerComponent,
    FixedSupplyComponent,
  ]
})
export class CrowdsaleCreateModule { }
