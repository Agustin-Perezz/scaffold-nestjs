/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '..',
    testMatch: ['<rootDir>/test/**/*.e2e-spec.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'd.ts'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coverageDirectory: '<rootDir>/coverage',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^uuid$': '<rootDir>/node_modules/uuid/dist/cjs/index.js',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: '<rootDir>/tsconfig.json',
                isolatedModules: true,
            },
        ],
    },
};
