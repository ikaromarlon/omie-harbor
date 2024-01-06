const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const config = require('../../config')

module.exports = () => {
  const S3 = new S3Client()
  const { detaExportBucket } = config.services.S3
  return {
    storeCompanyData: async (companyId, data) => {
      const command = new PutObjectCommand({
        Bucket: detaExportBucket.name,
        Key: `${companyId}.json`,
        Body: Buffer.from(JSON.stringify(data)),
        ContentType: 'application/json'
      })
      const result = await S3.send(command)
      return result
    }
  }
}
