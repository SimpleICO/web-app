import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AcceptTermsModule } from './accept-terms/accept-terms.module';
import { ErrorTrackingService } from '@service/error-tracking.service';

import { SharedModule } from '@shared/shared.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { NewWalletModule } from './new-wallet/new-wallet.module';
import { CrowdsaleShowModule } from './crowdsale-show/crowdsale-show.module';
import { CrowdsaleIndexModule } from './crowdsale-index/crowdsale-index.module';
import { ContractCreateModule } from './contract-create/contract-create.module';
import { ContractDeployModule } from './contract-deploy/contract-deploy.module';
import { CrowdsaleByAddressModule } from './crowdsale-by-address/crowdsale-by-address.module';
import { CrowdsaleIndexPublicModule } from './crowdsale-index-public/crowdsale-index-public.module';
import { CrowdsaleShowPublicModule } from './crowdsale-show-public/crowdsale-show-public.module';
import { CatalogModule } from './catalog/catalog.module';
import { WalletModule } from './wallet/wallet.module';
import { SettingsModule } from './settings/settings.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HomeModule,
    LoginModule,
    NewWalletModule,
    AcceptTermsModule,
    CrowdsaleShowModule,
    CrowdsaleIndexModule,
    ContractCreateModule,
    ContractDeployModule,
    SharedModule,
    CrowdsaleByAddressModule,
    CrowdsaleIndexPublicModule,
    CrowdsaleShowPublicModule,
    CatalogModule,
    WalletModule,
    SettingsModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorTrackingService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
