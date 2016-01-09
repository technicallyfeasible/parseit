/**
 * Matches patterns according to registered rules
 */

const arrayUtils = require('./utils/arrayUtils');
const stringUtils = require('./utils/stringUtils');
const Token = require('./matching/Token');
const PatternPath = require('./matching/PatternPath');
const MatchState = require('./MatchState');
const PathNode = require('./matching/PathNode');
const PatternContext = require('./PatternContext');

/** @const */
const LETTER_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Create a new pattern matcher with the given base patterns
 * @param patterns
 * @constructor
 */
function PatternMatcher(patterns) {
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
 * Clear all compiled patterns
 */
PatternMatcher.prototype.clearPatterns = function clearPatterns() {
  this.patterns.length = 0;
  this.compiledPatterns.length = 0;
};

/**
 * Add more patterns to the compiled ones
 * @param matchTag
 * @param newPatterns
 */
PatternMatcher.prototype.addPatterns = function addPatterns(matchTag, newPatterns) {
  // if no patterns are in the list then there's nothing to do
  if (!newPatterns || !newPatterns.length) {
    return;
  }

  let targetPatterns = this.patterns[matchTag];
  if (!targetPatterns) {
    targetPatterns = this.patterns[matchTag] = [];
  }

  let pathRoot = this.compiledPatterns[matchTag];
  if (!pathRoot) {
    pathRoot = this.compiledPatterns[matchTag] = {};
  }

  // parse each pattern into tokens and then parse the tokens
  const tokens = [];
  for (let patternIndex = 0; patternIndex < newPatterns.length; patternIndex++) {
    const p = newPatterns[patternIndex];

    // if the pattern was added before then don't do it again
    if (arrayUtils.contains(targetPatterns, p)) {
      continue;
    }

    const targetIndex = targetPatterns.length;
    targetPatterns.push(p);

    const pattern = p.match;

    //
    // parse the pattern into tokens
    //

    tokens.length = 0;
    let currentToken = '';
    let i;
    for (i = 0; i < pattern.length; i++) {
      switch (pattern[i]) {
        case '{':
          if (!currentToken.length) {
            break;
          }
          tokens.push(new Token(currentToken, true));
          currentToken = '';
          break;
        case '}':
          tokens.push(new Token(currentToken, false));
          currentToken = '';
          break;
        default:
          currentToken += pattern[i];
          break;
      }
    }

    if (currentToken) {
      tokens.push(new Token(currentToken, true));
    }

    if (!tokens.length) {
      continue;
    }

    //
    // Compile the tokens into the tree
    //

    let path = null;
    let paths = pathRoot;
    for (i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const tokenKey = token.toString();
      // check if the exact same node exists and take it if it does
      let nextPath = paths[tokenKey];
      if (!nextPath) {
        nextPath = paths[tokenKey] = new PatternPath();
      }
      path = nextPath;
      paths = nextPath.paths;
    }
    if (path) {
      if (!path.matchedPatterns) {
        path.matchedPatterns = [];
      }
      if (path.matchedPatterns.indexOf(targetIndex) === -1) {
        path.matchedPatterns.push(targetIndex);
      }
    }
  }
};

/**
 * Match the value against all patterns and return the ones that fit
 * @param context - The current context for matching
 * @param value
 * @returns {*}
 */
PatternMatcher.prototype.match = function match(context, value) {
  if (!value) {
    return [];
  }

  const state = this.matchStart(context, '');
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i);
    if (!this.matchNext(state, c)) {
      return [];
    }
  }

  const results = this.matchResults(state);
  // reverse results since the longest matches will be found last but are the most specific
  results.reverse();
  return results;
};

/**
 * Begin a parsing session
 * @param context
 * @param matchTag
 * @returns {MatchState}
 */
PatternMatcher.prototype.matchStart = function matchStart(context, matchTag) {
  const roots = this.compiledPatterns[matchTag];
  if (!roots) {
    return null;
  }

  const state = new MatchState();
  state.matchTag = matchTag;
  state.context = context || new PatternContext();

  const root = new PatternPath();
  root.paths = roots;
  const startNode = new PathNode(null, root, '');
  state.candidatePaths.push(startNode);

  return state;
};

