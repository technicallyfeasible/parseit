/**
 * Tests for Pattern
 */

const chai = require('chai');
const Pattern = require('../../src/matching/Pattern');
const sinon = require('sinon');

const assert = chai.assert;

describe('Pattern', () => {
  it('is initialized with a pattern', () => {
    const pattern = new Pattern('abc', null);
    assert.equal(pattern.match, 'abc');
  });

  it('calls parser on parse', () => {
    const spy = sinon.spy();
    const pattern = new Pattern('abc', spy);
    assert.strictEqual(spy.callCount, 0);

    const context = {};
    const values = ['val1', 'val2'];
    pattern.parse(context, values);
    assert.strictEqual(spy.callCount, 1);
    assert.isTrue(spy.calledWith(context, ['val1', 'val2']));
  });

  describe('.equals', () => {
    it('exists', () => {
      const pattern = new Pattern('');
      assert.isFunction(pattern.equals);
    });

    it('returns true if patterns have the same match', () => {
      const pattern1 = new Pattern('abc');
      const pattern2 = new Pattern('abc');
      assert.isTrue(pattern1.equals(pattern2));
    });

    it('returns false if patterns have a different match', () => {
      const pattern1 = new Pattern('abc');
      const pattern2 = new Pattern('def');
      assert.isFalse(pattern1.equals(pattern2));
    });
  });
});
