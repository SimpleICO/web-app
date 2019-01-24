import { Component, OnInit } from '@angular/core';
import { MVT20Component as PrivateMVT20Component } from '../../contract-show/mvt20/mvt20.component';

@Component({
  selector: 'app-mvt20',
  templateUrl: './mvt20.component.html',
  styleUrls: ['./mvt20.component.scss']
})
export class MVT20Component extends PrivateMVT20Component implements OnInit {

  ngOnInit() {
    this.settings.onNetworkChange.subscribe((networkChanged) => {
      super.ngOnInit()
    })
    super.ngOnInit()
  }

}
