import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EthereumService } from '@service/ethereum.service';
import { WalletService } from '@service/wallet.service';
import { SharedService } from '@service/shared.service';
import { SimpleCrowdsaleContract } from '@contract/simplecrowdsale.contract';
import { SimpleTokenContract } from '@contract/simpletoken.contract';

declare var require: any

const ethers = require('ethers')

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})

export class ContainerComponent implements OnInit {

  crowdsaleAddress: string

  ethRaised: string = '0.0'

  crowdsale: SimpleCrowdsaleContract

  token: SimpleTokenContract

  txHistory: Array<any> = []

  txs: Array<string> = []

  constructor(
    public route: ActivatedRoute,
    public eth: EthereumService,
    public shared: SharedService,
    private zone: NgZone,
    public wallet: WalletService) {}

  ngOnInit() {
    this.route.params.subscribe(({ crowdsaleAddress }) => {
      this.crowdsaleAddress = crowdsaleAddress

      this.crowdsale = new SimpleCrowdsaleContract(this.wallet.getInstance())
      this.crowdsale.connect()
      this.crowdsale.setAddress(this.crowdsaleAddress)
      console.log(this.crowdsale)
      this.subscribe()

      this.token = new SimpleTokenContract(this.wallet.getInstance())
      this.token.connect()

      this.getCrowdsaleData()
      this.getTokenData()
    })
  }

  refresh(){
    this.crowdsale.getEthRaised()
    this.crowdsale.getAvailableTokens(this.token)
  }

  subscribe(){
    this.crowdsale.subscribeToEvents()
      .on('data', event => {
        console.log(event)
        this.crowdsale.getEthRaised()
        this.crowdsale.getAvailableTokens(this.token)

        this.getTransaction(event.transactionHash)
      }).on('error', error => {
        console.log(error)
      })
  }

  async getTransaction(hash: string){
    if (this.txs.indexOf(hash) != -1) {
      return false
    }

    this.txs.push(hash)

    try {
      let tx = await this.crowdsale.web3.eth.getTransaction(hash)

      console.log(tx)

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

  async getCrowdsaleData(){
    this.crowdsale.getEthRaised()
    this.crowdsale.getBeneficiary()
    this.crowdsale.getPrice()

    this.crowdsale.web3.eth.getPastLogs({
      fromBlock: '0x0',
      address: this.crowdsale.address
    }).then(res => {
      console.log(res)
      res.forEach(rec => {
        this.getTransaction(rec.transactionHash)
      })
    }).catch(err => console.log)
  }

  async getTokenData(){
    let tokenAddress = await this.crowdsale.instance.methods.token().call()
    this.token.setAddress(tokenAddress)

    this.crowdsale.getAvailableTokens(this.token)

    this.token.getName()
    this.token.getSymbol()
  }
}
