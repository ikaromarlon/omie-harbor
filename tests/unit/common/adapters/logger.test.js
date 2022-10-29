const logger = require('../../../../src/common/adapters/logger')

const makeSut = () => {
  process.env.UUID = '6e3a00e9-b85d-4df4-8992-7b7e262dad69'
  return {
    sut: logger
  }
}

describe('Logger Adapter', () => {
  describe('info method', () => {
    it('Should execute successfully', () => {
      const { sut } = makeSut()
      const infoSpy = jest.spyOn(console, 'info')
      const result = sut.info({ title: 'Log Title', message: 'Log message', data: {} })
      expect(infoSpy).toHaveBeenCalled()
      expect(result).toBe(undefined)
    })
  })

  describe('error method', () => {
    it('Should execute successfully', () => {
      const { sut } = makeSut()
      const errorSpy = jest.spyOn(console, 'error')
      const result = sut.error({ title: 'Log Title', message: 'Log message', data: {} })
      expect(result).toBe(undefined)
      expect(errorSpy).toHaveBeenCalled()
    })
  })
})
