import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { WalletService } from './@service/wallet.service';
import { AcceptTermsModule } from './accept-terms/accept-terms.module';
import { CookieService } from './@service/cookie.service';
import { SharedService } from './@service/shared.service';
import { EthereumService } from './@service/ethereum.service';
import { UnlockRouteGuard } from '@guard/unlock-route-guard';
import { AcceptTermsRouteGuard } from '@guard/accept-terms-route-guard';

import { SharedModule } from '@shared/shared.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { NewWalletModule } from './new-wallet/new-wallet.module';
import { CrowdsaleShowModule } from './crowdsale-show/crowdsale-show.module';
import { CrowdsaleIndexModule } from './crowdsale-index/crowdsale-index.module';
import { CrowdsaleCreateModule } from './crowdsale-create/crowdsale-create.module';
import { CrowdsaleDeployModule } from './crowdsale-deploy/crowdsale-deploy.module';
import { CrowdsaleByAddressModule } from './crowdsale-by-address/crowdsale-by-address.module';
import { CrowdsaleIndexPublicModule } from './crowdsale-index-public/crowdsale-index-public.module';
import { CrowdsaleShowPublicModule } from './crowdsale-show-public/crowdsale-show-public.module';
import { CatalogModule } from './catalog/catalog.module';
import { WalletModule } from './wallet/wallet.module';


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
    CrowdsaleCreateModule,
    CrowdsaleDeployModule,
    SharedModule,
    CrowdsaleByAddressModule,
    CrowdsaleIndexPublicModule,
    CrowdsaleShowPublicModule,
    CatalogModule,
    WalletModule,
  ],
  providers: [
    WalletService,
    UnlockRouteGuard,
    CookieService,
    AcceptTermsRouteGuard,
    SharedService,
    EthereumService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
