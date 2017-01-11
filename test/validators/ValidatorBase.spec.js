import { assert } from 'chai';
import ValidatorBase from '../../src/validators/ValidatorBase';

describe('ValidatorBase', () => {
  describe('constructor', () => {
    it('stores context on the instance', () => {
      const expected = {};
      const base = new ValidatorBase(expected);
      assert.strictEqual(base.context, expected);
    });
  });

  describe('.defineContext', () => {
    it('sets keys on the cache object with the object keys given in the first call', () => {
      const cache = {};
      const context = {
        country: 'de',
      };
      ValidatorBase.defineContext(cache, context, {});
      assert.isArray(cache.keys, 'Expected cache.keys to be an array');
      assert.deepEqual(cache.keys, ['country'], 'Expected cache.keys to contain all context props');
    });
  });

  describe('.getOptions', () => {
    it('can fetch an object with options if an equivalent context is used', () => {
      const cache = {};
      const context = {
        country: '',
      };
      const expected = {};
      ValidatorBase.defineContext(cache, context, expected);
      let options = ValidatorBase.getOptions(cache, context);
      assert.strictEqual(options, expected, 'Expected the same options to be returned');

      options = ValidatorBase.getOptions(cache, { country: 'en' });
      assert.isUndefined(options, 'Expected options to be undefined if a different context is used');
    });
  });
});
