/**
 * Tests for PatternMatcher
 */

import chai from 'chai';
import sinon from 'sinon';

import DataParser from '../src/DataParser';
import PatternMatcher from '../src/PatternMatcher';

import BooleanValue from '../src/values/BooleanValue';

const assert = chai.assert;

describe('DataParser', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('calls getDefaultPatternMatcher when created with no modules', () => {
    const spy = sandbox.spy();
    const getDefaultPatternMatcher = DataParser.__get__('getDefaultPatternMatcher');
    DataParser.__set__('getDefaultPatternMatcher', spy);

    /* eslint-disable no-new */
    new DataParser();
    /* eslint-enable no-new */
    assert.isTrue(spy.calledOnce);

    // restore
    DataParser.__set__('getDefaultPatternMatcher', getDefaultPatternMatcher);
  });

  describe('.getDefaultPatternMatcher', () => {
    it('creates a default matcher or returns the cached instance', () => {
      const getDefaultPatternMatcher = DataParser.__get__('getDefaultPatternMatcher');

      const matcher = getDefaultPatternMatcher();
      assert.instanceOf(matcher, PatternMatcher);
      // second call should return same instance
      const matcher2 = getDefaultPatternMatcher();
      assert.strictEqual(matcher, matcher2);
    });
  });

  describe('.parse', () => {
    it('returns BooleanValue when parsing "true" / "false"', () => {
      const parser = new DataParser();
      const result = parser.parse('true');
      assert.isArray(result);
      assert.lengthOf(result, 1);
      assert.instanceOf(result[0], BooleanValue);
    });
  });
});
