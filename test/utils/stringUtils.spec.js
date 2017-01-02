/**
 * Tests for PatternMatcher
 */

import chai from 'chai';
import { startsWith, matchAll } from '../../src/utils/stringUtils';

const assert = chai.assert;

describe('String Utils', () => {
  describe('.startsWith', () => {
    it('exists', () => {
      assert.isFunction(startsWith);
    });

    it('returns false if the string is null or empty', () => {
      assert.isFalse(startsWith('', ''));
      assert.isFalse(startsWith(null, ''));
    });

    it('returns false if the test value is null or empty', () => {
      assert.isFalse(startsWith('str', ''));
      assert.isFalse(startsWith('str', null));
    });

    it('returns true if the string starts with the test string', () => {
      assert.isTrue(startsWith('this is a string', 'this'));
      assert.isTrue(startsWith('this is this', 'this'));
    });

    it('returns false if the string does not start with the test string', () => {
      assert.isFalse(startsWith(' this is a string', 'this'));
      assert.isFalse(startsWith('some other string', 'this'));
    });
  });

  describe('.matchAll', () => {
    it('exists', () => {
      assert.isFunction(matchAll);
    });

    it('returns false if the string is null or empty', () => {
      assert.isFalse(matchAll(''));
      assert.isFalse(matchAll(null));
    });

    it('returns false if the string is null or empty', () => {
      assert.isFalse(matchAll(''));
      assert.isFalse(matchAll(null));
    });

    it('returns true if all characters in the test string are contained', () => {
      assert.isTrue(matchAll('test', 'est'));
    });

    it('returns true if all characters in the test array are contained', () => {
      assert.isTrue(matchAll('test', ['e', 's', 't']));
    });

    it('returns false if str contains some characters which are not in the test string', () => {
      assert.isFalse(matchAll('test', 'et'));
    });

    it('returns false if str contains some characters which are not in the test array', () => {
      assert.isFalse(matchAll('test', ['e', 't']));
    });
  });
});
