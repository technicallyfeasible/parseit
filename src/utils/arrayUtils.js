/**
 * Created by Jens on 26.06.2015.
 * Provides utilities for arrays such as checking whether an object supporting the Equals interface is contained
 */

'use strict';

var arrayUtils = {
	/**
	 * Checks whether the array contains obj using a custom comparer if available
	 * @param ar {{equals: function}[]}
	 * @param obj {{equals: function}}
	 * @returns {boolean}
	 */
	contains: function(ar, obj) {
		if (!ar)
			return false;
		// check strict equality first, should be fastest
		if (ar.indexOf(obj) !== -1)
			return true;

		var hasEquals = (!!obj && typeof obj.equals === 'function');

		// check all elements
		for (var i = 0; i < ar.length; i++) {
			var other = ar[i];
			var result;
			if (hasEquals)
				result = obj.equals(other);
			else if (typeof other.equals === 'function')
				result = other.equals(obj);
			else
				result = (obj === other);
			if (result)
				return true;
		}
		return false;
	}
};

module.exports = arrayUtils;
