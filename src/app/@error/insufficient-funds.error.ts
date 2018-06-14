export class InsufficientFundsError extends Error {

  static readonly MESSAGE: string = 'Insufficient funds'

  constructor(...params) {
    super(...params)

    Object.setPrototypeOf(this, InsufficientFundsError.prototype)

    this.name = this.constructor.name
    this.stack = (new Error()).stack
  }

}
