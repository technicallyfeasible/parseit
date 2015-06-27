/**
 * Tests for PatternMatcher
 */

'use strict';

var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');

var Pattern = require('../src/matching/Pattern');
var Token = require('../src/matching/Token');
var PathNode = require('../src/matching/PathNode');
var PatternMatcher = require('../src/PatternMatcher');
var MatchState = require('../src/MatchState');
var PatternContext = require('../src/PatternContext');

describe('PatternMatcher', function() {

	var sandbox;
	beforeEach(function() {
		sandbox = sinon.sandbox.create();
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
		var testPatterns = [
			new Pattern('{emptyline:*}{booleantrue}{emptyline:*}', function() { return true; }),
			new Pattern('{emptyline:*}{booleanfalse}{emptyline:*}', function() { return false; })
		];
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

		it('remembers the pattern for each compiled node', function() {
			var testPatterns = [
				new Pattern('{emptyline:*}{booleantrue}{emptyline:*}', function() { return true; }),
				new Pattern('{emptyline:*}{booleanfalse}{emptyline:*}', function() { return false; })
			];
			var matcher = new PatternMatcher();
			matcher.addPatterns('', testPatterns);

			var tag = 'emptyline:0-' + Token.prototype.MAX_VALUE;
			var compiled = matcher.compiledPatterns[''];
			var root = compiled[tag];
			assert.strictEqual(root.matchedPatterns.length, 0);

			var levelTrue = root.paths['booleantrue:1-1'];
			assert.strictEqual(levelTrue.matchedPatterns.length, 0);
			var levelFalse = root.paths['booleanfalse:1-1'];
			assert.strictEqual(levelFalse.matchedPatterns.length, 0);

			// the last level should have the patterns referenced
			var end = levelTrue.paths[tag];
			assert.strictEqual(end.matchedPatterns.length, 1);
			assert.strictEqual(end.matchedPatterns[0], 0);
			end = levelFalse.paths[tag];
			assert.strictEqual(end.matchedPatterns.length, 1);
			assert.strictEqual(end.matchedPatterns[0], 1);
		});
	});

	describe('.matchStart', function() {

		var matcher;
		beforeEach(function() {
			matcher = new PatternMatcher([
				new Pattern('{emptyline:*}{booleantrue}{emptyline:*}', function() { return true; }),
				new Pattern('{emptyline:*}{booleanfalse}{emptyline:*}', function() { return false; })
			]);
		});

		it('returns null if there are no patterns', function() {
			var state = new PatternMatcher().matchStart(new PatternContext(), '');
			assert.isNull(state);
		});

		it('returns new state', function() {
			var state = matcher.matchStart(new PatternContext(), '');
			assert.isObject(state);
			assert.instanceOf(state, MatchState);
		});

		it('returns new state with context and tag set', function() {
			var state = matcher.matchStart(null, '');
			assert.instanceOf(state.context, PatternContext);
			assert.strictEqual(state.matchTag, '');

			assert.strictEqual(state.candidatePaths.length, 1);
			assert.instanceOf(state.candidatePaths[0], PathNode);
		});
	});

});
