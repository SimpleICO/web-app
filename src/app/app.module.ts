import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';

import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { NewWalletModule } from './new-wallet/new-wallet.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    LoginModule,
    NewWalletModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
