const MongodbHelper = require('../infra/db/mongodb')

module.exports = () => ({
  categories: MongodbHelper.repository('categories'),
  departments: MongodbHelper.repository('departments'),
  projects: MongodbHelper.repository('projects'),
  customers: MongodbHelper.repository('customers'),
  productsServices: MongodbHelper.repository('products-services'),
  checkingAccounts: MongodbHelper.repository('checking-accounts'),
  contracts: MongodbHelper.repository('contracts'),
  orders: MongodbHelper.repository('orders'),
  billing: MongodbHelper.repository('billing'),
  accountsPayable: MongodbHelper.repository('accounts-payable'),
  accountsReceivable: MongodbHelper.repository('accounts-receivable'),
  financialMovements: MongodbHelper.repository('financial-movements')
})
