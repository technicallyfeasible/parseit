import Pattern from '../matching/Pattern';
import BooleanValue from '../values/BooleanValue';

import { startsWith } from '../utils/arrayUtils';

export const constants = {
  trueValues: ['1', 'true', 'wahr'],
  falseValues: ['0', 'false', 'falsch'],
};
constants.trueLookup = constants.trueValues.reduce((r, text) => (r[text] = true) && r, {});   // eslint-disable-line no-param-reassign
constants.falseLookup = constants.falseValues.reduce((r, text) => (r[text] = true) && r, {}); // eslint-disable-line no-param-reassign

/**
 * Make the final output value
 * @param value
 * @returns {BooleanValue}
 */
function make(value) {
  let boolValue = false;
  if (typeof value === 'boolean') {
    boolValue = value;
  } else if (value) {
    const lowerValue = value.toString().toLowerCase();
    boolValue = !constants.falseLookup[lowerValue];
  }
  return new BooleanValue(boolValue);
}
/**
 * Reusable wrapper for the two patterns
 * @param context
 * @param v
 */
function parsePattern(context, v) {
  return make(v[1]);
}

const mainPatterns = [
  new Pattern('{emptyline:*}{booleantrue}{emptyline:*}', parsePattern),
  new Pattern('{emptyline:*}{booleanfalse}{emptyline:*}', parsePattern),
];


class BooleanParserModule {
  static tokenTags = ['booleanfalse', 'booleantrue'];
  patternTags = [''];

  /* eslint-disable class-methods-use-this, no-unused-vars */

  /**
   * Return the patterns for the tag
   * @param tag {string}
   */
  getPatterns(tag) {
    if (tag === '') {
      return mainPatterns;
    }
    return [];
  }

  /**
   * Callback handler when a value has to be validated against a token
   * @param token - The token to validate against
   * @param value - The value to validate
   * @param isFinal - True if this is the final validation and no more characters are expected for the value
   * @returns {*} - Returns true if the value matches the token, false if it doesn't match or the token is unknown
   */
  validateToken(token, value, isFinal) {
    const lowerValue = value.toLowerCase();
    switch (token.value) {
      case 'booleantrue':
        return (isFinal && constants.trueLookup[lowerValue]) || (!isFinal && startsWith(constants.trueValues, lowerValue));
      case 'booleanfalse':
        return (isFinal && constants.falseLookup[lowerValue]) || (!isFinal && startsWith(constants.falseValues, lowerValue));
      default:
        return false;
    }
  }

  /**
   * Parses the TextValue of the node into the final value
   * @param token - The token to finalize
   * @param value - The text value to parse
   * @returns {*} - Returns the parsed result
   */
  finalizeValue(token, value) {
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

export default BooleanParserModule;
