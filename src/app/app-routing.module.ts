import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent as HomeComponent } from './home/container.component';
// import { EthereumService } from '@service/ethereum.service';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',
    component: HomeComponent,
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
