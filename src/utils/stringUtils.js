/**
 * Created by Jens on 26.06.2015.
 * Provides utilities for strings
 */


const stringUtils = {
  /**
   * Checks whether str starts with val
   * @param str {string}
   * @param val {string}
   * @returns {boolean}
   */
  startsWith(str, val) {
    return !!str && !!val && (str.length > val.length) && (str.indexOf(val) === 0);
  },

  /**
   * Match all characters in the string against all characters in the given array or string
   * @param str {string} - The string to test
   * @param chars {string|string[]} - The characters to test for
   * @param startIndex {number=} - Index of the first character to test
   * @returns {boolean} - true if all characters in the string are contained in chars
   */
  matchAll(str, chars, startIndex) {
    if (!str || !chars) {
      return false;
    }
    for (let i = startIndex || 0; i < str.length; i++) {
      const c = str.charAt(i);
      if (chars.indexOf(c) === -1) {
        return false;
      }
    }
    return true;
  },

};

module.exports = stringUtils;
