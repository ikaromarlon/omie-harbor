const config = require('../config')
const mongodb = require('./helpers/mongodb')
const makeDbRepository = require('./helpers/makeDbRepository')

module.exports = async () => {
  const db = await mongodb.connect(config.db.mongodb.uri, config.db.mongodb.dbName)
  return {
    users: makeDbRepository({
      name: 'users',
      db
    }),
    companies: makeDbRepository({
      name: 'companies',
      db
    }),
    categories: makeDbRepository({
      name: 'categories',
      db,
      properties: { allowsDeleteAllData: true }
    }),
    departments: makeDbRepository({
      name: 'departments',
      db,
      properties: { allowsDeleteAllData: true }
    }),
    projects: makeDbRepository({
      name: 'projects',
      db,
      properties: { allowsDeleteAllData: true }
    }),
    customers: makeDbRepository({
      name: 'customers',
      db,
      properties: { allowsDeleteAllData: true }
    }),
    productsServices: makeDbRepository({
      name: 'products-services',
      db,
      properties: { allowsDeleteAllData: true }
    }),
    checkingAccounts: makeDbRepository({
      name: 'checking-accounts',
      db,
      properties: { allowsDeleteAllData: true }
    }),
    contracts: makeDbRepository({
      name: 'contracts',
      db,
      properties: { allowsDeleteAllData: true }
    }),
    orders: makeDbRepository({
      name: 'orders',
      db,
      properties: { allowsDeleteAllData: true }
    }),
    billing: makeDbRepository({
      name: 'billing',
      db,
      properties: { allowsDeleteAllData: true }
    }),
    accountsPayable: makeDbRepository({
      name: 'accounts-payable',
      db,
      properties: { allowsDeleteAllData: true }
    }),
    accountsReceivable: makeDbRepository({
      name: 'accounts-receivable',
      db,
      properties: { allowsDeleteAllData: true }
    }),
    financialMovements: makeDbRepository({
      name: 'financial-movements',
      db,
      properties: { allowsDeleteAllData: true }
    })
  }
}
