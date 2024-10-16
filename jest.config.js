// jest.config.js
module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverage: true,
    collectCoverageFrom: [
      '**/router/**/*.js',
      '**/server.js',
      '!**/node_modules/**',
    ],
  };
  