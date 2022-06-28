const { services: { omie: { requestPeriodSeconds, maxRequestPerPeriod } } } = require('../../config')
const { sleep, millisecondsToSeconds } = require('../../utils/helpers')

const OmieRequestRate = function () {
  this.count = 0
  this.lastRequestTime = null

  this.addRequest = async () => {
    this.count++
    if (
      this.count === maxRequestPerPeriod &&
      millisecondsToSeconds(Date.now() - this.lastRequestTime) <= requestPeriodSeconds
    ) {
      this.count = 0
      await sleep(requestPeriodSeconds)
    }
    this.lastRequestTime = Date.now()
  }
}

module.exports = OmieRequestRate
