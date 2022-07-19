const mongodb = require('../src/repositories/utils/mongodb')

module.exports = async (arg, config) => {
  try {
    console.log(`Setting up Database... (${arg})`)
    console.log(config.bin.layout.dashRuler)
    const db = await mongodb.connect(config.mongodb.uri, config.mongodb.dbName)

    console.log('Updating companies indexes...')
    await db.collection('companies').createIndexes([
      { name: 'appkey_appSecret', key: { 'credentials.appKey': 1, 'credentials.appSecret': 1 }, unique: true }
    ])
    console.log('done!')

    console.log('Updating categories indexes...')
    await db.collection('categories').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!')

    console.log('Updating departments indexes...')
    await db.collection('departments').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!')

    console.log('Updating projects indexes...')
    await db.collection('projects').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!')

    console.log('Updating customers indexes...')
    await db.collection('customers').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!')

    console.log('Updating checking-accounts indexes...')
    await db.collection('checking-accounts').createIndexes([
      { name: 'companyId_externalId', key: { companyId: 1, externalId: 1 }, unique: true }
    ])
    console.log('done!')

    console.log('Updating products-services indexes...')
    await db.collection('products-services').createIndexes([
      { name: 'companyId_externalId_type', key: { companyId: 1, externalId: 1, type: 1 }, unique: true }
    ])
    console.log('done!')

    console.log('Updating contracts indexes...')
    await db.collection('contracts').createIndexes([
      { name: 'companyId_externalId_departmentId_productServiceId_municipalServiceCode', key: { companyId: 1, externalId: 1, departmentId: 1, productServiceId: 1, municipalServiceCode: 1 }, unique: true }
    ])
    console.log('done!')

    console.log('Updating orders indexes...')
    await db.collection('orders').createIndexes([
      { name: 'companyId_customerId_externalId_type_departmentId_productServiceId_cfop_municipalServiceCode', key: { companyId: 1, customerId: 1, externalId: 1, type: 1, departmentId: 1, productServiceId: 1, cfop: 1, municipalServiceCode: 1 }, unique: true }
    ])
    console.log('done!')

    console.log('Updating billing indexes...')
    await db.collection('billing').createIndexes([
      { name: 'companyId_customerId_externalId_type_departmentId_productServiceId_cfop_municipalServiceCode', key: { companyId: 1, customerId: 1, externalId: 1, type: 1, departmentId: 1, productServiceId: 1, cfop: 1, municipalServiceCode: 1 }, unique: true }
    ])
    console.log('done!')

    console.log('Updating accounts-payable indexes...')
    await db.collection('accounts-payable').createIndexes([
      { name: 'companyId_customerId_titleId_externalId_departmentId_categoryId', key: { companyId: 1, customerId: 1, titleId: 1, externalId: 1, departmentId: 1, categoryId: 1 }, unique: true }
    ])
    console.log('done!')

    console.log('Updating accounts-receivable indexes...')
    await db.collection('accounts-receivable').createIndexes([
      { name: 'companyId_customerId_titleId_externalId_departmentId_categoryId', key: { companyId: 1, customerId: 1, titleId: 1, externalId: 1, departmentId: 1, categoryId: 1 }, unique: true }
    ])
    console.log('done!')

    console.log('Updating financial-movements indexes...')
    await db.collection('financial-movements').createIndexes([
      { name: 'companyId_customerId_movementId_externalId_departmentId_categoryId', key: { companyId: 1, customerId: 1, movementId: 1, externalId: 1, departmentId: 1, categoryId: 1 }, unique: true }
    ])
    console.log('done!')
  } finally {
    await mongodb.disconnect()
  }
}
