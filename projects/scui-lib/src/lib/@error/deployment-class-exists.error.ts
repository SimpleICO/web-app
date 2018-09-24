export class DeploymentClassExistsError extends Error {

  static readonly MESSAGE: string = 'Deployment class exists'

  constructor(...params) {
    super(...params)

    Object.setPrototypeOf(this, DeploymentClassExistsError.prototype)

    this.name = this.constructor.name
    this.stack = (new Error()).stack
  }

}
