const baseConfig = require('../jest.config.js');

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

module.exports = config;
