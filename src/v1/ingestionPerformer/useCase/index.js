const config = require('../../../config')
const { NotFoundError, ValidationError } = require('../../../common/errors')
const { daysToMilliseconds, uuidFrom } = require('../../../common/helpers')
const updateDimensions = require('./updateDimensions')
const updateFacts = require('./updateFacts')

module.exports = ({
  omieService,
  omieMappings,
  repositories,
  queuer,
  logger
}) => {
  const getAuxiliaryRecords = async (credentials) => {
    const [
      omieBanks,
      omieCnae,
      omieDocumentTypes
    ] = await Promise.all([
      omieService.getBanks(credentials),
      omieService.getCnae(credentials),
      omieService.getDocumentTypes(credentials)
    ])

    return {
      omieBanks,
      omieCnae,
      omieDocumentTypes
    }
  }

  const updateCompany = async ({ credentials, company, omieCnae, companyMapping, companiesRepository }) => {
    const omieCompany = await omieService.getCompany(credentials)
    const companyData = companyMapping({ omieCompany, omieCnae, credentials })
    if (companyData.isActive !== company.isActive) {
      const date = new Date()
      companyData.statusAt = date
      companyData.statusBy = config.app.user
    }
    await companiesRepository.createOrUpdateOne({ _id: company._id }, companyData)
  }

  return async ({ payload }) => {
    const company = await repositories.companies.findOne({ _id: payload.companyId })

    if (!company) {
      throw new NotFoundError(`Company ${payload.companyId} not found`)
    }
    if (company.isActive !== true) {
      throw new ValidationError(`Company ${payload.companyId} is not active`)
    }

    let { startDate, endDate } = payload

    if (!startDate && !endDate) {
      startDate = new Date()
      startDate.setMilliseconds(startDate.getMilliseconds() - daysToMilliseconds(config.services.omie.ingestionPeriod))
    }

    const { _id: companyId, name, credentials } = company

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

    logger.info({
      title: 'ingestionPerformer',
      message: `Ingestion started for company ${companyId} - ${name}`,
      data: { companyId, startDate, endDate }
    })

    const {
      omieBanks,
      omieCnae,
      omieDocumentTypes
    } = await getAuxiliaryRecords(credentials)

    await updateCompany({
      credentials,
      company,
      omieCnae,
      companyMapping: omieMappings.company,
      companiesRepository: repositories.companies
    })

    await updateDimensions({
      omieService,
      credentials,
      startDate,
      endDate,
      companyId,
      omieMappings,
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
      omieMappings,
      repositories,
      omieDocumentTypes,
      emptyRecordsIds
    })

    logger.info({
      title: 'ingestionPerformer',
      message: `Ingestion completed for company ${companyId} - ${name}`
    })

    await queuer.sendCompanyToDataExportQueue(companyId)

    logger.info({
      title: 'ingestionPerformer',
      message: `Company ${companyId} - ${name} sent to dataExport process`
    })

    return { success: true }
  }
}
