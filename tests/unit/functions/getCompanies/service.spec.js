const makeService = require('../../../../src/functions/getCompanies/service')
const { NotFoundException } = require('../../../../src/common/errors')
const {
  mockCompany
} = require('../../../mocks')

const makeSut = () => {
  const payload = {}

  const mockCompanyRepository = {
    findById: jest.fn(async () => mockCompany),
    find: jest.fn(async () => [mockCompany])
  }

  const service = makeService({
    companiesRepository: mockCompanyRepository
  })

  return {
    sut: service,
    payload,
    mockCompanyRepository
  }
}

describe('getCompanies - service', () => {
  it('Should not find company and throws a NotFoundException', async () => {
    const sutPackage = makeSut()
    const { sut, payload, mockCompanyRepository } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    payload.id = 'any-invalid-or-non-existing-id'
    mockCompanyRepository.findById.mockResolvedValueOnce(null)
    try {
      await sut(payload)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe('Company not found')
    }
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(payload.id)
    expect(spySut).toHaveReturnedTimes(0)
  })

  it('Should return one company successfully', async () => {
    const { sut, payload, mockCompanyRepository } = makeSut()
    payload.id = '25c176b6-b200-4575-9217-e23c6105163c'
    const result = await sut(payload)
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(payload.id)
    expect(mockCompanyRepository.find).toHaveBeenCalledTimes(0)
    expect(result).toEqual(mockCompany)
  })

  it('Should return all companies', async () => {
    const { sut, payload, mockCompanyRepository } = makeSut()
    const result = await sut(payload)
    expect(mockCompanyRepository.findById).toHaveBeenCalledTimes(0)
    expect(mockCompanyRepository.find).toHaveBeenCalledWith({})
    expect(result).toBeInstanceOf(Array)
    expect(result).toEqual([mockCompany])
  })

  it('Should return filtered companies', async () => {
    const { sut, payload, mockCompanyRepository } = makeSut()
    payload.isActive = true
    const mockFilter = {
      ...payload
    }
    const result = await sut(payload)
    expect(mockCompanyRepository.findById).toHaveBeenCalledTimes(0)
    expect(mockCompanyRepository.find).toHaveBeenCalledWith(mockFilter)
    expect(result).toBeInstanceOf(Array)
    expect(result).toEqual([mockCompany])
  })
})
