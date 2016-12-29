/**
 * Tests for PatternMatcher
 */

import chai from 'chai';

import BooleanParserModule from '../../src/modules/BooleanParserModule';
import BooleanValue from '../../src/values/BooleanValue';

const assert = chai.assert;

describe('BooleanParserModule', () => {
  it('sets up default constants for parsing', () => {
    const parser = new BooleanParserModule();
    assert.isObject(parser.const);
    assert.isArray(parser.const.trueValues);
    assert.isArray(parser.const.falseValues);
  });

  it('defines patternTags', () => {
    const parser = new BooleanParserModule();
    assert.isArray(parser.patternTags);
    assert.include(parser.patternTags, '');
  });

  it('defines tokenTags', () => {
    const parser = new BooleanParserModule();
    assert.isArray(parser.tokenTags);
  });

  describe('.getPatterns', () => {
    it('returns patterns for all tags in patternTags', () => {
      const parser = new BooleanParserModule();
      assert.isFunction(parser.getPatterns);

      parser.patternTags.forEach((tag) => {
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
      parser.const.trueValues.forEach((trueValue) => {
        const value = make.call(parser, trueValue);
        assert.strictEqual(value.bool, true);
      });
    });

    it('converts values in falseValues to BooleanValue(false)', () => {
      const make = BooleanParserModule.__get__('make');

      const parser = new BooleanParserModule();
      parser.const.falseValues.forEach((falseValue) => {
        const value = make.call(parser, falseValue);
        assert.strictEqual(value.bool, false);
      });
    });
  });
});