/**
 * Match the next character
 * @param state {MatchState} - The current matching state
 * @param c {String} - The next character
 * @returns {boolean} - true if this is still a valid match, false otherwise
 */
PatternMatcher.prototype.matchNext = function matchNext(state, c) {
  if (!state) {
    return false;
  }

  const candidatePaths = state.candidatePaths;
  const newCandidates = state.newCandidates;
  for (let i = 0; i < candidatePaths.length; i++) {
    const candidate = candidatePaths[i];

    // first check if any of the child nodes validate with the new character and remember them as candidates
    // any children can only be candidates if the final validation of the current value succeeds
    if (!candidate.token || this.validateToken(state.context, candidate, true)) {
      this.validateChildren(state.context, candidate.path.paths, candidate, c, newCandidates, 0);
    }

    // token can be null for the root node but no validation needs to be done for that
    if (candidate.token != null) {
      // validate this candidate and remove it if it doesn't validate anymore
      candidate.isFinalized = false;
      candidate.textValue += c;
      if (this.validateToken(state.context, candidate, false)) {
        continue;
      }
    }
    candidatePaths.splice(i--, 1);
  }
  candidatePaths.push.apply(candidatePaths, newCandidates);
  newCandidates.length = 0;

  return candidatePaths.length > 0;
};

/**
 * Assemble the results after the last character has been matched
 * @param currentState {MatchState} - The current matching state
 * @returns {Object[]} - The list of matches
 */
PatternMatcher.prototype.matchResults = function matchResults(currentState) {

};

/**
 * Register a validation object for the tag
 * @param tag
 * @param validator
 */
PatternMatcher.prototype.registerValidator = function registerValidator(tag, validator) {
  this.validators[tag] = validator;
};

/**
 * Checks whether the value is within the required length for token
 * @param token
 * @param value
 * @param isFinal
 * @returns {boolean}
 */
PatternMatcher.prototype.validateCount = function validateCount(token, value, isFinal) {
  return (!isFinal || value.length >= token.minCount) && value.length <= token.maxCount;
};

/**
 * Add the next character to the matched path
 * @param context {PatternContext} - The current matching context
 * @param node {PathNode} - The node we are validating
 * @param isFinal {boolean} - True if this is the final match and no further values will be added
 * @returns {boolean} - true if the value can be parsed successfully using the token
 */
