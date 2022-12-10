const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const config = require('../../config')

module.exports = () => {
  const S3 = new S3Client()
  const { detaExport } = config.S3
  return {
    storeCompanyData: async (companyId, data) => {
      const command = new PutObjectCommand({
        Bucket: detaExport.bucketName,
        Key: `${companyId}.json`,
        Body: Buffer.from(JSON.stringify(data)),
        ContentType: 'application/json'
      })
      const result = await S3.send(command)
      return result
    }
  }
}
