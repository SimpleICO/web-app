import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container.component';
import { SharedModule } from '@shared/shared.module';
import { NewTokenModalComponent } from './new-token-modal/new-token-modal.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    AppRoutingModule
  ],
  declarations: [ContainerComponent, NewTokenModalComponent]
})
export class TokenNewModule { }
