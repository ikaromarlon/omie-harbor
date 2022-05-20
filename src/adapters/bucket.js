const aws = require('aws-sdk')
const config = require('../config')
const { NotFoundError } = require('../utils/errors')

module.exports = () => {
  const s3 = new aws.S3()
  const { detaExport } = config.s3
  return {
    storeCompanyData: async (companyId, data) => s3.putObject({
      Bucket: detaExport.bucketName,
      Key: `${companyId}.json`,
      Body: Buffer.from(JSON.stringify(data)),
      ContentType: 'application/json'
    }).promise(),
    getCompanyDataSignedUrl: async (companyId) => {
      try {
        await (s3.headObject({ Bucket: detaExport.bucketName, Key: `${companyId}.json` }).promise())
      } catch (error) {
        if (error.statusCode === 404) throw new NotFoundError(`Company ${companyId} not found`)
        throw error
      }
      return s3.getSignedUrl('getObject', {
        Bucket: detaExport.bucketName,
        Key: `${companyId}.json`,
        Expires: detaExport.signedUrlExpirationSeconds
      })
    }
  }
}
