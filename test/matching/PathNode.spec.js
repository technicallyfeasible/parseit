/**
 * Tests for Pattern
 */

const chai = require('chai');
const assert = chai.assert;
const PathNode = require('../../src/matching/PathNode');

describe('PathNode', () => {
  it('is initialized with token, path and text value', () => {
    const token = {};
    const path = {};
    const text = 'text';
    const pathNode = new PathNode(token, path, text);

    assert.strictEqual(pathNode.token, token);
    assert.strictEqual(pathNode.path, path);
    assert.strictEqual(pathNode.textValue, text);
  });
});
