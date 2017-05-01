/**
 * Created by Jens on 26.06.2015.
 * Provides utilities for strings
 */


/**
 * Checks whether str starts with val
 * @param str {string}
 * @param val {string}
 * @returns {boolean}
 */
export function startsWith(str, val) {
  return !!str && !!val && (str.length >= val.length) && (str.indexOf(val) === 0);
}

/**
 * Match all characters in the string against all characters in the given array or string
 * @param str {string} - The string to test
 * @param chars {string|string[]} - The characters to test for
 * @param startIndex {number=} - Index of the first character to test
 * @returns {boolean} - true if all characters in the string are contained in chars
 */
export function matchAll(str, chars, startIndex) {
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
}

/**
 * Count occurrences of numbers
 * @param value
 * @return {number}
 * @constructor
 */
export function countNumbers(value) {
  let count = 0;
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i);
    if (c >= '0' && c <= '9') count++;
  }
  return count;
}
