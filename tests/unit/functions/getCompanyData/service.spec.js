const makeService = require('../../../../src/functions/getCompanyData/service')
const { NotFoundException, ForbiddenException } = require('../../../../src/common/errors')
const { mockSavedOmieCompanies } = require('../../../mocks')

const makeSut = () => {
  const mockPayload = { id: '25c176b6-b200-4575-9217-e23c6105163c' }

  const mockCompanyRepository = {
    findById: jest.fn(async () => Promise.resolve(mockSavedOmieCompanies[0]))
  }

  const mockS3 = {
    getCompanyDataSignedUrl: jest.fn(async () => Promise.resolve('https://the-bucket-url/data.json'))
  }

  const service = makeService({
    companiesRepository: mockCompanyRepository,
    s3: mockS3
  })

  return {
    sut: service,
    mockPayload,
    mockCompanyRepository,
    mockS3
  }
}

describe('getCompanyData Service', () => {
  it('Should not find company and throws a NotFoundException', async () => {
    const sutPackage = makeSut()
    const { sut, mockCompanyRepository } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    const mockPayload = { id: 'any-invalid-or-non-existing-id' }
    mockCompanyRepository.findById.mockResolvedValueOnce(null)
    try {
      await sut(mockPayload)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe('Company not found')
    }
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(mockPayload.id)
    expect(spySut).toHaveBeenCalledTimes(0)
  })

  it('Should find an inactive company and throws an ForbiddenException', async () => {
    const sutPackage = makeSut()
    const { sut, mockPayload, mockCompanyRepository } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    mockCompanyRepository.findById.mockResolvedValueOnce({ ...mockSavedOmieCompanies[0], isActive: false })
    try {
      await sut(mockPayload)
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException)
      expect(error.message).toBe('Company is not active')
    }
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(mockPayload.id)
    expect(spySut).toHaveBeenCalledTimes(0)
  })

  it('Should find a company by id return it successfully', async () => {
    const { sut, mockPayload, mockCompanyRepository, mockS3 } = makeSut()
    const result = await sut(mockPayload)
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(mockPayload.id)
    expect(mockS3.getCompanyDataSignedUrl).toHaveBeenCalledWith(mockPayload.id)
    expect(result).toBe('https://the-bucket-url/data.json')
  })
})
