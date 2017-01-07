import ValidatorBase from './ValidatorBase';
import { matchAll } from '../utils/stringUtils';

/** @const */
const LETTER_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Matches some basic patterns like whitespace, letters and numbers
 */
class DefaultValidator extends ValidatorBase {
  static tokenTags = [' ', 'newline', 'emptyline', 'letter', 'any'];

  /* eslint-disable class-methods-use-this */

  /**
   * Callback handler when a value has to be validated against a token
   * @param context - The current parse context
   * @param token - The token to validate against
   * @param value - The value to validate
   * @param isFinal - True if this is the final validation and no more characters are expected for the value
   * @returns {*} - Returns true if the value matches the token, false if it doesn't match or the token is unknown
   */
  validateToken(context, token, value, isFinal) {
    let result;
    switch (token.value) {
      // whitespace
      case ' ':
        result = DefaultValidator.validateCount(token, value, isFinal) && matchAll(value, ' \t');
        break;
      case 'newline':
        result = DefaultValidator.validateCount(token, value, isFinal) && matchAll(value, '\r\n');
        break;
      case 'emptyline':
        result = DefaultValidator.validateCount(token, value, isFinal) && matchAll(value, '\r\n \t');
        break;
      case 'letter':
        result = DefaultValidator.validateCount(token, value, isFinal) && matchAll(value, LETTER_CHARACTERS);
        break;
      case 'any':
        result = DefaultValidator.validateCount(token, value, isFinal);
        break;
      default:
        result = false;
    }
    return result;
  }

  /* eslint-enable */

  /**
   * Checks whether the value is within the required length for token
   * @param token
   * @param value
   * @param isFinal
   * @returns {boolean}
   */
  static validateCount(token, value, isFinal) {
    return (!isFinal || value.length >= token.minCount) && value.length <= token.maxCount;
  }

  /**
   * Parses the TextValue of the node into the final value
   * @param context - The current parse context
   * @param token - The token to finalize
   * @param value - The text value to parse
   * @returns {*} - Returns the parsed result
   */
  finalizeValue(context, token, value) {
    if (this.tokenTags.indexOf(token.value) !== -1) {
      return value;
    }
    // TODO: return something else if unknown?
    return value;
  }
}

export default DefaultValidator;
