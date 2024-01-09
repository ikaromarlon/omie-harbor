const { omie: { requestPeriod, maxRequestPerPeriod } } = require('../../../config/services')
const { sleep, millisecondsToSeconds } = require('../../../common/utils')

module.exports = class OmieRequestRate {
  constructor () {
    this.count = 0
    this.lastBatchRequestTime = Date.now()
  }

  addRequest = async () => {
    this.count++
    if (
      this.count === maxRequestPerPeriod &&
      millisecondsToSeconds(Date.now() - this.lastBatchRequestTime) <= requestPeriod
    ) {
      await sleep(requestPeriod)
      this.resetRequests()
    }
  }

  resetRequests = () => {
    this.count = 0
    this.lastBatchRequestTime = Date.now()
  }
}
