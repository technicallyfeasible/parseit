/**
 * Tests for PatternMatcher
 */

import chai from 'chai';
import sinon from 'sinon';

import { allSubStrings } from './utils';
import Pattern from '../src/matching/Pattern';
import Token from '../src/matching/Token';
import PathNode from '../src/matching/PathNode';
import PatternPath from '../src/matching/PatternPath';
import PatternMatcher from '../src/PatternMatcher';
import MatchState from '../src/MatchState';
import PatternContext from '../src/PatternContext';
import DefaultValidator from '../src/validators/DefaultValidator';

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
      new Pattern('{el:*}{booleantrue}{el:*}', () => true),
      new Pattern('{el:*}{booleanfalse}{el:*}', () => false),
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
        new Pattern('{el:?}', null),
        new Pattern('{el:?}', null),
      ]);

      assert.isArray(matcher.patterns['']);
      assert.strictEqual(matcher.patterns[''].length, 1);
      assert.instanceOf(matcher.compiledPatterns[''], PatternPath);
      assert.strictEqual(Object.keys(matcher.compiledPatterns[''].paths).length, 1);
    });

    it('splits a pattern into tokens', () => {
      const matcher = new PatternMatcher();
      matcher.addPatterns('', [
        new Pattern('{level1:?}{level2:?}', null),
      ]);

      const compiled = matcher.compiledPatterns[''];
      assert.isDefined(compiled.paths['level1:0-1']);
      assert.isDefined(compiled.paths['level1:0-1'].paths['level2:0-1']);
    });

    it('identifies exact patterns and custom patterns correctly', () => {
      const matcher = new PatternMatcher();
      const token1 = 'exact';
      const token2 = '{level2:?}';
      matcher.addPatterns('', [
        new Pattern(token1 + token2, null),
      ]);

      const compiled = matcher.compiledPatterns[''];
      assert.isDefined(compiled.paths[token1]);
      assert.isDefined(compiled.paths[token1].paths['level2:0-1']);
    });

    it('remembers the pattern for each compiled node', () => {
      const testPatterns = [
        new Pattern('{el:*}{booleantrue}{el:*}', () => true),
        new Pattern('{el:*}{booleanfalse}{el:*}', () => false),
      ];
      const matcher = new PatternMatcher();
      matcher.addPatterns('', testPatterns);

      const tag = `el:0-${Token.MAX_VALUE}`;
      const compiled = matcher.compiledPatterns[''];
      const root = compiled.paths[tag];
      assert.strictEqual(root.matchedPatterns.length, 0);

      const levelTrue = root.paths['booleantrue:1-1'];
      assert.strictEqual(levelTrue.matchedPatterns.length, 0);
      const levelFalse = root.paths['booleanfalse:1-1'];
      assert.strictEqual(levelFalse.matchedPatterns.length, 0);

      // the last level should have the patterns referenced
      let end = levelTrue.paths[tag];
      assert.strictEqual(end.matchedPatterns.length, 1);
      assert.strictEqual(end.matchedPatterns[0], testPatterns[0]);
      end = levelFalse.paths[tag];
      assert.strictEqual(end.matchedPatterns.length, 1);
      assert.strictEqual(end.matchedPatterns[0], testPatterns[1]);
    });
  });

  describe('.matchStart', () => {
    let matcher;
    beforeEach(() => {
      matcher = new PatternMatcher([
        new Pattern('{el:*}true{el:*}', () => true),
        new Pattern('{el:*}false{el:*}', () => false),
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

      assert.strictEqual(state.candidateNodes.length, 1);
      assert.instanceOf(state.candidateNodes[0], PathNode);
    });

    it('adds the starting node as first candidate path', () => {
      const state = matcher.matchStart(new PatternContext(), '');
      assert.isArray(state.candidateNodes);
      assert.strictEqual(state.candidateNodes.length, 1);
    });
  });

  describe('.match', () => {
    let matcher;
    let context;
    beforeEach(() => {
      matcher = new PatternMatcher([
        new Pattern('{el:*}true{el:*}', () => true),
        new Pattern('{el:*}false{el:*}', () => false),
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

      assert.deepEqual(result, {
        values: matches,
        reasons: undefined,
      });
    });
  });

  describe('.validateToken', () => {
    let exactToken;
    let matcher;
    let context;
    let state;
    beforeEach(() => {
      context = new PatternContext();
      exactToken = new Token('true', true);
      matcher = new PatternMatcher([
        new Pattern('{el:*}true{el:*}', () => true),
        new Pattern('{el:*}false{el:*}', () => false),
      ]);
      const defaultValidator = new DefaultValidator(context);
      DefaultValidator.tokenTags.forEach(tag => matcher.registerValidator(tag, defaultValidator));
      state = matcher.matchStart(context, '');
    });

    const predefTokens = {
      ' ': { correct: ['   ', '\t \t'], wrong: ['test'] },
      nl: { correct: ['\r', '\n', '\r\n'], wrong: [' ', '\t'] },
      el: { correct: ['   ', '\t \t', '\r', '\n', '\r\n'], wrong: ['test'] },
      w: { correct: ['longwordnospaces', 'UPPERCASE'], wrong: ['long word with spaces'] },
      '.': { correct: ['   ', '\t ', 'abc', 'some text'], wrong: [] },
    };


    it('exists', () => {
      assert.isFunction(matcher.validateToken);
    });

    it('returns true for finalized nodes', () => {
      const node = new PathNode(exactToken, null, 'true');
      node.isFinalized = true;
      const result = matcher.validateToken(state, node, true);
      assert.isTrue(result);
    });

    it('returns false for empty textValue', () => {
      const node = new PathNode(exactToken, null, '');
      const result = matcher.validateToken(state, node, true);
      assert.isFalse(result);
    });

    it('returns true if the token is an exact match and starts with the text value (!isFinal)', () => {
      const node = new PathNode(exactToken, null, 'tr');
      const result = matcher.validateToken(state, node, false);
      assert.isTrue(result);
    });

    it('returns false if the token is an exact match and does not start with the text value (!isFinal)', () => {
      const node = new PathNode(exactToken, null, 'te');
      const result = matcher.validateToken(state, node, false);
      assert.isFalse(result);
    });

    it('returns true if the token is an exact match and equals the text value (isFinal=true)', () => {
      const node = new PathNode(exactToken, null, 'true');
      const result = matcher.validateToken(state, node, true);
      assert.isTrue(result);
    });

    it('returns false if the token is an exact match and does not equal the text value (isFinal=true)', () => {
      const node = new PathNode(exactToken, null, 'tru');
      const result = matcher.validateToken(state, node, true);
      assert.isFalse(result);
    });

    it('returns false if the token does not allow zero length and the text is empty', () => {
      const node = new PathNode(new Token('', false), null, '');
      const result = matcher.validateToken(state, node, true);
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
          const result = matcher.validateToken(state, node, false);
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
          // eslint-disable-next-line no-loop-func
          const result = allSubStrings(textValue, subTextValue => matcher.validateToken(state, new PathNode(token, null, subTextValue), false));
          assert.isFalse(result, `token "${value}" should not match text "${textValue}`);
        }
      }
    });
  });
});
