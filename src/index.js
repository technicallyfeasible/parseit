import PatternMatcher from './PatternMatcher';
import DataParser from './DataParser';

import Pattern from './matching/Pattern';
import PatternContext from './PatternContext';

import ValidatorBase from './validators/ValidatorBase';

import arrayUtils from './utils/arrayUtils';
import stringUtils from './utils/stringUtils';
import validatorUtils from './utils/validatorUtils';

import DefaultValidator from './validators/DefaultValidator';
import BooleanParserModule from './modules/BooleanParserModule';
import NumberParserModule from './modules/NumberParserModule';

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
  utils: {
    array: arrayUtils,
    string: stringUtils,
    validator: validatorUtils,
  },
  modules: {
    DefaultValidator,
    BooleanParserModule,
    NumberParserModule,
  },
};
