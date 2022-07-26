const config = require('../config')
const mongodb = require('./utils/mongodb')
const makeDbRepository = require('./utils/makeDbRepository')

module.exports = async () => {
  const db = await mongodb.connect(config.mongodb.uri, config.mongodb.dbName)
  return {
    companies: makeDbRepository({ name: 'companies', db }),
    categories: makeDbRepository({ name: 'categories', db, properties: { allowDeleteByCompany: true } }),
    departments: makeDbRepository({ name: 'departments', db, properties: { allowDeleteByCompany: true } }),
    projects: makeDbRepository({ name: 'projects', db, properties: { allowDeleteByCompany: true } }),
    customers: makeDbRepository({ name: 'customers', db, properties: { allowDeleteByCompany: true } }),
    productsServices: makeDbRepository({ name: 'products-services', db, properties: { allowDeleteByCompany: true } }),
    checkingAccounts: makeDbRepository({ name: 'checking-accounts', db, properties: { allowDeleteByCompany: true } }),
    contracts: makeDbRepository({ name: 'contracts', db, properties: { allowDeleteByCompany: true } }),
    orders: makeDbRepository({ name: 'orders', db, properties: { allowDeleteByCompany: true } }),
    billing: makeDbRepository({ name: 'billing', db, properties: { allowDeleteByCompany: true } }),
    accountsPayable: makeDbRepository({ name: 'accounts-payable', db, properties: { allowDeleteByCompany: true } }),
    accountsReceivable: makeDbRepository({ name: 'accounts-receivable', db, properties: { allowDeleteByCompany: true } }),
    financialMovements: makeDbRepository({ name: 'financial-movements', db, properties: { allowDeleteByCompany: true } })
  }
}
