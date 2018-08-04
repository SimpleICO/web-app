import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EthereumService } from '@service/ethereum.service';
import { WalletService } from '@service/wallet.service';
import { SharedService } from '@service/shared.service';
import { SettingsService } from '@service/settings.service';
import { SimpleCrowdsaleContract } from '@contract/simplecrowdsale.contract';
import { SimpleTokenContract } from '@contract/simpletoken.contract';
import { Network } from '@model/network.model';

declare var require: any

const ethers = require('ethers')

@Component({
  selector: 'app-fixed-supply',
  templateUrl: './fixed-supply.component.html',
  styleUrls: ['./fixed-supply.component.css']
})
export class FixedSupplyComponent implements OnInit {

  contractAddress: string

  contractType: string

  ethRaised: string = '0.0'

  crowdsale: SimpleCrowdsaleContract

  token: SimpleTokenContract

  txHistory: Array<any> = []

  txs: Array<string> = []

  constructor(
    public route: ActivatedRoute,
    public eth: EthereumService,
    public shared: SharedService,
    public settings: SettingsService,
    public wallet: WalletService) { }

  ngOnInit() {
    this.route.params.subscribe(({ contractAddress, contractType }) => {
      this.contractAddress = contractAddress
      this.contractType = contractType

      this.crowdsale = new SimpleCrowdsaleContract(this.wallet.getInstance())
      this.crowdsale.connect()
      this.crowdsale.setAddress(this.contractAddress)
      this.subscribe()

      this.token = new SimpleTokenContract(this.wallet.getInstance())
      this.token.connect()

      this.getCrowdsaleData()
      this.getTokenData()
    })
  }

  refresh() {
    this.crowdsale.getEthRaised()
    this.crowdsale.getAvailableTokens(this.token)
  }

  subscribe() {
    this.crowdsale.subscribeToEvents()
      .on('data', event => {
        this.crowdsale.getEthRaised()
        this.crowdsale.getAvailableTokens(this.token)

        this.getTransaction(event.transactionHash)
      }).on('error', error => {
        console.log(error)
      })
  }

  async getTransaction(hash: string) {
    if (this.txs.indexOf(hash) !== -1) {
      return false
    }

    this.txs.push(hash)

    try {
      const tx = await this.crowdsale.web3.eth.getTransaction(hash)

      this.txHistory.unshift({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: `ETH ${ethers.utils.formatEther(tx.value)}`
      })
    } catch (error) {
      console.log(error)
    }
  }

  async getCrowdsaleData() {
    this.crowdsale.getEthRaised()
    this.crowdsale.getBeneficiary()
    this.crowdsale.getPrice()

    this.crowdsale.web3.eth.getPastLogs({
      fromBlock: '0x0',
      address: this.crowdsale.address
    }).then(res => {
      res.forEach(rec => {
        this.getTransaction(rec.transactionHash)
      })
    }).catch(err => console.log)
  }

  async getTokenData() {
    const tokenAddress = await this.crowdsale.instance.methods.token().call()
    this.token.setAddress(tokenAddress)

    this.crowdsale.getAvailableTokens(this.token)

    this.token.getName()
    this.token.getSymbol()
  }
}
