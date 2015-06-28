/**
 * Tests for PatternMatcher
 */

'use strict';

var chai = require('chai');
var assert = chai.assert;
var rewire = require('rewire');

var BooleanParserModule = rewire('../../src/modules/BooleanParserModule');
var BooleanValue = require('../../src/values/BooleanValue');

describe('BooleanParserModule', function() {

	it('sets up default constants for parsing', function() {
		var parser = new BooleanParserModule();
		assert.isObject(parser.const);
		assert.isArray(parser.const.trueValues);
		assert.isArray(parser.const.falseValues);
	});

	it('defines patternTags', function() {
		var parser = new BooleanParserModule();
		assert.isArray(parser.patternTags);
		assert.include(parser.patternTags, '');
	});

	it('defines tokenTags', function() {
		var parser = new BooleanParserModule();
		assert.isArray(parser.tokenTags);
	});

	describe('.getPatterns', function() {

		it('returns patterns for all tags in patternTags', function() {
			var parser = new BooleanParserModule();
			assert.isFunction(parser.getPatterns);

			parser.patternTags.forEach(function(tag) {
				var patterns = parser.getPatterns(tag);
				assert.isArray(patterns);
			});
		});

		it('returns mainPatterns for empty tag', function() {
			var mainPatterns = BooleanParserModule.__get__('mainPatterns');
			assert.isArray(mainPatterns);

			var parser = new BooleanParserModule();
			var patterns = parser.getPatterns('');
			assert.isArray(patterns);
			assert.strictEqual(patterns, mainPatterns);
		});

	});

	describe('make', function() {

		it('exists', function() {
			var make = BooleanParserModule.__get__('make');
			assert.isFunction(make);
		});

		it('returns a BooleanValue with false if supplied no argument', function() {
			var make = BooleanParserModule.__get__('make');
			var value = make();
			assert.instanceOf(value, BooleanValue);
		});

		it('returns a BooleanValue for boolean arguments', function() {
			var make = BooleanParserModule.__get__('make');
			var value = make(false);
			assert.strictEqual(value.bool, false);
			value = make(true);
			assert.strictEqual(value.bool, true);
		});

		it('converts values in trueValues to BooleanValue(true)', function() {
			var make = BooleanParserModule.__get__('make');

			var parser = new BooleanParserModule();
			parser.const.trueValues.forEach(function(trueValue) {
				var value = make.call(parser, trueValue);
				assert.strictEqual(value.bool, true);
			});
		});

		it('converts values in falseValues to BooleanValue(false)', function() {
			var make = BooleanParserModule.__get__('make');

			var parser = new BooleanParserModule();
			parser.const.falseValues.forEach(function(falseValue) {
				var value = make.call(parser, falseValue);
				assert.strictEqual(value.bool, false);
			});
		});

	});

});
