import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ContainerComponent } from './container.component';
import { AppRoutingModule } from '../app-routing.module';
import { CatalogModule } from '../catalog/catalog.module';

@NgModule({
  imports: [
    AppRoutingModule,
    SharedModule,
    CatalogModule,
  ],
  declarations: [ContainerComponent]
})

export class HomeModule { }
