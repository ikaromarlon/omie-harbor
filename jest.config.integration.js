const globalConfig = require('./jest.config')

module.exports = {
  ...globalConfig,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/integration',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js'
  ],
  roots: [
    'src',
    'tests/integration'
  ]
}
