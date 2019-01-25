import { NgModule } from '@angular/core';
import { ContainerComponent } from './container.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [ContainerComponent]
})

export class NewWalletModule { }
