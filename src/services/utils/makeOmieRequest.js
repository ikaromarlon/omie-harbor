module.exports = async ({ requester, method, url, body, propertiesMapping }) => {
  const requests = []
  const responses = []

  responses.push(await requester[method](url, body))

  for (let i = responses[0].data[propertiesMapping.pagination.currentPage] + 1; i <= responses[0].data[propertiesMapping.pagination.totalPages]; i++) {
    requests.push(requester[method](url, { ...body, param: [{ ...body.param[0], [propertiesMapping.pagination.currentPage]: i }] }))
  }

  responses.push(...(await Promise.all(requests)))

  return responses.flatMap(e => e.data[propertiesMapping.data])
}
