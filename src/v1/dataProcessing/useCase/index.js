const { NotFoundError } = require('../../../common/errors')
const entityFlow = {
  department: require('./department')
}

module.exports = ({
  omieService,
  repositories,
  omieMappings,
  logger,
  mailer
}) => {
  const getCompany = async (companyId) => {
    const company = await repositories.companies.findOne({ _id: companyId })
    if (!company) throw new NotFoundError('Company not found')
    return company
  }

  const handler = async ({ userId, companyId, data, entity, batch, notificationAddress }) => {
    const company = await getCompany(companyId)

    const errors = []
    const successes = []

    await entityFlow[entity]({ data, userId, company, omieService, repositories, omieMappings, errors, successes })

    const report = {
      status: 'SUCCESS',
      batch,
      batchSize: data.length,
      companyId: company._id,
      companyCnpj: company.cnpj,
      companyName: company.name,
      message: `${successes.length} record(s) were processed successfully`
    }

    if (errors.length) {
      report.status = 'FAIL'
      report.message += ` and ${errors.length} record(s) has been failed.`
      report.data = errors
    }

    logger.info({
      title: `Data Processing: ${entity}`,
      message: report.message,
      data: report
    })

    await mailer.sendDataProcessingStatus({
      notificationAddress,
      entity,
      data: report
    })
  }

  return handler
}
