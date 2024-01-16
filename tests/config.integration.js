const globalConfig = require('../jest.config')

module.exports = {
  ...globalConfig,
  globalSetup: '<rootDir>/tests/globalSetup.integration.js',
  roots: [
    'src',
    'tests/integration'
  ]
}
