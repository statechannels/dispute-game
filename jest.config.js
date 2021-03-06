/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  /**
   * We run the contract tests through hardhat (using mocha) so we want jest to avoid them
   */
  testPathIgnorePatterns: ['sol-prototype'],
  /**
   * Only collect coverage for DisputeManager and utilities used by DisputeManager
   * merkle.ts IS a utility used by challenge manager. But this utility is fairly specific
   *  to merkle-tools dependency. So it is ignored for now.
   */
  collectCoverage: true,
  collectCoverageFrom: [
    'ts-prototype/**/*.{js,ts}',
    '!sol-prototype/**',
    '!ts-prototype/{index,merkle,dispute-agent,dispute-game}.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
