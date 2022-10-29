const globalConfig = require('./jest.config')

module.exports = {
  ...globalConfig,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/integration',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js'
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
  roots: [
    'src',
    'tests/integration'
  ]
}
