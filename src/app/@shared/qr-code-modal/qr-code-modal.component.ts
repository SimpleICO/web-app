import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from '@service/shared.service';

declare var require: any
declare var window: any

const qrcode = require('qrcode-generator')
const clipboard = require('clipboard')

@Component({
  selector: 'app-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.css']
})

export class QrCodeModalComponent implements OnInit {

  QR: any

  @ViewChild('qrCode') set el(el: ElementRef) {
    this.QR = el
  }

  display: boolean = false

  onQrCode: boolean = false

  @Input() model: any

  constructor(
    public shared: SharedService) {

    shared.onCrowdsaleShowModal.subscribe(data => {

      this.display = data.display
      this.onQrCode = data.onQrCode

      setTimeout(() => {
        let qr = qrcode(0, 'H')
        qr.addData(this.model.getAddress())
        qr.make()
        this.QR.nativeElement.innerHTML = qr.createImgTag(6, 2)

        let self = this

        new clipboard(`.copy-address`, {
          text: function(trigger) {

            self.shared.updateCopyTrigger(trigger)

            return self.model.getAddress()
          }
        })
      }, 100)

    })

  }

  ngOnInit() {

  }

  reset(){
    this.display = false
    this.onQrCode = false
  }

}
