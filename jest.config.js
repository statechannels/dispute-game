/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  /**
   * Only collect coverage for ChallengeManager and utilities used by ChallengeManager
   * merkle.ts IS a utility used by challenge manager. But this utility is fairly specific
   *  to merkle-tools dependency. So it is ignored for now.
   */
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,ts}', '!src/{index,merkle,challenger-agent}.ts'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
