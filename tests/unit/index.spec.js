const fs = require('fs')
const { handler } = require('../../src')

let functions

const makeSut = () => {
  const eventMock = { headers: {}, pathParameters: {}, queryStringParameters: {}, body: '{}' }
  const contextMock = {}
  return {
    sut: handler,
    eventMock,
    contextMock
  }
}

describe('Main Handler - Functions Loader', () => {
  beforeAll(() => {
    functions = Object.values(fs.readdirSync('./src/functions')).filter(f => !['.DS_Store', 'desktop.ini'].includes(f))
    expect(functions.length).toBeGreaterThan(0)
  })

  it('Should find all functions', async () => {
    expect(functions).toEqual([
      'dataExport',
      'ingestionDispatcher',
      'ingestionPerformer'
    ])
  })

  it('Should load functions modules and return success response', async () => {
    const { sut, eventMock, contextMock } = makeSut()
    await Promise.all(functions.map(async fn => {
      jest.mock(`../../src/functions/${fn}`, () => async () => async () => Promise.resolve({ statusCode: 200, data: { success: true } }))
      contextMock.functionName = fn
      const result = await sut(eventMock, contextMock)
      expect(result).toBeTruthy()
      expect(result.statusCode).toBe(200)
      expect(result.headers).toBeTruthy()
      expect(result.headers['Content-Type']).toBeTruthy()
      expect(result.body).toBeTruthy()
      expect(result.body).toBe(JSON.stringify({ success: true }))
    }))
  })

  it('Should return error response if cannot find the called function', async () => {
    const { sut, eventMock, contextMock } = makeSut()
    contextMock.functionName = 'functionThatDoNotExist'
    const result = await sut(eventMock, contextMock)
    expect(result).toBeTruthy()
    expect(result.statusCode).toBe(500)
    expect(result.headers).toBeTruthy()
    expect(result.headers['Content-Type']).toBeTruthy()
    expect(result.body).toBeTruthy()
    expect(JSON.parse(result.body).message).toBe(`Cannot find module './functions/${contextMock.functionName}' from 'src/index.js'`)
  })

  it('Should return error response if any Error is thrown from any where', async () => {
    const { sut, eventMock, contextMock } = makeSut()
    contextMock.functionName = null
    const result = await sut(eventMock, contextMock)
    expect(result).toBeTruthy()
    expect(result.statusCode).toBe(500)
    expect(result.headers).toBeTruthy()
    expect(result.headers['Content-Type']).toBeTruthy()
    expect(result.body).toBeTruthy()
    expect(JSON.parse(result.body).message).toBeTruthy()
  })

  it('Should return undefied for warmUp event', async () => {
    const { sut, eventMock, contextMock } = makeSut()
    eventMock.warmUp = true
    const result = await sut(eventMock, contextMock)
    expect(result).toBeUndefined()
  })
})
