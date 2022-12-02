const globalConfig = require('./jest.config')

module.exports = {
  ...globalConfig,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/unit',
  collectCoverageFrom: [
    '<rootDir>/src/index.js',
    '<rootDir>/src/mappings/**/*.js',
    '<rootDir>/src/v*/**/*.js',
    '!<rootDir>/src/v*/**/schema.js',
    '!<rootDir>/src/v1/dataProcessing/**'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  roots: [
    'src',
    'tests/unit'
  ]
}
