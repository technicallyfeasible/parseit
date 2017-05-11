/* eslint-disable import/prefer-default-export */
/**
 * Created by Jens on 26.06.2015.
 * Provides utilities for validators such as checking whether a value is within the token character limit
 */

/**
 * Checks whether the value is within the required length for token
 * @param token
 * @param value
 * @param isFinal
 * @returns {boolean}
 */
export function validateCount(token, value, isFinal) {
  return (!isFinal || value.length >= token.minCount) && value.length <= token.maxCount;
}
