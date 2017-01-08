import * as arrayUtils from './utils/arrayUtils';
import * as stringUtils from './utils/stringUtils';
import PatternPath from './matching/PatternPath';
import MatchState from './MatchState';
import PatternContext from './PatternContext';

/**
 * Matches patterns according to registered rules
 */
class PatternMatcher {
  /**
   * Create a new pattern matcher with the given base patterns
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
   * Register a validator type for the tag
   * @param tag
   * @param validator
   */
  registerValidator(tag, validator) {
    this.validators[tag] = validator;
  }

  /**
   * Clear all compiled patterns
   */
  clearPatterns() {
    this.patterns = {};
    this.compiledPatterns = {};
  }

  /**
   * Add more patterns to the compiled ones
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
   * Match the value against all patterns and return the ones that fit
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

    const len = value.length;
    const finalIndex = len - 1;
    for (let i = 0; i < len; i++) {
      const c = value.charAt(i);
      if (!this.matchNext(state, c, i === finalIndex)) {
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
   * @param isFinal
   * @returns {boolean} - true if this is still a valid match, false otherwise
   */
  matchNext(state, c, isFinal) {
    const candidateNodes = state.getCandidateNodes();
    for (let i = 0; i < candidateNodes.length; i++) {
      const candidate = candidateNodes[i];

      // first check if any of the child nodes validate with the new character and remember them as candidates
      // any children can only be candidates if the final validation of the current value succeeds
      if (this.validateToken(state, candidate, true)) {
        state.addCandidates(candidate.path, candidate.previousValues.concat(candidate.textValue));
      }

      // validate this candidate and remove it if it doesn't validate anymore
      candidate.isFinalized = false;
      candidate.textValue += c;
      if (!this.validateToken(state, candidate, isFinal)) {
        state.removeCandidate(i--);
      }
    }

    return candidateNodes.length > 0;
  }

  static logReasons(state) {
    if (state.context.reasons) {
      state.reasons.concat(state.getCandidateNodes())
        .forEach(node => {
          console.log('\n', node.token.toString());
          node.reasons.forEach(reason => {
            console.log('  ', reason.test, JSON.stringify(reason.args), `"${reason.textValue}"`, '=>', reason.result);
          });
        });
    }
  }

  /**
   * Assemble the results after the last character has been matched
   * @param state
   * @returns {boolean}
   */
  hasResults(state) {
    const candidateNodes = state.getCandidateNodes();

    if (!this.patterns[state.matchTag]) {
      return false;
    }

    // fetch patterns for all matching candidates
    for (let index = 0; index < candidateNodes.length; index++) {
      const path = candidateNodes[index];
      let result = false;
      PatternMatcher.matchToLast(path.path, () => { result = true; });
      if (result) {
        return result;
      }
    }
    return false;
  }

/**
   * Assemble the results after the last character has been matched
   * @param state {MatchState} - The current matching state
   * @returns {Object[]} - The list of matches
   */
  matchResults(state) {
    const results = [];

    const { context, candidateNodes } = state;

    // fetch patterns for all matching candidates
    for (let i = 0; i < candidateNodes.length; i++) {
      const node = candidateNodes[i];

      this.finalizeValue(state, node);

      const previousValues = node.previousValues.concat(node.value);
      const previousValuesCount = previousValues.length - 1;
      // traverse the tree to the leaf nodes with empty values added so we find all valid patterns
      PatternMatcher.matchToLast(node.path, (path, depth) => {
        if (depth > 0) {
          previousValues[previousValuesCount + depth] = '';
        }
        for (let m = 0; m < path.matchedPatterns.length; m++) {
          const pattern = path.matchedPatterns[m];
          const result = pattern.parse(context, previousValues);
          if (context.reasons) {
            node.logReason(`Parse "${pattern}"`, {
              values: previousValues,
            }, result);
          }
          // only add if it is not in the list yet
          if (!arrayUtils.contains(results, result)) {
            results.push(result);
          }
        }
      });
    }
    PatternMatcher.logReasons(state);
    return results;
  }

  /**
   * Recursively traverse all children of the path and call the "add" function
   * @param path - path to traverse
   * @param add - callback function
   * @param depth
   */
  static matchToLast(path, add, depth = 0) {
    if (path.matchedPatterns && path.matchedPatterns.length > 0) {
      add(path, depth);
    }
    // check children if they allow 0 length as well
    path.children.forEach(child => {
      if (child.token.minCount > 0) {
        return;
      }
      PatternMatcher.matchToLast(child.path, add, depth + 1);
    });
  }

  /**
   * Add the next character to the matched path
   * @param state {MatchState} - The current matching state
   * @param node {PathNode} - The node we are validating
   * @param isFinal {boolean} - True if this is the final match and no further values will be added
   * @returns {boolean} - true if the value can be parsed successfully using the token
   */
  validateToken(state, node, isFinal) {
    // if it is finalized then it is definitely also valid
    if (node.isFinalized) {
      return true;
    }

    const args = { isFinal };
    const { context } = state;
    const { token, textValue } = node;

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

    // check pattern tags and do a sub match for each of them
    if (this.compiledPatterns[token.value]) {
      // sub matching is possible, so start a new one or continue the previous one
      if (!node.matchState) {
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

    const validatorResult = validator.validateToken(context, token, textValue, isFinal);
    if (context.reasons) node.logReason(`Validator[${validator.constructor && validator.constructor.displayName}]`, args, validatorResult);
    return validatorResult;
  }

  /**
   * Parses the TextValue of the node into the final value
   * @param state
   * @param node
   */
  finalizeValue(state, node) {
    /* eslint-disable no-param-reassign */
    // already finalized
    if (node.isFinalized) {
      return;
    }

    const { context } = state;
    const { token, textValue } = node;

    if (token.exactMatch) {
      node.value = textValue || '';
      node.isFinalized = true;
      if (context.reasons) node.logReason('Finalize exact', null, true);
      return;
    }

    // check pattern tags and do a sub match for each of them
    if (this.compiledPatterns[token.value] && node.matchState) {
      node.value = null;
      const results = this.matchResults(node.matchState);
      if (results.length === 0) {
        if (context.reasons) node.logReason(`Finalize pattern[${token.value}] failed`, null, false);
        return;
      }
      // TODO: can be multiple results, choose the correct one depending on user culture
      node.value = results[0];
      node.isFinalized = true;
      if (context.reasons) node.logReason(`Finalize pattern[${token.value}]`, null, node.value);
      return;
    }

    // check if a validator is registered for this token
    const validator = this.validators[token.value];
    if (validator) {
      node.value = validator.finalizeValue(context, token, textValue);
      node.isFinalized = true;
      if (context.reasons) node.logReason(`Finalize validator[${validator.constructor && validator.constructor.displayName}]`, null, node.value);
      return;
    }
    if (context.reasons) node.logReason('Finalize failed', null, false);
    /* eslint-enable */
  }
}

export default PatternMatcher;
