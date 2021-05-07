export default {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.{ts}',
    '!**/*.d.ts', //  Exclude all type declaration files
    '!**/node_modules/**', //  Exclude all files in node_modules
    '!**/dist/**', //  Exclude all files in the dist folder
  ],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
