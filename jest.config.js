/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  /**
   * Only collect coverage for ChallengeManager and utilities used by ChallengeManager
   * merkle.ts IS a utility used by challenge manager. But this utility is fairly specific
   *  to merkle-tools dependency. So it is ignored for now.
   */
  collectCoverageFrom: ['src/**/*.{js,ts}', '!src/{index,merkle,auto-disputer}.ts']
};
