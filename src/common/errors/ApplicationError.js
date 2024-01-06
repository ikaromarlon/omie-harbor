module.exports = class ApplicationError extends Error {
  constructor (message) {
    super(message)
    if (this.constructor === ApplicationError) {
      throw new Error("Can't be instantiated")
    }
  }
}
