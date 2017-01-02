import * as arrayUtils from './utils/arrayUtils';
import * as stringUtils from './utils/stringUtils';
import PatternPath from './matching/PatternPath';
import MatchState from './MatchState';
import PathNode from './matching/PathNode';
import PatternContext from './PatternContext';

/** @const */
const LETTER_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';


/**
 * Matches patterns according to registered rules
 */
class PatternMatcher {
  /**
   * @preserve Create a new pattern matcher with the given base patterns
   * @param patterns
   * @constructor
   */
  constructor(patterns) {
    // All currently active patterns
    this.patterns = {};
    // All active patterns compiled for use
    this.compiledPatterns = {};
    // All registered validators
    this.validators = {};

    if (patterns) {
      this.addPatterns('', patterns);
    }
  }

  /**
   * @preserve Clear all compiled patterns
   */
  clearPatterns() {
    this.patterns = {};
    this.compiledPatterns = {};
  }

  /**
   * @preserve Add more patterns to the compiled ones
   * @param matchTag
   * @param newPatterns
   */
  addPatterns(matchTag, newPatterns) {
    // if no patterns are in the list then there's nothing to do
    if (!newPatterns || !newPatterns.length) {
      return;
    }

    let targetPatterns = this.patterns[matchTag];
    if (!targetPatterns) {
      targetPatterns = [];
      this.patterns[matchTag] = targetPatterns;
    }

    let pathRoot = this.compiledPatterns[matchTag];
    if (!pathRoot) {
      pathRoot = new PatternPath();
      this.compiledPatterns[matchTag] = pathRoot;
    }

    //
    // parse each pattern into tokens and then parse the tokens
    //

    for (let index = 0; index < newPatterns.length; index++) {
      const pattern = newPatterns[index];

      // if the pattern was added before then don't do it again
      if (arrayUtils.contains(targetPatterns, pattern)) {
        continue;
      }

      targetPatterns.push(pattern);
      pathRoot.addPattern(pattern);
    }
  }

  /**
   * @preserve Match the value against all patterns and return the ones that fit
   * @param context - The current context for matching
   * @param value
   * @returns {*}
   */
  match(context, value) {
    if (!value) {
      return [];
    }

    const state = this.matchStart(context, '');
    if (!state) {
      return [];
    }

    for (let i = 0; i < value.length; i++) {
      const c = value.charAt(i);
      if (!this.matchNext(state, c)) {
        PatternMatcher.logReasons(state);
        return [];
      }
    }

    const results = this.matchResults(state);
    // reverse results since the longest matches will be found last but are the most specific
    results.reverse();
    return results;
  }

  /**
   * Begin a parsing session
   * @param context
   * @param matchTag
   * @returns {MatchState}
   */
  matchStart(context, matchTag) {
    const root = this.compiledPatterns[matchTag];
    if (!root) {
      return null;
    }

    const state = new MatchState(matchTag, context || new PatternContext());
    state.addCandidates(root);

    return state;
  }

  /**
   * Match the next character
   * @param state {MatchState} - The current matching state
   * @param c {String} - The next character
   * @returns {boolean} - true if this is still a valid match, false otherwise
   */
  matchNext(state, c) {
    const candidateNodes = state.candidateNodes;
    // const newCandidates = state.newCandidates;
    for (let i = 0; i < candidateNodes.length; i++) {
      const candidate = candidateNodes[i];

      // first check if any of the child nodes validate with the new character and remember them as candidates
      // any children can only be candidates if the final validation of the current value succeeds
      if (this.validateToken(state.context, candidate, true)) {
        state.addCandidates(candidate.path);
        // this.validateChildren(state.context, candidate.path, candidate, c, newCandidates, 0);
      }

      // validate this candidate and remove it if it doesn't validate anymore
      candidate.isFinalized = false;
      candidate.textValue += c;
      if (!this.validateToken(state.context, candidate, false)) {
        state.removeCandidate(i--);
      }
    }
    // candidateNodes.push(...newCandidates);

    return candidateNodes.length > 0;
  }

  static logReasons(state) {
    if (state.context.reasons) {
      state.reasons.concat(state.candidateNodes)
        .forEach(node => {
          console.log('\n', node.token.toString());
          node.reasons.forEach(reason => {
            console.log('  ', reason.result, reason.test, `"${reason.textValue}"`);
          });
        });
    }
  }

  /**
   * Assemble the results after the last character has been matched
   * @param state {MatchState} - The current matching state
   * @returns {Object[]} - The list of matches
   */
  matchResults(state) {
    PatternMatcher.logReasons(state);
    // TODO
    return state;
  }

  /**
   * Register a validation object for the tag
   * @param tag
   * @param validator
   */
  registerValidator(tag, validator) {
    this.validators[tag] = validator;
  }

  /**
   * Checks whether the value is within the required length for token
   * @param token
   * @param value
   * @param isFinal
   * @returns {boolean}
   */
  validateCount(token, value, isFinal) {
    return (!isFinal || value.length >= token.minCount) && value.length <= token.maxCount;
  }

