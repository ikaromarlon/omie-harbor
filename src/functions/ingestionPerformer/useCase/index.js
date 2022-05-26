const config = require('../../../config')
const { daysToMilliseconds, uuidFrom, emptyProperties } = require('../../../utils/helpers')
const updateDimensions = require('./updateDimensions')
const updateFacts = require('./updateFacts')

module.exports = ({
  omieService,
  omieMappings,
  repositories,
  queuer,
  logger
}) => {
  const makeEmptyRecord = async (id, { companyId, provider, isActive, ...data }) => {
    const emptyRecord = {
      _id: id,
      companyId,
      provider,
      ...emptyProperties(data, true)
    }
    if (isActive !== undefined) emptyRecord.isActive = true
    return emptyRecord
  }

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
    const companies = await repositories.companies.find({
      _id: payload?.companyId,
      isActive: true
    })

    let { startDate, endDate } = payload

    if (!startDate && !endDate) {
      startDate = new Date()
      startDate.setMilliseconds(startDate.getMilliseconds() - daysToMilliseconds(config.services.omie.ingestionPeriod))
    }

    await Promise.all(companies.map(async (company) => {
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

      await updateDimensions({
        omieService,
        credentials,
        startDate,
        endDate,
        companyId,
        omieMappings,
        repositories,
        omieCnae,
        emptyRecordsIds,
        makeEmptyRecord
      })

      await updateFacts({
        omieService,
        credentials,
        startDate,
        endDate,
        companyId,
        omieMappings,
        repositories,
        omieEntryOrigins,
        omieDocumentTypes,
        emptyRecordsIds,
        makeEmptyRecord
      })

      logger.info({ title: 'Ingestion: Performer', message: `Ingestion completed for company ${companyId} - ${name}` })

      await queuer.sendCompanyToDataExportQueue(companyId)

      logger.info({ title: 'Ingestion: Performer', message: '1 record(s) sent to dataExport queue', data: { companyId } })
    }))

    return { success: true }
  }
}
