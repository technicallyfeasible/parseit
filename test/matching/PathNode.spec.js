/**
 * Tests for Pattern
 */

import chai from 'chai';
import PathNode from '../../src/matching/PathNode';

const assert = chai.assert;

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
