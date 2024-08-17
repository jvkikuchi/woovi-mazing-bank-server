export default {
  clearMocks: true,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/tests/**/*.spec.ts'],
  setupFiles: ['<rootDir>/src/tests/envs.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/definitions/*',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.webpack/'],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};