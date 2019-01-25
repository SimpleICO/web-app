import { Component, OnInit, Input } from '@angular/core';
import { MVT20Deployment } from '@factory/MVT20.deployment';

@Component({
  selector: 'app-mvt20',
  templateUrl: './mvt20.component.html',
  styleUrls: ['./mvt20.component.scss']
})
export class MVT20Component implements OnInit {

  @Input() address: string

  MVT20Deployment = MVT20Deployment._type

  constructor() { }

  ngOnInit() {
  }

}
