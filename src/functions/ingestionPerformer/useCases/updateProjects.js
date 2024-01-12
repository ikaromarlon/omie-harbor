module.exports = async ({
  omieService,
  credentials,
  companyId,
  startDate,
  endDate,
  projectMapping,
  projectsRepository
}) => {
  const omieProjects = await omieService.getProjects(credentials, { startDate, endDate })
  const projects = omieProjects.map(omieProject => projectMapping({ omieProject, companyId }))
  if (projects.length) {
    await projectsRepository.createOrUpdateMany(projects, ['companyId', 'externalId'])
  }
}
