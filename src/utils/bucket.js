const aws = require('aws-sdk')
const config = require('../config')

module.exports = () => {
  const s3 = new aws.S3()
  const { detaExport } = config.s3
  return {
    storeCompanyData: async (companyId, data) => s3.putObject({
      Bucket: detaExport.bucketName,
      Key: `${companyId}.json`,
      Body: Buffer.from(JSON.stringify(data)),
      ContentType: 'application/json'
    }).promise()
  }
}
