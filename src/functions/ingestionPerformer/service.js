const config = require('../../config')
const { NotFoundException, UnprocessableEntityException } = require('../../common/errors')
const { daysToMilliseconds } = require('../../common/utils')
const updateCompany = require('./useCases/updateCompany')
const updateCategories = require('./useCases/updateCategories')
const updateDepartments = require('./useCases/updateDepartments')
const updateProjects = require('./useCases/updateProjects')
const updateCustomers = require('./useCases/updateCustomers')
const updateProductsServices = require('./useCases/updateProductsServices')
const updateCheckingAccounts = require('./useCases/updateCheckingAccounts')
const updateContracts = require('./useCases/updateContracts')
const updateOrders = require('./useCases/updateOrders')
const updateBilling = require('./useCases/updateBilling')
const updateAccountsPayable = require('./useCases/updateAccountsPayable')
const updateAccountsReceivable = require('./useCases/updateAccountsReceivable')
const updateFinancialMovements = require('./useCases/updateFinancialMovements')

module.exports = ({
  omieService,
  mappings,
  companiesRepository,
  repositories,
  sqs,
  logger
}) => async (payload) => {
  const { companyId } = payload

  const company = await companiesRepository.findById(companyId)

  if (!company) {
    throw new NotFoundException(`Company ${companyId} not found`)
  }

  if (company.isActive !== true) {
    throw new UnprocessableEntityException(`Company ${companyId} is not active`)
  }

  let { startDate, endDate } = payload

  if (!startDate && !endDate) {
    startDate = new Date()
    startDate.setMilliseconds(startDate.getMilliseconds() - daysToMilliseconds(config.services.omie.ingestionPeriod))
  }

  const { name, credentials } = company

  logger.info(
    `Ingestion started for company ${companyId} - ${name}`,
    { companyId, startDate, endDate }
  )

  const [
    omieBanks,
    omieCnae,
    omieDocumentTypes
  ] = await Promise.all([
    omieService.getBanks(credentials),
    omieService.getCnae(credentials),
    omieService.getDocumentTypes(credentials)
  ])

  /* main entity -> */
  await updateCompany({
    omieService,
    credentials,
    company,
    omieCnae,
    companyMapping: mappings.companyMapping,
    companiesRepository
  })
  /* <- main entity */

  /* dimension entities -> */
  await updateCategories({
    omieService,
    credentials,
    companyId,
    categoryMapping: mappings.categoryMapping,
    categoriesRepository: repositories.categories
  })

  await updateDepartments({
    omieService,
    credentials,
    companyId,
    startDate,
    endDate,
    departmentMapping: mappings.departmentMapping,
    departmentsRepository: repositories.departments
  })

  await updateProjects({
    omieService,
    credentials,
    companyId,
    startDate,
    endDate,
    projectMapping: mappings.projectMapping,
    projectsRepository: repositories.projects
  })

  await updateCustomers({
    omieService,
    credentials,
    companyId,
    startDate,
    endDate,
    omieCnae,
    omieBanks,
    customerMapping: mappings.customerMapping,
    customersRepository: repositories.customers
  })

  await updateProductsServices({
    omieService,
    credentials,
    companyId,
    startDate,
    endDate,
    productMapping: mappings.productMapping,
    serviceMapping: mappings.serviceMapping,
    productsServicesRepository: repositories.productsServices
  })

  await updateCheckingAccounts({
    omieService,
    credentials,
    companyId,
    startDate,
    endDate,
    omieBanks,
    checkingAccountMapping: mappings.checkingAccountMapping,
    checkingAccountsRepository: repositories.checkingAccounts
  })

  await updateContracts({
    omieService,
    credentials,
    companyId,
    startDate,
    endDate,
    contractMapping: mappings.contractMapping,
    repositories
  })

  await updateOrders({
    omieService,
    credentials,
    companyId,
    startDate,
    endDate,
    productOrderMapping: mappings.productOrderMapping,
    serviceOrderMapping: mappings.serviceOrderMapping,
    repositories
  })
  /* <- dimension entities */

  /* fact entities -> */
  await updateBilling({
    omieService,
    credentials,
    companyId,
    startDate,
    endDate,
    productInvoiceMapping: mappings.productInvoiceMapping,
    serviceInvoiceMapping: mappings.serviceInvoiceMapping,
    repositories
  })

  await updateAccountsPayable({
    omieService,
    credentials,
    companyId,
    startDate,
    endDate,
    titleMapping: mappings.titleMapping,
    repositories,
    omieDocumentTypes
  })

  await updateAccountsReceivable({
    omieService,
    credentials,
    companyId,
    startDate,
    endDate,
    titleMapping: mappings.titleMapping,
    repositories,
    omieDocumentTypes
  })

  await updateFinancialMovements({
    omieService,
    credentials,
    companyId,
    startDate,
    endDate,
    financialMovementMapping: mappings.financialMovementMapping,
    repositories,
    omieDocumentTypes
  })
  /* <- fact entities */

  logger.info(`Ingestion completed for company ${companyId} - ${name}`)

  await sqs.sendCompanyToDataExportQueue(companyId)

  logger.info(`Company ${companyId} - ${name} sent to dataExport process`)

  return { success: true }
}
