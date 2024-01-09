const OmieRequestRate = require('./OmieRequestRate')

let omieRequestRate

module.exports = async ({ requester, method, url, body, propertiesMapping }) => {
  if (!omieRequestRate) {
    omieRequestRate = new OmieRequestRate()
  }

  const responses = []
  responses.push(await requester[method](url, body))
  await omieRequestRate.addRequest()

  if (propertiesMapping?.pagination) {
    for (let i = responses[0].data[propertiesMapping.pagination.currentPage] + 1; i <= responses[0].data[propertiesMapping.pagination.totalPages]; i++) {
      responses.push(await requester[method](url, { ...body, param: [{ ...body.param[0], [propertiesMapping.pagination.currentPage]: i }] }))
      await omieRequestRate.addRequest()
    }
  }

  if (propertiesMapping?.data) {
    return responses.flatMap(e => e.data[propertiesMapping.data])
  }
  return responses[0].data
}