  /**
   * Add the next character to the matched path
   * @param context {PatternContext} - The current matching context
   * @param node {PathNode} - The node we are validating
   * @param isFinal {boolean} - True if this is the final match and no further values will be added
   * @returns {boolean} - true if the value can be parsed successfully using the token
   */
  validateToken(context, node, isFinal) {
    // if it is finalized then it is definitely also valid
    if (node.isFinalized) {
      return true;
    }

    const args = { isFinal };
    const token = node.token;
    const textValue = node.textValue;

    // match exact values first
    if (textValue === '') {
      const result = token.minCount === 0;
      if (context.reasons) node.logReason('Exact match', args, result);
      return result;
    }
    if (token.exactMatch) {
      const result = ((isFinal && token.value === textValue) || (!isFinal && stringUtils.startsWith(token.value, textValue)));
      if (context.reasons) node.logReason('Exact match', args, result);
      return result;
    }

    // test inbuilt tokens first
    let inbuiltResult;
    switch (token.value) {
      // whitespace
      case ' ':
        inbuiltResult = this.validateCount(token, textValue, isFinal) && stringUtils.matchAll(textValue, ' \t');
        break;
      case 'newline':
        inbuiltResult = this.validateCount(token, textValue, isFinal) && stringUtils.matchAll(textValue, '\r\n');
        break;
      case 'emptyline':
        inbuiltResult = this.validateCount(token, textValue, isFinal) && stringUtils.matchAll(textValue, '\r\n \t');
        break;
      case 'letter':
        inbuiltResult = this.validateCount(token, textValue, isFinal) && stringUtils.matchAll(textValue, LETTER_CHARACTERS);
        break;
      case 'any':
        inbuiltResult = this.validateCount(token, textValue, isFinal);
        break;
      default:
        break;
    }
    if (inbuiltResult !== undefined) {
      if (context.reasons) node.logReason(`Inbuilt(${token.value})`, args, inbuiltResult);
      return inbuiltResult;
    }

    // check pattern tags and do a sub match for each of them
    if (this.compiledPatterns[token.value]) {
      // sub matching is possible, so start a new one or continue the previous one
      if (node.matchState == null) {
        node.matchState = this.matchStart(context, token.value);  // eslint-disable-line no-param-reassign
      }
      // if this is the last match then assemble the results
      if (isFinal) {
        return this.hasResults(node.matchState);
      }
      return this.matchNext(node.matchState, textValue[textValue.length - 1]);
    }

    // check if a validator is registered for this token
    const validator = this.validators[token.value];
    if (!validator) {
      if (context.reasons) node.logReason('No validator', args, false);
      return false;
    }

    const validatorResult = validator.validateToken(token, textValue, isFinal);
    if (context.reasons) node.logReason('Validator', args, validatorResult);
    return validatorResult;
  }

  /**
   * Recursively check candidates
   * @param context {PatternContext}
   * @param paths {object[]}
   * @param node {PathNode}
   * @param val {string}
   * @param newCandidates {PathNode[]}
   * @param depth {number}
   */
  validateChildren(context, paths, node, val, newCandidates, depth) {
    // first check if any of the child nodes validate with the new character and remember them as candidates
    // foreach (KeyValuePair<Token, PatternPath> childPath in paths)
    // TODO: replace with normal for-loop which is a lot faster
    const keys = Object.keys(paths);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const value = paths[key];
      const childNode = new PathNode(key, value, val);
      // if zero count is allowed it does not matter whether the child validates or not, we always try children as well
      if (key.minCount === 0) { this.validateChildren(context, value.paths, node, val, newCandidates, depth + 1); }
      if (!this.validateToken(context, childNode, false)) {
        // token did not validate but 0 count is allowed
        // if (childPath.Key.MinCount == 0)
        //  ValidateChildren(childPath.Value.Paths, node, val, newCandidates, depth + 1);
        continue;
      }

      // validated successfully so add a new candidate
      // add empty values for all skipped tokens
      Array.prototype.push.apply(childNode.previousValues, node.previousValues);
      if (node.token != null) {
        this.finalizeValue(node);
        childNode.previousValues.push(node.value);
      }
      for (let i = 0; i < depth; i++) {
        childNode.previousValues.push(null);
      }
      newCandidates.push(childNode);
    }
  }

  /**
   * Parses the TextValue of the node into the final value
   * @param node
   * Returns true if successful, false if the TextValue is not valid
   */
  finalizeValue(node) {
    /* eslint-disable no-param-reassign */
    // already finalized
    if (node.isFinalized) {
      return;
    }

    const token = node.token;
    const textValue = node.textValue;

    if (token.exactMatch || token.value === ' ' || token.value === 'newline' || token.Value === 'emptyline' || token.Value === 'letter') {
      node.value = textValue;
      node.isFinalized = true;
      return;
    }

    // check pattern tags and do a sub match for each of them
    if (this.compiledPatterns[token.value] && node.matchState !== null) {
      node.value = null;
      const results = this.matchResults(node.matchState);
      if (results.length === 0) {
        return;
      }
      // TODO: can be multiple results, choose the correct one depending on user culture
      node.value = results[0];
      node.isFinalized = true;
      return;
    }

    // check if a validator is registered for this token
    const validator = this.validators[token.Value];
    if (validator) {
      node.value = validator.finalizeValue(token, textValue);
      node.isFinalized = true;
    }
    /* eslint-enable */
  }
}

export default PatternMatcher;
