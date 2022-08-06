jest.mock('../../../src/services/utils/omieErrorHandler', () => jest.fn((omieError, response) => response))

const omieErrorHandler = require('../../../src/services/utils/omieErrorHandler')
const makeOmieService = require('../../../src/services/omieService')
const {
  mockOmieCompaniesResponse,
  mockOmieActivitiesResponse,
  mockOmieCnaeResponse,
  mockOmieCustomersResponse,
  mockOmieCategoriesResponse,
  mockOmieDepartmentsResponse,
  mockOmieProjectsResponse,
  mockOmieProductsResponse,
  mockOmieServicesResponse,
  mockOmieProductOrdersResponse
} = require('../../mocks')

const makeSut = () => {
  const mockPayload = { appKey: 'the_app_key', appSecret: 'the_app_secret' }

  const mockRequester = {
    post: async () => Promise.resolve({})
  }

  const mockOmieError = new Error('Omie response error')

  return {
    sut: makeOmieService({ requester: mockRequester }),
    mockPayload,
    mockRequester,
    mockOmieError
  }
}

describe('Omie Service', () => {
  describe('getCompany method', () => {
    it('Should return null if getCompany throws an error', async () => {
      const { sut, mockPayload, mockRequester, mockOmieError } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockRejectedValueOnce(mockOmieError)
      const result = await sut.getCompany(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(mockOmieError, null, false)
      expect(result).toBe(null)
    })
    it('Should return a company response successfully', async () => {
      const { sut, mockPayload, mockRequester } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockResolvedValueOnce({ data: mockOmieCompaniesResponse })
      const result = await sut.getCompany(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockOmieCompaniesResponse.empresas_cadastro[0])
    })
  })

  describe('getActivities method', () => {
    it('Should return an empty array if getActivities throws an error', async () => {
      const { sut, mockPayload, mockRequester, mockOmieError } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockRejectedValueOnce(mockOmieError)
      const result = await sut.getActivities(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(mockOmieError, [], false)
      expect(result).toEqual([])
    })
    it('Should call getActivities and return response successfully', async () => {
      const { sut, mockPayload, mockRequester } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockResolvedValueOnce({ data: mockOmieActivitiesResponse })
      const result = await sut.getActivities(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockOmieActivitiesResponse.lista_tipos_atividade)
    })
  })

  describe('getCnae method', () => {
    it('Should return an empty array if getCnae throws an error', async () => {
      const { sut, mockPayload, mockRequester, mockOmieError } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockRejectedValueOnce(mockOmieError)
      const result = await sut.getCnae(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(mockOmieError, [], false)
      expect(result).toEqual([])
    })
    it('Should call getCnae and return response successfully', async () => {
      const { sut, mockPayload, mockRequester } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockResolvedValueOnce({ data: mockOmieCnaeResponse })
      const result = await sut.getCnae(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockOmieCnaeResponse.cadastros)
    })
  })

  describe('getCustomers method', () => {
    it('Should return an empty array if getCustomers throws an error', async () => {
      const { sut, mockPayload, mockRequester, mockOmieError } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockRejectedValueOnce(mockOmieError)
      const result = await sut.getCustomers(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(mockOmieError, [], false)
      expect(result).toEqual([])
    })
    it('Should call getCustomers and return response successfully', async () => {
      const { sut, mockPayload, mockRequester } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockResolvedValueOnce({ data: mockOmieCustomersResponse })
      const result = await sut.getCustomers(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockOmieCustomersResponse.clientes_cadastro)
    })
  })

  describe('getCategories method', () => {
    it('Should return an empty array if getCategories throws an error', async () => {
      const { sut, mockPayload, mockRequester, mockOmieError } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockRejectedValueOnce(mockOmieError)
      const result = await sut.getCategories(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(mockOmieError, [], false)
      expect(result).toEqual([])
    })
    it('Should call getCategories and return response successfully', async () => {
      const { sut, mockPayload, mockRequester } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockResolvedValueOnce({ data: mockOmieCategoriesResponse })
      const result = await sut.getCategories(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockOmieCategoriesResponse.categoria_cadastro)
    })
  })

  describe('getDepartments method', () => {
    it('Should return an empty array if getDepartments throws an error', async () => {
      const { sut, mockPayload, mockRequester, mockOmieError } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockRejectedValueOnce(mockOmieError)
      const result = await sut.getDepartments(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(mockOmieError, [], false)
      expect(result).toEqual([])
    })
    it('Should call getDepartments and return response successfully', async () => {
      const { sut, mockPayload, mockRequester } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockResolvedValueOnce({ data: mockOmieDepartmentsResponse })
      const result = await sut.getDepartments(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockOmieDepartmentsResponse.departamentos)
    })
  })

  describe('getProjects method', () => {
    it('Should return an empty array if getProjects throws an error', async () => {
      const { sut, mockPayload, mockRequester, mockOmieError } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockRejectedValueOnce(mockOmieError)
      const result = await sut.getProjects(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(mockOmieError, [], false)
      expect(result).toEqual([])
    })
    it('Should call getProjects and return response successfully', async () => {
      const { sut, mockPayload, mockRequester } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockResolvedValueOnce({ data: mockOmieProjectsResponse })
      const result = await sut.getProjects(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockOmieProjectsResponse.cadastro)
    })
  })

  describe('getProducts method', () => {
    it('Should return an empty array if getProducts throws an error', async () => {
      const { sut, mockPayload, mockRequester, mockOmieError } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockRejectedValueOnce(mockOmieError)
      const result = await sut.getProducts(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(mockOmieError, [], false)
      expect(result).toEqual([])
    })
    it('Should call getProducts and return response successfully', async () => {
      const { sut, mockPayload, mockRequester } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockResolvedValueOnce({ data: mockOmieProductsResponse })
      const result = await sut.getProducts(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockOmieProductsResponse.produto_servico_cadastro)
    })
  })

  describe('getServices method', () => {
    it('Should return an empty array if getServices throws an error', async () => {
      const { sut, mockPayload, mockRequester, mockOmieError } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockRejectedValueOnce(mockOmieError)
      const result = await sut.getServices(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(mockOmieError, [], false)
      expect(result).toEqual([])
    })
    it('Should call getServices and return response successfully', async () => {
      const { sut, mockPayload, mockRequester } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockResolvedValueOnce({ data: mockOmieServicesResponse })
      const result = await sut.getServices(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockOmieServicesResponse.cadastros)
    })
  })

  describe('getProductOrders method', () => {
    it('Should return an empty array if getProductOrders throws an error', async () => {
      const { sut, mockPayload, mockRequester, mockOmieError } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockRejectedValueOnce(mockOmieError)
      const result = await sut.getProductOrders(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(mockOmieError, [], false)
      expect(result).toEqual([])
    })
    it('Should call getProductOrders and return response successfully', async () => {
      const { sut, mockPayload, mockRequester } = makeSut()
      const spyPost = jest.spyOn(mockRequester, 'post').mockResolvedValueOnce({ data: mockOmieProductOrdersResponse })
      const result = await sut.getProductOrders(mockPayload)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockOmieProductOrdersResponse.pedido_venda_produto)
    })
  })
})
