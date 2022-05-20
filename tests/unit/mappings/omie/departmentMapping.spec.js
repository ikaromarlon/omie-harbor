const { services: { omie: { providerName } } } = require('../../../../src/config')
const makeDepartmentMapping = require('../../../../src/mappings/omie/departmentMapping')
const {
  omieDepartmentsResponseMock,
  omieDepartmentParsedMock,
  omieDepartmentParentParsedMock
} = require('../../../mocks')

const makeSut = () => {
  const omieDepartmentMock = omieDepartmentsResponseMock.departamentos[1]
  const omieDepartmentParentMock = omieDepartmentsResponseMock.departamentos[2]
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: makeDepartmentMapping({ providerName }),
    omieDepartmentMock,
    omieDepartmentParentMock,
    companyIdMock
  }
}

describe('Department Mapping', () => {
  it('Should return mapped department successfully', () => {
    const { sut, omieDepartmentMock, companyIdMock } = makeSut()
    const result = sut({ omieDepartment: omieDepartmentMock, companyId: companyIdMock })
    expect(result).toEqual(omieDepartmentParsedMock)
  })

  it('Should return mapped parent department successfully', () => {
    const { sut, omieDepartmentParentMock, companyIdMock } = makeSut()
    const result = sut({ omieDepartment: omieDepartmentParentMock, companyId: companyIdMock })
    expect(result).toEqual(omieDepartmentParentParsedMock)
  })
})
