const { services: { omie: { providerName } } } = require('../../../../src/config')
const makeDepartmentMapping = require('../../../../src/mappings/omie/departmentMapping')
const {
  mockOmieDepartmentsResponse,
  mockParsedOmieDepartment,
  mockParsedOmieParentDepartment
} = require('../../../mocks')

const makeSut = () => {
  const mockOmieDepartment = mockOmieDepartmentsResponse.departamentos[1]
  const mockOmieDepartmentParent = mockOmieDepartmentsResponse.departamentos[2]
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: makeDepartmentMapping({ providerName }),
    mockOmieDepartment,
    mockOmieDepartmentParent,
    mockCompanyId
  }
}

describe('Department Mapping', () => {
  it('Should return mapped department successfully', () => {
    const { sut, mockOmieDepartment, mockCompanyId } = makeSut()
    const result = sut({ omieDepartment: mockOmieDepartment, companyId: mockCompanyId })
    expect(result).toEqual(mockParsedOmieDepartment)
  })

  it('Should return mapped parent department successfully', () => {
    const { sut, mockOmieDepartmentParent, mockCompanyId } = makeSut()
    const result = sut({ omieDepartment: mockOmieDepartmentParent, companyId: mockCompanyId })
    expect(result).toEqual(mockParsedOmieParentDepartment)
  })
})
