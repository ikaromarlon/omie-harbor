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
  const getCompany = async (appKey, appSecret) => {
    const company = await repositories.companies.findOne({ 'credentials.appKey': appKey, 'credentials.appSecret': appSecret })
    return company
  }

  const handler = async ({ payload }) => {
    const { appKey, appSecret, data, entity, batch, notificationAddress } = payload

    const company = await getCompany(appKey, appSecret)

    const errors = []
    const successes = []

    await entityFlow[entity]({ data, company, omieService, repositories, omieMappings, errors, successes })

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
      title: `dataProcessing: ${entity}`,
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
