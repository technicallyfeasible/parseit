/**
 * Tests for PatternMatcher
 */

import chai from 'chai';

import BooleanParserModule, { constants } from '../../src/modules/BooleanParserModule';
import BooleanValue from '../../src/values/BooleanValue';

const assert = chai.assert;

describe('BooleanParserModule', () => {
  it('sets up default constants for parsing', () => {
    assert.isObject(constants);
    assert.isArray(constants.trueValues);
    assert.isArray(constants.falseValues);
  });

  it('defines patternTags', () => {
    assert.isArray(BooleanParserModule.patternTags);
    assert.include(BooleanParserModule.patternTags, '');
  });

  it('defines tokenTags', () => {
    assert.isArray(BooleanParserModule.tokenTags);
  });

  describe('.getPatterns', () => {
    it('returns patterns for all tags in patternTags', () => {
      const parser = new BooleanParserModule();
      assert.isFunction(parser.getPatterns);

      BooleanParserModule.patternTags.forEach((tag) => {
        const patterns = parser.getPatterns(tag);
        assert.isArray(patterns);
      });
    });

    it('returns mainPatterns for empty tag', () => {
      const mainPatterns = BooleanParserModule.__get__('mainPatterns');
      assert.isArray(mainPatterns);

      const parser = new BooleanParserModule();
      const patterns = parser.getPatterns('');
      assert.isArray(patterns);
      assert.strictEqual(patterns, mainPatterns);
    });
  });

  describe('.make', () => {
    it('exists', () => {
      const make = BooleanParserModule.__get__('make');
      assert.isFunction(make);
    });

    it('returns a BooleanValue with false if supplied no argument', () => {
      const make = BooleanParserModule.__get__('make');
      const value = make();
      assert.instanceOf(value, BooleanValue);
    });

    it('returns a BooleanValue for boolean arguments', () => {
      const make = BooleanParserModule.__get__('make');
      let value = make(false);
      assert.strictEqual(value.bool, false);
      value = make(true);
      assert.strictEqual(value.bool, true);
    });

    it('converts values in trueValues to BooleanValue(true)', () => {
      const make = BooleanParserModule.__get__('make');

      const parser = new BooleanParserModule();
      constants.trueValues.forEach((trueValue) => {
        const value = make.call(parser, trueValue);
        assert.instanceOf(value, BooleanValue);
        assert.strictEqual(value.bool, true);
      });
    });

    it('converts values in trueValues with surrounding spaces to BooleanValue(true)', () => {
      const make = BooleanParserModule.__get__('make');

      const parser = new BooleanParserModule();
      constants.trueValues.forEach((trueValue) => {
        const value = make.call(parser, trueValue);
        assert.instanceOf(value, BooleanValue);
        assert.strictEqual(value.bool, true);
      });
    });

    it('converts values in falseValues to BooleanValue(false)', () => {
      const make = BooleanParserModule.__get__('make');

      const parser = new BooleanParserModule();
      constants.falseValues.forEach((falseValue) => {
        const value = make.call(parser, falseValue);
        assert.instanceOf(value, BooleanValue);
        assert.strictEqual(value.bool, false);
      });
    });
  });
});
