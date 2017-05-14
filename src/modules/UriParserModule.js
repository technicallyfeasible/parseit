// @flow
import ValidatorBase from '../validators/ValidatorBase';
import makeOptions from './contexts/uri.global';
import { validateCount } from '../utils/validatorUtils';

export const optionsCache = {};

const URI_SCHEME_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+.-'.split('');
const URI_HOST_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.@~'.split('');
const URI_PATH_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/._-()@~:'.split('');
const URI_QUERY_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&%=+._-@~'.split('');
const URI_FRAGMENT_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&%=+._-@~?'.split('');

/**
 * Parses URIs
 */
export default class UriParserModule extends ValidatorBase {
  static tokenTags = ['urischeme', 'urihost', 'uripath', 'uriquery', 'urifragment', 'uridelim'];
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
      case 'urischeme':
        return URI_SCHEME_CHARS.indexOf(c) !== -1;
      case 'urihost':
        return URI_HOST_CHARS.indexOf(c) !== -1;
      case 'uripath':
        return value[0] === '/' && (!isFinal || value.length === 1 || c !== '/') && URI_PATH_CHARS.indexOf(c) !== -1;
      case 'uriquery':
        return value[0] === '?' && (value.length === 1 || URI_QUERY_CHARS.indexOf(c) !== -1);
      case 'urifragment':
        return value[0] === '#' && (value.length === 1 || URI_FRAGMENT_CHARS.indexOf(c) !== -1);
      case 'uridelim':
        return c === '/';
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

/* eslint-enable */
}

/**
 * Define english language context
 */
UriParserModule.defineContext({
  language: 'en',
}, makeOptions({
}));
