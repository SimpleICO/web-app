import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { AppRoutingModule } from '../app-routing.module';
import { HeaderComponent } from './header/header.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
  ],
  exports: [
    AuthHeaderComponent,
    HeaderComponent,
    MobileMenuComponent,
    FooterComponent,
  ],
  declarations: [AuthHeaderComponent, HeaderComponent, MobileMenuComponent, FooterComponent]
})
export class SharedModule { }
