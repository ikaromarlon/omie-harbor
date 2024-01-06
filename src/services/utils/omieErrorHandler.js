const { BadGatewayException } = require('../../common/errors')

/**
 * Receive an error from Omie API and check if it should be thrown or not
 * @param {Error} error The error provided from the HTTP response
 * @param {*} response The rensponse that should be returned if the error should not be thrown
 * @param {Boolean} forceThrow Force the Error throw
 * @returns {*} Returns the response parameter or an error should be thrown
 * @throws {BadGatewayException} The message iuncludes the information provided by error with Bad Gateway HTTP response
 */
module.exports = (error, response = null, forceThrow = false) => {
  const { faultcode, faultstring, error_code, error_message } = error.response?.data || {} // eslint-disable-line

  const errorMapping = {
    'SOAP-ENV:Server': { throw: true }, // i.e.: 'SOAP-ERROR: Broken response from Application Server (4)'
    'SOAP-ENV:Client-4': { throw: false }, // i.e.: 'ERROR: Não é possivel excluir Departamento Inativo ou Totalizador!'
    'SOAP-ENV:Client-71': { throw: true }, // i.e.: ''
    'SOAP-ENV:Client-101': { throw: false }, // i.e.: 'ERROR: Nenhuma [?] foi encontrada!'
    'SOAP-ENV:Client-115': { throw: true }, // i.e.: 'ERROR: O produto [?] está inativo !(Id: [?] / Integração: [?])'
    'SOAP-ENV:Client-5001': { throw: true }, // i.e.: 'ERROR: Tag [?] não faz parte da estrutura do tipo complexo [?]!'
    'SOAP-ENV:Client-5113': { throw: false }, // i.e.: 'ERROR: Não existem registros para a página [?]!'
    'SOAP-ENV:Client-8020': { throw: false } // i.e.: 'ERROR: Esta requisição já foi processada ou está sendo processada e você pode tentar novamente às [?]. (1)'
  }

  const errorFound = errorMapping[faultcode]

  if (forceThrow || !errorFound || errorFound.throw) throw new BadGatewayException(`Omie Service Request Error: [${faultcode ?? error_code}] ${faultstring ?? error_message}`, error) // eslint-disable-line

  return response
}
