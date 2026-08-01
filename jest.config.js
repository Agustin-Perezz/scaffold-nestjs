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
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/main.ts',
    '<rootDir>/src/app.module.ts',
    '<rootDir>/src/books.module.ts',
    '<rootDir>/src/application/',
    '<rootDir>/src/infrastructure/',
    '<rootDir>/src/presentation/',
  ],
  coverageThreshold: {
    global: { lines: 60, functions: 60, branches: 50, statements: 60 },
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
  transformIgnorePatterns: ['/node_modules/(?!.*(@mikro-orm|kysely|uuid|@faker-js))'],
};