/* eslint-disable import/no-extraneous-dependencies */

// Source: https://github.com/shelfio/jest-mongodb/blob/master/teardown.js

const debug = require('debug')('jest-mongodb:teardown');

module.exports = async function teardown() {
  debug('Teardown mongod');
  await global.__MONGOD__.stop();
};
