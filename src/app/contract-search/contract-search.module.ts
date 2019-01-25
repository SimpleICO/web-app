import { NgModule } from '@angular/core';
import { MVT20Component } from './mvt20/mvt20.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ContainerComponent } from './container.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
  ],
  declarations: [MVT20Component, ContainerComponent],
})
export class ContractSearchModule { }
