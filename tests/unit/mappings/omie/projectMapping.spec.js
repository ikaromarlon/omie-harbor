const { services: { omie: { providerName } } } = require('../../../../src/config')
const makeProjectMapping = require('../../../../src/mappings/omie/projectMapping')
const {
  mockOmieProjectsResponse,
  mockParsedOmieProject
} = require('../../../mocks')

const makeSut = () => {
  const mockOmieProject = mockOmieProjectsResponse.cadastro[0]
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: makeProjectMapping({ providerName }),
    mockOmieProject,
    mockCompanyId
  }
}

describe('Project Mapping', () => {
  it('Should return mapped project successfully', () => {
    const { sut, mockOmieProject, mockCompanyId } = makeSut()
    const result = sut({ omieProject: mockOmieProject, companyId: mockCompanyId })
    expect(result).toEqual(mockParsedOmieProject)
  })
})
