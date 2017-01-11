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
});
