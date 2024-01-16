const projectMapping = require('../../../../../src/functions/ingestionPerformer/mappings/projectMapping')
const {
  mockOmieProjectsResponse,
  mockProject
} = require('../../../../mocks')

delete mockProject.id
delete mockProject.createdAt
delete mockProject.updatedAt

const makeSut = () => {
  const mockOmieProject = mockOmieProjectsResponse.cadastro[0]
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: projectMapping,
    mockOmieProject,
    mockCompanyId
  }
}

describe('Project Mapping', () => {
  it('Should return mapped project successfully', () => {
    const { sut, mockOmieProject, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieProject: mockOmieProject
    })
    expect(result).toEqual(mockProject)
  })
})
