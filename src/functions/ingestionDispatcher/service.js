module.exports = ({
  companiesRepository,
  queuer,
  logger
}) => async () => {
  const companies = await companiesRepository.find({ isActive: true })

  const companiesSent = await Promise.all(companies.map(async (company) => {
    await queuer.sendCompanyToIngestionQueue(company.id)
    return {
      id: company.id,
      name: company.name
    }
  }))

  logger.info(
    `${companiesSent.length} record(s) sent to ingestion queue`,
    { companies: companiesSent }
  )

  return { success: true }
}
