const omieErrorHandler = require('./utils/omieErrorHandler')
const makeOmieRequest = require('./utils/makeOmieRequest')
const { services: { omie: { apiBaseUrl } } } = require('../config')
const { isoDateToBR } = require('../utils/helpers')

module.exports = ({ requester }) => {
  const defaultPagination = { pageNumber: 1, recordsPerPage: 500 }
  const defaultForceThrow = false

  const getCompany = async ({ appKey, appSecret }, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/geral/empresas/`

    const body = {
      call: 'ListarEmpresas',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage,
        apenas_importado_api: 'N'
      }]
    }

    const propertiesMapping = { data: 'empresas_cadastro', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response[0]
    } catch (error) {
      return omieErrorHandler(error, null, forceThrow)
    }
  }

  const getActivities = async ({ appKey, appSecret }, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/geral/tpativ/`

    const body = {
      call: 'ListarTipoAtiv',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        filtrar_por_codigo: '',
        filtrar_por_descricao: ''
      }]
    }

    const propertiesMapping = { data: 'lista_tipos_atividade', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getCnae = async ({ appKey, appSecret }, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/produtos/cnae/`

    const body = {
      call: 'ListarCNAE',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage
      }]
    }

    const propertiesMapping = { data: 'cadastros', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getBanks = async ({ appKey, appSecret }, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/geral/bancos/`

    const body = {
      call: 'ListarBancos',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage
      }]
    }

    const propertiesMapping = { data: 'fin_banco_cadastro', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getCheckingAccountTypes = async ({ appKey, appSecret }, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/geral/tipocc/`

    const body = {
      call: 'ListarTiposCC',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage
      }]
    }

    const propertiesMapping = { data: 'cadastros', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getCheckingAccounts = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/geral/contacorrente/`

    const body = {
      call: 'ListarContasCorrentes',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage
      }]
    }
    if (params.startDate) body.param[0].filtrar_por_data_de = isoDateToBR(params.startDate)[0]
    if (params.endDate) body.param[0].filtrar_por_data_ate = isoDateToBR(params.endDate)[0]

    const propertiesMapping = { data: 'ListarContasCorrentes', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getCustomers = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/geral/clientes/`

    const body = {
      call: 'ListarClientes',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage,
        apenas_importado_api: 'N',
        exibir_caracteristicas: 'S'
      }]
    }
    if (params.startDate) body.param[0].filtrar_por_data_de = isoDateToBR(params.startDate)[0]
    if (params.endDate) body.param[0].filtrar_por_data_ate = isoDateToBR(params.endDate)[0]

    const propertiesMapping = { data: 'clientes_cadastro', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getCategories = async ({ appKey, appSecret }, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/geral/categorias/`

    const body = {
      call: 'ListarCategorias',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage
      }]
    }

    const propertiesMapping = { data: 'categoria_cadastro', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getDepartments = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/geral/departamentos/`

    const body = {
      call: 'ListarDepartamentos',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage
      }]
    }
    if (params.startDate) body.param[0].filtrar_por_data_de = isoDateToBR(params.startDate)[0]
    if (params.endDate) body.param[0].filtrar_por_data_ate = isoDateToBR(params.endDate)[0]

    const propertiesMapping = { data: 'departamentos', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getProjects = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/geral/projetos/`

    const body = {
      call: 'ListarProjetos',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage,
        apenas_importado_api: 'N'
      }]
    }
    if (params.startDate) body.param[0].filtrar_por_data_de = isoDateToBR(params.startDate)[0]
    if (params.endDate) body.param[0].filtrar_por_data_ate = isoDateToBR(params.endDate)[0]

    const propertiesMapping = { data: 'cadastro', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getProducts = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/geral/produtos/`

    const body = {
      call: 'ListarProdutos',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage,
        apenas_importado_api: 'N',
        filtrar_apenas_omiepdv: 'N',
        exibir_caracteristicas: 'S'
      }]
    }
    if (params.startDate) body.param[0].filtrar_por_data_de = isoDateToBR(params.startDate)[0]
    if (params.endDate) body.param[0].filtrar_por_data_ate = isoDateToBR(params.endDate)[0]

    const propertiesMapping = { data: 'produto_servico_cadastro', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getServices = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/servicos/servico/`

    const body = {
      call: 'ListarCadastroServico',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        nPagina: defaultPagination.pageNumber,
        nRegPorPagina: defaultPagination.recordsPerPage
      }]
    }
    if (params.startDate) {
      body.param[0].dInclusaoInicial = isoDateToBR(params.startDate)[0]
      body.param[0].dAlteracaoInicial = isoDateToBR(params.startDate)[0]
    }
    if (params.endDate) {
      body.param[0].dInclusaoFinal = isoDateToBR(params.endDate)[0]
      body.param[0].dAlteracaoFinal = isoDateToBR(params.endDate)[0]
    }

    const propertiesMapping = { data: 'cadastros', pagination: { currentPage: 'nPagina', totalPages: 'nTotPaginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getBillingSteps = async ({ appKey, appSecret }, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/produtos/etapafat/`

    const body = {
      call: 'ListarEtapasFaturamento',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage
      }]
    }

    const propertiesMapping = { data: 'cadastros', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getContractBillingTypes = async ({ appKey, appSecret }, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/servicos/contratotpfat/`

    const body = {
      call: 'ListarTipoFatContrato',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage
      }]
    }

    const propertiesMapping = { data: 'cadastros', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getContractSteps = async ({ appKey, appSecret }, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/servicos/contratofat/`

    const body = {
      call: 'ObterContratos',
      app_key: appKey,
      app_secret: appSecret
    }

    const STEPS = {
      20: 'NAO_FATURADO',
      30: 'FATURADO_NO_MES',
      40: 'A_RENOVAR'
    }

    try {
      const responses = await Promise.all(Object.keys(STEPS).map(async (step) => requester.post(url, { ...body, param: [{ cEtapa: String(step) }] })))

      const response = responses.flatMap(e => ({ etapa: e.data.cEtapa, descricao: STEPS[e.data.cEtapa], contratos: e.data.listaContratos }))

      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getContracts = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/servicos/contrato/`

    const body = {
      call: 'ListarContratos',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage,
        apenas_importado_api: 'N',
        cExibeObs: 'S',
        cExibirInfoCadastro: 'S'
      }]
    }
    if (params.startDate) body.param[0].filtrar_por_data_de = isoDateToBR(params.startDate)[0]
    if (params.endDate) body.param[0].filtrar_por_data_de = isoDateToBR(params.endDate)[0]

    const propertiesMapping = { data: 'contratoCadastro', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getProductOrders = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/produtos/pedido/`

    const body = {
      call: 'ListarPedidos',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage,
        apenas_importado_api: 'N'
      }]
    }
    if (params.startDate) body.param[0].filtrar_por_data_de = isoDateToBR(params.startDate)[0]
    if (params.endDate) body.param[0].filtrar_por_data_ate = isoDateToBR(params.endDate)[0]

    const propertiesMapping = { data: 'pedido_venda_produto', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getServiceOrders = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/servicos/os/`

    const body = {
      call: 'ListarOS',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage,
        apenas_importado_api: 'N'
      }]
    }
    if (params.startDate) body.param[0].filtrar_por_data_de = isoDateToBR(params.startDate)[0]
    if (params.endDate) body.param[0].filtrar_por_data_ate = isoDateToBR(params.endDate)[0]

    const propertiesMapping = { data: 'osCadastro', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getProductInvoices = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/produtos/nfconsultar/`

    const body = {
      call: 'ListarNF',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        pagina: defaultPagination.pageNumber,
        registros_por_pagina: defaultPagination.recordsPerPage,
        apenas_importado_api: 'N',
        ordenar_por: 'CODIGO',
        cDetalhesPedido: 'S',
        tpNF: '1',
        tpAmb: '1'
      }]
    }
    if (params.startDate) body.param[0].filtrar_por_data_de = isoDateToBR(params.startDate)[0]
    if (params.endDate) body.param[0].filtrar_por_data_de = isoDateToBR(params.endDate)[0]

    const propertiesMapping = { data: 'nfCadastro', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getServiceInvoices = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/servicos/nfse/`

    const body = {
      call: 'ListarNFSEs',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        nPagina: defaultPagination.pageNumber,
        nRegPorPagina: defaultPagination.recordsPerPage,
        cAmbienteNFSe: 'P',
        cExibirDepartamentos: 'S',
        cExibirDescricao: 'S'
      }]
    }
    if (params.startDate) body.param[0].dEmiInicial = isoDateToBR(params.startDate)[0]
    if (params.endDate) body.param[0].dEmiFinal = isoDateToBR(params.endDate)[0]

    const propertiesMapping = { data: 'nfseEncontradas', pagination: { currentPage: 'nPagina', totalPages: 'nTotPaginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getTaxCoupons = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/produtos/cupomfiscalconsultar/`

    const body = {
      call: 'CuponsPagamentos',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        nPagina: defaultPagination.pageNumber,
        nRegPorPagina: defaultPagination.recordsPerPage
      }]
    }
    if (params.startDate) {
      body.param[0].dDtIncDe = isoDateToBR(params.startDate)[0]
      body.param[0].dDtAltDe = isoDateToBR(params.startDate)[0]
    }
    if (params.endDate) {
      body.param[0].dDtIncAte = isoDateToBR(params.endDate)[0]
      body.param[0].dDtAltAte = isoDateToBR(params.endDate)[0]
    }

    const propertiesMapping = { data: 'pagamentos', pagination: { currentPage: 'nPagina', totalPages: 'nTotPaginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getTaxCouponsItems = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/produtos/cupomfiscalconsultar/`

    const body = {
      call: 'CuponsItens',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        nPagina: defaultPagination.pageNumber,
        nRegPorPagina: defaultPagination.recordsPerPage
      }]
    }
    if (params.startDate) {
      body.param[0].dDtIncDe = isoDateToBR(params.startDate)[0]
      body.param[0].dDtAltDe = isoDateToBR(params.startDate)[0]
    }
    if (params.endDate) {
      body.param[0].dDtIncAte = isoDateToBR(params.endDate)[0]
      body.param[0].dDtAltAte = isoDateToBR(params.endDate)[0]
    }

    const propertiesMapping = { data: 'itens', pagination: { currentPage: 'nPagina', totalPages: 'nTotPaginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getEntryOrigins = async ({ appKey, appSecret }, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/geral/origemlancamento/`

    const body = {
      call: 'ListarOrigem',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        codigo: ''
      }]
    }

    const propertiesMapping = { data: 'origem', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getDocumentTypes = async ({ appKey, appSecret }, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/geral/tiposdoc/`

    const body = {
      call: 'PesquisarTipoDocumento',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        codigo: ''
      }]
    }

    const propertiesMapping = { data: 'tipo_documento_cadastro', pagination: { currentPage: 'pagina', totalPages: 'total_de_paginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getTitles = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/financas/pesquisartitulos/`

    const body = {
      call: 'PesquisarLancamentos',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        nPagina: defaultPagination.pageNumber,
        nRegPorPagina: defaultPagination.recordsPerPage
      }]
    }
    if (params.startDate) {
      body.param[0].dDtIncDe = isoDateToBR(params.startDate)[0]
      body.param[0].dDtAltDe = isoDateToBR(params.startDate)[0]
    }
    if (params.endDate) {
      body.param[0].dDtIncAte = isoDateToBR(params.endDate)[0]
      body.param[0].dDtAltAte = isoDateToBR(params.endDate)[0]
    }
    if (params.type) {
      body.param[0].cNatureza = params.type
    }

    const propertiesMapping = { data: 'titulosEncontrados', pagination: { currentPage: 'nPagina', totalPages: 'nTotPaginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  const getAccountsPayable = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => getTitles({ appKey, appSecret }, { ...params, type: 'P' }, forceThrow)

  const getAccountsReceivable = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => getTitles({ appKey, appSecret }, { ...params, type: 'R' }, forceThrow)

  const getFinancialMovements = async ({ appKey, appSecret }, params = {}, forceThrow = defaultForceThrow) => {
    const url = `${apiBaseUrl}/financas/mf/`

    const body = {
      call: 'ListarMovimentos',
      app_key: appKey,
      app_secret: appSecret,
      param: [{
        nPagina: defaultPagination.pageNumber,
        nRegPorPagina: defaultPagination.recordsPerPage,
        lDadosCad: 'S',
        cExibirDepartamentos: 'S'
      }]
    }
    if (params.startDate) {
      body.param[0].dDtIncDe = isoDateToBR(params.startDate)[0]
      body.param[0].dDtAltDe = isoDateToBR(params.startDate)[0]
    }
    if (params.endDate) {
      body.param[0].dDtIncAte = isoDateToBR(params.endDate)[0]
      body.param[0].dDtAltAte = isoDateToBR(params.endDate)[0]
    }

    const propertiesMapping = { data: 'movimentos', pagination: { currentPage: 'nPagina', totalPages: 'nTotPaginas' } }

    try {
      const response = await makeOmieRequest({ requester, method: 'post', url, body, propertiesMapping })
      return response
    } catch (error) {
      return omieErrorHandler(error, [], forceThrow)
    }
  }

  return {
    getCompany,
    getActivities,
    getCnae,
    getBanks,
    getCheckingAccountTypes,
    getCheckingAccounts,
    getCustomers,
    getCategories,
    getDepartments,
    getProjects,
    getProducts,
    getServices,
    getBillingSteps,
    getContractBillingTypes,
    getContractSteps,
    getContracts,
    getProductOrders,
    getServiceOrders,
    getProductInvoices,
    getServiceInvoices,
    getTaxCoupons,
    getTaxCouponsItems,
    getEntryOrigins,
    getDocumentTypes,
    getTitles,
    getAccountsPayable,
    getAccountsReceivable,
    getFinancialMovements
  }
}
