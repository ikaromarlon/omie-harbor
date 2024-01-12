module.exports = async ({
  omieService,
  credentials,
  companyId,
  startDate,
  endDate,
  productMapping,
  serviceMapping,
  productsServicesRepository
}) => {
  const [
    omieProducts,
    omieServicesCreated,
    omieServicesUpdated
  ] = await Promise.all([
    omieService.getProducts(credentials, { startDate, endDate }),
    omieService.getServices(credentials, { createdFrom: startDate, createdTo: endDate }),
    omieService.getServices(credentials, { updatedFrom: startDate, updatedTo: endDate })
  ])
  const products = omieProducts.map(omieProduct => productMapping({ omieProduct, companyId }))

  const omieServices = Array.from(
    [...omieServicesCreated, ...omieServicesUpdated]
      .reduce((acc, el) => { acc.set(el.intListar.nCodServ, el); return acc }, new Map())
      .values()
  )

  const services = omieServices.map(omieService => serviceMapping({ omieService, companyId }))

  const productsServices = [...products, ...services]

  if (productsServices.length) {
    await productsServicesRepository.createOrUpdateMany(productsServices, ['companyId', 'externalId'])
  }
}
