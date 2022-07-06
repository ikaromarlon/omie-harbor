const { services: { omie: { requestPeriodSeconds, maxRequestPerPeriod } } } = require('../../config')
const { sleep, millisecondsToSeconds } = require('../../utils/helpers')

const OmieRequestRate = function () {
  this.count = 0
  this.lastBatchRequestTime = Date.now()

  this.addRequest = async () => {
    this.count++
    if (
      this.count === maxRequestPerPeriod &&
      millisecondsToSeconds(Date.now() - this.lastBatchRequestTime) <= requestPeriodSeconds
    ) {
      await sleep(requestPeriodSeconds)
      this.resetRequests()
    }
  }

  this.resetRequests = () => {
    this.count = 0
    this.lastBatchRequestTime = Date.now()
  }
}

module.exports = OmieRequestRate
