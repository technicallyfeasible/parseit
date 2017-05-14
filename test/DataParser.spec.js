/**
 * Tests for PatternMatcher
 */

import chai from 'chai';
import sinon from 'sinon';

import DataParser from '../src/DataParser';
import PatternMatcher from '../src/PatternMatcher';

import DefaultValidator from '../src/validators/DefaultValidator';
import BooleanParserModule from '../src/modules/BooleanParserModule';
import BooleanValue from '../src/values/BooleanValue';

import NumberParserModule from '../src/modules/NumberParserModule';
import NumberValue from '../src/values/NumberValue';

const assert = chai.assert;

describe('DataParser', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('calls makePatternMatcher with default modules when none are supplied', () => {
    const spy = sandbox.spy();
    const makePatternMatcher = DataParser.__get__('makePatternMatcher');
    DataParser.__set__('makePatternMatcher', spy);

    new DataParser();   // eslint-disable-line no-new

    assert.isTrue(spy.calledOnce);

    // restore
    DataParser.__set__('makePatternMatcher', makePatternMatcher);
  });

  describe('.constructor', () => {
    it('creates a matcher or uses the cached instance', () => {
      const parser1 = new DataParser('parser');
      const parser2 = new DataParser('parser');

      assert.instanceOf(parser1.patternMatcher, PatternMatcher);
      assert.instanceOf(parser2.patternMatcher, PatternMatcher);

      // second call should return same instance
      assert.strictEqual(parser2.patternMatcher, parser1.patternMatcher, 'Should reuse a cached PatternMatcher instance if a name is specified');
    });

    it('creates a new matcher if modules or context are set', () => {
      const parser1 = new DataParser('parser');
      const parser2 = new DataParser('parser', []);
      const parser3 = new DataParser('parser', null, {});

      assert.instanceOf(parser1.patternMatcher, PatternMatcher);
      assert.instanceOf(parser2.patternMatcher, PatternMatcher);
      assert.instanceOf(parser3.patternMatcher, PatternMatcher);

      // second call should return different instance
      assert.notStrictEqual(parser2.patternMatcher, parser1.patternMatcher, 'Should create a new PatternMatcher instance if modules are specified');

      // third call should return different instance
      assert.notStrictEqual(parser3.patternMatcher, parser2.patternMatcher, 'Should create a new PatternMatcher instance if context is specified');
    });
  });

  describe('.parse', () => {
    it('returns BooleanValue when parsing "true" / "false" with or without surrounding spaces', () => {
      const parser = new DataParser('boolean', [DefaultValidator, BooleanParserModule]);

      const testStrings = ['true', 'false', '  true', ' true  ', ' 0', '1 '];
      const testValues = [true, false, true, true, false, true];
      testStrings.forEach((str, index) => {
        const result = parser.parse(str);
        const values = result.values;
        assert.isArray(values);
        assert.lengthOf(values, 1, `Failing case: [${str}]`);
        assert.instanceOf(values[0], BooleanValue);
        assert.strictEqual(values[0].bool, testValues[index], 'Expected the parsed value to be correct');
      });
    });

    it('returns NumberValue when parsing numbers with or without surrounding spaces', () => {
      const parser = new DataParser('number', [DefaultValidator, NumberParserModule]);

      const tests = {
        2: 2,
        32: 32,
        76.3: 76.3,
        '23,598': 23598,
        '43,671,324.3245': 43671324.3245,
        43671324.3245: 43671324.3245,
        '34m': { address: 34, symbol: 'm', decimals: 0 },
        '  98': 98,
        ' 87 steps  ': { address: 87, symbol: 'steps', decimals: 0 },
        // { :*}{-+:?}{#,:+}.{#:*}{ :*}{unit:*}{ :*}
        ' -1,456.123 l/s ': { address: -1456.123, decimals: 3, symbol: 'l/s' },
        ' +1,456.123 l/s ': { address: 1456.123, decimals: 3, symbol: 'l/s' },
        // { :*}{-+:?}{#:*}.{#:+}{ :*}{unit:*}{ :*}
        ' -74809.456 m^2 ': { address: -74809.456, decimals: 3, symbol: 'm^2' },
        ' +74809.456 m^2 ': { address: 74809.456, decimals: 3, symbol: 'm^2' },
        // { :*}{-+:?}{#,:+}.{#:*}e{-+:?}{#:+}{ :*}{unit:*}{ :*}
        ' -1,025.6946e3 seconds ': { address: -1025.6946 * 1000, decimals: 1, symbol: 'seconds' },
        ' 3,000.6946e-2 monkeys ': { address: 30.006946, decimals: 6, symbol: 'monkeys' },
        // { :*}{-+:?}{#,:+}.{#:*}e{-+:?}{#:+}.{#:+}{ :*}{unit:*}{ :*}
        ' -1,025.6946e2.7 mm ': { address: -514065.0391204318, decimals: 1, symbol: 'mm' },
        // { :*}{-+:?}{#:+}.{#:*}e{-+:?}{#:+}.{#:+}{ :*}{unit:*}{ :*}
        ' -1025.6946e2.7 mm ': { address: -514065.0391204318, decimals: 1, symbol: 'mm' },
        // { :*}{-+:?}{#:+}.{#:*}e{-+:?}{#:+}{ :*}{unit:*}{ :*}
        ' -1025.6946e3 hands ': { address: -1025.6946 * 1000, decimals: 1, symbol: 'hands' },
        // { :*}{-+:?}{#:+}{ :*}{unit:*}{ :*}
        ' 7678233 km ': { address: 7678233, decimals: 0, symbol: 'km' },
        // { :*}{-+:?}{#,:+}{ :*}{unit:*}{ :*}
        ' 7,678,233 km ': { address: 7678233, decimals: 0, symbol: 'km' },
        // { :*}{-+:?}{#:+}e{-+:?}{#:+}{ :*}{unit:*}{ :*}
        ' -76e-5 stones ': { address: -0.00076, decimals: 5, symbol: 'stones' },
        // { :*}{-+:?}{#,:+}e{-+:?}{#:+}{ :*}{unit:*}{ :*}
        ' -4,239e5 bears ': { address: -423900000, decimals: 0, symbol: 'bears' },
      };
      Object.keys(tests).forEach(str => {
        const expected = tests[str];

        const result = parser.parse(str);
        const values = result.values;
        assert.isArray(values);
        assert.lengthOf(values, 1, `"${str}" parsed as ${JSON.stringify(values)}`);
        assert.instanceOf(values[0], NumberValue);
        if (typeof expected === 'object') {
          assert.deepEqual(values[0], expected, `Expected "${str}" to be correct: ${JSON.stringify(values)}`);
        } else {
          assert.strictEqual(values[0].address, expected, `Expected "${str}" to be correct: ${JSON.stringify(values)}`);
        }
      });
    });
  });
});
