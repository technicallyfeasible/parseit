/**
 * Tests for PatternMatcher
 */

'use strict';

var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');
var rewire = require('rewire');

var DataParser = rewire('../src/DataParser');
var PatternMatcher = require('../src/PatternMatcher');

describe('DataParser', function() {

	var sandbox;
	beforeEach(function() {
		sandbox = sinon.sandbox.create();
	});

	afterEach(function() {
		sandbox.restore();
	});

	it('calls getDefaultPatternMatcher when created with no modules', function() {
		var spy = sinon.spy();
		var getDefaultPatternMatcher = DataParser.__get__('getDefaultPatternMatcher');
		DataParser.__set__('getDefaultPatternMatcher', spy);

		/* eslint-disable no-new */
		new DataParser();
		/* eslint-enable no-new */
		assert.isTrue(spy.calledOnce);

		// restore
		DataParser.__set__('getDefaultPatternMatcher', getDefaultPatternMatcher);
	});

	describe('.getDefaultPatternMatcher', function() {

		it('creates a default matcher or returns the cached instance', function() {
			var getDefaultPatternMatcher = DataParser.__get__('getDefaultPatternMatcher');

			var matcher = getDefaultPatternMatcher();
			assert.instanceOf(matcher, PatternMatcher);
			// second call should return same instance
			var matcher2 = getDefaultPatternMatcher();
			assert.strictEqual(matcher, matcher2);
		});

	});

});
