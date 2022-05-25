const config = require('../../../config')
const { daysToMilliseconds } = require('../../../utils/helpers')
const createEmptyRecords = require('./createEmptyRecords')
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
      omieCnae,
      omieEntryOrigins,
      omieDocumentTypes
    ] = await Promise.all([
      omieService.getCnae(credentials),
      omieService.getEntryOrigins(credentials),
      omieService.getDocumentTypes(credentials)
    ])

    return {
      omieCnae,
      omieEntryOrigins,
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
    const { companyId } = payload

    const filter = { isActive: true }
    if (companyId) filter._id = companyId

    const companies = await repositories.companies.find(filter)

    let { startDate, endDate } = payload

    if (!startDate && !endDate) {
      startDate = new Date()
      startDate.setMilliseconds(startDate.getMilliseconds() - daysToMilliseconds(config.services.omie.ingestionPeriod))
    }

    await Promise.all(companies.map(async (company) => {
      const { _id: companyId, name, credentials } = company

      logger.info({ title: 'Ingestion: Performer', message: `Starting ingestion for company ${companyId} - ${name}` })

      const {
        omieCnae,
        omieEntryOrigins,
        omieDocumentTypes
      } = await getAuxiliaryRecords(credentials)

      await updateCompany({
        credentials,
        company,
        omieCnae,
        companyMapping: omieMappings.company,
        companiesRepository: repositories.companies
      })

      const emptyRecordsIds = await createEmptyRecords({ companyId, omieMappings, repositories })

      await updateDimensions({
        omieService,
        credentials,
        startDate,
        endDate,
        companyId,
        omieMappings,
        repositories,
        omieCnae,
        emptyRecordsIds
      })

      await updateFacts({
        omieService,
        credentials,
        startDate,
        endDate,
        companyId,
        emptyRecordsIds,
        omieMappings,
        repositories,
        omieEntryOrigins,
        omieDocumentTypes
      })

      logger.info({ title: 'Ingestion: Performer', message: `Ingestion completed for company ${companyId} - ${name}` })

      await queuer.sendCompanyToDataExportQueue(companyId)

      logger.info({ title: 'Ingestion: Performer', message: '1 record(s) sent to dataExport queue', data: { companyId } })
    }))

    return { success: true }
  }
}
