/**
 * Tests for PatternMatcher
 */

const chai = require('chai');
const sinon = require('sinon');

const Pattern = require('../src/matching/Pattern');
const Token = require('../src/matching/Token');
const PathNode = require('../src/matching/PathNode');
const PatternMatcher = require('../src/PatternMatcher');
const MatchState = require('../src/MatchState');
const PatternContext = require('../src/PatternContext');

const assert = chai.assert;

describe('PatternMatcher', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('does not call addPatterns if no patterns are supplied', () => {
    sandbox.spy(PatternMatcher.prototype, 'addPatterns');
    const matcher = new PatternMatcher();
    assert.isTrue(matcher.addPatterns.notCalled);
  });

  it('calls addPatterns if patterns are supplied', () => {
    sandbox.spy(PatternMatcher.prototype, 'addPatterns');
    const testPatterns = [
      new Pattern('{emptyline:*}{booleantrue}{emptyline:*}', () => true),
      new Pattern('{emptyline:*}{booleanfalse}{emptyline:*}', () => false),
    ];
    const matcher = new PatternMatcher(testPatterns);
    assert.isTrue(matcher.addPatterns.called);
  });

  describe('.clearPatterns', () => {
    it('exists', () => {
      const matcher = new PatternMatcher();
      assert.isFunction(matcher.clearPatterns);
    });
  });

  describe('.addPatterns', () => {
    it('adds a pattern only once', () => {
      const matcher = new PatternMatcher();
      assert.isObject(matcher.patterns);
      assert.isObject(matcher.compiledPatterns);
      assert.isObject(matcher.validators);
      matcher.addPatterns('', [
        new Pattern('{emptyline:?}', null),
        new Pattern('{emptyline:?}', null),
      ]);

      assert.isArray(matcher.patterns['']);
      assert.strictEqual(matcher.patterns[''].length, 1);
      assert.isObject(matcher.compiledPatterns['']);
      assert.strictEqual(Object.keys(matcher.compiledPatterns['']).length, 1);
    });

    it('splits a pattern into tokens', () => {
      const matcher = new PatternMatcher();
      matcher.addPatterns('', [
        new Pattern('{level1:?}{level2:?}', null),
      ]);

      const compiled = matcher.compiledPatterns[''];
      assert.isDefined(compiled['level1:0-1']);
      assert.isDefined(compiled['level1:0-1'].paths['level2:0-1']);
    });

    it('identifies exact patterns and custom patterns correctly', () => {
      const matcher = new PatternMatcher();
      const token1 = 'exact';
      const token2 = '{level2:?}';
      matcher.addPatterns('', [
        new Pattern(token1 + token2, null),
      ]);

      const compiled = matcher.compiledPatterns[''];
      assert.isDefined(compiled[token1]);
      assert.isDefined(compiled[token1].paths['level2:0-1']);
    });

    it('remembers the pattern for each compiled node', () => {
      const testPatterns = [
        new Pattern('{emptyline:*}{booleantrue}{emptyline:*}', () => true),
        new Pattern('{emptyline:*}{booleanfalse}{emptyline:*}', () => false),
      ];
      const matcher = new PatternMatcher();
      matcher.addPatterns('', testPatterns);

      const tag = `emptyline:0-${Token.prototype.MAX_VALUE}`;
      const compiled = matcher.compiledPatterns[''];
      const root = compiled[tag];
      assert.strictEqual(root.matchedPatterns.length, 0);

      const levelTrue = root.paths['booleantrue:1-1'];
      assert.strictEqual(levelTrue.matchedPatterns.length, 0);
      const levelFalse = root.paths['booleanfalse:1-1'];
      assert.strictEqual(levelFalse.matchedPatterns.length, 0);

      // the last level should have the patterns referenced
      let end = levelTrue.paths[tag];
      assert.strictEqual(end.matchedPatterns.length, 1);
      assert.strictEqual(end.matchedPatterns[0], 0);
      end = levelFalse.paths[tag];
      assert.strictEqual(end.matchedPatterns.length, 1);
      assert.strictEqual(end.matchedPatterns[0], 1);
    });
  });

  describe('.matchStart', () => {
    let matcher;
    beforeEach(() => {
      matcher = new PatternMatcher([
        new Pattern('{emptyline:*}true{emptyline:*}', () => true),
        new Pattern('{emptyline:*}false{emptyline:*}', () => false),
      ]);
    });

    it('returns null if there are no patterns', () => {
      // new matcher to check empty tag
      let state = new PatternMatcher().matchStart(new PatternContext(), '');
      assert.isNull(state);
      // check unregistered tag name with test matcher
      state = matcher.matchStart(new PatternContext(), 'tag');
      assert.isNull(state);
    });

    it('returns new state', () => {
      const state = matcher.matchStart(new PatternContext(), '');
      assert.isObject(state);
      assert.instanceOf(state, MatchState);
    });

    it('returns new state with the given context set', () => {
      const context = new PatternContext();
      const state = matcher.matchStart(context, '');
      assert.strictEqual(state.context, context, 'the given context should be set with the state');
    });

    it('returns new state with context and tag set even if no context given', () => {
      const state = matcher.matchStart(null, '');
      assert.instanceOf(state.context, PatternContext);
      assert.strictEqual(state.matchTag, '');

      assert.strictEqual(state.candidatePaths.length, 1);
      assert.instanceOf(state.candidatePaths[0], PathNode);
    });

    it('adds the starting node as first candidate path', () => {
      const state = matcher.matchStart(new PatternContext(), '');
      assert.isArray(state.candidatePaths);
      assert.strictEqual(state.candidatePaths.length, 1);
    });
  });

  describe('.match', () => {
    let matcher;
    let context;
    beforeEach(() => {
      matcher = new PatternMatcher([
        new Pattern('{emptyline:*}true{emptyline:*}', () => true),
        new Pattern('{emptyline:*}false{emptyline:*}', () => false),
      ]);
      context = new PatternContext();
    });

    it('does not do matching for empty value and returns empty array', () => {
      const mock = sandbox.mock(matcher);
      mock.expects('matchStart').never();

      const result = matcher.match(context, '');

      mock.verify();

      assert.isArray(result);
      assert.strictEqual(result.length, 0);
    });

    it('first calls matchStart with the given context and empty tag', () => {
      const mock = sandbox.mock(matcher);
      mock.expects('matchStart').once().withExactArgs(context, '');

      matcher.match(context, 'true');

      mock.verify();
    });

    it('first calls matchStart, then matchNext for each character and then matchResults', () => {
      const state = new MatchState();
      state.matchTag = '';
      state.context = context;
      const matches = [];

      const mock = sandbox.mock(matcher);
      mock.expects('matchStart').once().withExactArgs(context, '').returns(state);
      mock.expects('matchNext').exactly(4).returns(true);
      mock.expects('matchResults').once().withExactArgs(state).returns(matches);

      const result = matcher.match(context, 'true');

      mock.verify();

      assert.strictEqual(result, matches);
    });
  });

  describe('.validateToken', () => {
    let exactToken;
    let matcher;
    let context;
    beforeEach(() => {
      exactToken = new Token('true', true);
      matcher = new PatternMatcher([
        new Pattern('{emptyline:*}true{emptyline:*}', () => true),
        new Pattern('{emptyline:*}false{emptyline:*}', () => false),
      ]);
      context = new PatternContext();
    });

    const predefTokens = {
      ' ': { correct: ['   ', '\t \t'], wrong: ['test'] },
      newline: { correct: ['\r', '\n', '\r\n'], wrong: [' ', '\t'] },
      emptyline: { correct: ['   ', '\t \t', '\r', '\n', '\r\n'], wrong: ['test'] },
      letter: { correct: ['longwordnospaces', 'UPPERCASE'], wrong: ['long word with spaces'] },
      any: { correct: ['   ', '\t ', 'abc', 'some text'], wrong: [''] },
    };


    it('exists', () => {
      assert.isFunction(matcher.validateToken);
    });

    it('returns true for finalized nodes', () => {
      const node = new PathNode(exactToken, null, 'true');
      node.isFinalized = true;
      const result = matcher.validateToken(context, node, true);
      assert.isTrue(result);
    });

    it('returns false for empty textValue', () => {
      const node = new PathNode(exactToken, null, '');
      const result = matcher.validateToken(context, node, true);
      assert.isFalse(result);
    });

    it('returns true if the token is an exact match and starts with the text value (!isFinal)', () => {
      const node = new PathNode(exactToken, null, 'tr');
      const result = matcher.validateToken(context, node, false);
      assert.isTrue(result);
    });

    it('returns false if the token is an exact match and does not start with the text value (!isFinal)', () => {
      const node = new PathNode(exactToken, null, 'te');
      const result = matcher.validateToken(context, node, false);
      assert.isFalse(result);
    });

    it('returns true if the token is an exact match and equals the text value (isFinal=true)', () => {
      const node = new PathNode(exactToken, null, 'true');
      const result = matcher.validateToken(context, node, true);
      assert.isTrue(result);
    });

    it('returns false if the token is an exact match and does not equal the text value (isFinal=true)', () => {
      const node = new PathNode(exactToken, null, 'tru');
      const result = matcher.validateToken(context, node, true);
      assert.isFalse(result);
    });

    it('returns true for predefined tokens and correct test strings', () => {
      const keys = Object.keys(predefTokens);
      for (let index = 0; index < keys.length; index++) {
        const value = keys[index];
        const token = new Token(`${value}:*`, false);

        const tests = predefTokens[value];
        let i;
        for (i = 0; i < tests.correct.length; i++) {
          const textValue = tests.correct[i];
          const node = new PathNode(token, null, textValue);
          const result = matcher.validateToken(context, node, false);
          assert.isTrue(result, `token "${value}" should match text "${textValue}`);
        }
      }
    });
    it('returns false for predefined tokens and wrong test strings', () => {
      const keys = Object.keys(predefTokens);
      for (let index = 0; index < keys.length; index++) {
        const value = keys[index];
        const token = new Token(`${value}:*`, false);

        const tests = predefTokens[value];
        let i;
        for (i = 0; i < tests.wrong.length; i++) {
          const textValue = tests.wrong[i];
          const node = new PathNode(token, null, textValue);
          const result = matcher.validateToken(context, node, false);
          assert.isFalse(result, `token "${value}" should not match text "${textValue}`);
        }
      }
    });
  });
});
