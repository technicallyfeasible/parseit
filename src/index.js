import PatternMatcher from './PatternMatcher';
import DataParser from './DataParser';

import Pattern from './matching/Pattern';
import PatternContext from './PatternContext';

import ValidatorBase from './validators/ValidatorBase';

import BooleanParserModule from './modules/BooleanParserModule';

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
  modules: {
    BooleanParserModule,
  },
};
