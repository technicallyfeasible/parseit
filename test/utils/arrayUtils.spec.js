/**
 * Tests for PatternMatcher
 */

const chai = require('chai');
const arrayUtils = require('../../src/utils/arrayUtils');

const assert = chai.assert;

describe('Array Utils', () => {
  describe('.contains', () => {
    it('exists', () => {
      assert.isFunction(arrayUtils.contains);
    });

    it('returns false if the array is null or empty', () => {
      assert.isFalse(arrayUtils.contains([], 1));
      assert.isFalse(arrayUtils.contains(null, 1));
    });

    it('correctly finds native types', () => {
      assert.isTrue(arrayUtils.contains([1, 2, 3, 4], 3));
      assert.isFalse(arrayUtils.contains([1, 2, 3, 4], 5));
      assert.isTrue(arrayUtils.contains(['a', 'b', 'c', 'd'], 'd'));
      assert.isFalse(arrayUtils.contains(['a', 'b', 'c', 'd'], 'e'));
      assert.isTrue(arrayUtils.contains([true], true));
      assert.isFalse(arrayUtils.contains([true], false));
    });

    it('finds an object by ref', () => {
      const obj = {};
      assert.isTrue(arrayUtils.contains([{}, obj], obj));
      assert.isFalse(arrayUtils.contains([{}, {}], obj));
    });

    it('finds an object using the equals interface', () => {
      const obj = {
        value: 'some value',
        equals: function equals(other) {
          return other.value === this.value;
        },
      };
      const obj2 = {
        value: 'some value',
      };
      const obj3 = {
        value: 'some other value',
      };
      assert.isTrue(arrayUtils.contains([{}, obj2], obj));
      assert.isFalse(arrayUtils.contains([{}, obj3], obj));

      assert.isTrue(arrayUtils.contains([{}, obj], obj2));
      assert.isFalse(arrayUtils.contains([{}, obj], obj3));
    });
  });
});
