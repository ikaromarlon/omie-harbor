const globalConfig = require('./jest.config')

module.exports = {
  ...globalConfig,
  coverageDirectory: '<rootDir>/coverage/unit',
  collectCoverageFrom: [
    '<rootDir>/src/functions/**/*.js',
    '!<rootDir>/src/functions/**/schema.js',
    '<rootDir>/src/shared/**/*.js',
    '!<rootDir>/src/shared/services/**/*.js'
  ],
  roots: [
    'src',
    'tests/unit'
  ]
}
