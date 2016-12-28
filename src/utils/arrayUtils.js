/**
 * Created by Jens on 26.06.2015.
 * Provides utilities for arrays such as checking whether an object supporting the Equals interface is contained
 */


const arrayUtils = {
  /**
   * Checks whether the array contains obj using a custom comparer if available
   * @param ar {{equals: function}[]}
   * @param obj {{equals: function}}
   * @returns {boolean}
   */
  contains(ar, obj) {
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
  },
};

module.exports = arrayUtils;
