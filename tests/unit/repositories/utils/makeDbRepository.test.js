const mongodb = require('../../../../src/repositories/utils/mongodb')
const makeDbRepository = require('../../../../src/repositories/utils/makeDbRepository')

let db
const dbName = 'test'
const collectionName = 'test'

const makeSut = () => {
  const insertMocksForFindMethods = async () => db.collection(collectionName).insertMany([{ _id: '000001', name: 'test_1' }, { _id: '000002', name: 'test_2' }, { _id: '000003', name: 'test_3' }])

  return {
    sut: makeDbRepository(collectionName, db),
    insertMocksForFindMethods
  }
}

describe('SetupRepository Util', () => {
  beforeAll(async () => (db = await mongodb.connect(process.env.MONGODB_URI, dbName)))

  afterEach(async () => db.collection(collectionName).deleteMany({}))

  afterAll(async () => mongodb.disconnect())

  describe('Find method', () => {
    it('Should call find with an empty filter', async () => {
      const { sut, insertMocksForFindMethods } = makeSut()
      await insertMocksForFindMethods()
      const result = await sut.find({})
      expect(result).toBeTruthy()
      expect(result.length).toBeGreaterThanOrEqual(3)
      expect(result[0].name).toBe('test_1')
      expect(result[1].name).toBe('test_2')
      expect(result[2].name).toBe('test_3')
    })
    it('Should call find with a simple filter', async () => {
      const { sut, insertMocksForFindMethods } = makeSut()
      await insertMocksForFindMethods()
      const filterMock = { _id: '000002' }
      const result = await sut.find(filterMock)
      expect(result).toBeTruthy()
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('test_2')
    })
    it('Should call find with a complex filter: field with a list of single value (do not use $in)', async () => {
      const { sut, insertMocksForFindMethods } = makeSut()
      await insertMocksForFindMethods()
      const filterMock = { _id: ['000002'] }
      const result = await sut.find(filterMock)
      expect(result).toBeTruthy()
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('test_2')
    })
    it('Should call find with a complex filter: field with a list of values (use $in)', async () => {
      const { sut, insertMocksForFindMethods } = makeSut()
      await insertMocksForFindMethods()
      const filterMock = { _id: ['000001', '000003'] }
      const result = await sut.find(filterMock)
      expect(result).toBeTruthy()
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('test_1')
      expect(result[1].name).toBe('test_3')
    })
  })

  describe('FindOne method', () => {
    it('Should call findOne and return data of previous inserted records', async () => {
      const { sut, insertMocksForFindMethods } = makeSut()
      await insertMocksForFindMethods()
      const result = await sut.findOne({ _id: '000001' })
      expect(result).toBeTruthy()
      expect(result._id).toBe('000001')
      expect(result.name).toBe('test_1')
    })
  })

  describe('CreateOrUpdateOneRaw method', () => {
    it('Should call createOrUpdateOneRaw and stores a new record with _id and timestamps', async () => {
      const { sut } = makeSut()
      const data = { _id: 'my_id', name: 'Any Name' }
      const result = await sut.createOrUpdateOneRaw({ anyFiled: 'any_value' }, data)
      expect(result).toBeTruthy()
      expect(result._id).toBe('my_id')
      expect(result.name).toBe('Any Name')
    })
    it('Should call createOrUpdateOneRaw and update a record', async () => {
      const { sut } = makeSut()
      const data1 = { _id: 'my_id', name: 'Any Name' }
      const result1 = await sut.createOrUpdateOneRaw({ anyFiled: 'any_value' }, data1)
      const data2 = { name: 'Updated Name' }
      const result2 = await sut.createOrUpdateOneRaw({ _id: result1._id }, data2)
      expect(result2).toBeTruthy()
      expect(result2._id).toBe(result1._id)
      expect(result2.name).toBe('Updated Name')
    })
  })

  describe('CreateOrUpdateOne method', () => {
    it('Should call createOrUpdateOne without filter and stores a new record with _id and timestamps', async () => {
      const { sut } = makeSut()
      const data = { name: 'Any Name' }
      const result = await sut.createOrUpdateOne(null, data)
      expect(result).toBeTruthy()
      expect(result._id).toBeTruthy()
      expect(result.name).toBe('Any Name')
      expect(result.createdAt).toBeTruthy()
      expect(result.updatedAt).toBeTruthy()
      expect(result.createdAt).toEqual(result.updatedAt)
    })

    it('Should call createOrUpdateOne with filter and stores a new record with _id and timestamps', async () => {
      const { sut } = makeSut()
      const data = { name: 'Any Name' }
      const result = await sut.createOrUpdateOne({ anyFiled: 'any_value' }, data)
      expect(result).toBeTruthy()
      expect(result._id).toBeTruthy()
      expect(result.name).toBe('Any Name')
      expect(result.createdAt).toBeTruthy()
      expect(result.updatedAt).toBeTruthy()
      expect(result.createdAt).toEqual(result.updatedAt)
    })
    it('Should call createOrUpdateOne and update a record', async () => {
      const { sut } = makeSut()
      const data1 = { name: 'Any Name' }
      const result1 = await sut.createOrUpdateOne({ anyFiled: 'any_value' }, data1)
      const data2 = { name: 'Updated Name' }
      const result2 = await sut.createOrUpdateOne({ _id: result1._id }, data2)
      expect(result2).toBeTruthy()
      expect(result2._id).toBe(result1._id)
      expect(result2.name).toBe('Updated Name')
      expect(result2.createdAt === result2.updatedAt).toBe(false)
    })
  })

  describe('CreateOrUpdateMany method', () => {
    it('Should call createOrUpdateMany and return the results', async () => {
      const { sut } = makeSut()
      const fieldsToBuildFilter = ['companyId', 'customerCpf']
      const batch = [
        { companyId: '000001', customerCpf: '00000000000', customerName: 'Jose da Silva', customerAge: 18 }, // should create
        { companyId: '000001', customerCpf: '11111111111', customerName: 'Maria das Dores', customerAge: 21 }, // should create
        { companyId: '000002', customerCpf: '00000000000', customerName: 'Jose da Silva', customerAge: 18 }, // should create
        { companyId: '000001', customerCpf: '00000000000', customerName: 'Jose da Silva e Dores', customerAge: 24 } // should update
      ]
      const result = await sut.createOrUpdateMany(fieldsToBuildFilter, batch)
      expect(result).toBeTruthy()
      expect(Object.keys(result)).toHaveLength(3)
      expect(result.written).toBe(4)
      expect(result.created).toBe(3)
      expect(result.updated).toBe(1)
    })
    it('Should call createOrUpdateMany with empty batch', async () => {
      const { sut } = makeSut()
      const fieldsToBuildFilter = ['companyId', 'customerCpf']
      const batch = []
      const result = await sut.createOrUpdateMany(fieldsToBuildFilter, batch)
      expect(result).toBeTruthy()
      expect(Object.keys(result)).toHaveLength(3)
      expect(result.written).toBe(0)
      expect(result.created).toBe(0)
      expect(result.updated).toBe(0)
    })
  })

  describe('DeleteOldAndCreateNew method', () => {
    it('Should call deleteOldAndCreateNew and return the results', async () => {
      const { sut } = makeSut()
      const fieldsToBuildFilter = ['companyId', 'customerCpf']
      const batch = [
        { companyId: '000001', customerCpf: '00000000000', customerName: 'Jose da Silva', customerAge: 18 } // should create
      ]
      await sut.deleteOldAndCreateNew(fieldsToBuildFilter, batch)

      batch.push(...[
        { companyId: '000001', customerCpf: '11111111111', customerName: 'Maria das Dores', customerAge: 21 }, // should create
        { companyId: '000002', customerCpf: '00000000000', customerName: 'Jose da Silva', customerAge: 18 }, // should create
        { companyId: '000001', customerCpf: '00000000000', customerName: 'Jose da Silva e Dores', customerAge: 24 } // should delete and create
      ])
      const result = await sut.deleteOldAndCreateNew(fieldsToBuildFilter, batch)

      expect(result).toBeTruthy()
      expect(Object.keys(result)).toHaveLength(2)
      expect(result.deleted).toBe(1)
      expect(result.created).toBe(4)
    })
    it('Should call deleteOldAndCreateNew with empty batch', async () => {
      const { sut } = makeSut()
      const fieldsToBuildFilter = ['companyId', 'customerCpf']
      const batch = []
      const result = await sut.deleteOldAndCreateNew(fieldsToBuildFilter, batch)
      expect(result).toBeTruthy()
      expect(Object.keys(result)).toHaveLength(2)
      expect(result.deleted).toBe(0)
      expect(result.created).toBe(0)
    })
  })
})
