import { NgModule } from '@angular/core';
import { ContainerComponent } from './container.component';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { LoginModule as SCUILoginModule } from '@decentralizedtechnologies/scui-lib';

@NgModule({
  imports: [
    AppRoutingModule,
    FormsModule,
    SharedModule,
    SCUILoginModule
  ],
  declarations: [ContainerComponent]
})
export class LoginModule { }
