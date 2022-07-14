module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest-testing',
    },
    binary: {
      version: '4.0.25',
      skipMD5: true,
    },
    autoStart: false,
  },
};
