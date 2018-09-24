import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    ContainerComponent
  ],
  declarations: [ContainerComponent]
})
export class LoginModule { }
