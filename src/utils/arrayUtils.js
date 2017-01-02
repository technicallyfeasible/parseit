/**
 * Created by Jens on 26.06.2015.
 * Provides utilities for arrays such as checking whether an object supporting the Equals interface is contained
 */


/**
 * Checks whether the array contains obj using a custom comparer if available
 * @param ar {{equals: function}[]}
 * @param obj {{equals: function}}
 * @returns {boolean}
 */
export function contains(ar, obj) {
  if (!ar) {
    return false;
  }
  // check strict equality first, should be fastest
  if (ar.indexOf(obj) !== -1) {
    return true;
  }

  const hasEquals = (!!obj && typeof obj.equals === 'function');

  // check all elements
  for (let i = 0; i < ar.length; i++) {
    const other = ar[i];
    let result;
    if (hasEquals) {
      result = obj.equals(other);
    } else if (typeof other.equals === 'function') {
      result = other.equals(obj);
    } else {
      result = (obj === other);
    }
    if (result) {
      return true;
    }
  }
  return false;
}

/**
 * Checks whether any of the values in the array start with the string
 * @param strings {string[]} - Array of strings to test against value. Cannot contain null or undefined values.
 * @param value {string}
 */
export function startsWith(strings, value) {
  if (value === null || value === undefined) return false;
  // according to jsperf, using substr and === is slightly faster than indexOf
  return strings.some(string => (string.length >= value.length) && (string.substr(0, value.length) === value));
}
