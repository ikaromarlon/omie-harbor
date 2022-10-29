const aws = require('aws-sdk')
const config = require('../../config')

module.exports = () => {
  const S3 = new aws.S3()
  const { detaExport } = config.S3
  return {
    storeCompanyData: async (companyId, data) => S3.putObject({
      Bucket: detaExport.bucketName,
      Key: `${companyId}.json`,
      Body: Buffer.from(JSON.stringify(data)),
      ContentType: 'application/json'
    }).promise()
  }
}
