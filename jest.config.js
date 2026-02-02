export default {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js'],
  testMatch: ['**/tests/**/*.test.js'],
  moduleFileExtensions: ['js'],
  transform: {},
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
