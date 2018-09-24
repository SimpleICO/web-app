import { Component, OnInit, Input } from '@angular/core';
import { WalletService } from 'scui-lib';
import { SettingsService } from '@service/settings.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  @Input() network: string

  constructor(
    private wallet: WalletService,
    public settings: SettingsService) {

    this.network = wallet.network
  }

  ngOnInit() {
  }

  selectNetwork() {
    this.settings.setNetwork(this.network)
  }
}
