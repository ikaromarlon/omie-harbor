const { services: { omie: { providerName } } } = require('../../config')
const helpers = require('../../utils/helpers')
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
  company: makeCompanyMapping({ providerName, helpers }),
  category: makeCategoryMapping({ providerName }),
  department: makeDepartmentMapping({ providerName }),
  customer: makeCustomerMapping({ providerName, helpers }),
  project: makeProjectMapping({ providerName }),
  product: makeProductMapping({ providerName }),
  service: makeServiceMapping({ providerName }),
  checkingAccount: makeCheckingAccountMapping({ providerName, helpers }),
  productOrder: makeProductOrderMapping({ providerName, helpers }),
  serviceOrder: makeServiceOrderMapping({ providerName, helpers }),
  contract: makeContractMapping({ providerName, helpers }),
  productInvoice: makeProductInvoiceMapping({ providerName, helpers }),
  serviceInvoice: makeServiceInvoiceMapping({ providerName, helpers }),
  title: makeTitleMapping({ providerName, helpers }),
  financialMovement: makeFinancialMovementMapping({ providerName, helpers })
}
