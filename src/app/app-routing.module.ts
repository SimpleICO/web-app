import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent as HomeComponent } from './home/container.component';
import { ContainerComponent as LoginComponent } from './login/container.component';
import { ContainerComponent as NewWalletComponent } from './new-wallet/container.component';
// import { EthereumService } from '@service/ethereum.service';

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
    // resolve: {
    //   contract: EthereumService
    // }
  },
  { path: 'new-wallet',
    component: NewWalletComponent,
    // resolve: {
    //   contract: EthereumService
    // }
  },
  { path: 'tokens/index',
    component: NewWalletComponent,
    // resolve: {
    //   contract: EthereumService
    // }
  },
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
