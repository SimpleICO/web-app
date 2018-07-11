import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { CrowdsaleByAddressModule } from '../crowdsale-by-address/crowdsale-by-address.module';
import { ContainerComponent } from './container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CrowdsaleByAddressModule
  ],
  declarations: [
    ContainerComponent
  ]
})
export class WalletModule { }
