import { Pipe, PipeTransform } from '@angular/core';

const ethers = require('ethers')

@Pipe({ name: 'weiToEther', pure: false })

export class WeiToEtherPipe implements PipeTransform {

  constructor() { }

  transform(wei) {
    try {
      const result = ethers.utils.formatEther(wei)
      return result
    } catch (error) {
      return 0
    }
  }
}
