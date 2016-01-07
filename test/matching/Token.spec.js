/**
 * Tests for Pattern
 */

const chai = require('chai');
const assert = chai.assert;
const Token = require('../../src/matching/Token');

describe('Token', () => {
  it('defaults to single count if only given a value', () => {
    const token = new Token('mytoken');
    assert.strictEqual(token.value, 'mytoken');
    assert.strictEqual(token.minCount, 1);
    assert.strictEqual(token.maxCount, 1);
    assert.isFalse(token.exactMatch);
  });

  it('handles exact matches even with colon ":"', () => {
    const token = new Token('mytoken:', true);
    assert.strictEqual(token.value, 'mytoken:');
    assert.strictEqual(token.minCount, 1);
    assert.strictEqual(token.maxCount, 1);
    assert.isTrue(token.exactMatch);
  });

  it('splits value by colon and allows empty count', () => {
    const token = new Token('mytoken:');
    assert.strictEqual(token.value, 'mytoken');
    assert.strictEqual(token.minCount, 1);
    assert.strictEqual(token.maxCount, 1);
    assert.isFalse(token.exactMatch);
  });

  it('splits value by colon, + is 1-max count', () => {
    const token = new Token('mytoken:+');
    assert.strictEqual(token.value, 'mytoken');
    assert.strictEqual(token.minCount, 1);
    assert.strictEqual(token.maxCount, token.MAX_VALUE);
  });
  it('splits value by colon, * is 0-max count', () => {
    const token = new Token('mytoken:*');
    assert.strictEqual(token.value, 'mytoken');
    assert.strictEqual(token.minCount, 0);
    assert.strictEqual(token.maxCount, token.MAX_VALUE);
  });
  it('splits value by colon, ? is 0-1 count', () => {
    const token = new Token('mytoken:?');
    assert.strictEqual(token.value, 'mytoken');
    assert.strictEqual(token.minCount, 0);
    assert.strictEqual(token.maxCount, 1);
  });

  it('accepts single count', () => {
    let token = new Token('mytoken:2');
    assert.strictEqual(token.value, 'mytoken');
    assert.strictEqual(token.minCount, 2);
    assert.strictEqual(token.maxCount, 2);

    token = new Token('mytoken:5');
    assert.strictEqual(token.value, 'mytoken');
    assert.strictEqual(token.minCount, 5);
    assert.strictEqual(token.maxCount, 5);
  });

  it('accepts count range', () => {
    let token = new Token('mytoken:1-2');
    assert.strictEqual(token.value, 'mytoken');
    assert.strictEqual(token.minCount, 1);
    assert.strictEqual(token.maxCount, 2);

    token = new Token('mytoken:-3');
    assert.strictEqual(token.value, 'mytoken');
    assert.strictEqual(token.minCount, 0);
    assert.strictEqual(token.maxCount, 3);
  });

  it('count range max cannot be smaller than min', () => {
    let token = new Token('mytoken:2-1');
    assert.strictEqual(token.value, 'mytoken');
    assert.strictEqual(token.minCount, 2);
    assert.strictEqual(token.maxCount, 2);

    token = new Token('mytoken:3-');
    assert.strictEqual(token.value, 'mytoken');
    assert.strictEqual(token.minCount, 3);
    assert.strictEqual(token.maxCount, 3);
  });

  describe('.equals', () => {
    it('exists', () => {
      const token = new Token('mytoken');
      assert.isFunction(token.equals);
    });
    it('returns true if tokens are equal', () => {
      let token1 = new Token('mytoken');
      let token2 = new Token('mytoken');
      assert.isTrue(token1.equals(token2));

      token1 = new Token('mytoken:1-5');
      token2 = new Token('mytoken:1-5');
      assert.isTrue(token1.equals(token2));
    });
    it('returns false if tokens are not equal', () => {
      let token1 = new Token('mytoken');
      let token2 = new Token('othertoken');
      assert.isFalse(token1.equals(token2));

      token1 = new Token('mytoken:0-1');
      token2 = new Token('mytoken:2-3');
      assert.isFalse(token1.equals(token2));
    });
    it('equates tokens even if they were created with different count modifiers', () => {
      let token1 = new Token('mytoken:?');
      let token2 = new Token('mytoken:0-1');
      assert.isTrue(token1.equals(token2));

      token1 = new Token('mytoken:+');
      token2 = new Token('mytoken:1-' + Token.prototype.MAX_VALUE);
      assert.isTrue(token1.equals(token2));
    });
  });

  describe('.toString', () => {
    it('converts the token back to its string representation', () => {
      const str = 'mytoken:1-2';
      let token = new Token(str);
      assert.strictEqual(token.toString(), str);

      token = new Token(str, true);
      assert.strictEqual(token.toString(), str);
    });

    it('replaces shortcuts by actual count ranges', () => {
      const token = new Token('mytoken:?');
      assert.strictEqual(token.toString(), 'mytoken:0-1');
    });
  });
});
