const config = require('../../config')
const { NotFoundException, UnprocessableEntityException } = require('../../common/errors')
const { daysToMilliseconds } = require('../../common/utils')
const updateCompany = require('./useCases/updateCompany')
const updateDimensions = require('./useCases/updateDimensions')
const updateFacts = require('./useCases/updateFacts')

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
    omieCnae
  })

  await updateFacts({
    omieService,
    credentials,
    startDate,
    endDate,
    companyId,
    mappings,
    repositories,
    omieDocumentTypes
  })

  logger.info(`Ingestion completed for company ${companyId} - ${name}`)

  await sqs.sendCompanyToDataExportQueue(companyId)

  logger.info(`Company ${companyId} - ${name} sent to dataExport process`)

  return { success: true }
}
