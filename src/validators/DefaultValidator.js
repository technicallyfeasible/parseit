import ValidatorBase from './ValidatorBase';
import { validateCount } from '../utils/validatorUtils';

/** @const */
const LETTER_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const SPACE_CHARS = [' ', '\t'];
const NEWLINE_CHARS = ['\r', '\n'];
const EMPTYLINE_CHARS = ['\r', '\n', ' ', '\t'];

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
    if (!validateCount(token, value, isFinal)) {
      return false;
    }

    const c = value.charAt(value.length - 1);
    let result;
    switch (token.value) {
      // whitespace
      case ' ':
        result = SPACE_CHARS.indexOf(c) !== -1;
        break;
      case 'nl':
        result = NEWLINE_CHARS.indexOf(c) !== -1;
        break;
      case 'el':
        result = EMPTYLINE_CHARS.indexOf(c) !== -1;
        break;
      case 'w':
        result = LETTER_CHARACTERS.indexOf(c) !== -1;
        break;
      case '.':
        result = true;
        break;
      default:
        result = false;
    }
    return result;
  }

  /**
   * Parses the TextValue of the node into the final value
   * @param context - The current parse context
   * @param token - The token to finalize
   * @param value - The text value to parse
   * @returns {*} - Returns the parsed result
   */
  finalizeValue(context, token, value) {
    if (DefaultValidator.tokenTags.indexOf(token.value) !== -1) {
      return value;
    }
    // TODO: return something else if unknown?
    return value;
  }

  /* eslint-enable */
}

export default DefaultValidator;
