/**
 * Tests for Pattern
 */

'use strict';

var chai = require('chai');
var assert = chai.assert;
var PathNode = require('../../src/matching/PathNode');

describe('PathNode', function() {

	it('is initialized with token, path and text value', function() {
		var token = {};
		var path = {};
		var text = 'text';
		var pathNode = new PathNode(token, path, text);

		assert.strictEqual(pathNode.token, token);
		assert.strictEqual(pathNode.path, path);
		assert.strictEqual(pathNode.textValue, text);
	});

});
