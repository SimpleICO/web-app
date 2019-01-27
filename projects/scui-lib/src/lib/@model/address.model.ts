const Web3 = require('web3')

export class Address {

  address = '0x0'

  constructor(address: string) {
    if (this.isValid(address)) {
      this.address = address
    }
  }

  toString() {
    return this.address
  }

  isValid(_address?: string) {
    const address = _address ? _address : this.toString()
    return address !== '0x0000000000000000000000000000000000000000' &&
      Web3.utils.isAddress(address)
  }

  toUpperCase() {
    return this.address.toUpperCase()
  }

  toChecksumAddress(): string {
    return this.isValid() ? Web3.utils.toChecksumAddress(this.address) : ''
  }
}
