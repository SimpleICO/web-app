import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeiToEtherPipe } from '../@pipe/wei-to-ether.pipe';
import { KeepHtmlPipe } from '../@pipe/keep-html.pipe';

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
    KeepHtmlPipe
  ]
})
export class SharedModule { }
