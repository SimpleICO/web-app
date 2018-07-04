import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent as HomeComponent } from './home/container.component';
import { ContainerComponent as LoginComponent } from './login/container.component';
import { ContainerComponent as NewWalletComponent } from './new-wallet/container.component';
import { ContainerComponent as TokenNewComponent } from './token-new/container.component';
import { ContainerComponent as AcceptTermsComponent } from './accept-terms/container.component';
import { ContainerComponent as CrowdsaleShowComponent } from './crowdsale-show/container.component';
import { ContainerComponent as CrowdsaleShowPublicComponent } from './crowdsale-show-public/container.component';
import { ContainerComponent as CrowdsaleIndexComponent } from './crowdsale-index/container.component';
import { ContainerComponent as CrowdsaleIndexPublicComponent } from './crowdsale-index-public/container.component';
import { ContainerComponent as CrowdsaleByAddressComponent } from './crowdsale-by-address/container.component';
import { ContainerComponent as CrowdsaleCreateComponent } from './crowdsale-create/container.component';
import { ContainerComponent as CrowdsaleDeployComponent } from './crowdsale-deploy/container.component';
import { WalletService } from '@service/wallet.service';
import { UnlockRouteGuard } from '@guard/unlock-route-guard'
import { AcceptTermsRouteGuard } from '@guard/accept-terms-route-guard'

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',
    component: HomeComponent,
    canActivate: [AcceptTermsRouteGuard],
  },
  { path: 'login',
    component: LoginComponent,
    canActivate: [AcceptTermsRouteGuard],
  },
  { path: 'new-wallet',
    component: NewWalletComponent,
    canActivate: [AcceptTermsRouteGuard],
  },
  { path: 'accept-terms',
    component: AcceptTermsComponent,
  },
  { path: 'token/new',
    component: TokenNewComponent,
    canActivate: [UnlockRouteGuard, AcceptTermsRouteGuard],
  },
  { path: 'crowdsale/:crowdsaleAddress/show',
    component: CrowdsaleShowComponent,
    canActivate: [UnlockRouteGuard, AcceptTermsRouteGuard],
  },
  { path: 'public/crowdsale/:crowdsaleAddress/show',
    component: CrowdsaleShowPublicComponent,
    canActivate: [AcceptTermsRouteGuard],
  },
  { path: 'crowdsale/index',
    component: CrowdsaleIndexComponent,
    canActivate: [UnlockRouteGuard, AcceptTermsRouteGuard],
  },
  { path: 'public/crowdsale/index',
    component: CrowdsaleIndexPublicComponent,
    canActivate: [AcceptTermsRouteGuard],
  },
  { path: 'crowdsale/:address/address',
    component: CrowdsaleByAddressComponent,
    canActivate: [UnlockRouteGuard, AcceptTermsRouteGuard],
  },
  { path: 'crowdsale/:crowdsaleType/create',
    component: CrowdsaleCreateComponent,
    canActivate: [UnlockRouteGuard, AcceptTermsRouteGuard],
  },
  { path: 'crowdsale/:crowdsaleType/deploy',
    component: CrowdsaleDeployComponent,
    canActivate: [UnlockRouteGuard, AcceptTermsRouteGuard],
  },
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
