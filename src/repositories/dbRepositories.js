const config = require('../config')
const mongodb = require('./utils/mongodb')
const makeDbRepository = require('./utils/makeDbRepository')

module.exports = async () => {
  const db = await mongodb.connect(config.mongodb.uri, config.mongodb.dbName)
  return {
    companies: makeDbRepository('companies', db),
    users: makeDbRepository('users', db),
    categories: makeDbRepository('categories', db),
    departments: makeDbRepository('departments', db),
    projects: makeDbRepository('projects', db),
    customers: makeDbRepository('customers', db),
    productsServices: makeDbRepository('products-services', db),
    checkingAccounts: makeDbRepository('checking-accounts', db),
    contracts: makeDbRepository('contracts', db),
    orders: makeDbRepository('orders', db),
    billing: makeDbRepository('billing', db),
    accountsPayable: makeDbRepository('accounts-payable', db),
    accountsReceivable: makeDbRepository('accounts-receivable', db),
    financialMovements: makeDbRepository('financial-movements', db)
  }
}
