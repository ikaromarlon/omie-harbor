const globalConfig = require('../jest.config')

module.exports = {
  ...globalConfig,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/unit',
  collectCoverageFrom: [
    '<rootDir>/src/functions/**/*.js',
    '<rootDir>/src/shared/**/*.js'
  ],
  roots: [
    'src',
    'tests/unit'
  ]
}
