const { services: { omie: { providerName } } } = require('../../../../src/config')
const makeProjectMapping = require('../../../../src/mappings/omie/projectMapping')
const {
  omieProjectsResponseMock,
  omieProjectParsedMock
} = require('../../../mocks')

const makeSut = () => {
  const omieProjectMock = omieProjectsResponseMock.cadastro[0]
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: makeProjectMapping({ providerName }),
    omieProjectMock,
    companyIdMock
  }
}

describe('Project Mapping', () => {
  it('Should return mapped project successfully', () => {
    const { sut, omieProjectMock, companyIdMock } = makeSut()
    const result = sut({ omieProject: omieProjectMock, companyId: companyIdMock })
    expect(result).toEqual(omieProjectParsedMock)
  })
})
