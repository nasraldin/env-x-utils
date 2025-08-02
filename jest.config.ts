import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  testMatch: ['<rootDir>/tests/**/?(*.)+(test).ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['lib/**/*.ts', '!lib/**/*.d.ts', '!lib/**/*.test.ts'],
};

export default config;
