const config = require('../../config')
const { NotFoundException, UnprocessableEntityException } = require('../../common/errors')
const { daysToMilliseconds, uuidFrom } = require('../../common/utils')
const updateCompany = require('./useCases/updateCompany')
const updateDimensions = require('./useCases/updateDimensions')
const updateFacts = require('./useCases/updateFacts')

module.exports = ({
  omieService,
  mappings,
  companiesRepository,
  repositories,
  queuer,
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

  const emptyRecordsIds = {
    category: uuidFrom(`${companyId}-category`),
    department: uuidFrom(`${companyId}-department`),
    project: uuidFrom(`${companyId}-project`),
    customer: uuidFrom(`${companyId}-customer`),
    checkingAccount: uuidFrom(`${companyId}-checkingAccount`),
    productService: uuidFrom(`${companyId}-productService`),
    contract: uuidFrom(`${companyId}-contract`),
    order: uuidFrom(`${companyId}-order`),
    billing: uuidFrom(`${companyId}-billing`),
    accountPayable: uuidFrom(`${companyId}-accountPayable`),
    accountReceivable: uuidFrom(`${companyId}-accountReceivable`),
    financialMovement: uuidFrom(`${companyId}-financialMovement`)
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

  await updateCompany({
    omieService,
    credentials,
    company,
    omieCnae,
    companyMapping: mappings.companyMapping,
    companiesRepository
  })

  await updateDimensions({
    omieService,
    credentials,
    startDate,
    endDate,
    companyId,
    mappings,
    repositories,
    omieBanks,
    omieCnae,
    emptyRecordsIds
  })

  await updateFacts({
    omieService,
    credentials,
    startDate,
    endDate,
    companyId,
    mappings,
    repositories,
    omieDocumentTypes,
    emptyRecordsIds
  })

  logger.info(`Ingestion completed for company ${companyId} - ${name}`)

  await queuer.sendCompanyToDataExportQueue(companyId)

  logger.info(`Company ${companyId} - ${name} sent to dataExport process`)

  return { success: true }
}
