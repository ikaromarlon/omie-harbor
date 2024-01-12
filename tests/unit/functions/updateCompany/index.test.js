const sut = require('../../../../src/functions/updateCompany')

describe('updateCompany - factory', () => {
  it('Should setup dependencies and return a handler function', async () => {
    expect(sut.handler).toBeInstanceOf(Function)
    expect(sut.handler.constructor.name).toBe('AsyncFunction')
  })
})
