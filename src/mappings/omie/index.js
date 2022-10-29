const { services: { omie: { providerName } } } = require('../../config')
const makeCompanyMapping = require('./companyMapping')
const makeCustomerMapping = require('./customerMapping')
const makeProjectMapping = require('./projectMapping')
const makeDepartmentMapping = require('./departmentMapping')
const makeCategoryMapping = require('./categoryMapping')
const makeProductMapping = require('./productMapping')
const makeServiceMapping = require('./serviceMapping')
const makeProductOrderMapping = require('./productOrderMapping')
const makeServiceOrderMapping = require('./serviceOrderMapping')
const makeCheckingAccountMapping = require('./checkingAccountMapping')
const makeContractMapping = require('./contractMapping')
const makeProductInvoiceMapping = require('./productInvoiceMapping')
const makeServiceInvoiceMapping = require('./serviceInvoiceMapping')
const makeTitleMapping = require('./titleMapping')
const makeFinancialMovementMapping = require('./financialMovementMapping')

module.exports = {
  company: makeCompanyMapping({ providerName }),
  category: makeCategoryMapping({ providerName }),
  department: makeDepartmentMapping({ providerName }),
  customer: makeCustomerMapping({ providerName }),
  project: makeProjectMapping({ providerName }),
  product: makeProductMapping({ providerName }),
  service: makeServiceMapping({ providerName }),
  checkingAccount: makeCheckingAccountMapping({ providerName }),
  productOrder: makeProductOrderMapping({ providerName }),
  serviceOrder: makeServiceOrderMapping({ providerName }),
  contract: makeContractMapping({ providerName }),
  productInvoice: makeProductInvoiceMapping({ providerName }),
  serviceInvoice: makeServiceInvoiceMapping({ providerName }),
  title: makeTitleMapping({ providerName }),
  financialMovement: makeFinancialMovementMapping({ providerName })
}
