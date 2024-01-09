const config = require('../config')
const mongodb = require('./helpers/mongodb')
const mongodbRepository = require('./helpers/mongodbRepository')

module.exports = async () => {
  const db = await mongodb.connect(config.db.mongodb.uri, config.db.mongodb.dbName)
  const properties = { allowsDeleteAllData: true }
  return {
    companies: mongodbRepository('companies', db),
    categories: mongodbRepository('categories', db, properties),
    departments: mongodbRepository('departments', db, properties),
    projects: mongodbRepository('projects', db, properties),
    customers: mongodbRepository('customers', db, properties),
    productsServices: mongodbRepository('products-services', db, properties),
    checkingAccounts: mongodbRepository('checking-accounts', db, properties),
    contracts: mongodbRepository('contracts', db, properties),
    orders: mongodbRepository('orders', db, properties),
    billing: mongodbRepository('billing', db, properties),
    accountsPayable: mongodbRepository('accounts-payable', db, properties),
    accountsReceivable: mongodbRepository('accounts-receivable', db, properties),
    financialMovements: mongodbRepository('financial-movements', db, properties)
  }
}
