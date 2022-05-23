const makeLogger = require('../../../src/utils/logger')

const makeSut = () => {
  process.env.UUID = '6e3a00e9-b85d-4df4-8992-7b7e262dad69'
  return {
    sut: makeLogger()
  }
}

describe('Logger Adapter', () => {
  describe('info method', () => {
    it('Should call log.info successfully', () => {
      const { sut } = makeSut()
      const infoSpy = jest.spyOn(console, 'info')
      sut.info({ title: 'Log Title', message: 'Log message', data: {} })
      expect(infoSpy).toHaveBeenCalled()
    })

    it('Should execute successfully', () => {
      const { sut } = makeSut()
      const result = sut.info({ title: 'Log Title', message: 'Log message', data: {} })
      expect(result).toBe(undefined)
    })
  })

  describe('error method', () => {
    it('Should call log.error successfully', () => {
      const { sut } = makeSut()
      const errorSpy = jest.spyOn(console, 'error')
      sut.error({ title: 'Log Title', message: 'Log message', data: {} })
      expect(errorSpy).toHaveBeenCalled()
    })

    it('Should execute successfully', () => {
      const { sut } = makeSut()
      const result = sut.error({ title: 'Log Title', message: 'Log message', data: {} })
      expect(result).toBe(undefined)
    })
  })
})
