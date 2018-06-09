import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container.component';
import { SharedModule } from '@shared/shared.module';
import { NewTokenModalComponent } from './new-token-modal/new-token-modal.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [ContainerComponent, NewTokenModalComponent]
})
export class TokenNewModule { }
