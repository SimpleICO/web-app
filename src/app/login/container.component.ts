import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})

export class ContainerComponent {

  constructor(
    public router: Router
  ) { }

  onUnlockSuccess() {
    return this.router.navigate(['/catalog'])
  }

}
