const PatternMatcher = require('./src/PatternMatcher');
const DataParser = require('./src/DataParser');

const Pattern = require('./src/matching/Pattern');

/**
 * Entry point for the DataParser library
 */
module.exports = {
  PatternMatcher,
  DataParser,
  matching: {
    Pattern,
  },
};
