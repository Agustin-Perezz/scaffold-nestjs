/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    testMatch: ['<rootDir>/src/**/*.spec.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'd.ts'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^uuid$': '<rootDir>/node_modules/uuid/dist/cjs/index.js',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: '<rootDir>/tsconfig.json',
            },
        ],
    },
};
