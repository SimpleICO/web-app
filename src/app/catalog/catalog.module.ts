import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { ContainerComponent } from './container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
  ],
  declarations: [
    ContainerComponent,
  ]
})
export class CatalogModule { }
