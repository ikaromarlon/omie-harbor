const makeRequester = require('../adapters/requester')
const makeOmieService = require('./omieService')

module.exports = () => {
  const requester = makeRequester()
  return {
    omieService: makeOmieService({ requester })
  }
}
