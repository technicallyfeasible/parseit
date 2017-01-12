/**
 * Tests for PatternMatcher
 */

import { assert } from 'chai';

import BooleanParserModule, { optionsCache } from '../../src/modules/BooleanParserModule';


describe('BooleanParserModule', () => {
  let context;
  beforeEach(() => {
    context = {
      language: 'en',
    };
  });

  it('loads english language constants by default', () => {
    assert.isObject(optionsCache.en);
    assert.isArray(optionsCache.en.trueValues);
    assert.isArray(optionsCache.en.falseValues);
  });

  it('defines tokenTags', () => {
    assert.isArray(BooleanParserModule.tokenTags);
  });

  describe('.getPatterns', () => {
    it('returns en patterns by default', () => {
      const parser = new BooleanParserModule(context);
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

      const parser = new BooleanParserModule(context);
      const patterns = parser.getPatterns();
      assert.isArray(patterns['']);
      assert.strictEqual(patterns[''], mainPatterns);
    });
  });

  describe('.validateToken', () => {
    it('returns true for final en "true" boolean values and false for "false" values', () => {
      const parser = new BooleanParserModule(context);
      assert.isFunction(parser.validateToken);

      const trueValues = ['true', '1', 'yes'];
      trueValues.forEach(value => {
        assert.isTrue(parser.validateToken(context, { value: 'booleantrue' }, value, true));
        assert.isFalse(parser.validateToken(context, { value: 'booleanfalse' }, value, true));
      });
    });

    it('returns true for final en "false" boolean values and false for "true" values', () => {
      const parser = new BooleanParserModule(context);
      assert.isFunction(parser.validateToken);

      const trueValues = ['false', '0', 'no'];
      trueValues.forEach(value => {
        assert.isTrue(parser.validateToken(context, { value: 'booleanfalse' }, value, true));
        assert.isFalse(parser.validateToken(context, { value: 'booleantrue' }, value, true));
      });
    });
  });

  describe('.finalizeValue', () => {
    it('returns "true" if the token is "booleantrue"', () => {
      const parser = new BooleanParserModule(context);
      assert.isFunction(parser.finalizeValue);

      assert.isTrue(parser.finalizeValue(context, { value: 'booleantrue' }, ''));
      assert.isTrue(parser.finalizeValue(context, { value: 'booleantrue' }, 'true'));
    });

    it('returns "false" if the token is "booleanfalse"', () => {
      const parser = new BooleanParserModule(context);
      assert.isFunction(parser.finalizeValue);

      assert.isFalse(parser.finalizeValue(context, { value: 'booleanfalse' }, ''));
      assert.isFalse(parser.finalizeValue(context, { value: 'booleanfalse' }, 'false'));
    });
  });
});
