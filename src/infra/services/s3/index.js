const { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const config = require('../../../config')
const { NotFoundException } = require('../../../common/errors')

module.exports = () => {
  const S3 = new S3Client()
  const { dataExportBucket } = config.services.S3
  return {
    storeCompanyData: async (companyId, data) => {
      const command = new PutObjectCommand({
        Bucket: dataExportBucket.name,
        Key: `${companyId}.json`,
        Body: Buffer.from(JSON.stringify(data)),
        ContentType: 'application/json'
      })
      const result = await S3.send(command)
      return result
    },
    getCompanyDataSignedUrl: async (companyId) => {
      const params = {
        Bucket: dataExportBucket.name,
        Key: `${companyId}.json`
      }
      try {
        await S3.send(new HeadObjectCommand(params))
      } catch (error) {
        if (error.name === 'NotFound') throw new NotFoundException(`Company ${companyId} not found`)
        throw error
      }
      const command = new GetObjectCommand(params)
      const result = await getSignedUrl(S3, command, { expiresIn: dataExportBucket.signedUrlExpiration })
      return result
    }
  }
}
