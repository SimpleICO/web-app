import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeiToEtherPipe } from '../@pipe/wei-to-ether.pipe';
import { KeepHtmlPipe } from '../@pipe/keep-html.pipe';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WeiToEtherPipe,
    KeepHtmlPipe
  ],
  exports: [
    WeiToEtherPipe,
    KeepHtmlPipe,
    RouterModule
  ]
})
export class SharedModule { }
