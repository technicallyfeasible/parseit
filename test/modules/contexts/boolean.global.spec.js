/**
 * Tests for PatternMatcher
 */

import { assert } from 'chai';

import booleanGlobal from '../../../src/modules/contexts/boolean.global';
import BooleanValue from '../../../src/values/BooleanValue';


describe('boolean.global', () => {
  let context;
  let constants;
  beforeEach(() => {
    context = {
      language: 'en',
    };
    constants = {
      trueValues: ['1', 'true'],
      falseValues: ['0', 'false'],
    };
  });

  it('exports a function', () => {
    assert.isFunction(booleanGlobal);
  });

  it('returns a BooleanValue with false if supplied no argument', () => {
    const make = booleanGlobal(constants).make;
    const value = make();
    assert.instanceOf(value, BooleanValue);
  });

  it('returns a BooleanValue for boolean arguments', () => {
    const make = booleanGlobal(constants).make;
    let value = make(context, ['', false, '']);
    assert.strictEqual(value.bool, false);
    value = make(context, ['', true, '']);
    assert.strictEqual(value.bool, true);
  });

  it('converts values in trueValues to BooleanValue(true)', () => {
    const make = booleanGlobal(constants).make;

    constants.trueValues.forEach((trueValue) => {
      const value = make(context, ['', trueValue, '']);
      assert.instanceOf(value, BooleanValue);
      assert.strictEqual(value.bool, true);
    });
  });

  it('converts values in trueValues with surrounding spaces to BooleanValue(true)', () => {
    const make = booleanGlobal(constants).make;

    constants.trueValues.forEach((trueValue) => {
      const value = make(context, ['', trueValue, '']);
      assert.instanceOf(value, BooleanValue);
      assert.strictEqual(value.bool, true);
    });
  });

  it('converts values in falseValues to BooleanValue(false)', () => {
    const make = booleanGlobal(constants).make;

    constants.falseValues.forEach((falseValue) => {
      const value = make(['', falseValue, '']);
      assert.instanceOf(value, BooleanValue);
      assert.strictEqual(value.bool, false);
    });
  });
});
