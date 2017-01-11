import ValidatorBase from '../validators/ValidatorBase';
import { startsWith } from '../utils/arrayUtils';
import makeOptions from './contexts/boolean.global';

export const optionsCache = {};

/**
 * Parses booleans
 */
class BooleanParserModule extends ValidatorBase {
  static tokenTags = ['booleanfalse', 'booleantrue'];

  constructor(context) {
    super(context);
    this.options = ValidatorBase.getOptions(optionsCache, context);
  }

  static defineContext(context, options) {
    ValidatorBase.defineContext(optionsCache, context, options);
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */

  /**
   * Get all the patterns
   */
  getPatterns() {
    return (this.options && this.options.patterns) || {};
  }

  /**
   * Callback handler when a value has to be validated against a token
   * @param context - The current parse context
   * @param token - The token to validate against
   * @param value - The value to validate
   * @param isFinal - True if this is the final validation and no more characters are expected for the value
   * @returns {*} - Returns true if the value matches the token, false if it doesn't match or the token is unknown
   */
  validateToken(context, token, value, isFinal) {
    const lowerValue = value.toLowerCase();
    const options = this.options;
    if (!options) return false;
    switch (token.value) {
      case 'booleantrue':
        return (isFinal && options.trueLookup[lowerValue]) || (!isFinal && startsWith(options.trueValues, lowerValue));
      case 'booleanfalse':
        return (isFinal && options.falseLookup[lowerValue]) || (!isFinal && startsWith(options.falseValues, lowerValue));
      default:
        return false;
    }
  }

  /**
   * Parses the TextValue of the node into the final value
   * @param context - The current parse context
   * @param token - The token to finalize
   * @param value - The text value to parse
   * @returns {*} - Returns the parsed result
   */
  finalizeValue(context, token, value) {
    switch (token.value) {
      case 'booleantrue':
        return true;
      case 'booleanfalse':
        return false;
      default:
        return value;
    }
  }

  /* eslint-enable */
}

/**
 * Define english language context
 */
BooleanParserModule.defineContext({
  language: 'en',
}, makeOptions({
  trueValues: ['1', 'true'],
  falseValues: ['0', 'false'],
}));

export default BooleanParserModule;
