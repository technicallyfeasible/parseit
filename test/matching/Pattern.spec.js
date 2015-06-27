/**
 * Tests for Pattern
 */

'use strict';

var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');
var Pattern = require('../../src/matching/Pattern');

describe('Pattern', function() {

	it('is initialized with a pattern', function() {
		var pattern = new Pattern('abc', null);
		assert.equal(pattern.match, 'abc');
	});

	it('calls parser on parse', function() {
		var spy = sinon.spy();
		var pattern = new Pattern('abc', spy);
		assert.strictEqual(spy.callCount, 0);

		var context = {};
		var values = ['val1', 'val2'];
		pattern.parse(context, values);
		assert.strictEqual(spy.callCount, 1);
		assert.isTrue(spy.calledWith(context, ['val1', 'val2']));

	});

	describe('.equals', function() {
		it('exists', function() {
			var pattern = new Pattern('');
			assert.isFunction(pattern.equals);
		});

		it('returns true if patterns have the same match', function() {
			var pattern1 = new Pattern('abc');
			var pattern2 = new Pattern('abc');
			assert.isTrue(pattern1.equals(pattern2));
		});

		it('returns false if patterns have a different match', function() {
			var pattern1 = new Pattern('abc');
			var pattern2 = new Pattern('def');
			assert.isFalse(pattern1.equals(pattern2));
		});
	});

});
