import { Component, OnInit } from '@angular/core';
import { SharedService } from '@service/shared.service';

declare var document: any

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
    document.querySelectorAll('#mobile-menu a').forEach(anchor => {
      anchor.onclick = (e) => {
        this.shared.toggleMobileMenu()
      }
    })

    this.shared.onMobileMenu.subscribe(data => {
      this.display = data.display
    })
  }

}
