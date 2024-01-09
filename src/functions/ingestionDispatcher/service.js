module.exports = ({
  Repositories,
  queuer,
  logger
}) => async () => {
  const repositories = await Repositories()

  const companies = await repositories.companies.find({ isActive: true })

  const companiesSent = await Promise.all(companies.map(async (company) => {
    await queuer.sendCompanyToIngestionQueue(company._id)
    return {
      id: company._id,
      name: company.name
    }
  }))

  logger.info(
    `${companiesSent.length} record(s) sent to ingestion queue`,
    { companies: companiesSent }
  )

  return { success: true }
}
