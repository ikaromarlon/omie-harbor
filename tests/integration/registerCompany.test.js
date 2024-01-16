const { matchers } = require('jest-json-schema')
const { handler } = require('../../src/functions/registerCompany')
const MongodbHelper = require('../../src/infra/db/mongodb')
const config = require('../../src/config')
const companySchema = require('../../src/shared/shemas/company.schema.json')

expect.extend(matchers)

describe('registerCompany - integration tests', () => {
  const appKey = process.env.TEST_OMIE_APP_KEY
  const appSecret = process.env.TEST_OMIE_APP_SECRET
  let db

  beforeAll(async () => {
    db = await MongodbHelper.connect(config.db.mongodb)
  })

  beforeEach(async () => {
    await db.dropDatabase()
  })

  afterAll(async () => {
    await MongodbHelper.disconnect()
  })

  it('Should return statusCode 422 due to invalid payload', async () => {
    const event = {
      body: `{"appKey":"${appKey}"}`
    }
    const result = await handler(event)
    expect(result.statusCode).toBe(422)
    expect(JSON.parse(result.body)).toEqual({ message: '"appSecret" is required' })
  })

  it('Should return statusCode 403 for invalid credentials', async () => {
    const event = {
      body: '{"appKey":"any_app_key","appSecret":"any_app_secret"}'
    }
    const result = await handler(event)
    expect(result.statusCode).toBe(403)
    expect(JSON.parse(result.body)).toEqual({ message: 'Omie Error: A chave de acesso está inválida ou o aplicativo está suspenso.' })
  })

  it('Should return statusCode 409 for an existing company with same credentials', async () => {
    const event = {
      body: `{"appKey":"${appKey}","appSecret":"${appSecret}"}`
    }

    await handler(event)

    const result = await handler(event)
    expect(result.statusCode).toBe(409)
    expect(JSON.parse(result.body)).toEqual({ message: 'Company with provided credentials already exists.' })
  })

  it('Should register a company sucessfully and return statusCode 200', async () => {
    const event = {
      body: `{"appKey":"${appKey}","appSecret":"${appSecret}"}`
    }
    const result = await handler(event)
    expect(result.statusCode).toBe(200)
    expect(JSON.parse(result.body)).toMatchSchema(companySchema)
  })
})
