import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent as HomeComponent } from './home/container.component';
import { ContainerComponent as LoginComponent } from './login/container.component';
import { ContainerComponent as NewWalletComponent } from './new-wallet/container.component';
import { ContainerComponent as WalletComponent } from './wallet/container.component';
import { ContainerComponent as AcceptTermsComponent } from './accept-terms/container.component';
import { ContainerComponent as ContractShowComponent } from './contract-show/container.component';
import { ContainerComponent as ContractShowPublicComponent } from './contract-show-public/container.component';
import { ContainerComponent as CrowdsaleIndexComponent } from './crowdsale-index/container.component';
import { ContainerComponent as CrowdsaleIndexPublicComponent } from './crowdsale-index-public/container.component';
import { ContainerComponent as ContractCreateComponent } from './contract-create/container.component';
import { ContainerComponent as ContractDeployComponent } from './contract-deploy/container.component';
import { ContainerComponent as CatalogComponent } from './catalog/container.component';
import { ContainerComponent as SettingsComponent } from './settings/container.component';
import { UnlockRouteGuard } from '@guard/unlock-route-guard';
import { AcceptTermsRouteGuard } from '@guard/accept-terms-route-guard';

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
  { path: 'wallet',
    component: WalletComponent,
    canActivate: [UnlockRouteGuard, AcceptTermsRouteGuard],
  },
  { path: 'catalog',
    component: CatalogComponent,
    canActivate: [UnlockRouteGuard, AcceptTermsRouteGuard],
  },
  { path: 'contract/:contractAddress/show/:contractType',
    component: ContractShowComponent,
    canActivate: [UnlockRouteGuard, AcceptTermsRouteGuard],
  },
  { path: 'public/contract/:contractAddress/show/:contractType',
    component: ContractShowPublicComponent,
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
  { path: 'contract/:contractType/create',
    component: ContractCreateComponent,
    canActivate: [UnlockRouteGuard, AcceptTermsRouteGuard],
  },
  { path: 'contract/:contractType/deploy',
    component: ContractDeployComponent,
    canActivate: [UnlockRouteGuard, AcceptTermsRouteGuard],
  },
  { path: 'settings',
    component: SettingsComponent,
    canActivate: [UnlockRouteGuard, AcceptTermsRouteGuard],
  },
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
