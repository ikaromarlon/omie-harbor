const customerMapping = require('../../../../../src/functions/ingestionPerformer/mappings/customerMapping')
const {
  mockOmieCustomersResponse,
  mockParsedOmieCustomer,
  mockOmieCnaeResponse,
  mockOmieActivitiesResponse,
  mockOmieBanksResponse
} = require('../../../../mocks')

const makeSut = () => {
  const mockOmieCustomer = mockOmieCustomersResponse.clientes_cadastro[0]
  const mockOmieCnae = mockOmieCnaeResponse.cadastros
  const mockOmieActivities = mockOmieActivitiesResponse.lista_tipos_atividade
  const mockOmieBanks = mockOmieBanksResponse.fin_banco_cadastro
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: customerMapping,
    mockOmieCustomer,
    mockOmieCnae,
    mockOmieActivities,
    mockOmieBanks,
    mockCompanyId
  }
}

describe('Customer Mapping', () => {
  it('Should return mapped customer successfully', () => {
    const { sut, mockOmieCustomer, mockOmieCnae, mockOmieActivities, mockOmieBanks, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCustomer: mockOmieCustomer,
      omieCnae: mockOmieCnae,
      omieActivities: mockOmieActivities,
      omieBanks: mockOmieBanks
    })
    expect(result).toEqual(mockParsedOmieCustomer)
  })

  it('Should return mapped customer without first phone', () => {
    const { sut, mockOmieCustomer, mockOmieCnae, mockOmieActivities, mockOmieBanks, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCustomer: { ...mockOmieCustomer, telefone1_ddd: '', telefone1_numero: '' },
      omieCnae: mockOmieCnae,
      omieActivities: mockOmieActivities,
      omieBanks: mockOmieBanks
    })
    expect(result).toEqual({ ...mockParsedOmieCustomer, phones: [{ ...mockParsedOmieCustomer.phones[1] }] })
  })

  it('Should return mapped customer without second phone', () => {
    const { sut, mockOmieCustomer, mockOmieCnae, mockOmieActivities, mockOmieBanks, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCustomer: { ...mockOmieCustomer, telefone2_ddd: '', telefone2_numero: '' },
      omieCnae: mockOmieCnae,
      omieActivities: mockOmieActivities,
      omieBanks: mockOmieBanks
    })
    expect(result).toEqual({ ...mockParsedOmieCustomer, phones: [{ ...mockParsedOmieCustomer.phones[0] }] })
  })

  it('Should return mapped customer without cnae', () => {
    const { sut, mockOmieCustomer, mockOmieCnae, mockOmieActivities, mockOmieBanks, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCustomer: { ...mockOmieCustomer, cnae: null },
      omieCnae: mockOmieCnae,
      omieActivities: mockOmieActivities,
      omieBanks: mockOmieBanks
    })
    expect(result).toEqual({ ...mockParsedOmieCustomer, cnae: { code: null, description: null } })
  })

  it('Should return mapped customer without checkingAccount', () => {
    const { sut, mockOmieCustomer, mockOmieCnae, mockOmieActivities, mockOmieBanks, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCustomer: { ...mockOmieCustomer, dadosBancarios: {} },
      omieCnae: mockOmieCnae,
      omieActivities: mockOmieActivities,
      omieBanks: mockOmieBanks
    })
    expect(result).toEqual({
      ...mockParsedOmieCustomer,
      checkingAccount: {
        bank: {
          code: null,
          name: null
        },
        branch: null,
        accountNumber: null,
        holder: {
          cpfcnpj: null,
          name: null
        }
      }
    })
  })

  it('Should return mapped customer without activity', () => {
    const { sut, mockOmieCustomer, mockOmieCnae, mockOmieActivities, mockOmieBanks, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCustomer: { ...mockOmieCustomer, tipo_atividade: null },
      omieCnae: mockOmieCnae,
      omieActivities: mockOmieActivities,
      omieBanks: mockOmieBanks
    })
    expect(result).toEqual({ ...mockParsedOmieCustomer, activity: null })
  })

  it('Should return mapped customer without characteristics', () => {
    const { sut, mockOmieCustomer, mockOmieCnae, mockOmieActivities, mockOmieBanks, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCustomer: { ...mockOmieCustomer, caracteristicas: null },
      omieCnae: mockOmieCnae,
      omieActivities: mockOmieActivities,
      omieBanks: mockOmieBanks
    })
    expect(result).toEqual({ ...mockParsedOmieCustomer, characteristics: [] })
  })

  it('Should return mapped customer without tags', () => {
    const { sut, mockOmieCustomer, mockOmieCnae, mockOmieActivities, mockOmieBanks, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCustomer: { ...mockOmieCustomer, tags: null },
      omieCnae: mockOmieCnae,
      omieActivities: mockOmieActivities,
      omieBanks: mockOmieBanks
    })
    expect(result).toEqual({ ...mockParsedOmieCustomer, tags: [] })
  })

  it('Should return mapped customer for non legal people', () => {
    const { sut, mockOmieCustomer, mockOmieCnae, mockOmieActivities, mockOmieBanks, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCustomer: { ...mockOmieCustomer, pessoa_fisica: 'S' },
      omieCnae: mockOmieCnae,
      omieActivities: mockOmieActivities,
      omieBanks: mockOmieBanks
    })
    expect(result).toEqual({ ...mockParsedOmieCustomer, personType: 'F' })
  })
})
