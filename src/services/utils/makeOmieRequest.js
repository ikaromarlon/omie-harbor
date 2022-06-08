const config = require('../../config')
const { sleep } = require('../../utils/helpers')

module.exports = async ({ requester, method, url, body, propertiesMapping }) => {
  const responses = []

  responses.push(await requester[method](url, body))

  for (let i = responses[0].data[propertiesMapping.pagination.currentPage] + 1; i <= responses[0].data[propertiesMapping.pagination.totalPages]; i++) {
    await sleep(config.services.omie.waitSecondsBeforeNextPageRequest)
    responses.push(await requester[method](url, { ...body, param: [{ ...body.param[0], [propertiesMapping.pagination.currentPage]: i }] }))
  }

  return responses.flatMap(e => e.data[propertiesMapping.data])
}
