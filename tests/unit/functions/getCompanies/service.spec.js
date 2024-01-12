const makeService = require('../../../../src/functions/getCompanies/service')
const { NotFoundException } = require('../../../../src/common/errors')
const {
  mockSavedOmieCompanies
} = require('../../../mocks')

const makeSut = () => {
  const mockPayload = {}

  const mockCompaniesRepository = {
    findById: jest.fn(async () => mockSavedOmieCompanies[0]),
    find: jest.fn(async () => mockSavedOmieCompanies)
  }

  const useCase = makeService({
    companiesRepository: mockCompaniesRepository
  })

  return {
    sut: useCase,
    mockPayload,
    mockCompaniesRepository
  }
}

describe('getCompanies Service', () => {
  it('Should not find company and throws a NotFoundException', async () => {
    const sutPackage = makeSut()
    const { sut, mockPayload, mockCompaniesRepository } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    mockPayload.id = 'any-invalid-or-non-existing-id'
    mockCompaniesRepository.findById.mockResolvedValueOnce(null)
    try {
      await sut(mockPayload)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.statusCode).toBe(404)
      expect(error.message).toBe('Company not found')
    }
    expect(mockCompaniesRepository.findById).toHaveBeenCalledWith(mockPayload.id)
    expect(spySut).toHaveReturnedTimes(0)
  })

  it('Should return one company successfully', async () => {
    const { sut, mockPayload, mockCompaniesRepository } = makeSut()
    mockPayload.id = '25c176b6-b200-4575-9217-e23c6105163c'
    const result = await sut(mockPayload)
    expect(mockCompaniesRepository.findById).toHaveBeenCalledWith(mockPayload.id)
    expect(mockCompaniesRepository.find).toHaveBeenCalledTimes(0)
    expect(result).toBe(mockSavedOmieCompanies[0])
  })

  it('Should return all companies', async () => {
    const { sut, mockPayload, mockCompaniesRepository } = makeSut()
    const result = await sut(mockPayload)
    expect(mockCompaniesRepository.findById).toHaveBeenCalledTimes(0)
    expect(mockCompaniesRepository.find).toHaveBeenCalledWith({})
    expect(result).toBeInstanceOf(Array)
    expect(result).toBe(mockSavedOmieCompanies)
  })

  it('Should return filtered companies', async () => {
    const { sut, mockPayload, mockCompaniesRepository } = makeSut()
    mockPayload.isActive = true
    const mockFilter = {
      ...mockPayload
    }
    const result = await sut(mockPayload)
    expect(mockCompaniesRepository.findById).toHaveBeenCalledTimes(0)
    expect(mockCompaniesRepository.find).toHaveBeenCalledWith(mockFilter)
    expect(result).toBeInstanceOf(Array)
    expect(result).toBe(mockSavedOmieCompanies)
  })
})
