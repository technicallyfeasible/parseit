/**
 * Tests for PatternMatcher
 */

'use strict';

var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');

var Pattern = require('../src/matching/Pattern');
var PatternMatcher = require('../src/PatternMatcher');

describe('PatternMatcher', function() {

	var sandbox, testPatterns;
	beforeEach(function() {
		sandbox = sinon.sandbox.create();
		testPatterns = [
			new Pattern('{emptyline:*}{booleantrue}{emptyline:*}', function() { return true; }),
			new Pattern('{emptyline:*}{booleanfalse}{emptyline:*}', function() { return false; })
		];
	});

	afterEach(function() {
		sandbox.restore();
	});

	it('does not call addPatterns if no patterns are supplied', function() {
		sandbox.spy(PatternMatcher.prototype, 'addPatterns');
		var matcher = new PatternMatcher();
		assert.isTrue(matcher.addPatterns.notCalled);
	});

	it('calls addPatterns if patterns are supplied', function() {
		sandbox.spy(PatternMatcher.prototype, 'addPatterns');
		var matcher = new PatternMatcher(testPatterns);
		assert.isTrue(matcher.addPatterns.called);
	});

	describe('.addPatterns', function() {
		it('adds a pattern only once', function() {
			var matcher = new PatternMatcher();
			assert.isObject(matcher.patterns);
			assert.isObject(matcher.compiledPatterns);
			assert.isObject(matcher.validators);
			matcher.addPatterns('', [
				new Pattern('{emptyline:?}', null),
				new Pattern('{emptyline:?}', null)
			]);

			assert.isArray(matcher.patterns['']);
			assert.strictEqual(matcher.patterns[''].length, 1);
			assert.isObject(matcher.compiledPatterns['']);
			assert.strictEqual(Object.keys(matcher.compiledPatterns['']).length, 1);
		});

		it('splits a pattern into tokens', function() {
			var matcher = new PatternMatcher();
			matcher.addPatterns('', [
				new Pattern('{level1:?}{level2:?}', null)
			]);

			var compiled = matcher.compiledPatterns[''];
			assert.isDefined(compiled['level1:0-1']);
			assert.isDefined(compiled['level1:0-1'].paths['level2:0-1']);
		});

		it('identifies exact patterns and custom patterns correctly', function() {
			var matcher = new PatternMatcher();
			var token1 = 'exact';
			var token2 = '{level2:?}';
			matcher.addPatterns('', [
				new Pattern(token1 + token2, null)
			]);

			var compiled = matcher.compiledPatterns[''];
			assert.isDefined(compiled[token1]);
			assert.isDefined(compiled[token1].paths['level2:0-1']);
		});
	});

});
