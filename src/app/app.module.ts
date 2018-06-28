import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';

import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { NewWalletModule } from './new-wallet/new-wallet.module';
import { WalletService } from './@service/wallet.service';
import { TokenNewModule } from './token-new/token-new.module';
import { AcceptTermsModule } from './accept-terms/accept-terms.module';

import { UnlockRouteGuard } from '@guard/unlock-route-guard';
import { AcceptTermsRouteGuard } from '@guard/accept-terms-route-guard'
import { CookieService } from './@service/cookie.service';
import { SharedService } from './@service/shared.service';
import { EthereumService } from './@service/ethereum.service';
import { CrowdsaleShowModule } from './crowdsale-show/crowdsale-show.module';
import { CrowdsaleIndexModule } from './crowdsale-index/crowdsale-index.module';
import { CrowdsaleCreateModule } from './crowdsale-create/crowdsale-create.module';
import { CrowdsaleDeployModule } from './crowdsale-deploy/crowdsale-deploy.module';
import { CrowdsaleByAddressModule } from './crowdsale-by-address/crowdsale-by-address.module';
import { CrowdsaleIndexPublicModule } from './crowdsale-index-public/crowdsale-index-public.module';
import { CrowdsaleShowPublicModule } from './crowdsale-show-public/crowdsale-show-public.module';
import { DeploymentStateService } from './@service/deployment-state.service';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    LoginModule,
    NewWalletModule,
    AcceptTermsModule,
    TokenNewModule,
    HttpClientModule,
    CrowdsaleShowModule,
    CrowdsaleIndexModule,
    CrowdsaleCreateModule,
    CrowdsaleDeployModule,
    SharedModule,
    CrowdsaleByAddressModule,
    CrowdsaleIndexPublicModule,
    CrowdsaleShowPublicModule
  ],
  providers: [WalletService, UnlockRouteGuard, CookieService, AcceptTermsRouteGuard, SharedService, EthereumService, DeploymentStateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
