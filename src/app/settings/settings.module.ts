import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ContainerComponent } from './container.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule
  ],
  declarations: [
    ContainerComponent,
  ]
})
export class SettingsModule { }
