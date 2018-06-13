import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container.component';
import { SharedModule } from '@shared/shared.module';
import { QrCodeModalComponent } from './qr-code-modal/qr-code-modal.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ContainerComponent, QrCodeModalComponent]
})
export class CrowdsaleShowModule { }
