module.exports = async ({
  omieService,
  credentials,
  companyId,
  startDate,
  endDate,
  departmentMapping,
  departmentsRepository
}) => {
  const omieDepartments = await omieService.getDepartments(credentials, { startDate, endDate })
  const departments = omieDepartments.map(omieDepartment => departmentMapping({ omieDepartment, companyId }))
  if (departments.length) {
    await departmentsRepository.createOrUpdateMany(departments, ['companyId', 'externalId'])
  }
}
