/**
 * Created by Creator on 25.06.2015.
 */

var chai = require('chai');
var assert = chai.assert;
var Pattern = require('../src/matching/Pattern.js');

describe('Pattern', function() {

	it('is initialized with a pattern', function() {
		var pattern = new Pattern('abc', null);
		assert.equal(pattern.match, 'abc');
	});

	it('calls parser on parse', function() {
		var callCount = 0;
		var pattern = new Pattern('abc', function(context, values) {
			callCount++;
		});
		assert.strictEqual(callCount, 0);

		pattern.parse({}, ['val1', 'val2']);
		assert.strictEqual(callCount, 1);

	});

});
