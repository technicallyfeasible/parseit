/* eslint-disable import/prefer-default-export */

/**
 * Invoke the callback for all sub-strings and return true if cb returns true for all and false otherwise
 * @param str
 * @param cb
 */
export function allSubStrings(str, cb) {
  if (!str) {
    return cb(str);
  }
  for (let i = 1; i <= str.length; i++) {
    if (!cb(str.substring(0, i))) {
      return false;
    }
  }
  return true;
}
