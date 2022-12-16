const fs = require('fs')
const { handler } = require('../../src')

let functions

const makeSut = () => {
  const mockEvent = { headers: {}, pathParameters: {}, queryStringParameters: {}, body: '{}' }
  const mockContext = {}
  return {
    sut: handler,
    mockEvent,
    mockContext
  }
}

describe('Main Handler - Functions Loader', () => {
  beforeAll(() => {
    functions = Object.values(fs.readdirSync('./src/v1')).filter(f => !['.DS_Store', 'desktop.ini'].includes(f))
    expect(functions.length).toBeGreaterThan(0)
  })

  it('Should find all functions', async () => {
    expect(functions).toEqual([
      'dataExport',
      'dataProcessing',
      'deleteDataByCompany',
      'ingestionPerformer',
      'omieWebhook',
      'registerOmieCompany'
    ])
  })

  it('Should load functions modules and return success response', async () => {
    const { sut, mockEvent, mockContext } = makeSut()
    await Promise.all(functions.map(async fn => {
      jest.mock(`../../src/v1/${fn}`, () => async () => async () => Promise.resolve({ statusCode: 200, data: { success: true } }))
      mockContext.functionName = fn
      const result = await sut(mockEvent, mockContext)
      expect(result).toBeTruthy()
      expect(result.statusCode).toBe(200)
      expect(result.headers).toBeTruthy()
      expect(result.headers['Content-Type']).toBeTruthy()
      expect(result.body).toBeTruthy()
      expect(result.body).toBe(JSON.stringify({ success: true }))
    }))
  })

  it('Should return error response if cannot find the called function', async () => {
    const { sut, mockEvent, mockContext } = makeSut()
    mockContext.functionName = 'functionThatDoNotExist'
    const result = await sut(mockEvent, mockContext)
    expect(result).toBeTruthy()
    expect(result.statusCode).toBe(500)
    expect(result.headers).toBeTruthy()
    expect(result.headers['Content-Type']).toBeTruthy()
    expect(result.body).toBeTruthy()
    expect(JSON.parse(result.body).message).toBe(`Cannot find module './v1/${mockContext.functionName}' from 'src/index.js'`)
  })

  it('Should return error response if any Error is thrown from any where', async () => {
    const { sut, mockEvent, mockContext } = makeSut()
    mockContext.functionName = null
    const result = await sut(mockEvent, mockContext)
    expect(result).toBeTruthy()
    expect(result.statusCode).toBe(500)
    expect(result.headers).toBeTruthy()
    expect(result.headers['Content-Type']).toBeTruthy()
    expect(result.body).toBeTruthy()
    expect(JSON.parse(result.body).message).toBeTruthy()
  })

  it('Should return undefied for warmUp event', async () => {
    const { sut, mockEvent, mockContext } = makeSut()
    mockEvent.warmUp = true
    const result = await sut(mockEvent, mockContext)
    expect(result).toBeUndefined()
  })
})
