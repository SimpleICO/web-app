import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContainerComponent } from './container.component';
import { FixedSupplyComponent } from './fixed-supply/fixed-supply.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    ContainerComponent,
    FixedSupplyComponent,
  ]
})
export class CrowdsaleCreateModule { }
