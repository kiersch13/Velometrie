/** @type {import('jest').Config} */
module.exports = {
  // jest-preset-angular wires up TypeScript compilation, Angular TestBed,
  // and jsdom for us — we just point it at our setup file.
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',

  // Which files count as tests
  testMatch: ['**/src/**/*.spec.ts'],

  // Tell Jest how to transform TypeScript and HTML template files
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        // Inline HTML templates get stringified for Jest's module system
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },

  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],

  // Map bare 'src/...' imports that some Angular paths use
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
