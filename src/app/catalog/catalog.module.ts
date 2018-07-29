import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { ContainerComponent } from './container.component';
import { ContractsComponent } from './contracts/contracts.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
  ],
  exports: [
    ContractsComponent,
  ],
  declarations: [
    ContainerComponent,
    ContractsComponent,
  ]
})
export class CatalogModule { }
