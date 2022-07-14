const { resolve } = require('path');

module.exports = {
  globalSetup: resolve(__dirname, './__jest__/setup.jest.js'),
  globalTeardown: resolve(__dirname, './__jest__/teardown.jest.js'),
  testEnvironment: resolve(__dirname, './__jest__/environment.jest.js'),
  moduleDirectories: ['node_modules', 'src'],
};
