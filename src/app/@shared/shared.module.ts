import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { AppRoutingModule } from '../app-routing.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
  ],
  exports: [
    AuthHeaderComponent,
    HeaderComponent
  ],
  declarations: [AuthHeaderComponent, HeaderComponent]
})
export class SharedModule { }
