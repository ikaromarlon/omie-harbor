const config = require('../config')
const MongodbHelper = require('../infra/db/mongodb')

module.exports = () => {
  MongodbHelper.setup(config.db.mongodb)

  const repositories = Object.entries({
    categories: 'categories',
    departments: 'departments',
    projects: 'projects',
    customers: 'customers',
    productsServices: 'products-services',
    checkingAccounts: 'checking-accounts',
    contracts: 'contracts',
    orders: 'orders',
    billing: 'billing',
    accountsPayable: 'accounts-payable',
    accountsReceivable: 'accounts-receivable',
    financialMovements: 'financial-movements'
  }).reduce((acc, [key, name]) => ({ ...acc, [key]: MongodbHelper.repository(name, config.db.mongodb) }), {})

  return repositories
}
