import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';

declare var require: any

const qrcode = require('qrcode-generator')
const clipboard = require('clipboard')

@Component({
  selector: 'fixed-supply-widget',
  templateUrl: './fixed-supply.component.html',
  styleUrls: ['./fixed-supply.component.css'],
  encapsulation: ViewEncapsulation.Native,
})
export class FixedSupplyComponent implements OnInit {

  QR: any

  @ViewChild('qrCode') set el(el: ElementRef) {
    this.QR = el
  }

  @Input() contract: any

  constructor() { }

  ngOnInit() {
    let qr = qrcode(0, 'H')
    qr.addData(this.contract.getAddress())
    qr.make()
    this.QR.nativeElement.innerHTML = qr.createImgTag(6, 2)
  }

}
