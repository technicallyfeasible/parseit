/**
 * Tests for PatternMatcher
 */

import { assert } from 'chai';

import Token from '../../src/matching/Token';
import NumberParserModule, { optionsCache } from '../../src/modules/NumberParserModule';


describe('BooleanParserModule', () => {
  let context;
  beforeEach(() => {
    context = {
      language: 'en',
    };
  });

  it('loads english language constants by default', () => {
    assert.isObject(optionsCache.en);
    assert.isFalse(optionsCache.en.commaDecimal);
  });

  it('defines tokenTags', () => {
    assert.isArray(NumberParserModule.tokenTags);
  });

  describe('.getPatterns', () => {
    it('returns en patterns by default', () => {
      const parser = new NumberParserModule(context);
      assert.isFunction(parser.getPatterns);

      const patterns = parser.getPatterns();
      assert.isObject(patterns);
      assert.isNotNull(patterns['']);
      Object.keys(patterns).forEach((tag) => {
        assert.isArray(patterns[tag]);
      });
    });

    it('returns mainPatterns for empty tag', () => {
      const mainPatterns = optionsCache.en.patterns[''];
      assert.isArray(mainPatterns);

      const parser = new NumberParserModule(context);
      const patterns = parser.getPatterns();
      assert.isArray(patterns['']);
      assert.strictEqual(patterns[''], mainPatterns);
    });
  });


  describe('.validateToken', () => {
    function validateTokenValuesFinal(token, values, expected = true) {
      const parser = new NumberParserModule(context);
      values.forEach(value => {
        assert.strictEqual(parser.validateToken(context, token, value, true), expected, `Failing case: ${value}`);
      });
    }

    it('exists', () => {
      const parser = new NumberParserModule(context);
      assert.isFunction(parser.validateToken);
    });

    it('returns true for + or - signs', () => {
      const token = new Token('-+:?');
      const signs = ['-', '+'];
      const nonSigns = ['--', '+-', '1', '-+', '++', ''];
      validateTokenValuesFinal(token, signs);
      validateTokenValuesFinal(token, nonSigns, false);
    });

    it('returns true simple integers', () => {
      const token = new Token('#:+');
      const ints = ['70', '12', '33645', '0928', '1'];
      const nonInts = ['70.5', '12,12', '33645a', '09g28', '-100', ''];
      validateTokenValuesFinal(token, ints);
      validateTokenValuesFinal(token, nonInts, false);
    });

    it('returns true for integers with "." group separator', () => {
      const token = new Token('#.:+');
      const groups = ['70', '12', '33.645', '0.928', '1'];
      const nonGroups = ['70,005', '12,12', '336.45', '10928', '-100', ''];
      validateTokenValuesFinal(token, groups);
      validateTokenValuesFinal(token, nonGroups, false);
    });

    it('returns true for integers with "," group separator', () => {
      const token = new Token('#,:+');
      const groups = ['70', '12', '33,645', '0,928', '1', '43,671,324'];
      const nonGroups = ['70.005', '12.12', '336,45', '10928', '-100', ''];
      validateTokenValuesFinal(token, groups);
      validateTokenValuesFinal(token, nonGroups, false);
    });

    it('returns true for units', () => {
      const token = new Token('unit:+');
      const units = ['m^2', 'm', 'a', 'g', 'kg', 'ml', 'MB', 'l/d', 'Kilometer', 'km', 'mol', 'N/m^2', 'J/Kg'];
      const nonUnits = ['12', '^m', '/d', '5m', 'per day', '-', ''];
      validateTokenValuesFinal(token, units);
      validateTokenValuesFinal(token, nonUnits, false);
    });

    it('returns true hexadecimal numbers', () => {
      const token = new Token('X:+');
      const hex = ['70', '12', '33acf', '0a6d7f', 'aaa', 'def', 'ffff', 'abcdef'];
      const nonHex = ['abcdefg', '0436h90', 'a.b', '0.5a', ''];
      validateTokenValuesFinal(token, hex);
      validateTokenValuesFinal(token, nonHex, false);
    });
  });

  describe('.finalizeValue', () => {
    it('always returns value', () => {
      const parser = new NumberParserModule(context);
      assert.isFunction(parser.finalizeValue);

      const values = ['abc', '1', 'true', '456', '12,487', ''];
      values.forEach(value => {
        assert.strictEqual(parser.finalizeValue(context, {}, value), value);
      });
    });
  });
});
