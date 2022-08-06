const mongodb = require('../src/repositories/utils/mongodb')

module.exports = async ({ config }) => {
  try {
    console.log('Creating MongoDB Indexes:')
    console.log(config.bin.layout.dashRuler)
    const db = await mongodb.connect(config.mongodb.uri, config.mongodb.dbName)

    console.log('Companies...')
    await db.collection('companies').createIndexes([
      { name: 'appkey_appSecret', key: { 'credentials.appKey': 1, 'credentials.appSecret': 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('Categories...')
    await db.collection('categories').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('Departments...')
    await db.collection('departments').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('Projects...')
    await db.collection('projects').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('Customers...')
    await db.collection('customers').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('Checking-accounts...')
    await db.collection('checking-accounts').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('Products-services...')
    await db.collection('products-services').createIndexes([
      { name: 'companyId_externalId_type', key: { companyId: 1, externalId: 1, type: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('Contracts...')
    await db.collection('contracts').createIndexes([
      { name: 'companyId_customerId_externalId_departmentId_productServiceId_municipalServiceCode', key: { companyId: 1, customerId: 1, externalId: 1, departmentId: 1, productServiceId: 1, municipalServiceCode: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('Orders...')
    await db.collection('orders').createIndexes([
      { name: 'companyId_customerId_externalId_type_departmentId_productServiceId_cfop_municipalServiceCode', key: { companyId: 1, customerId: 1, externalId: 1, type: 1, departmentId: 1, productServiceId: 1, cfop: 1, municipalServiceCode: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('Billing...')
    await db.collection('billing').createIndexes([
      { name: 'companyId_customerId_externalId_type_departmentId_productServiceId_cfop_municipalServiceCode', key: { companyId: 1, customerId: 1, externalId: 1, type: 1, departmentId: 1, productServiceId: 1, cfop: 1, municipalServiceCode: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('Accounts-payable...')
    await db.collection('accounts-payable').createIndexes([
      { name: 'companyId_customerId_titleId_externalId_departmentId_categoryId', key: { companyId: 1, customerId: 1, titleId: 1, externalId: 1, departmentId: 1, categoryId: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('Accounts-receivable...')
    await db.collection('accounts-receivable').createIndexes([
      { name: 'companyId_customerId_titleId_externalId_departmentId_categoryId', key: { companyId: 1, customerId: 1, titleId: 1, externalId: 1, departmentId: 1, categoryId: 1 }, unique: true }
    ])
    console.log('done!\n')

    console.log('Financial-movements...')
    await db.collection('financial-movements').createIndexes([
      { name: 'companyId_customerId_movementId_externalId_departmentId_categoryId', key: { companyId: 1, customerId: 1, movementId: 1, externalId: 1, departmentId: 1, categoryId: 1 }, unique: true }
    ])
    console.log('done!\n')
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await mongodb.disconnect()
  }
}
