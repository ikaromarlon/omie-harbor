module.exports = ({
  repositories,
  queuer,
  logger
}) => async () => {
  const companies = await repositories.companies.find({ isActive: true })

  const companiesSent = await Promise.all(companies.map(async ({ _id: companyId }) => {
    await queuer.sendCompanyToIngestionQueue({ companyId })
    return companyId
  }))

  logger.info({ title: 'Ingestion: Dispatcher', message: `${companiesSent.length} record(s) sent to ingestion queue`, data: { companyId: companiesSent } })

  return { success: true }
}