PatternMatcher.prototype.validateToken = function validateToken(context, node, isFinal) {
  // if it is finalized then it is definitely also valid
  if (node.isFinalized) {
    return true;
  }

  const token = node.token;
  const textValue = node.textValue;

  // match exact values first
  if (!textValue) {
    return false;
  }
  if (token.exactMatch) {
    return ((isFinal && token.value === textValue) || (!isFinal && stringUtils.startsWith(token.value, textValue)));
  }

  // test inbuilt tokens first
  switch (token.value) {
    // whitespace
    case ' ':
      return this.validateCount(token, textValue, isFinal) && stringUtils.matchAll(textValue, ' \t');
    case 'newline':
      return this.validateCount(token, textValue, isFinal) && stringUtils.matchAll(textValue, '\r\n');
    case 'emptyline':
      return this.validateCount(token, textValue, isFinal) && stringUtils.matchAll(textValue, '\r\n \t');
    case 'letter':
      return this.validateCount(token, textValue, isFinal) && stringUtils.matchAll(textValue, LETTER_CHARACTERS);
    case 'any':
      return this.validateCount(token, textValue, isFinal);
    default:
      break;
  }

  // check pattern tags and do a sub match for each of them
  if (this.compiledPatterns[token.value]) {
    // sub matching is possible, so start a new one or continue the previous one
    if (node.matchState == null) {
      node.matchState = this.matchStart(context, token.value);
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
    return false;
  }

  return validator.validateToken(token, textValue, isFinal);
};

/**
 * Recursively check candidates
 * @param context {PatternContext}
 * @param paths {object[]}
 * @param node {PathNode}
 * @param val {string}
 * @param newCandidates {PathNode[]}
 * @param depth {number}
 */
PatternMatcher.prototype.validateChildren = function validateChildren(context, paths, node, val, newCandidates, depth) {

};


module.exports = PatternMatcher;


/*

 /// <summary>
 /// Matches data based on patterns
 /// </summary>
 public class PatternMatcher
 {
 private const String LetterCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

 /// <summary>
 /// All currently active patterns
 /// </summary>
 private readonly Dictionary<String, List<Pattern>> patterns = new Dictionary<String, List<Pattern>>();
 /// <summary>
 /// All active patterns compiled for use
 /// </summary>
 private readonly Dictionary<String, Dictionary<Token, PatternPath>> compiledPatterns = new Dictionary<String, Dictionary<Token, PatternPath>>();
 /// <summary>
 /// All registered validators
 /// </summary>
 private readonly Dictionary<String, ITokenValidator> validators = new Dictionary<String, ITokenValidator>();

 /// <summary>
 /// Constructor
 /// </summary>
 public PatternMatcher(Pattern[] patterns)
 {
 if (patterns.Length > 0)
 AddPatterns("", patterns);
 }

 /// <summary>
 /// Clear all compiled patterns
 /// </summary>
 public void ClearPatterns()
 {
 this.patterns.Clear();
 this.compiledPatterns.Clear();
 }

 /// <summary>
 /// Add more patterns to the compiled ones
 /// </summary>
 public void AddPatterns(String matchTag, Pattern[] newPatterns)
 {
 List<Pattern> targetPatterns;
 #if SCRIPTSHARP
 if ((targetPatterns = DictionaryUtils.TryGetPatterns(this.patterns, matchTag)) == null)
 #else
 if (!this.patterns.TryGetValue(matchTag, out targetPatterns))
 #endif
 this.patterns[matchTag] = targetPatterns = new List<Pattern>(newPatterns.Length);

 Dictionary<Token, PatternPath> pathRoot;
 #if SCRIPTSHARP
 if ((pathRoot = DictionaryUtils.TryGetPatternPath(compiledPatterns, matchTag)) == null)
 compiledPatterns[matchTag] = pathRoot = new Dictionary<Token, PatternPath>();
 #else
 if (!this.compiledPatterns.TryGetValue(matchTag, out pathRoot))
 this.compiledPatterns[matchTag] = pathRoot = new Dictionary<Token, PatternPath>();
 #endif

 // parse each pattern into tokens and then parse the tokens
 List<Token> tokens = new List<Token>();
 for (Int32 patternIndex = 0; patternIndex < newPatterns.Length; patternIndex++)
 {
 Pattern p = newPatterns[patternIndex];

 // if the pattern was added before then don't do it again
 if (targetPatterns.Contains(p))
 continue;

 Int32 targetIndex = targetPatterns.Count;
 targetPatterns.Add(p);

 String pattern = p.Match;

 //
 // parse the pattern into tokens
 //

 tokens.Clear();
 String currentToken = "";
 Int32 i;
 for (i = 0; i < pattern.Length; i++)
 {
 switch (pattern[i])
 {
 case '{':
 if (currentToken.Length == 0)
 break;
 tokens.Add(new Token(currentToken, true));
 currentToken = "";
 break;
 case '}':
 tokens.Add(new Token(currentToken, false));
 currentToken = "";
 break;
 default:
 currentToken += pattern[i];
 break;
 }
 }

 if(!String.IsNullOrEmpty(currentToken))
 tokens.Add(new Token(currentToken, true));

 if (tokens.Count == 0)
 continue;

 //
 // Compile the tokens into the tree
 //

 PatternPath path = null;
 Dictionary<Token, PatternPath> paths = pathRoot;
 for (i = 0; i < tokens.Count; i++)
 {
 Token token = tokens[i];
 // check if the exact same node exists and take it if it does
 PatternPath nextPath;
 #if SCRIPTSHARP
 if ((nextPath = DictionaryUtils.TryGetPath(paths, token)) == null)
 #else
 if (!paths.TryGetValue(token, out nextPath))
 #endif
 {
 nextPath = new PatternPath();
 paths[token] = nextPath;
 }
 path = nextPath;
 paths = nextPath.Paths;
 }
 if (path != null)
 {
 if (path.MatchedPatterns == null)
 path.MatchedPatterns = new List<Int32>();
 if (!path.MatchedPatterns.Contains(targetIndex))
 path.MatchedPatterns.Add(targetIndex);
 }
 }
 }


 /// <summary>
 /// Match the value against all patterns and return the ones that fit
 /// </summary>
 /// <param name="value"></param>
 /// <returns></returns>
 public List<Object> Match(String value)
 {
 return Match(new PatternContext(), value);
 }

 /// <summary>
 /// Match the value against all patterns and return the ones that fit
 /// </summary>
 /// <param name="context">The current context for matching</param>
 /// <param name="value"></param>
 /// <returns></returns>
 public List<Object> Match(PatternContext context, String value)
 {
 List<Object> results = new List<Object>();
 if (String.IsNullOrEmpty(value))
 return results;

 Object state = MatchStart(context, "");
 for (int i = 0; i < value.Length; i++)
 {
 char c = value[i];
 if (!MatchNext(state, c))
 return results;
 }

 results = MatchResults(state);
 // reverse results since the longest matches will be found last but are the most specific
 results.Reverse();
 return results;
 }


 /// <summary>
 /// Begin a parsing session
 /// </summary>
 /// <param name="context"></param>
 /// <param name="matchTag"></param>
 /// <returns></returns>
 public Object MatchStart(PatternContext context, String matchTag)
 {
 Dictionary<Token, PatternPath> roots;
 #if SCRIPTSHARP
 if ((roots = DictionaryUtils.TryGetPatternPath(compiledPatterns, matchTag)) == null)
 #else
 if (!this.compiledPatterns.TryGetValue(matchTag, out roots))
 #endif
 return null;

 MatchState state = new MatchState();
 state.MatchTag = matchTag;
 state.Context = context ?? new PatternContext();

 PatternPath root = new PatternPath();
 root.Paths = roots;
 PathNode startNode = new PathNode(null, root, "");
 state.CandidatePaths.Add(startNode);

 return state;
 }

 /// <summary>
 /// Match the next character
 /// </summary>
 /// <param name="currentState">The current matching state</param>
 /// <param name="c">The next character</param>
 /// <returns>Returns true if this is still a valid match, false otherwise</returns>
 public Boolean MatchNext(Object currentState, Char c)
 {
 MatchState state = currentState as  MatchState;
 if (state == null)
 return false;

 List<PathNode> candidatePaths = state.CandidatePaths;
 List<PathNode> newCandidates = state.NewCandidates;
 for (Int32 i = 0; i < candidatePaths.Count; i++)
 {
 PathNode candidate = candidatePaths[i];

 // first check if any of the child nodes validate with the new character and remember them as candidates
 // any children can only be candidates if the final validation of the current value succeeds
 if (candidate.Token == null || ValidateToken(state.Context, candidate, true))
 ValidateChildren(state.Context, candidate.Path.Paths, candidate, c.ToString(CultureInfo.InvariantCulture), newCandidates, 0);

 // token can be null for the root node but no validation needs to be done for that
 if (candidate.Token != null)
 {
 // validate this candidate and remove it if it doesn't validate anymore
 candidate.IsFinalized = false;
 candidate.TextValue += c;
 if (ValidateToken(state.Context, candidate, false))
 continue;
 }
 candidatePaths.RemoveAt(i--);
 }
 candidatePaths.AddRange(newCandidates);
 newCandidates.Clear();

 return candidatePaths.Count > 0;
 }


 /// <summary>
 /// Assemble the results after the last character has been matched
 /// </summary>
 /// <param name="currentState"></param>
 /// <returns></returns>
 public Boolean HasResults(Object currentState)
 {
 MatchState state = currentState as MatchState;
 if (state == null)
 return false;

 List<PathNode> candidatePaths = state.CandidatePaths;

 if (!this.patterns.ContainsKey(state.MatchTag))
 return false;

 // fetch patterns for all matching candidates
 foreach (PathNode path in candidatePaths)
 {
 // do final validation
 if (!ValidateToken(state.Context, path, true))
 continue;
 Boolean result = false;
 MatchToLast(path.Path, delegate { result = true; }, 0);
 return result;
 }
 return false;
 }


 /// <summary>
 /// Assemble the results after the last character has been matched
 /// </summary>
 /// <param name="currentState"></param>
 /// <returns></returns>
 public List<Object> MatchResults(Object currentState)
 {
 List<Object> results = new List<Object>();

 MatchState state = currentState as MatchState;
 if (state == null)
 return results;

 List<PathNode> candidatePaths = state.CandidatePaths;

 // get the patterns for this tag
 List<Pattern> targetPatterns;
 #if SCRIPTSHARP
 if ((targetPatterns = DictionaryUtils.TryGetPatterns(patterns, state.MatchTag)) == null)
 #else
 if (!this.patterns.TryGetValue(state.MatchTag, out targetPatterns))
 #endif
 return results;

 // fetch patterns for all matching candidates
 foreach (PathNode path in candidatePaths)
 {
 // do final validation
 if (!ValidateToken(state.Context, path, true))
 continue;
 FinalizeValue(path);
 List<Object> previousValues = new List<Object>(path.PreviousValues);
 previousValues.Add(path.Value);
 MatchToLast(path.Path, delegate(PatternPath match, Int32 depth)
 {
 // add empty values for remaining tokens
 Object[] values = new Object[previousValues.Count + depth];
 for (Int32 i = 0; i < previousValues.Count; i++)
 values[i] = previousValues[i];
 for (Int32 m = 0; m < match.MatchedPatterns.Count; m++)
 {
 Pattern pattern = targetPatterns[match.MatchedPatterns[m]];
 Object result = pattern.Parse(state.Context, values);
 // only add if it is not in the list yet
 if (!results.Contains(result))
 results.Add(result);
 }
 }, 0);
 }
 return results;
 }

 private void ValidateChildren(PatternContext context, IEnumerable<KeyValuePair<Token, PatternPath>> paths, PathNode node, String val, List<PathNode> newCandidates, Int32 depth)
 {
 // first check if any of the child nodes validate with the new character and remember them as candidates
 foreach (KeyValuePair<Token, PatternPath> childPath in paths)
 {
 PathNode childNode = new PathNode(childPath.Key, childPath.Value, val);
 // if zero count is allowed it does not matter whether the child validates or not, we always try children as well
 if (childPath.Key.MinCount == 0)
 ValidateChildren(context, childPath.Value.Paths, node, val, newCandidates, depth + 1);
 if (!ValidateToken(context, childNode, false))
 {
 // token did not validate but 0 count is allowed
 //if (childPath.Key.MinCount == 0)
 //	ValidateChildren(childPath.Value.Paths, node, val, newCandidates, depth + 1);
 continue;
 }

 // validated successfully so add a new candidate
 // add empty values for all skipped tokens
 childNode.PreviousValues.AddRange(node.PreviousValues);
 if (node.Token != null)
 {
 FinalizeValue(node);
 childNode.PreviousValues.Add(node.Value);
 }
 for (Int32 i = 0; i < depth; i++)
 childNode.PreviousValues.Add(null);
 newCandidates.Add(childNode);
 }
 }

 private void MatchToLast(PatternPath path, Action<PatternPath, Int32> add, Int32 depth)
 {
 if (path.MatchedPatterns != null)
 add(path, depth);
 // check children if they allow 0 length as well
 foreach (KeyValuePair<Token, PatternPath> childPath in path.Paths)
 {
 if (childPath.Key.MinCount > 0)
 continue;
 MatchToLast(childPath.Value, add, depth + 1);
 }

 }


 /// <summary>
 /// Register a validation object for the tag
 /// </summary>
 /// <param name="tag"></param>
 /// <param name="validator"></param>
 public void RegisterValidator(String tag, ITokenValidator validator)
 {
 this.validators[tag] = validator;
 }


 private Boolean ValidateCount(Token token, String value, Boolean isFinal)
 {
 return (!isFinal || value.Length >= token.MinCount) && value.Length <= token.MaxCount;
 }

 /// <summary>
 /// Add the next character to the matched path
 /// </summary>
 /// <param name="context">The current matching context</param>
 /// <param name="node">The node we are validating</param>
 /// <param name="isFinal">True if this is the final match and no further values will be added</param>
 /// <returns>Returns true if the value can be parsed successfully using the token</returns>
 private Boolean ValidateToken(PatternContext context, PathNode node, Boolean isFinal)
 {
 // if it is finalzed then it is definitely also valid
 if (node.IsFinalized)
 return true;

 Token token = node.Token;
 String textValue = node.TextValue;

 // match exact values first
 if (String.IsNullOrEmpty(textValue))
 return false;
 if (token.ExactMatch)
 return ((isFinal && token.Value == textValue) || (!isFinal && token.Value.StartsWith(textValue)));

 // test inbuilt tokens first
 switch (token.Value)
 {
 // whitespace
 case " ":
 return ValidateCount(token, textValue, isFinal) && StringUtils.MatchAll(textValue, " \t");
 case "newline":
 return ValidateCount(token, textValue, isFinal) && StringUtils.MatchAll(textValue, "\r\n");
 case "emptyline":
 return ValidateCount(token, textValue, isFinal) && StringUtils.MatchAll(textValue, "\r\n \t");
 case "letter":
 return ValidateCount(token, textValue, isFinal) && StringUtils.MatchAll(textValue, LetterCharacters);
 case "any":
 return ValidateCount(token, textValue, isFinal);
 }

 // check pattern tags and do a sub match for each of them
 if (this.compiledPatterns.ContainsKey(token.Value))
 {
 // sub matching is possible, so start a new one or continue the previous one
 if (node.MatchState == null)
 node.MatchState = MatchStart(context, token.Value);
 // if this is the last match then assemble the results
 if (isFinal)
 return HasResults(node.MatchState);
 return MatchNext(node.MatchState, textValue[textValue.Length - 1]);
 }

 // check if a validator is registered for this token
 ITokenValidator validator;
 #if SCRIPTSHARP
 if ((validator = DictionaryUtils.TryGetValidators(validators, token.Value)) == null)
 #else
 if (!this.validators.TryGetValue(token.Value, out validator))
 #endif
 return false;

 return validator.ValidateToken(token, textValue, isFinal);
 }


 /// <summary>
 /// Parses the TextValue of the node into the final value
 /// </summary>
 /// <param name="node"></param>
 /// <returns>Returns true if successful, false if the TextValue is not valid</returns>
 private void FinalizeValue(PathNode node)
 {
 // already finalized
 if (node.IsFinalized)
 return;

 Token token = node.Token;
 String textValue = node.TextValue;

 if (token.ExactMatch || token.Value == " " || token.Value == "newline" || token.Value == "emptyline" || token.Value == "letter")
 {
 node.Value = textValue;
 node.IsFinalized = true;
 return;
 }

 // check pattern tags and do a sub match for each of them
 if (this.compiledPatterns.ContainsKey(token.Value) && node.MatchState != null)
 {
 node.Value = null;
 List<Object> results = MatchResults(node.MatchState);
 if (results.Count == 0)
 return;
 // TODO: can be multiple results, choose the correct one depending on user culture
 node.Value = results[0];
 node.IsFinalized = true;
 return;
 }

 // check if a validator is registered for this token
 ITokenValidator validator;
 #if SCRIPTSHARP
 if ((validator = DictionaryUtils.TryGetValidators(validators, token.Value)) != null)
 #else
 if (this.validators.TryGetValue(token.Value, out validator))
 #endif
 {
 node.Value = validator.FinalizeValue(token, textValue);
 node.IsFinalized = true;
 }
 }
 }
 */
