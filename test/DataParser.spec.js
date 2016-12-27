/**
 * Tests for PatternMatcher
 */

const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');

const DataParser = require('../src/DataParser');
const PatternMatcher = require('../src/PatternMatcher');

const BooleanValue = require('../src/values/BooleanValue');

describe('DataParser', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('calls getDefaultPatternMatcher when created with no modules', () => {
    const spy = sinon.spy();
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
