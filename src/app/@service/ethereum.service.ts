import { Injectable } from '@angular/core';
import { environment as env } from '@environment/environment';
import { WalletService } from '@service/wallet.service';
import * as SimpleTokenABI from '@abi/simpletoken.abi.json';
import * as SimpleCrowdsaleABI from '@abi/simplecrowdsale.abi.json';

declare var require: any

@Injectable()
export class EthereumService {

  constructor(private wallet: WalletService) {}

}
