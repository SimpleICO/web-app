import { Component, OnInit } from '@angular/core';
import { SharedService } from '@service/shared.service';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css']
})
export class MobileMenuComponent implements OnInit {

  display: boolean = false

  constructor(
    public shared: SharedService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.shared.onMobileMenu.subscribe(data => {
      this.display = data.display
    })
  }

}
