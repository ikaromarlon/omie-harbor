const config = require('../../config')
const { ExternalServerError } = require('../../utils/errors')
const { logger: makeLogger } = require('../../adapters')

/**
 * Receive an error from Omie API and check if it should be thrown or not
 * @param {Error} error The error provided from the HTTP response
 * @param {*} response The rensponse that should be returned if the error should not be thrown
 * @param {Boolean} forceThrow Force the Error throw
 * @returns {*} Returns the response parameter or an error should be thrown
 * @throws {ExternalServerError} The message iuncludes the information provided by error with Bad Gateway HTTP response
 */
module.exports = (error, response = null, forceThrow = false) => {
  const logger = makeLogger()

  if (config.flags.logEachOmieError) logger.info({ title: 'Omie Service Request', message: 'An error ocurred calling Omie service', data: error })

  const { faultcode } = error.response?.data || {}

  const errorMapping = {
    'SOAP-ENV:Server': { throw: true, message: 'SOAP-ERROR: Broken response from Application Server (4)' },
    'SOAP-ENV:Client-71': { throw: true, message: '' },
    'SOAP-ENV:Client-101': { throw: false, message: 'ERROR: Nenhuma [?] foi encontrada!' },
    'SOAP-ENV:Client-115': { throw: true, message: 'ERROR: O produto [?] está inativo !(Id: [?] / Integração: [?])' },
    'SOAP-ENV:Client-5001': { throw: true, message: 'ERROR: Tag [?] não faz parte da estrutura do tipo complexo [?]!' },
    'SOAP-ENV:Client-5113': { throw: false, message: 'ERROR: Não existem registros para a página [?]!' },
    'SOAP-ENV:Client-8020': { throw: false, message: 'ERROR: Esta requisição já foi processada ou está sendo processada e você pode tentar novamente às [?]. (1)' }
  }

  const errorFound = errorMapping[faultcode]

  if (forceThrow || !errorFound || errorFound.throw) throw new ExternalServerError('Omie Service Request Error', error)

  return response
}
