const globalConfig = require('./jest.config')

module.exports = {
  ...globalConfig,
  coverageDirectory: '<rootDir>/coverage/unit',
  collectCoverageFrom: [
    '<rootDir>/src/index.js',
    '<rootDir>/src/mappings/**/*.js',
    '<rootDir>/src/v*/**/*.js',
    '!<rootDir>/src/v*/**/schema.js',
    '!<rootDir>/src/v1/dataProcessing/**'
  ],
  roots: [
    'src',
    'tests/unit'
  ]
}
