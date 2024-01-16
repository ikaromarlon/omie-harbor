const globalConfig = require('../jest.config')

module.exports = {
  ...globalConfig,
  testTimeout: 30000,
  globalSetup: '<rootDir>/tests/globalSetup.integration.js',
  roots: [
    'src',
    'tests/integration'
  ]
}
