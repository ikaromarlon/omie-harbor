const { Db } = require('mongodb')
const mongodb = require('../../../../src/repositories/adapters/mongodb')

const makeSut = () => ({ sut: mongodb })

describe('Respositories Mongodb Adapter', () => {
  it('Should create a Db intance if db is connected', async () => {
    const { sut } = makeSut()
    const db = await sut.connect(process.env.MONGODB_URI, 'test')
    expect(db).toBeInstanceOf(Db)
    await sut.disconnect()
  })

  it('Should return same dbs for cached client', async () => {
    const { sut } = makeSut()
    const db1 = await sut.connect(process.env.MONGODB_URI, 'test-1')
    const db2 = await sut.connect(process.env.MONGODB_URI, 'test-1')
    expect(db1).toBeInstanceOf(Db)
    expect(db2).toBeInstanceOf(Db)
    expect(db1).toEqual(db2)
    await sut.disconnect()
  })

  it('Should return different dbs for cached client', async () => {
    const { sut } = makeSut()
    const db1 = await sut.connect(process.env.MONGODB_URI, 'test-1')
    const db2 = await sut.connect(process.env.MONGODB_URI, 'test-2')
    expect(db1).toBeInstanceOf(Db)
    expect(db2).toBeInstanceOf(Db)
    expect(db1.namespace).toBe('test-1')
    expect(db2.namespace).toBe('test-2')
    await sut.disconnect()
  })

  it('Should disconect client and clean all caches', async () => {
    const { sut } = makeSut()
    await sut.connect(process.env.MONGODB_URI, 'test')
    const result = await sut.disconnect()
    expect(result).toBeNull()
  })
})
