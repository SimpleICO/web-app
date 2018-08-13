import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeepHtmlPipe } from '@pipe/keep-html.pipe';
import { WeiToEtherPipe } from '@pipe/wei-to-ether.pipe';
import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { AppRoutingModule } from '../app-routing.module';
import { HeaderComponent } from './header/header.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderPublicComponent } from './header-public/header-public.component';
import { QrCodeModalComponent } from './qr-code-modal/qr-code-modal.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
  ],
  exports: [
    AppRoutingModule,
    AuthHeaderComponent,
    HeaderComponent,
    MobileMenuComponent,
    FooterComponent,
    HeaderPublicComponent,
    QrCodeModalComponent,
    SpinnerComponent,
    KeepHtmlPipe,
    WeiToEtherPipe,
  ],
  declarations: [
    AuthHeaderComponent,
    HeaderComponent,
    MobileMenuComponent,
    FooterComponent,
    HeaderPublicComponent,
    QrCodeModalComponent,
    SpinnerComponent,
    KeepHtmlPipe,
    WeiToEtherPipe,
  ]
})
export class SharedModule { }
