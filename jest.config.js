/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.claude/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'd.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: '<rootDir>/coverage/unit',
  coverageReporters: ['text', 'lcov', 'html'],
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/src/main.ts'],
  coverageThreshold: {
    global: { lines: 80, functions: 80, branches: 75, statements: 80 },
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['@swc/jest', {
      jsc: {
        parser: { syntax: 'typescript', decorators: true },
        target: 'es2021',
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
      module: { type: 'commonjs' },
    }],
  },
  transformIgnorePatterns: ['/node_modules/(?!.*(@mikro-orm|kysely|uuid))'],
};