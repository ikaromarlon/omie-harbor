const globalConfig = require('./jest.config')

module.exports = {
  ...globalConfig,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/integration',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
    '!<rootDir>/src/v1/dataProcessing/**'
  ],
  roots: [
    'src',
    'tests/integration'
  ]
}
