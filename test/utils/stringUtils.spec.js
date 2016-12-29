/**
 * Tests for PatternMatcher
 */

import chai from 'chai';
import stringUtils from '../../src/utils/stringUtils';

const assert = chai.assert;

describe('String Utils', () => {
  describe('.startsWith', () => {
    it('exists', () => {
      assert.isFunction(stringUtils.startsWith);
    });

    it('returns false if the string is null or empty', () => {
      assert.isFalse(stringUtils.startsWith('', ''));
      assert.isFalse(stringUtils.startsWith(null, ''));
    });

    it('returns false if the test value is null or empty', () => {
      assert.isFalse(stringUtils.startsWith('str', ''));
      assert.isFalse(stringUtils.startsWith('str', null));
    });

    it('returns true if the string starts with the test string', () => {
      assert.isTrue(stringUtils.startsWith('this is a string', 'this'));
      assert.isTrue(stringUtils.startsWith('this is this', 'this'));
    });

    it('returns false if the string does not start with the test string', () => {
      assert.isFalse(stringUtils.startsWith(' this is a string', 'this'));
      assert.isFalse(stringUtils.startsWith('some other string', 'this'));
    });
  });

  describe('.matchAll', () => {
    it('exists', () => {
      assert.isFunction(stringUtils.matchAll);
    });

    it('returns false if the string is null or empty', () => {
      assert.isFalse(stringUtils.matchAll(''));
      assert.isFalse(stringUtils.matchAll(null));
    });

    it('returns false if the string is null or empty', () => {
      assert.isFalse(stringUtils.matchAll(''));
      assert.isFalse(stringUtils.matchAll(null));
    });

    it('returns true if all characters in the test string are contained', () => {
      assert.isTrue(stringUtils.matchAll('test', 'est'));
    });

    it('returns true if all characters in the test array are contained', () => {
      assert.isTrue(stringUtils.matchAll('test', ['e', 's', 't']));
    });

    it('returns false if str contains some characters which are not in the test string', () => {
      assert.isFalse(stringUtils.matchAll('test', 'et'));
    });

    it('returns false if str contains some characters which are not in the test array', () => {
      assert.isFalse(stringUtils.matchAll('test', ['e', 't']));
    });
  });
});
