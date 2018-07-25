import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AcceptTermsModule } from './accept-terms/accept-terms.module';
import { ErrorTrackingService } from '@service/error-tracking.service';

import { SharedModule } from '@shared/shared.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { NewWalletModule } from './new-wallet/new-wallet.module';
import { ContractShowModule } from './contract-show/contract-show.module';
import { ContractIndexModule } from './contract-index/contract-index.module';
import { ContractCreateModule } from './contract-create/contract-create.module';
import { ContractDeployModule } from './contract-deploy/contract-deploy.module';
import { CrowdsaleByAddressModule } from './crowdsale-by-address/crowdsale-by-address.module';
import { ContractIndexPublicModule } from './contract-index-public/contract-index-public.module';
import { ContractShowPublicModule } from './contract-show-public/contract-show-public.module';
import { CatalogModule } from './catalog/catalog.module';
import { WalletModule } from './wallet/wallet.module';
import { SettingsModule } from './settings/settings.module';
import { ScuiLandingPageModule } from './scui-landing-page/scui-landing-page.module';
import { HackatonModule } from './hackaton/hackaton.module';

import { SCUILibModule, Network } from 'scui-lib';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HomeModule,
    LoginModule,
    NewWalletModule,
    AcceptTermsModule,
    ContractShowModule,
    ContractIndexModule,
    ContractCreateModule,
    ContractDeployModule,
    SharedModule,
    CrowdsaleByAddressModule,
    ContractIndexPublicModule,
    ContractShowPublicModule,
    CatalogModule,
    WalletModule,
    SettingsModule,
    ScuiLandingPageModule,
    HackatonModule
    SCUILibModule.forRoot({
      network: Network.testnet
    }),
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorTrackingService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
