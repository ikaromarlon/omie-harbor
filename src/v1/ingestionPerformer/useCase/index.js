const config = require('../../../config')
const { NotFoundError, ValidationError } = require('../../../common/errors')
const { daysToMilliseconds, uuidFrom, emptyProperties } = require('../../../common/helpers')
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

  const joinRecordsByCfopAndMunicipalServiceCode = (acc, record, i, records) => {
    const stored = acc.some(e => e.customerId === record.customerId && e.externalId === record.externalId && e.type === record.type && e.departmentId === record.departmentId && e.productServiceId === record.productServiceId && e.cfop === record.cfop && e.municipalServiceCode === record.municipalServiceCode)
    const pending = records.filter(e => e.customerId === record.customerId && e.externalId === record.externalId && e.type === record.type && e.departmentId === record.departmentId && e.productServiceId === record.productServiceId && e.cfop === record.cfop && e.municipalServiceCode === record.municipalServiceCode)
    if (!stored) {
      acc.push({
        ...record,
        ...(pending.reduce((sum, e) => ({
          grossValue: sum.grossValue + e.grossValue,
          netValue: sum.netValue + e.netValue,
          discounts: sum.discounts + e.discounts,
          taxAmount: sum.taxAmount + e.taxAmount,
          taxes: {
            ir: sum.taxes.ir + e.taxes.ir,
            pis: sum.taxes.pis + e.taxes.pis,
            cofins: sum.taxes.cofins + e.taxes.cofins,
            csll: sum.taxes.csll + e.taxes.csll,
            icms: sum.taxes.icms + e.taxes.icms,
            iss: sum.taxes.iss + e.taxes.iss
          }
        }), {
          grossValue: 0,
          netValue: 0,
          discounts: 0,
          taxAmount: 0,
          taxes: {
            ir: 0,
            pis: 0,
            cofins: 0,
            csll: 0,
            icms: 0,
            iss: 0
          }
        }))
      })
    }
    return acc
  }

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
      emptyRecordsIds,
      makeEmptyRecord,
      joinRecordsByCfopAndMunicipalServiceCode
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
      emptyRecordsIds,
      makeEmptyRecord,
      joinRecordsByCfopAndMunicipalServiceCode
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
