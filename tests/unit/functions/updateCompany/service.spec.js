const makeService = require('../../../../src/functions/updateCompany/service')
const { NotFoundException } = require('../../../../src/common/errors')
const {
  mockCompany
} = require('../../../mocks')

jest.useFakeTimers('modern').setSystemTime(new Date())

const makeSut = () => {
  const payload = {
    id: '25c176b6-b200-4575-9217-e23c6105163c',
    isActive: false
  }

  const mockCompanyRepository = {
    findById: jest.fn(async () => mockCompany),
    update: jest.fn(async () => ({
      ...mockCompany,
      isActive: payload.isActive,
      statusAt: new Date().toISOString()
    }))
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

describe('updateCompany - service', () => {
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
    expect(spySut).toHaveBeenCalledTimes(0)
  })

  it('Should return unchanged company', async () => {
    const { sut, payload, mockCompanyRepository } = makeSut()
    payload.isActive = true
    const result = await sut(payload)
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(payload.id)
    expect(mockCompanyRepository.update).toHaveBeenCalledTimes(0)
    expect(result).toEqual(mockCompany)
  })

  it('Should return updated company successfully', async () => {
    const { sut, payload, mockCompanyRepository } = makeSut()
    const result = await sut(payload)
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(payload.id)
    expect(mockCompanyRepository.update).toHaveBeenCalledWith({
      id: payload.id,
      isActive: payload.isActive,
      statusAt: new Date().toISOString()
    })
    expect(result).toEqual({
      ...mockCompany,
      isActive: payload.isActive,
      statusAt: new Date().toISOString()
    })
  })
})
