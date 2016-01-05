/**
 * Tests for PatternMatcher
 */

const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');

const Pattern = require('../src/matching/Pattern');
const Token = require('../src/matching/Token');
const PathNode = require('../src/matching/PathNode');
const PatternMatcher = require('../src/PatternMatcher');
const MatchState = require('../src/MatchState');
const PatternContext = require('../src/PatternContext');

describe('PatternMatcher', () => {

  var sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('does not call addPatterns if no patterns are supplied', function () {
    sandbox.spy(PatternMatcher.prototype, 'addPatterns');
    var matcher = new PatternMatcher();
    assert.isTrue(matcher.addPatterns.notCalled);
  });

  it('calls addPatterns if patterns are supplied', function () {
    sandbox.spy(PatternMatcher.prototype, 'addPatterns');
    var testPatterns = [
      new Pattern('{emptyline:*}{booleantrue}{emptyline:*}', function () {
        return true;
      }),
      new Pattern('{emptyline:*}{booleanfalse}{emptyline:*}', function () {
        return false;
      })
    ];
    var matcher = new PatternMatcher(testPatterns);
    assert.isTrue(matcher.addPatterns.called);
  });

  describe('.addPatterns', function () {
    it('adds a pattern only once', function () {
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

    it('splits a pattern into tokens', function () {
      var matcher = new PatternMatcher();
      matcher.addPatterns('', [
        new Pattern('{level1:?}{level2:?}', null)
      ]);

      var compiled = matcher.compiledPatterns[''];
      assert.isDefined(compiled['level1:0-1']);
      assert.isDefined(compiled['level1:0-1'].paths['level2:0-1']);
    });

    it('identifies exact patterns and custom patterns correctly', function () {
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

    it('remembers the pattern for each compiled node', function () {
      var testPatterns = [
        new Pattern('{emptyline:*}{booleantrue}{emptyline:*}', function () {
          return true;
        }),
        new Pattern('{emptyline:*}{booleanfalse}{emptyline:*}', function () {
          return false;
        })
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

  describe('.matchStart', function () {

    var matcher;
    beforeEach(function () {
      matcher = new PatternMatcher([
        new Pattern('{emptyline:*}true{emptyline:*}', function () {
          return true;
        }),
        new Pattern('{emptyline:*}false{emptyline:*}', function () {
          return false;
        })
      ]);
    });

    it('returns null if there are no patterns', function () {
      // new matcher to check empty tag
      var state = new PatternMatcher().matchStart(new PatternContext(), '');
      assert.isNull(state);
      // check unregistered tag name with test matcher
      state = matcher.matchStart(new PatternContext(), 'tag');
      assert.isNull(state);
    });

    it('returns new state', function () {
      var state = matcher.matchStart(new PatternContext(), '');
      assert.isObject(state);
      assert.instanceOf(state, MatchState);
    });

    it('returns new state with the given context set', function () {
      var context = new PatternContext();
      var state = matcher.matchStart(context, '');
      assert.strictEqual(state.context, context, 'the given context should be set with the state');
    });

    it('returns new state with context and tag set even if no context given', function () {
      var state = matcher.matchStart(null, '');
      assert.instanceOf(state.context, PatternContext);
      assert.strictEqual(state.matchTag, '');

      assert.strictEqual(state.candidatePaths.length, 1);
      assert.instanceOf(state.candidatePaths[0], PathNode);
    });

    it('adds the starting node as first candidate path', function () {
      var state = matcher.matchStart(new PatternContext(), '');
      assert.isArray(state.candidatePaths);
      assert.strictEqual(state.candidatePaths.length, 1);
    });
  });

  describe('.match', function () {

    var matcher, context;
    beforeEach(function () {
      matcher = new PatternMatcher([
        new Pattern('{emptyline:*}true{emptyline:*}', function () {
          return true;
        }),
        new Pattern('{emptyline:*}false{emptyline:*}', function () {
          return false;
        })
      ]);
      context = new PatternContext();
    });

    it('does not do macthing for empty value and returns empty array', function () {
      var mock = sandbox.mock(matcher);
      mock.expects('matchStart').never();

      var result = matcher.match(context, '');

      mock.verify();

      assert.isArray(result);
      assert.strictEqual(result.length, 0);
    });

    it('first calls matchStart with the given context and empty tag', function () {
      var mock = sandbox.mock(matcher);
      mock.expects('matchStart').once().withExactArgs(context, '');

      matcher.match(context, 'true');

      mock.verify();
    });

    it('first calls matchStart, then matchNext for each character and then matchResults', function () {
      var state = new MatchState();
      state.matchTag = '';
      state.context = context;
      var matches = [];

      var mock = sandbox.mock(matcher);
      mock.expects('matchStart').once().withExactArgs(context, '').returns(state);
      mock.expects('matchNext').exactly(4).returns(true);
      mock.expects('matchResults').once().withExactArgs(state).returns(matches);

      var result = matcher.match(context, 'true');

      mock.verify();

      assert.strictEqual(result, matches);
    });

  });

  describe('.validateToken', function () {

    var exactToken, matcher, context;
    beforeEach(function () {
      exactToken = new Token('true', true);
      matcher = new PatternMatcher([
        new Pattern('{emptyline:*}true{emptyline:*}', function () {
          return true;
        }),
        new Pattern('{emptyline:*}false{emptyline:*}', function () {
          return false;
        })
      ]);
      context = new PatternContext();
    });

    var predefTokens = {
      ' ': {correct: ['   ', '\t \t'], wrong: ['test']},
      'newline': {correct: ['\r', '\n', '\r\n'], wrong: [' ', '\t']},
      'emptyline': {correct: ['   ', '\t \t', '\r', '\n', '\r\n'], wrong: ['test']},
      'letter': {correct: ['longwordnospaces', 'UPPERCASE'], wrong: ['long word with spaces']},
      'any': {correct: ['   ', '\t ', 'abc', 'some text'], wrong: ['']}
    };


    it('exists', function () {
      assert.isFunction(matcher.validateToken);
    });

    it('returns true for finalized nodes', function () {
      var node = new PathNode(exactToken, null, 'true');
      node.isFinalized = true;
      var result = matcher.validateToken(context, node, true);
      assert.isTrue(result);
    });

    it('returns false for empty textValue', function () {
      var node = new PathNode(exactToken, null, '');
      var result = matcher.validateToken(context, node, true);
      assert.isFalse(result);
    });

    it('returns true if the token is an exact match and starts with the text value (!isFinal)', function () {
      var node = new PathNode(exactToken, null, 'tr');
      var result = matcher.validateToken(context, node, false);
      assert.isTrue(result);
    });

    it('returns false if the token is an exact match and does not start with the text value (!isFinal)', function () {
      var node = new PathNode(exactToken, null, 'te');
      var result = matcher.validateToken(context, node, false);
      assert.isFalse(result);
    });

    it('returns true if the token is an exact match and equals the text value (isFinal=true)', function () {
      var node = new PathNode(exactToken, null, 'true');
      var result = matcher.validateToken(context, node, true);
      assert.isTrue(result);
    });

    it('returns false if the token is an exact match and does not equal the text value (isFinal=true)', function () {
      var node = new PathNode(exactToken, null, 'tru');
      var result = matcher.validateToken(context, node, true);
      assert.isFalse(result);
    });

    it('returns true for predefined tokens and correct test strings', function () {
      for (var value in predefTokens) {
        var token = new Token(value + ':*', false);

        var tests = predefTokens[value];
        for (var i = 0; i < tests.correct.length; i++) {
          var textValue = tests.correct[i];
          var node = new PathNode(token, null, textValue);
          var result = matcher.validateToken(context, node, false);
          assert.isTrue(result, 'token "' + value + '" should match text "' + textValue);
        }
      }
    });
    it('returns false for predefined tokens and wrong test strings', function () {
      for (var value in predefTokens) {
        var token = new Token(value + ':*', false);

        var tests = predefTokens[value];
        for (var i = 0; i < tests.wrong.length; i++) {
          var textValue = tests.wrong[i];
          var node = new PathNode(token, null, textValue);
          var result = matcher.validateToken(context, node, false);
          assert.isFalse(result, 'token "' + value + '" should not match text "' + textValue);
        }
      }
    });

  });

});
