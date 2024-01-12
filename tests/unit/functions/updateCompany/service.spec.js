const makeService = require('../../../../src/functions/updateCompany/service')
const { NotFoundException } = require('../../../../src/common/errors')
const {
  mockSavedOmieCompanies
} = require('../../../mocks')

jest.useFakeTimers('modern').setSystemTime(new Date())

const makeSut = () => {
  const mockPayload = {
    id: '25c176b6-b200-4575-9217-e23c6105163c',
    isActive: false
  }

  const mockCompanyRepository = {
    findById: jest.fn(async () => mockSavedOmieCompanies[0]),
    update: jest.fn(async () => ({
      ...mockSavedOmieCompanies[0],
      isActive: mockPayload.isActive,
      statusAt: new Date().toISOString()
    }))
  }

  const useCase = makeService({
    companiesRepository: mockCompanyRepository
  })

  return {
    sut: useCase,
    mockPayload,
    mockCompanyRepository
  }
}

describe('updateCompany Service', () => {
  it('Should not find company and throws a NotFoundException', async () => {
    const sutPackage = makeSut()
    const { sut, mockPayload, mockCompanyRepository } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    mockPayload.id = 'any-invalid-or-non-existing-id'
    mockCompanyRepository.findById.mockResolvedValueOnce(null)
    try {
      await sut(mockPayload)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.statusCode).toBe(404)
      expect(error.message).toBe('Company not found')
    }
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(mockPayload.id)
    expect(spySut).toHaveBeenCalledTimes(0)
  })

  it('Should return unchanged company', async () => {
    const { sut, mockPayload, mockCompanyRepository } = makeSut()
    mockPayload.isActive = true
    const result = await sut(mockPayload)
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(mockPayload.id)
    expect(mockCompanyRepository.update).toHaveBeenCalledTimes(0)
    expect(result).toEqual(mockSavedOmieCompanies[0])
  })

  it('Should return updated company successfully', async () => {
    const { sut, mockPayload, mockCompanyRepository } = makeSut()
    const result = await sut(mockPayload)
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(mockPayload.id)
    expect(mockCompanyRepository.update).toHaveBeenCalledWith({
      id: mockPayload.id,
      isActive: mockPayload.isActive,
      statusAt: new Date().toISOString()
    })
    expect(result).toEqual({
      ...mockSavedOmieCompanies[0],
      isActive: mockPayload.isActive,
      statusAt: new Date().toISOString()
    })
  })
})
