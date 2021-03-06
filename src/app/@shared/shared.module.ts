import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { AppRoutingModule } from '../app-routing.module';
import { HeaderComponent } from './header/header.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderPublicComponent } from './header-public/header-public.component';
import { QrCodeModalComponent } from './qr-code-modal/qr-code-modal.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SharedModule as SCUISharedModule } from '@decentralizedtechnologies/scui-lib';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    SCUISharedModule,
  ],
  exports: [
    CommonModule,
    AuthHeaderComponent,
    HeaderComponent,
    MobileMenuComponent,
    FooterComponent,
    HeaderPublicComponent,
    QrCodeModalComponent,
    SpinnerComponent,
    SCUISharedModule,
  ],
  declarations: [
    AuthHeaderComponent,
    HeaderComponent,
    MobileMenuComponent,
    FooterComponent,
    HeaderPublicComponent,
    QrCodeModalComponent,
    SpinnerComponent,
  ]
})
export class SharedModule { }
