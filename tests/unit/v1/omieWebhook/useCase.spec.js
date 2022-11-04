const makeUseCase = require('../../../../src/v1/omieWebhook/useCase')

const makeSut = () => {
  const mockPayload = {
    payload: {
      topic: 'Entity.event',
      event: {},
      appKey: 'the-app-key'
    }
  }

  const mockFullbpoBfbService = {
    omieWebHook: jest.fn(async () => ({}))
  }

  const mockLogger = {
    info: jest.fn(() => null)
  }

  const useCase = makeUseCase({
    fullbpoBfbService: mockFullbpoBfbService,
    logger: mockLogger
  })

  return {
    sut: useCase,
    mockPayload,
    mockFullbpoBfbService,
    mockLogger
  }
}

describe('omieWebhook UseCase', () => {
  it('Should receive a ping event and return a pong response successfully', async () => {
    const { sut, mockPayload, mockLogger } = makeSut()
    mockPayload.payload = { ping: 'omie' }
    const result = await sut(mockPayload)
    expect(mockLogger.info).toHaveBeenCalledWith({ data: mockPayload.payload })
    expect(result).toEqual({
      ping: 'omie',
      pong: 'fullbpo'
    })
  })

  it('Should receive a real event and call fullbpoBfbService successfully', async () => {
    const { sut, mockPayload, mockFullbpoBfbService, mockLogger } = makeSut()
    const result = await sut(mockPayload)
    expect(mockLogger.info).toHaveBeenCalledWith({ data: mockPayload.payload })
    expect(mockFullbpoBfbService.omieWebHook).toHaveBeenCalledWith(mockPayload.payload)
    expect(result).toEqual({})
  })
})
