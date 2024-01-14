const makeService = require('../../../../src/functions/getCompanies/service')
const { NotFoundException } = require('../../../../src/common/errors')
const {
  mockSavedOmieCompanies
} = require('../../../mocks')

const makeSut = () => {
  const payload = {}

  const mockCompaniesRepository = {
    findById: jest.fn(async () => mockSavedOmieCompanies[0]),
    find: jest.fn(async () => mockSavedOmieCompanies)
  }

  const service = makeService({
    companiesRepository: mockCompaniesRepository
  })

  return {
    sut: service,
    payload,
    mockCompaniesRepository
  }
}

describe('getCompanies - service', () => {
  it('Should not find company and throws a NotFoundException', async () => {
    const sutPackage = makeSut()
    const { sut, payload, mockCompaniesRepository } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    payload.id = 'any-invalid-or-non-existing-id'
    mockCompaniesRepository.findById.mockResolvedValueOnce(null)
    try {
      await sut(payload)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe('Company not found')
    }
    expect(mockCompaniesRepository.findById).toHaveBeenCalledWith(payload.id)
    expect(spySut).toHaveReturnedTimes(0)
  })

  it('Should return one company successfully', async () => {
    const { sut, payload, mockCompaniesRepository } = makeSut()
    payload.id = '25c176b6-b200-4575-9217-e23c6105163c'
    const result = await sut(payload)
    expect(mockCompaniesRepository.findById).toHaveBeenCalledWith(payload.id)
    expect(mockCompaniesRepository.find).toHaveBeenCalledTimes(0)
    expect(result).toBe(mockSavedOmieCompanies[0])
  })

  it('Should return all companies', async () => {
    const { sut, payload, mockCompaniesRepository } = makeSut()
    const result = await sut(payload)
    expect(mockCompaniesRepository.findById).toHaveBeenCalledTimes(0)
    expect(mockCompaniesRepository.find).toHaveBeenCalledWith({})
    expect(result).toBeInstanceOf(Array)
    expect(result).toBe(mockSavedOmieCompanies)
  })

  it('Should return filtered companies', async () => {
    const { sut, payload, mockCompaniesRepository } = makeSut()
    payload.isActive = true
    const mockFilter = {
      ...payload
    }
    const result = await sut(payload)
    expect(mockCompaniesRepository.findById).toHaveBeenCalledTimes(0)
    expect(mockCompaniesRepository.find).toHaveBeenCalledWith(mockFilter)
    expect(result).toBeInstanceOf(Array)
    expect(result).toBe(mockSavedOmieCompanies)
  })
})
