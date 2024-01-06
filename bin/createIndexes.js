const mongodb = require('../src/repositories/utils/mongodb')

module.exports = async ({ config }) => {
  try {
    console.log('Creating MongoDB Indexes:')
    console.log(config.bin.layout.dashRuler)
    const db = await mongodb.connect(config.db.mongodb.uri, config.db.mongodb.dbName)

    console.log('users...')
    await db.collection('users').createIndexes([
      { name: 'email', key: { email: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('companies...')
    await db.collection('companies').createIndexes([
      { name: 'appkey_appSecret', key: { 'credentials.appKey': 1, 'credentials.appSecret': 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('categories...')
    await db.collection('categories').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('departments...')
    await db.collection('departments').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('projects...')
    await db.collection('projects').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('customers...')
    await db.collection('customers').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('checking-accounts...')
    await db.collection('checking-accounts').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('products-services...')
    await db.collection('products-services').createIndexes([
      { name: 'companyId_externalId_type', key: { companyId: 1, externalId: 1, type: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('contracts...')
    await db.collection('contracts').createIndexes([
      { name: 'companyId_externalId_departmentId_productServiceId_municipalServiceCode', key: { companyId: 1, externalId: 1, departmentId: 1, productServiceId: 1, municipalServiceCode: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('orders...')
    await db.collection('orders').createIndexes([
      { name: 'companyId_externalId_type_departmentId_productServiceId_cfop_municipalServiceCode', key: { companyId: 1, externalId: 1, type: 1, departmentId: 1, productServiceId: 1, cfop: 1, municipalServiceCode: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('billing...')
    await db.collection('billing').createIndexes([
      { name: 'companyId_externalId_type_departmentId_productServiceId_cfop_municipalServiceCode', key: { companyId: 1, externalId: 1, type: 1, departmentId: 1, productServiceId: 1, cfop: 1, municipalServiceCode: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('accounts-payable...')
    await db.collection('accounts-payable').createIndexes([
      { name: 'companyId_titleId_externalId_departmentId_categoryId', key: { companyId: 1, titleId: 1, externalId: 1, departmentId: 1, categoryId: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('accounts-receivable...')
    await db.collection('accounts-receivable').createIndexes([
      { name: 'companyId_titleId_externalId_departmentId_categoryId', key: { companyId: 1, titleId: 1, externalId: 1, departmentId: 1, categoryId: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('financial-movements...')
    await db.collection('financial-movements').createIndexes([
      { name: 'companyId_movementId_externalId_departmentId_categoryId', key: { companyId: 1, movementId: 1, externalId: 1, departmentId: 1, categoryId: 1 }, unique: true }
    ])
    console.log('done!\n')
  } finally {
    await mongodb.disconnect()
  }
}
