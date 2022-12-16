module.exports = ({
  repositories,
  queuer,
  logger
}) => async () => {
  const companies = await repositories.companies.find({ isActive: true })

  for (const company of companies) {
    await queuer.sendCompanyToIngestionQueue(company._id)
  }

  logger.info({
    title: 'ingestionDispatcher',
    message: `${companies.length} record(s) sent to ingestion queue`,
    data: {
      companies: companies.map(company => ({
        id: company._id,
        name: company.name
      }))
    }
  })

  return { success: true }
}
