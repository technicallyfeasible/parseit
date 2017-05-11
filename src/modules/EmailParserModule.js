// @flow
import ValidatorBase from '../validators/ValidatorBase';
import makeOptions from './contexts/email.global';
import { validateCount } from '../utils/validatorUtils';

export const optionsCache = {};

const MAIL_CHARS = 'abcdefghijklmnopqrstuvwxyzäöüßABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789!#$%&\'*+-/=?^_`{|}~.'.split('');
const MAIL_HOST_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_'.split('');
const SPECIAL_COMMENT_CHARS = '\\"()'.split('');
const SPECIAL_DISPLAY_CHARS = '\\"'.split('');

/**
 * Parses booleans
 */
export default class EmailParserModule extends ValidatorBase {
  static tokenTags = ['mail', 'mailh', 'mailc', 'mailn'];
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
      case 'mail':
        // mail user characters
        if (isFinal && (value.charAt(0) === '.' || c === '.')) {
          return false;
        }
        // be a bit more forgiving: && !value.Contains("..");
        return MAIL_CHARS.indexOf(c) !== -1;
      case 'mailh':
        // mail host characters
        if (isFinal && (value.charAt(0) === '.' || c === '.')) {
          return false;
        }
        // be a bit more forgiving: && !value.Contains("..");
        return MAIL_HOST_CHARS.indexOf(c) !== -1;
      case 'mailc':
        // comment characters
        // if it's a special character then make sure the escaping backslash is before it
        if (SPECIAL_COMMENT_CHARS.indexOf(c) !== -1 && (value.length <= 1 || value.charAt(value.length - 2) !== '\\')) {
          return false;
        }
        /*
         * allow any comment character except " and \
         else if (CommentCharacters.IndexOf(c) == -1)
         return false;
         */
        return true;
      case 'mailn':
        // display name characters
        // if it's a special character then make sure the escaping backslash is before it
        if (SPECIAL_DISPLAY_CHARS.indexOf(c) !== -1 && (value.length <= 1 || value.charAt(value.length - 2) !== '\\')) {
          return false;
        }
        /*
         * allow any display character except " and \
         else if (DisplayCharacters.IndexOf(c) == -1)
         return false;
         */
        return true;
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
EmailParserModule.defineContext({
  language: 'en',
}, makeOptions({
}));
