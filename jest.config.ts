import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": `<rootDir>/__mocks__/fileMock.js`,
  },
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/", "<rootDir>/__e2e__/", "<rootDir>/__tests__/next_template_reporter.js"],
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  watchPathIgnorePatterns: [
    "<rootDir>/.next/"
  ],
  reporters: [
    "default"
  ]
};
export default config;

