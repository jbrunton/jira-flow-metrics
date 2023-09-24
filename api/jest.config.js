/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@app/(.*)$': ['<rootDir>/src/app/$1'],
    '^@data/(.*)$': ['<rootDir>/src/data/$1'],
    '^@entities/(.*)$': ['<rootDir>/src/domain/entities/$1'],
    '^@usecases/(.*)$': ['<rootDir>/src/domain/usecases/$1'],
  },
};

module.exports = config;
