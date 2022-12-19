module.exports = ({
  repositories,
  queuer,
  logger
}) => async () => {
  const companies = await repositories.companies.find({ isActive: true })

  const companiesSent = await Promise.all(companies.map(async (company) => {
    await queuer.sendCompanyToIngestionQueue(company._id)
    return {
      id: company._id,
      name: company.name
    }
  }))

  logger.info({
    title: 'ingestionDispatcher',
    message: `${companiesSent.length} record(s) sent to ingestion queue`,
    data: {
      companies: companiesSent
    }
  })

  return { success: true }
}
