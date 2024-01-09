const config = require('../config')
const mongodb = require('../infra/db/mongodb')

module.exports = () => {
  const repository = mongodb.repository('companies', config.db.mongodb)

  const createCompany = async (data) => {
    return repository.insertOne(data)
  }

  const getCompanies = async ({
    isActive
  } = {}) => {
    const filters = {}
    if (isActive !== undefined) filters.isActive = isActive
    return repository.findMany(filters)
  }

  const getCompanyById = async id => {
    if (!id) return null
    return repository.findOne({ id })
  }

  const getCompanyByCredentials = async (appKey, appSecret) => {
    if (!appKey || !appSecret) return null
    return repository.findOne({ credentials: { appKey, appSecret } })
  }

  const updateCompany = async ({ id, ...data }) => {
    return repository.updateOne({ id }, data)
  }

  return {
    createCompany,
    getCompanies,
    getCompanyById,
    getCompanyByCredentials,
    updateCompany
  }
}
