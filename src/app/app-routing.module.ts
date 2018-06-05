import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent as HomeComponent } from './home/container.component';
import { ContainerComponent as LoginComponent } from './login/container.component';
import { ContainerComponent as NewWalletComponent } from './new-wallet/container.component';
import { ContainerComponent as TokenIndexComponent } from './token-index/container.component';
import { WalletService } from '@service/wallet.service';
import { UnlockRouteGuard } from '@guard/unlock-route-guard'

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',
    component: HomeComponent,
    // resolve: {
    //   contract: EthereumService
    // }
  },
  { path: 'login',
    component: LoginComponent,
  },
  { path: 'new-wallet',
    component: NewWalletComponent,
  },
  { path: 'token/index',
    component: TokenIndexComponent,
    canActivate: [UnlockRouteGuard],
  },
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
