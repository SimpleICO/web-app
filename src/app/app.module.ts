import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';

import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { NewWalletModule } from './new-wallet/new-wallet.module';
import { WalletService } from './@service/wallet.service';
import { TokenIndexModule } from './token-index/token-index.module';

import { UnlockRouteGuard } from '@guard/unlock-route-guard'


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
    TokenIndexModule,
  ],
  providers: [WalletService, UnlockRouteGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
