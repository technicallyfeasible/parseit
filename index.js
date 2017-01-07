const PatternMatcher = require('./src/PatternMatcher');
const DataParser = require('./src/DataParser');

const Pattern = require('./src/matching/Pattern');
const PatternContext = require('./src/PatternContext');

const ValidatorBase = require('./src/validators/ValidatorBase');

/**
 * Entry point for the DataParser library
 */
module.exports = {
  PatternMatcher,
  DataParser,
  PatternContext,
  matching: {
    Pattern,
  },
  validators: {
    ValidatorBase,
  },
};
