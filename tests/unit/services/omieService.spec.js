jest.mock('../../../src/services/utils/omieErrorHandler', () => jest.fn((omieError, response) => response))

const omieErrorHandler = require('../../../src/services/utils/omieErrorHandler')
const makeOmieService = require('../../../src/services/omieService')
const {
  omieCompaniesResponseMock,
  omieActivitiesResponseMock,
  omieCnaeResponseMock,
  omieCustomersResponseMock,
  omieCategoriesResponseMock,
  omieDepartmentsResponseMock,
  omieProjectsResponseMock,
  omieProductsResponseMock,
  omieServicesResponseMock,
  omieProductOrdersResponseMock
} = require('../../mocks')

const makeSut = () => {
  const payloadMock = { appKey: 'the_app_key', appSecret: 'the_app_secret' }

  const requesterMock = {
    post: async () => Promise.resolve({})
  }

  const omieErrorMock = new Error('Omie response error')

  return {
    sut: makeOmieService({ requester: requesterMock }),
    payloadMock,
    requesterMock,
    omieErrorMock
  }
}

describe('Omie Service', () => {
  describe('getCompany method', () => {
    it('Should return null if getCompany throws an error', async () => {
      const { sut, payloadMock, requesterMock, omieErrorMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockRejectedValueOnce(omieErrorMock)
      const result = await sut.getCompany(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(omieErrorMock, null, false)
      expect(result).toBe(null)
    })
    it('Should return a company response successfully', async () => {
      const { sut, payloadMock, requesterMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockResolvedValueOnce({ data: omieCompaniesResponseMock })
      const result = await sut.getCompany(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(omieCompaniesResponseMock.empresas_cadastro[0])
    })
  })

  describe('getActivities method', () => {
    it('Should return an empty array if getActivities throws an error', async () => {
      const { sut, payloadMock, requesterMock, omieErrorMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockRejectedValueOnce(omieErrorMock)
      const result = await sut.getActivities(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(omieErrorMock, [], false)
      expect(result).toEqual([])
    })
    it('Should call getActivities and return response successfully', async () => {
      const { sut, payloadMock, requesterMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockResolvedValueOnce({ data: omieActivitiesResponseMock })
      const result = await sut.getActivities(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(omieActivitiesResponseMock.lista_tipos_atividade)
    })
  })

  describe('getCnae method', () => {
    it('Should return an empty array if getCnae throws an error', async () => {
      const { sut, payloadMock, requesterMock, omieErrorMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockRejectedValueOnce(omieErrorMock)
      const result = await sut.getCnae(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(omieErrorMock, [], false)
      expect(result).toEqual([])
    })
    it('Should call getCnae and return response successfully', async () => {
      const { sut, payloadMock, requesterMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockResolvedValueOnce({ data: omieCnaeResponseMock })
      const result = await sut.getCnae(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(omieCnaeResponseMock.cadastros)
    })
  })

  describe('getCustomers method', () => {
    it('Should return an empty array if getCustomers throws an error', async () => {
      const { sut, payloadMock, requesterMock, omieErrorMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockRejectedValueOnce(omieErrorMock)
      const result = await sut.getCustomers(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(omieErrorMock, [], false)
      expect(result).toEqual([])
    })
    it('Should call getCustomers and return response successfully', async () => {
      const { sut, payloadMock, requesterMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockResolvedValueOnce({ data: omieCustomersResponseMock })
      const result = await sut.getCustomers(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(omieCustomersResponseMock.clientes_cadastro)
    })
  })

  describe('getCategories method', () => {
    it('Should return an empty array if getCategories throws an error', async () => {
      const { sut, payloadMock, requesterMock, omieErrorMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockRejectedValueOnce(omieErrorMock)
      const result = await sut.getCategories(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(omieErrorMock, [], false)
      expect(result).toEqual([])
    })
    it('Should call getCategories and return response successfully', async () => {
      const { sut, payloadMock, requesterMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockResolvedValueOnce({ data: omieCategoriesResponseMock })
      const result = await sut.getCategories(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(omieCategoriesResponseMock.categoria_cadastro)
    })
  })

  describe('getDepartments method', () => {
    it('Should return an empty array if getDepartments throws an error', async () => {
      const { sut, payloadMock, requesterMock, omieErrorMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockRejectedValueOnce(omieErrorMock)
      const result = await sut.getDepartments(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(omieErrorMock, [], false)
      expect(result).toEqual([])
    })
    it('Should call getDepartments and return response successfully', async () => {
      const { sut, payloadMock, requesterMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockResolvedValueOnce({ data: omieDepartmentsResponseMock })
      const result = await sut.getDepartments(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(omieDepartmentsResponseMock.departamentos)
    })
  })

  describe('getProjects method', () => {
    it('Should return an empty array if getProjects throws an error', async () => {
      const { sut, payloadMock, requesterMock, omieErrorMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockRejectedValueOnce(omieErrorMock)
      const result = await sut.getProjects(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(omieErrorMock, [], false)
      expect(result).toEqual([])
    })
    it('Should call getProjects and return response successfully', async () => {
      const { sut, payloadMock, requesterMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockResolvedValueOnce({ data: omieProjectsResponseMock })
      const result = await sut.getProjects(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(omieProjectsResponseMock.cadastro)
    })
  })

  describe('getProducts method', () => {
    it('Should return an empty array if getProducts throws an error', async () => {
      const { sut, payloadMock, requesterMock, omieErrorMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockRejectedValueOnce(omieErrorMock)
      const result = await sut.getProducts(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(omieErrorMock, [], false)
      expect(result).toEqual([])
    })
    it('Should call getProducts and return response successfully', async () => {
      const { sut, payloadMock, requesterMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockResolvedValueOnce({ data: omieProductsResponseMock })
      const result = await sut.getProducts(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(omieProductsResponseMock.produto_servico_cadastro)
    })
  })

  describe('getServices method', () => {
    it('Should return an empty array if getServices throws an error', async () => {
      const { sut, payloadMock, requesterMock, omieErrorMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockRejectedValueOnce(omieErrorMock)
      const result = await sut.getServices(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(omieErrorMock, [], false)
      expect(result).toEqual([])
    })
    it('Should call getServices and return response successfully', async () => {
      const { sut, payloadMock, requesterMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockResolvedValueOnce({ data: omieServicesResponseMock })
      const result = await sut.getServices(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(omieServicesResponseMock.cadastros)
    })
  })

  describe('getProductOrders method', () => {
    it('Should return an empty array if getProductOrders throws an error', async () => {
      const { sut, payloadMock, requesterMock, omieErrorMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockRejectedValueOnce(omieErrorMock)
      const result = await sut.getProductOrders(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(omieErrorHandler).toHaveBeenCalledWith(omieErrorMock, [], false)
      expect(result).toEqual([])
    })
    it('Should call getProductOrders and return response successfully', async () => {
      const { sut, payloadMock, requesterMock } = makeSut()
      const spyPost = jest.spyOn(requesterMock, 'post').mockResolvedValueOnce({ data: omieProductOrdersResponseMock })
      const result = await sut.getProductOrders(payloadMock)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(result).toEqual(omieProductOrdersResponseMock.pedido_venda_produto)
    })
  })
})
