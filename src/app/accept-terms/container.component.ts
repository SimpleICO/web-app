import { Component, OnInit } from '@angular/core';
import { CookieService } from '@service/cookie.service';
import { WalletService } from '@service/wallet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})

export class ContainerComponent implements OnInit {

  constructor(
    public cookie: CookieService,
    public wallet: WalletService,
    private router: Router) { }

  ngOnInit() {
  }

  acceptTerms() {
    this.cookie.acceptTerms()

    this.router.navigateByUrl('/home')
  }

  declineTerms() {
    this.cookie.declineTerms()

    this.router.navigateByUrl('/home')
  }
}
