const globalConfig = require('./jest.config')

module.exports = {
  ...globalConfig,
  coverageDirectory: '<rootDir>/coverage/unit',
  collectCoverageFrom: [
    '<rootDir>/src/index.js',
    '<rootDir>/src/mappings/**/*.js',
    '<rootDir>/src/functions/**/*.js',
    '!<rootDir>/src/functions/**/schema.js'
  ],
  roots: [
    'src',
    'tests/unit'
  ]
}
