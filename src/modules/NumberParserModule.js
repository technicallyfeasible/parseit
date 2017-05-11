// @flow
import ValidatorBase from '../validators/ValidatorBase';
import { countNumbers } from '../utils/stringUtils';
import makeOptions from './contexts/number.global';
import { validateCount } from '../utils/validatorUtils';

export const optionsCache = {};

const SIGN_CHARS = '-+'.split('');
const SEPARATOR_CHARS = '.,'.split('');
const UNIT_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!%?°^\'"/0123456789'.split('');
const INVALID_BEGIN_UNIT_CHARS = '0123456789?^/'.split('');
const NUMBER_CHARS = '0123456789'.split('');
const HEX_CHARS = '0123456789abcdefABCDEF'.split('');

/**
 * Parses booleans
 */
class NumberParserModule extends ValidatorBase {
  static tokenTags = ['-+', '#', '#.', '#,', 'unit', 'X'];
  options: Object;

  /**
   * Create a number parser
   * @param context
   */
  constructor(context: Object) {
    super(context);
    this.options = ValidatorBase.getOptions(optionsCache, context);
  }

  static defineContext(context: Object, options: Object) {
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
  validateToken(context: Object, token: Object, value: string, isFinal: boolean) {
    if (!validateCount(token, value, isFinal)) {
      return false;
    }

    const c = value.charAt(value.length - 1);
    switch (token.value) {
      case '-+':
        return SIGN_CHARS.indexOf(c) !== -1;
      case '.,':
        return SEPARATOR_CHARS.indexOf(c) !== -1;
      case '#':
        return NUMBER_CHARS.indexOf(c) !== -1;
      case '#.':
        return NumberParserModule.validateGroupedNumbers(value, '.', isFinal);
      case '#,':
        return NumberParserModule.validateGroupedNumbers(value, ',', isFinal);
      case 'unit': {
        // unit can contain numbers but not only consist of numbers
        let isValid = UNIT_CHARS.indexOf(c) !== -1 && INVALID_BEGIN_UNIT_CHARS.indexOf(value[0]) === -1;
        // check the ratio of numbers to other characters and reject unit if too many numbers
        if (isFinal && isValid) {
          const numCount = countNumbers(value);
          if (numCount > 0 && numCount >= (value.length - numCount)) {
            isValid = false;
          }
        }
        return isValid;
      }
      case 'X':
        return HEX_CHARS.indexOf(c) !== -1;
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
  finalizeValue(context: Object, token: Object, value: string): any {
    return value;
  }

  /**
   * Validates a number with thousands separators included
   * @param value
   * @param separator
   * @param isFinal
   * @return {boolean}
   */
  static validateGroupedNumbers(value: string, separator: string, isFinal: boolean) {
    let first = true;
    let groupLength = 0;
    for (let i = 0; i < value.length && groupLength <= 3; i++) {
      const c = value.charAt(i);
      if (c === separator) {
        if (groupLength === 0 || (first && groupLength > 3) || (!first && groupLength !== 3)) {
          return false;
        }
        first = false;
        groupLength = 0;
        continue;
      }
      if (c < '0' || c > '9') { return false; }
      groupLength++;
    }
    if (isFinal && !first) { return (groupLength === 3); }
    return (groupLength <= 3);
  }

/* eslint-enable */
}

/**
 * Define english language context
 */
NumberParserModule.defineContext({
  language: 'en',
}, makeOptions({
  commaDecimal: false,
}));

export default NumberParserModule;
