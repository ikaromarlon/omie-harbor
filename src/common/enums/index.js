const USER_ROLE = {
  SUPER: 'SUPER',
  ADMIN: 'ADMIN',
  DEFAULT: 'DEFAULT',
  CUSTOMER_ADMIN: 'CUSTOMER_ADMIN',
  CUSTOMER_DEFAULT: 'CUSTOMER_DEFAULT'
}

const PRODUCT_TYPES = {
  PRODUCT: 'PRODUTO',
  SERVICE: 'SERVICO'
}

const ORDER_TYPES = {
  SALES_ORDER: 'PEDIDO',
  SERVICE_ORDER: 'OS'
}

const MOVEMENT_STATUSES = {
  FORECAST: 'PREVISAO'
}

const OMIE_WEBHOOK_EVENTS = {
  SERVICE_ORDER: {
    DELETED: 'OrdemServico.Excluida'
  },
  SALES_ORDER: {
    DELETED: 'VendaProduto.Excluida'
  },
  CONTRACT: {
    DELETED: 'ContratoServico.Excluido'
  },
  ENTRY_INVOICE: {
    DELETED: 'NotaEntrada.Excluida'
  },
  ACCOUNT_PAYABLE: {
    DELETED: 'Financas.ContaPagar.Excluido'
  },
  ACCOUNT_RECEIVABLE: {
    DELETED: 'Financas.ContaReceber.Excluido'
  },
  CHECKING_ACCOUNT_ENTRY: {
    DELETED: 'Financas.ContaCorrente.Lancamento.Excluido'
  },
  CHECKING_ACCOUNT_TRANSFER: {
    DELETED: 'Financas.ContaCorrente.Transferencia.Excluido'
  }
}

module.exports = {
  USER_ROLE,
  PRODUCT_TYPES,
  ORDER_TYPES,
  MOVEMENT_STATUSES,
  OMIE_WEBHOOK_EVENTS
}
