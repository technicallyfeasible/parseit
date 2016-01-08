(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["DataParser"] = factory();
	else
		root["DataParser"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/release/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Entry point for the DataParser library
	 */
	
	'use strict';
	
	module.exports = {
	  PatternMatcher: __webpack_require__(1),
	  DataParser: __webpack_require__(9)
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Matches patterns according to registered rules
	 */
	
	const arrayUtils = __webpack_require__(2);
	const stringUtils = __webpack_require__(3);
	const Token = __webpack_require__(4);
	const PatternPath = __webpack_require__(5);
	const MatchState = __webpack_require__(6);
	const PathNode = __webpack_require__(7);
	const PatternContext = __webpack_require__(8);
	
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
	  var results = [];
	  if (!value) return results;
	
	  var state = this.matchStart(context, '');
	  for (var i = 0; i < value.length; i++) {
	    var c = value.charAt(i);
	    if (!this.matchNext(state, c)) return results;
	  }
	
	  results = this.matchResults(state);
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
	  var roots = this.compiledPatterns[matchTag];
	  if (!roots) return null;
	
	  var state = new MatchState();
	  state.matchTag = matchTag;
	  state.context = context || new PatternContext();
	
	  var root = new PatternPath();
	  root.paths = roots;
	  var startNode = new PathNode(null, root, '');
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
	  if (!state) return false;
	
	  var candidatePaths = state.candidatePaths;
	  var newCandidates = state.newCandidates;
	  for (var i = 0; i < candidatePaths.length; i++) {
	    var candidate = candidatePaths[i];
	
	    // first check if any of the child nodes validate with the new character and remember them as candidates
	    // any children can only be candidates if the final validation of the current value succeeds
	    if (!candidate.token || this.validateToken(state.context, candidate, true)) this.validateChildren(state.context, candidate.path.paths, candidate, c, newCandidates, 0);
	
	    // token can be null for the root node but no validation needs to be done for that
	    if (candidate.token != null) {
	      // validate this candidate and remove it if it doesn't validate anymore
	      candidate.isFinalized = false;
	      candidate.textValue += c;
	      if (this.validateToken(state.context, candidate, false)) continue;
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
	PatternMatcher.prototype.matchResults = function matchResults(currentState) {};
	
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
	  if (node.isFinalized) return true;
	
	  var token = node.token;
	  var textValue = node.textValue;
	
	  // match exact values first
	  if (!textValue) return false;
	  if (token.exactMatch) return isFinal && token.value === textValue || !isFinal && stringUtils.startsWith(token.value, textValue);
	
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
	  }
	
	  // check pattern tags and do a sub match for each of them
	  if (this.compiledPatterns[token.value]) {
	    // sub matching is possible, so start a new one or continue the previous one
	    if (node.matchState == null) node.matchState = this.matchStart(context, token.value);
	    // if this is the last match then assemble the results
	    if (isFinal) return this.hasResults(node.matchState);
	    return this.matchNext(node.matchState, textValue[textValue.length - 1]);
	  }
	
	  // check if a validator is registered for this token
	  var validator = this.validators[token.value];
	  if (!validator) return false;
	
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
	PatternMatcher.prototype.validateChildren = function validateChildren(context, paths, node, val, newCandidates, depth) {};
	
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

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Created by Jens on 26.06.2015.
	 * Provides utilities for arrays such as checking whether an object supporting the Equals interface is contained
	 */
	
	'use strict';
	
	var arrayUtils = {
		/**
	  * Checks whether the array contains obj using a custom comparer if available
	  * @param ar {{equals: function}[]}
	  * @param obj {{equals: function}}
	  * @returns {boolean}
	  */
		contains: function (ar, obj) {
			if (!ar) return false;
			// check strict equality first, should be fastest
			if (ar.indexOf(obj) !== -1) return true;
	
			var hasEquals = !!obj && typeof obj.equals === 'function';
	
			// check all elements
			for (var i = 0; i < ar.length; i++) {
				var other = ar[i];
				var result;
				if (hasEquals) result = obj.equals(other);else if (typeof other.equals === 'function') result = other.equals(obj);else result = obj === other;
				if (result) return true;
			}
			return false;
		}
	};
	
	module.exports = arrayUtils;

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Created by Jens on 26.06.2015.
	 * Provides utilities for strings
	 */
	
	'use strict';
	
	var stringUtils = {
		/**
	  * Checks whether str starts with val
	  * @param str {string}
	  * @param val {string}
	  * @returns {boolean}
	  */
		startsWith: function (str, val) {
			return !!str && !!val && str.length > val.length && str.indexOf(val) === 0;
		},
	
		/**
	  * Match all characters in the string against all characters in the given array or string
	  * @param str {string} - The string to test
	  * @param chars {string|string[]} - The characters to test for
	  * @param startIndex {number=} - Index of the first character to test
	  * @returns {boolean} - true if all characters in the string are contained in chars
	  */
		matchAll: function (str, chars, startIndex) {
			if (!str || !chars) return false;
			for (var i = startIndex || 0; i < str.length; i++) {
				var c = str.charAt(i);
				if (chars.indexOf(c) === -1) return false;
			}
			return true;
		}
	
	};
	
	module.exports = stringUtils;

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Token value for parsed patterns
	 */
	
	'use strict';
	
	/**
	 * Creates a new Token
	 * @param value {string}
	 * @param exactMatch {boolean}
	 * @constructor
	 */
	
	var Token = function (value, exactMatch) {
		this.exactMatch = !!exactMatch;
		if (this.exactMatch) {
			this.value = value;
			this.minCount = this.maxCount = 1;
			return;
		}
	
		var parts = (value || '').split(':');
		this.value = parts.length > 0 ? parts[0] : '';
		if (parts.length === 1) this.minCount = this.maxCount = 1;else if (parts.length > 1) {
			switch (parts[1]) {
				case '':
					this.minCount = 1;
					this.maxCount = 1;
					break;
				case '+':
					this.minCount = 1;
					this.maxCount = this.MAX_VALUE;
					break;
				case '*':
					this.minCount = 0;
					this.maxCount = this.MAX_VALUE;
					break;
				case '?':
					this.minCount = 0;
					this.maxCount = 1;
					break;
				default:
					var countParts = parts[1].split('-');
					if (countParts.length === 1) this.minCount = this.maxCount = parseInt(countParts[0]);else if (countParts.length >= 2) {
						this.minCount = parseInt(countParts[0] || '0');
						this.maxCount = parseInt(countParts[1] || '0');
					}
					break;
			}
		}
		// don't allow max to be smaller than min
		if (this.maxCount < this.minCount) this.maxCount = this.minCount;
	};
	/**
	 * Maximum times that a token without restriction can be repeated
	 * @const
	 */
	Token.prototype.MAX_VALUE = 1000;
	
	Token.prototype.equals = function (token) {
		if (!token) return false;
		return token.value === this.value && token.minCount === this.minCount && token.maxCount === this.maxCount && token.exactMatch === this.exactMatch;
	};
	Token.prototype.toString = function () {
		if (this.exactMatch) return this.value;
		return this.value + ':' + this.minCount + '-' + this.maxCount;
	};
	
	module.exports = Token;
	
	/*
		public class Token
		{
			public String Value;
			public Int32 MinCount;
			public Int32 MaxCount;
			public Boolean ExactMatch;
	
			/// <summary>
			/// Parse the token
			/// </summary>
			/// <param name="value"></param>
			/// <param name="exactMatch"></param>
			public Token(String value, Boolean exactMatch)
			{
				if (exactMatch)
				{
					this.Value = value;
					this.MinCount = this.MaxCount = 1;
					this.ExactMatch = true;
					return;
				}
	
	#if !SCRIPTSHARP
				String[] parts = value.Split(new Char[] { ':' }, StringSplitOptions.RemoveEmptyEntries);
	#else
				String[] parts = StringUtils.Split(value, ':');
	#endif
				this.Value = parts[0];
				if (parts.Length == 1)
					this.MinCount = this.MaxCount = 1;
				else if (parts.Length > 1)
				{
					switch (parts[1])
					{
						case "":
							this.MinCount = 1;
							this.MaxCount = 1;
							break;
						case "+":
							this.MinCount = 1;
							this.MaxCount = Int32.MaxValue;
							break;
						case "*":
							this.MinCount = 0;
							this.MaxCount = Int32.MaxValue;
							break;
						case "?":
							this.MinCount = 0;
							this.MaxCount = 1;
							break;
						default:
							String[] countParts = parts[1].Split('-');
							if (countParts.Length == 1)
								this.MinCount = this.MaxCount = Int32.Parse(countParts[0]);
							else if (countParts.Length == 2)
							{
								this.MinCount = Int32.Parse(countParts[0]);
								this.MaxCount = Int32.Parse(countParts[1]);
							}
							break;
					}
				}
			}
	
	#if !SCRIPTSHARP
			public override Boolean Equals(object obj)
			{
				if (ReferenceEquals(null, obj)) return false;
				if (ReferenceEquals(this, obj)) return true;
				if (obj.GetType() != GetType()) return false;
				return Equals((Token)obj);
			}
	
			protected bool Equals(Token other)
			{
				return string.Equals(this.Value, other.Value) && this.MinCount == other.MinCount && this.MaxCount == other.MaxCount && this.ExactMatch.Equals(other.ExactMatch);
			}
	
			public override int GetHashCode()
			{
				unchecked
				{
					int hashCode = (this.Value != null ? this.Value.GetHashCode() : 0);
					hashCode = (hashCode * 397) ^ this.MinCount;
					hashCode = (hashCode * 397) ^ this.MaxCount;
					hashCode = (hashCode * 397) ^ this.ExactMatch.GetHashCode();
					return hashCode;
				}
			}
	
			public override String ToString()
			{
				if (this.ExactMatch)
					return String.Format("{0}", this.Value);
				return String.Format("{0}:{1}-{2}", this.Value, this.MinCount, this.MaxCount);
			}
	#endif
		}
	*/

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Keeps tree information for patterns
	 */
	
	'use strict';
	
	/**
	 * Create a new patch
	 * @constructor
	 */
	
	var PatternPath = function () {
		// Paths for all tokens
		this.paths = {};
		// Any patterns finishing at this path
		this.matchedPatterns = [];
	};
	PatternPath.prototype.toString = function () {
		var matches = (this.matchedPatterns || []).join(', ');
		var children = this.paths.map(function (token) {
			return token.toString();
		}).join(', ');
		return matches + ' :: ' + children;
	};
	
	module.exports = PatternPath;
	
	/*
		internal class PatternPath
		{
	#if !SCRIPTSHARP
			public override String ToString()
			{
				var matches = String.Join(", ", this.MatchedPatterns ?? new List<Int32>(0));
				var children = String.Join(", ", this.Paths.Keys.Select(t => t.ToString()));
				return String.Format("{0} :: {1}", matches, children);
			}
	#endif
	
			public Dictionary<Token, PatternPath> Paths = new Dictionary<Token, PatternPath>();
	
			/// <summary>
			/// Any patterns finishing at this path
			/// </summary>
			public List<Int32> MatchedPatterns;
		}
	*/

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Holds state for a matching session
	 */
	
	'use strict';
	
	var MatchState = function () {
		this.matchTag = null;
		this.candidatePaths = [];
		this.newCandidates = [];
	
		this.context = null;
	};
	
	module.exports = MatchState;
	
	/*
		internal class MatchState
		{
			public String MatchTag;
			public List<PathNode> CandidatePaths = new List<PathNode>();
			public List<PathNode> NewCandidates = new List<PathNode>();
	
			public PatternContext Context { get; set; }
		}
	*/

/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * A node in the current parsing session
	 */
	
	'use strict';
	
	/**
	 * Create a new node to hold parsing state
	 * @param token
	 * @param path
	 * @param textValue
	 * @constructor
	 */
	
	var PathNode = function (token, path, textValue) {
		// The token for comparison
		this.token = token;
	
		// The matching path for going deeper
		this.path = path;
	
		// The value which still matches this path
		this.textValue = textValue;
	
		// The final assembled value
		this.value = null;
		// All values of earlier tokens
		this.previousValues = [];
	
		// True if the value has been finalized and assigned
		this.isFinalized = null;
	
		// Remember the current state of any matching algorithm
		this.matchState = null;
	};
	
	PathNode.prototype.toString = function () {
		return this.textValue + ' = ' + this.token;
	};
	
	module.exports = PathNode;
	
	/*
		internal class PathNode
		{
			public override string ToString()
			{
				return String.Format("{0} = {1}", this.TextValue, this.Token);
			}
	
			/// <summary>
			/// The token for comparison
			/// </summary>
			public Token Token;
	
			/// <summary>
			/// The matching path for going deeper
			/// </summary>
			public PatternPath Path;
	
			/// <summary>
			/// The value which still matches this path
			/// </summary>
			public String TextValue;
	
			/// <summary>
			/// The final assembled value
			/// </summary>
			public Object Value;
			/// <summary>
			/// All values of earlier tokens
			/// </summary>
			public List<Object> PreviousValues = new List<Object>();
	
			/// <summary>
			/// True if the value has been finalized and assigned
			/// </summary>
			public Boolean IsFinalized;
	
			/// <summary>
			/// Remember the current state of any matching algorithm
			/// </summary>
			public Object MatchState;
	
			public PathNode(Token token, PatternPath path, String textValue)
			{
				this.Token = token;
				this.Path = path;
				this.TextValue = textValue;
			}
		}
	*/

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Context for pattern matching
	 * Holds values which may influence parsing outcome like current date and time, location or language
	 */
	
	'use strict';
	
	var PatternContext = function (currentDate) {
		this.currentDate = currentDate || new Date();
	};
	
	module.exports = PatternContext;
	
	/*
		public class PatternContext
		{
			public LocalDate CurrentDate { get; set; }
	
			public PatternContext()
			{
				CurrentDate = new LocalDate(DateTime.UtcNow);
			}
	
			public PatternContext(LocalDate currentDate)
			{
				CurrentDate = currentDate;
			}
		}
	*/

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Parses data values to figure out what actual type they are
	 */
	
	/**
	 * @class Module
	 * @type {object}
	 * @property {string[]} patternTags - available pattern tags
	 * @property {string[]} tokenTags - available token tags
	 * @property {function(string)} getPatterns - returns patterns for a tag
	 */
	
	'use strict';
	
	var PatternMatcher = __webpack_require__(1);
	
	var moduleTypes = [__webpack_require__(10)
	/*require('./modules/NumberParserModule'),
	require('./modules/DateParserModule'),
	require('./modules/AddressParserModule'),
	require('./modules/CurrencyParserModule'),
	require('./modules/UrlParserModule'),
	require('./modules/IpParserModule'),
	require('./modules/EmailParserModule')*/
	];
	//var dateModuleTypes = [
	/*require('./modules/NumberParserModule'),
	require('./modules/DateParserModule')*/
	//];
	
	var defaultPatternMatcher = null;
	//var datePatternMatcher = null;
	var namedPatternMatchers = {};
	
	/**
	 * Create a new PatternMatcher object including the specified modules
	 * @param modules {Module[]} - List of modules to include
	 * @returns {PatternMatcher}
	 * @constructor
	 */
	function makePatternMatcher(modules) {
		var matcher = new PatternMatcher([]);
		if (!modules) return matcher;
	
		modules.forEach(function (Module) {
			var module = new Module();
			var i, tag;
	
			// add patterns
			for (i = 0; i < module.patternTags.length; i++) {
				tag = module.patternTags[i];
				matcher.addPatterns(tag, module.getPatterns(tag));
			}
	
			// register validators
			for (i = 0; i < module.tokenTags.length; i++) {
				tag = module.tokenTags[i];
				matcher.registerValidator(tag, module);
			}
		});
		return matcher;
	}
	
	/**
	 * Make sure the default pattern matcher including all patterns is available and return it
	 * @returns {PatternMatcher}
	 */
	function getDefaultPatternMatcher() {
		if (!defaultPatternMatcher) defaultPatternMatcher = makePatternMatcher(moduleTypes);
		return defaultPatternMatcher;
	}
	
	/**
	 * Create a data parser with the specified name and modules. If name and modules is empty, matches all default patterns.
	 * @param name
	 * @param modules
	 * @constructor
	 */
	var DataParser = function (name, modules) {
		if (!name || !modules) {
			this.patternMatcher = getDefaultPatternMatcher();
		} else {
			if (namedPatternMatchers[name]) return;
	
			this.patternMatcher = makePatternMatcher(modules);
			namedPatternMatchers[name] = this.patternMatcher;
		}
	};
	
	/*
	{
		private static readonly Type[] ModuleTypes =
		{
			typeof(NumberParserModule), typeof(DateParserModule), typeof(AddressParserModule), typeof(CurrencyParserModule), typeof(BooleanParserModule),
			typeof(UrlParserModule), typeof(IpParserModule), typeof(EmailParserModule)
		};
		private static readonly Type[] DateModuleTypes =
		{
			typeof(NumberParserModule), typeof(DateParserModule)
		};
		private static readonly PatternMatcher DefaultPatternMatcher;
		private static readonly PatternMatcher DatePatternMatcher;
		private static readonly Dictionary<String, PatternMatcher> NamedPatternMatchers = new Dictionary<String, PatternMatcher>();
	
		private readonly PatternMatcher patternMatcher;
	
		/// <summary>
		/// Default context for parsing
		/// </summary>
		public PatternContext DefaultPatternContext { get; set; }
	
		/// <summary>
		/// Load all patterns from the defined modules
		/// </summary>
		static DataParser()
		{
			DefaultPatternMatcher = makePatternMatcher(ModuleTypes);
			DatePatternMatcher = makePatternMatcher(DateModuleTypes);
		}
	
		/// <summary>
		/// Use the default pattern matcher
		/// </summary>
		public DataParser()
		{
			this.patternMatcher = DefaultPatternMatcher;
		}
	
		/// <summary>
		/// Load all patterns from the defined modules
		/// </summary>
		public DataParser(String name, Type[] modules)
		{
			if (String.IsNullOrEmpty(name) || modules == null)
			{
				this.patternMatcher = DefaultPatternMatcher;
				return;
			}
	
			if (NamedPatternMatchers.TryGetValue(name, out this.patternMatcher) && this.patternMatcher != null)
				return;
	
			this.patternMatcher = makePatternMatcher(modules);
			NamedPatternMatchers[name] = this.patternMatcher;
		}
	
	
		private static PatternMatcher makePatternMatcher(Type[] modules)
		{
			PatternMatcher matcher = new PatternMatcher(new Pattern[0]);
	
			foreach (Type moduleType in modules)
			{
				IParserModule module = Activator.CreateInstance(moduleType) as IParserModule;
				if (module == null) continue;
	
				// add patterns
				foreach (String tag in module.PatternTags)
					matcher.AddPatterns(tag, module.GetPatterns(tag));
	
				// register validators
				foreach (String tag in module.TokenTags)
					matcher.RegisterValidator(tag, module);
			}
			return matcher;
		}
	
		/// <summary>
		/// Parse a value into all possible native types
		/// </summary>
		/// <param name="value"></param>
		/// <returns></returns>
		public List<IValue> Parse(String value)
		{
			return Parse(DefaultPatternContext ?? new PatternContext(), value);
		}
	
		/// <summary>
		/// Parse a value into all possible native types
		/// </summary>
		/// <param name="context"></param>
		/// <param name="value"></param>
		/// <returns></returns>
		public List<IValue> Parse(PatternContext context, String value)
		{
			List<Object> matchResults = this.patternMatcher.Match(context, value);
			return (matchResults == null ? new List<IValue>() : matchResults.Cast<IValue>().ToList());
		}
	
		/// <summary>
		/// Parse a value as a LocalDate
		/// </summary>
		/// <param name="value"></param>
		/// <returns></returns>
		public LocalDate ParseDate(String value)
		{
			return ParseDate(DefaultPatternContext ?? new PatternContext(), value);
		}
	
		/// <summary>
		/// Parse a value as a LocalDate
		/// </summary>
		/// <param name="context"></param>
		/// <param name="value"></param>
		/// <returns></returns>
		public LocalDate ParseDate(PatternContext context, String value)
		{
			List<Object> results = DatePatternMatcher.Match(context, value);
			LocalDate dateResult = results.OfType<LocalDate>().FirstOrDefault();
			return dateResult;
		}
	}
	*/
	
	module.exports = DataParser;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Validates booleans
	 */
	
	'use strict';
	
	var Pattern = __webpack_require__(11);
	var BooleanValue = __webpack_require__(12);
	
	/**
	 * Make the final output value
	 * @param value
	 * @returns {BooleanValue}
	 */
	function make(value) {
		var boolValue = false;
		if (typeof value === 'boolean') boolValue = value;else if (value) {
			var lowerValue = value.toString().toLowerCase();
			boolValue = this.const.trueValues.indexOf(lowerValue) !== -1;
		}
		return new BooleanValue(boolValue);
	}
	/**
	 * Reusable wrapper for the two patterns
	 * @param v
	 */
	function parsePattern(v) {
		make(v[1]);
	}
	
	var mainPatterns = [new Pattern('{emptyline:*}{booleantrue}{emptyline:*}', parsePattern), new Pattern('{emptyline:*}{booleanfalse}{emptyline:*}', parsePattern)];
	
	/**
	 * Singleton Module to parse boolean values
	 * @constructor
	 */
	var BooleanParserModule = function () {
		this.const = {
			trueValues: ['1', 'true', 'wahr'],
			falseValues: ['0', 'false', 'falsch']
		};
	
		this.patternTags = [''];
		this.tokenTags = ['booleanfalse', 'booleantrue'];
	};
	/**
	 * Return the patterns for the tag
	 * @param tag {string}
	 */
	BooleanParserModule.prototype.getPatterns = function (tag) {
		if (tag === '') return mainPatterns;
		return [];
	};
	
	module.exports = BooleanParserModule;
	
	/*
		public class BooleanParserModule : IParserModule
		{
			private static readonly HashSet<String> TrueValues = new HashSet<String> { "true", "wahr" };
			private static readonly HashSet<String> FalseValues = new HashSet<String> { "false", "falsch" };
	
			private static readonly Pattern[] MainPatterns =
	        {
	            new Pattern("{emptyline:*}{booleantrue}{emptyline:*}", v => Make(v[1])),
	            new Pattern("{emptyline:*}{booleanfalse}{emptyline:*}", v => Make(v[1]))
	        };
	
	
			/// <summary>
			/// Make the final output value
			/// </summary>
			/// <param name="value"></param>
			/// <returns></returns>
			private static BooleanValue Make(Object value)
			{
				var boolValue = false;
				if (value is Boolean)
					boolValue = (Boolean) value;
				if (value != null)
				{
					String lowerValue = value.ToString().ToLower();
					boolValue = TrueValues.Contains(lowerValue);
				}
				return new BooleanValue(boolValue);
			}
	
	
			/// <summary>
			/// Returns the defined tags for which patterns exist
			/// </summary>
			public String[] PatternTags
			{
				get { return new[] { "" }; }
			}
	
			/// <summary>
			/// Get the patterns for a specific tag
			/// </summary>
			/// <param name="patternTag"></param>
			/// <returns></returns>
			public Pattern[] GetPatterns(String patternTag)
			{
				switch (patternTag)
				{
					case "":
						return MainPatterns;
				}
				return new Pattern[0];
			}
	
			/// <summary>
			/// Returns the defined tags which can be parsed as tokens
			/// </summary>
			public String[] TokenTags
			{
				get { return new[] { "booleanfalse", "booleantrue" }; }
			}
	
			/// <summary>
			/// Callback handler when a value has to be validated against a token
			/// </summary>
			/// <param name="token">The token to validate against</param>
			/// <param name="value">The value to validate</param>
			/// <param name="isFinal">True if this is the final validation and no more characters are expected for the value</param>
			/// <returns>Returns true if the value matches the token, false if it doesn't match or the token is unknown</returns>
			public Boolean ValidateToken(Token token, String value, Boolean isFinal)
			{
				String lowerValue = value.ToLower();
				switch (token.Value)
				{
					case "booleantrue":
						return (isFinal && TrueValues.Contains(lowerValue)) || (!isFinal && StartsWith(TrueValues, lowerValue));
					case "booleanfalse":
						return (isFinal && FalseValues.Contains(lowerValue)) || (!isFinal && StartsWith(FalseValues, lowerValue));
				}
	
				return false;
			}
	
			/// <summary>
			/// Parses the TextValue of the node into the final value
			/// </summary>
			/// <param name="token">The token to finalize</param>
			/// <param name="value">The text value to parse</param>
			/// <returns>Returns the parsed result</returns>
			public Object FinalizeValue(Token token, String value)
			{
				switch (token.Value)
				{
					case "booleantrue":
						return true;
					case "booleanfalse":
						return false;
				}
				return value;
			}
	
			private Boolean StartsWith(IEnumerable<String> allowedValues, String value)
			{
				foreach (String allowedValue in allowedValues)
				{
					if (allowedValue.StartsWith(value))
						return true;
				}
				return false;
			}
		}
	}
	*/

/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Pattern object
	 */
	
	'use strict';
	
	var Pattern = function (match, parser) {
		this.match = match || '';
		this.parser = parser;
	};
	
	Pattern.prototype.toString = function () {
		return this.match;
	};
	Pattern.prototype.parse = function (context, values) {
		return this.parser(context, values);
	};
	Pattern.prototype.equals = function (other) {
		if (!other) return false;
		return this.match === other.match;
	};
	
	module.exports = Pattern;
	
	/*
		public class Pattern
		{
			public String Match { get; private set; }
			public Func<PatternContext, Object[], Object> Parser { get; private set; }
			public Func<Object[], Object> ParserNoContext { get; private set; }
	
			public Pattern(String match, Func<Object[], Object> parser)
			{
				Match = match;
				ParserNoContext = parser;
			}
			public Pattern(String match, Func<PatternContext, Object[], Object> parser)
			{
				Match = match;
				Parser = parser;
			}
	
			public Object Parse(PatternContext context, Object[] values)
			{
				if (ParserNoContext != null)
					return ParserNoContext(values);
				return Parser(context, values);
			}
	
	#if !SCRIPTSHARP
			public override Boolean Equals(Object obj)
			{
				if (ReferenceEquals(null, obj)) return false;
				if (ReferenceEquals(this, obj)) return true;
				if (obj.GetType() != GetType()) return false;
				return Equals((Pattern) obj);
			}
	
			protected Boolean Equals(Pattern other)
			{
				return String.Equals(Match, other.Match);
			}
	
			public override Int32 GetHashCode()
			{
				return (Match != null ? Match.GetHashCode() : 0);
			}
	
			public override String ToString()
			{
				return Match;
			}
	#endif
	*/

/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * Boolean result wrapper
	 */
	
	'use strict';
	
	var BooleanValue = function (value) {
		this.bool = !!value;
	};
	BooleanValue.prototype.valueOf = function () {
		return this.bool;
	};
	BooleanValue.prototype.toString = function () {
		return this.bool.toString();
	};
	BooleanValue.prototype.equals = function (other) {
		if (!(other instanceof BooleanValue)) return false;
		return this.bool === other.bool;
	};
	
	module.exports = BooleanValue;
	
	/*
		public struct BooleanValue : IValue
		{
			/// <summary>
			/// The boolean value
			/// </summary>
			[JsonProperty("v")]
			public Boolean Bool;
	
	
			/// <summary>
			/// Generic access to the most prominent value .net type
			/// </summary>
			public Object Value
			{
				get { return Bool; }
				set { Bool = (Boolean)value; }
			}
	
	
	
			/// <summary>
			/// Serialize the value to binary data
			/// </summary>
			/// <returns></returns>
			public Byte[] ToBinary()
			{
				return BitConverter.GetBytes(Bool);
			}
	
			/// <summary>
			/// Read the value data from binary
			/// </summary>
			/// <param name="data"></param>
			public void FromBinary(Byte[] data)
			{
				Bool = BitConverter.ToBoolean(data, 0);
			}
	
	
			/// <summary>
			/// Constructor
			/// </summary>
			/// <param name="value"></param>
			public BooleanValue(Boolean value)
			{
				this.Bool = value;
			}
	
			public override String ToString()
			{
				return String.Format("{0}", this.Bool);
			}
	
			public override Boolean Equals(object obj)
			{
				if (!(obj is BooleanValue))
					return false;
				BooleanValue other = (BooleanValue)obj;
				return this.Bool.Equals(other.Bool);
			}
	
			public override int GetHashCode()
			{
				unchecked
				{
					return this.Bool.GetHashCode();
				}
			}
	
			public static bool operator ==(BooleanValue a, BooleanValue b)
			{
				return a.Bool.Equals(b.Bool);
			}
	
			public static bool operator !=(BooleanValue a, BooleanValue b)
			{
				return !a.Bool.Equals(b.Bool);
			}
		}
	*/

/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAzYjFmOGUzZjY0MWE2NmVlYTdmNiIsIndlYnBhY2s6Ly8vQzovX01lZGlhL3Byb2plY3RzL2RhdGFwYXJzZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0M6L19NZWRpYS9wcm9qZWN0cy9kYXRhcGFyc2VyL3NyYy9QYXR0ZXJuTWF0Y2hlci5qcyIsIndlYnBhY2s6Ly8vQzovX01lZGlhL3Byb2plY3RzL2RhdGFwYXJzZXIvc3JjL3V0aWxzL2FycmF5VXRpbHMuanMiLCJ3ZWJwYWNrOi8vL0M6L19NZWRpYS9wcm9qZWN0cy9kYXRhcGFyc2VyL3NyYy91dGlscy9zdHJpbmdVdGlscy5qcyIsIndlYnBhY2s6Ly8vQzovX01lZGlhL3Byb2plY3RzL2RhdGFwYXJzZXIvc3JjL21hdGNoaW5nL1Rva2VuLmpzIiwid2VicGFjazovLy9DOi9fTWVkaWEvcHJvamVjdHMvZGF0YXBhcnNlci9zcmMvbWF0Y2hpbmcvUGF0dGVyblBhdGguanMiLCJ3ZWJwYWNrOi8vL0M6L19NZWRpYS9wcm9qZWN0cy9kYXRhcGFyc2VyL3NyYy9NYXRjaFN0YXRlLmpzIiwid2VicGFjazovLy9DOi9fTWVkaWEvcHJvamVjdHMvZGF0YXBhcnNlci9zcmMvbWF0Y2hpbmcvUGF0aE5vZGUuanMiLCJ3ZWJwYWNrOi8vL0M6L19NZWRpYS9wcm9qZWN0cy9kYXRhcGFyc2VyL3NyYy9QYXR0ZXJuQ29udGV4dC5qcyIsIndlYnBhY2s6Ly8vQzovX01lZGlhL3Byb2plY3RzL2RhdGFwYXJzZXIvc3JjL0RhdGFQYXJzZXIuanMiLCJ3ZWJwYWNrOi8vL0M6L19NZWRpYS9wcm9qZWN0cy9kYXRhcGFyc2VyL3NyYy9tb2R1bGVzL0Jvb2xlYW5QYXJzZXJNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vL0M6L19NZWRpYS9wcm9qZWN0cy9kYXRhcGFyc2VyL3NyYy9tYXRjaGluZy9QYXR0ZXJuLmpzIiwid2VicGFjazovLy9DOi9fTWVkaWEvcHJvamVjdHMvZGF0YXBhcnNlci9zcmMvdmFsdWVzL0Jvb2xlYW5WYWx1ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbENBLGFBQVksQ0FBQzs7QUFFYixPQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2hCLGlCQUFjLEVBQUUsbUJBQU8sQ0FBQyxDQUFzQixDQUFDO0FBQy9DLGFBQVUsRUFBRSxtQkFBTyxDQUFDLENBQWtCLENBQUM7RUFDdkMsQzs7Ozs7Ozs7Ozs7O0FDTEQsT0FBTSxVQUFVLEdBQUcsbUJBQU8sQ0FBQyxDQUFvQixDQUFDLENBQUM7QUFDakQsT0FBTSxXQUFXLEdBQUcsbUJBQU8sQ0FBQyxDQUFxQixDQUFDLENBQUM7QUFDbkQsT0FBTSxLQUFLLEdBQUcsbUJBQU8sQ0FBQyxDQUFrQixDQUFDLENBQUM7QUFDMUMsT0FBTSxXQUFXLEdBQUcsbUJBQU8sQ0FBQyxDQUF3QixDQUFDLENBQUM7QUFDdEQsT0FBTSxVQUFVLEdBQUcsbUJBQU8sQ0FBQyxDQUFjLENBQUMsQ0FBQztBQUMzQyxPQUFNLFFBQVEsR0FBRyxtQkFBTyxDQUFDLENBQXFCLENBQUMsQ0FBQztBQUNoRCxPQUFNLGNBQWMsR0FBRyxtQkFBTyxDQUFDLENBQWtCLENBQUM7OztBQUdsRCxPQUFNLGlCQUFpQixHQUFHLHNEQUFzRDs7Ozs7OztBQU9oRixVQUFTLGNBQWMsQ0FBQyxRQUFRLEVBQUU7O0FBRWhDLE9BQUksQ0FBQyxRQUFRLEdBQUcsRUFB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QUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDMUMsTUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLEtBQUssQ0FBQztBQUN6QixTQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQztFQUNsQyxDQUFDOztBQUVGLE9BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xCeEIsYUFBWSxDQUFDOztBQUViLEtBQUksWUFBWSxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQ2xDLE1BQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztFQUNwQixDQUFDO0FBQ0YsYUFBWSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsWUFBVztBQUMzQyxTQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7RUFDakIsQ0FBQztBQUNGLGFBQVksQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFlBQVc7QUFDNUMsU0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0VBQzVCLENBQUM7QUFDRixhQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFTLEtBQUssRUFBRTtBQUMvQyxNQUFJLEVBQUUsS0FBSyxZQUFZLFlBQVksQ0FBQyxFQUNuQyxPQUFPLEtBQUssQ0FBQztBQUNkLFNBQU8sSUFBSSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDO0VBQ2hDLENBQUM7O0FBRUYsT0FBTSxDQUFDLE9BQU8sR0FBRyxZQUFZIiwiZmlsZSI6ImRhdGFwYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJEYXRhUGFyc2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkRhdGFQYXJzZXJcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb25cbiAqKi8iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvcmVsZWFzZS9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDNiMWY4ZTNmNjQxYTY2ZWVhN2Y2XG4gKiovIiwiLyoqXHJcbiAqIEVudHJ5IHBvaW50IGZvciB0aGUgRGF0YVBhcnNlciBsaWJyYXJ5XHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0UGF0dGVybk1hdGNoZXI6IHJlcXVpcmUoJy4vc3JjL1BhdHRlcm5NYXRjaGVyJyksXHJcblx0RGF0YVBhcnNlcjogcmVxdWlyZSgnLi9zcmMvRGF0YVBhcnNlcicpXHJcbn07XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L19NZWRpYS9wcm9qZWN0cy9kYXRhcGFyc2VyL2luZGV4LmpzXG4gKiovIiwiLyoqXHJcbiAqIE1hdGNoZXMgcGF0dGVybnMgYWNjb3JkaW5nIHRvIHJlZ2lzdGVyZWQgcnVsZXNcclxuICovXHJcblxyXG5jb25zdCBhcnJheVV0aWxzID0gcmVxdWlyZSgnLi91dGlscy9hcnJheVV0aWxzJyk7XHJcbmNvbnN0IHN0cmluZ1V0aWxzID0gcmVxdWlyZSgnLi91dGlscy9zdHJpbmdVdGlscycpO1xyXG5jb25zdCBUb2tlbiA9IHJlcXVpcmUoJy4vbWF0Y2hpbmcvVG9rZW4nKTtcclxuY29uc3QgUGF0dGVyblBhdGggPSByZXF1aXJlKCcuL21hdGNoaW5nL1BhdHRlcm5QYXRoJyk7XHJcbmNvbnN0IE1hdGNoU3RhdGUgPSByZXF1aXJlKCcuL01hdGNoU3RhdGUnKTtcclxuY29uc3QgUGF0aE5vZGUgPSByZXF1aXJlKCcuL21hdGNoaW5nL1BhdGhOb2RlJyk7XHJcbmNvbnN0IFBhdHRlcm5Db250ZXh0ID0gcmVxdWlyZSgnLi9QYXR0ZXJuQ29udGV4dCcpO1xyXG5cclxuLyoqIEBjb25zdCAqL1xyXG5jb25zdCBMRVRURVJfQ0hBUkFDVEVSUyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJztcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBuZXcgcGF0dGVybiBtYXRjaGVyIHdpdGggdGhlIGdpdmVuIGJhc2UgcGF0dGVybnNcclxuICogQHBhcmFtIHBhdHRlcm5zXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gUGF0dGVybk1hdGNoZXIocGF0dGVybnMpIHtcclxuICAvLyBBbGwgY3VycmVudGx5IGFjdGl2ZSBwYXR0ZXJuc1xyXG4gIHRoaXMucGF0dGVybnMgPSB7fTtcclxuICAvLyBBbGwgYWN0aXZlIHBhdHRlcm5zIGNvbXBpbGVkIGZvciB1c2VcclxuICB0aGlzLmNvbXBpbGVkUGF0dGVybnMgPSB7fTtcclxuICAvLyBBbGwgcmVnaXN0ZXJlZCB2YWxpZGF0b3JzXHJcbiAgdGhpcy52YWxpZGF0b3JzID0ge307XHJcblxyXG4gIGlmIChwYXR0ZXJucykge1xyXG4gICAgdGhpcy5hZGRQYXR0ZXJucygnJywgcGF0dGVybnMpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENsZWFyIGFsbCBjb21waWxlZCBwYXR0ZXJuc1xyXG4gKi9cclxuUGF0dGVybk1hdGNoZXIucHJvdG90eXBlLmNsZWFyUGF0dGVybnMgPSBmdW5jdGlvbiBjbGVhclBhdHRlcm5zKCkge1xyXG4gIHRoaXMucGF0dGVybnMubGVuZ3RoID0gMDtcclxuICB0aGlzLmNvbXBpbGVkUGF0dGVybnMubGVuZ3RoID0gMDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgbW9yZSBwYXR0ZXJucyB0byB0aGUgY29tcGlsZWQgb25lc1xyXG4gKiBAcGFyYW0gbWF0Y2hUYWdcclxuICogQHBhcmFtIG5ld1BhdHRlcm5zXHJcbiAqL1xyXG5QYXR0ZXJuTWF0Y2hlci5wcm90b3R5cGUuYWRkUGF0dGVybnMgPSBmdW5jdGlvbiBhZGRQYXR0ZXJucyhtYXRjaFRhZywgbmV3UGF0dGVybnMpIHtcclxuICAvLyBpZiBubyBwYXR0ZXJucyBhcmUgaW4gdGhlIGxpc3QgdGhlbiB0aGVyZSdzIG5vdGhpbmcgdG8gZG9cclxuICBpZiAoIW5ld1BhdHRlcm5zIHx8ICFuZXdQYXR0ZXJucy5sZW5ndGgpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGxldCB0YXJnZXRQYXR0ZXJucyA9IHRoaXMucGF0dGVybnNbbWF0Y2hUYWddO1xyXG4gIGlmICghdGFyZ2V0UGF0dGVybnMpIHtcclxuICAgIHRhcmdldFBhdHRlcm5zID0gdGhpcy5wYXR0ZXJuc1ttYXRjaFRhZ10gPSBbXTtcclxuICB9XHJcblxyXG4gIGxldCBwYXRoUm9vdCA9IHRoaXMuY29tcGlsZWRQYXR0ZXJuc1ttYXRjaFRhZ107XHJcbiAgaWYgKCFwYXRoUm9vdCkge1xyXG4gICAgcGF0aFJvb3QgPSB0aGlzLmNvbXBpbGVkUGF0dGVybnNbbWF0Y2hUYWddID0ge307XHJcbiAgfVxyXG5cclxuICAvLyBwYXJzZSBlYWNoIHBhdHRlcm4gaW50byB0b2tlbnMgYW5kIHRoZW4gcGFyc2UgdGhlIHRva2Vuc1xyXG4gIGNvbnN0IHRva2VucyA9IFtdO1xyXG4gIGZvciAobGV0IHBhdHRlcm5JbmRleCA9IDA7IHBhdHRlcm5JbmRleCA8IG5ld1BhdHRlcm5zLmxlbmd0aDsgcGF0dGVybkluZGV4KyspIHtcclxuICAgIGNvbnN0IHAgPSBuZXdQYXR0ZXJuc1twYXR0ZXJuSW5kZXhdO1xyXG5cclxuICAgIC8vIGlmIHRoZSBwYXR0ZXJuIHdhcyBhZGRlZCBiZWZvcmUgdGhlbiBkb24ndCBkbyBpdCBhZ2FpblxyXG4gICAgaWYgKGFycmF5VXRpbHMuY29udGFpbnModGFyZ2V0UGF0dGVybnMsIHApKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRhcmdldEluZGV4ID0gdGFyZ2V0UGF0dGVybnMubGVuZ3RoO1xyXG4gICAgdGFyZ2V0UGF0dGVybnMucHVzaChwKTtcclxuXHJcbiAgICBjb25zdCBwYXR0ZXJuID0gcC5tYXRjaDtcclxuXHJcbiAgICAvL1xyXG4gICAgLy8gcGFyc2UgdGhlIHBhdHRlcm4gaW50byB0b2tlbnNcclxuICAgIC8vXHJcblxyXG4gICAgdG9rZW5zLmxlbmd0aCA9IDA7XHJcbiAgICBsZXQgY3VycmVudFRva2VuID0gJyc7XHJcbiAgICBsZXQgaTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBwYXR0ZXJuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHN3aXRjaCAocGF0dGVybltpXSkge1xyXG4gICAgICAgIGNhc2UgJ3snOlxyXG4gICAgICAgICAgaWYgKCFjdXJyZW50VG9rZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdG9rZW5zLnB1c2gobmV3IFRva2VuKGN1cnJlbnRUb2tlbiwgdHJ1ZSkpO1xyXG4gICAgICAgICAgY3VycmVudFRva2VuID0gJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICd9JzpcclxuICAgICAgICAgIHRva2Vucy5wdXNoKG5ldyBUb2tlbihjdXJyZW50VG9rZW4sIGZhbHNlKSk7XHJcbiAgICAgICAgICBjdXJyZW50VG9rZW4gPSAnJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBjdXJyZW50VG9rZW4gKz0gcGF0dGVybltpXTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGN1cnJlbnRUb2tlbikge1xyXG4gICAgICB0b2tlbnMucHVzaChuZXcgVG9rZW4oY3VycmVudFRva2VuLCB0cnVlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0b2tlbnMubGVuZ3RoKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vXHJcbiAgICAvLyBDb21waWxlIHRoZSB0b2tlbnMgaW50byB0aGUgdHJlZVxyXG4gICAgLy9cclxuXHJcbiAgICBsZXQgcGF0aCA9IG51bGw7XHJcbiAgICBsZXQgcGF0aHMgPSBwYXRoUm9vdDtcclxuICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaV07XHJcbiAgICAgIGNvbnN0IHRva2VuS2V5ID0gdG9rZW4udG9TdHJpbmcoKTtcclxuICAgICAgLy8gY2hlY2sgaWYgdGhlIGV4YWN0IHNhbWUgbm9kZSBleGlzdHMgYW5kIHRha2UgaXQgaWYgaXQgZG9lc1xyXG4gICAgICBsZXQgbmV4dFBhdGggPSBwYXRoc1t0b2tlbktleV07XHJcbiAgICAgIGlmICghbmV4dFBhdGgpIHtcclxuICAgICAgICBuZXh0UGF0aCA9IHBhdGhzW3Rva2VuS2V5XSA9IG5ldyBQYXR0ZXJuUGF0aCgpO1xyXG4gICAgICB9XHJcbiAgICAgIHBhdGggPSBuZXh0UGF0aDtcclxuICAgICAgcGF0aHMgPSBuZXh0UGF0aC5wYXRocztcclxuICAgIH1cclxuICAgIGlmIChwYXRoKSB7XHJcbiAgICAgIGlmICghcGF0aC5tYXRjaGVkUGF0dGVybnMpIHtcclxuICAgICAgICBwYXRoLm1hdGNoZWRQYXR0ZXJucyA9IFtdO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwYXRoLm1hdGNoZWRQYXR0ZXJucy5pbmRleE9mKHRhcmdldEluZGV4KSA9PT0gLTEpIHtcclxuICAgICAgICBwYXRoLm1hdGNoZWRQYXR0ZXJucy5wdXNoKHRhcmdldEluZGV4KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBNYXRjaCB0aGUgdmFsdWUgYWdhaW5zdCBhbGwgcGF0dGVybnMgYW5kIHJldHVybiB0aGUgb25lcyB0aGF0IGZpdFxyXG4gKiBAcGFyYW0gY29udGV4dCAtIFRoZSBjdXJyZW50IGNvbnRleHQgZm9yIG1hdGNoaW5nXHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcblBhdHRlcm5NYXRjaGVyLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uIG1hdGNoKGNvbnRleHQsIHZhbHVlKSB7XHJcbiAgdmFyIHJlc3VsdHMgPSBbXTtcclxuICBpZiAoIXZhbHVlKVxyXG4gICAgcmV0dXJuIHJlc3VsdHM7XHJcblxyXG4gIHZhciBzdGF0ZSA9IHRoaXMubWF0Y2hTdGFydChjb250ZXh0LCAnJyk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGMgPSB2YWx1ZS5jaGFyQXQoaSk7XHJcbiAgICBpZiAoIXRoaXMubWF0Y2hOZXh0KHN0YXRlLCBjKSlcclxuICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgfVxyXG5cclxuICByZXN1bHRzID0gdGhpcy5tYXRjaFJlc3VsdHMoc3RhdGUpO1xyXG4gIC8vIHJldmVyc2UgcmVzdWx0cyBzaW5jZSB0aGUgbG9uZ2VzdCBtYXRjaGVzIHdpbGwgYmUgZm91bmQgbGFzdCBidXQgYXJlIHRoZSBtb3N0IHNwZWNpZmljXHJcbiAgcmVzdWx0cy5yZXZlcnNlKCk7XHJcbiAgcmV0dXJuIHJlc3VsdHM7XHJcbn07XHJcblxyXG4vKipcclxuICogQmVnaW4gYSBwYXJzaW5nIHNlc3Npb25cclxuICogQHBhcmFtIGNvbnRleHRcclxuICogQHBhcmFtIG1hdGNoVGFnXHJcbiAqIEByZXR1cm5zIHtNYXRjaFN0YXRlfVxyXG4gKi9cclxuUGF0dGVybk1hdGNoZXIucHJvdG90eXBlLm1hdGNoU3RhcnQgPSBmdW5jdGlvbiBtYXRjaFN0YXJ0KGNvbnRleHQsIG1hdGNoVGFnKSB7XHJcbiAgdmFyIHJvb3RzID0gdGhpcy5jb21waWxlZFBhdHRlcm5zW21hdGNoVGFnXTtcclxuICBpZiAoIXJvb3RzKVxyXG4gICAgcmV0dXJuIG51bGw7XHJcblxyXG4gIHZhciBzdGF0ZSA9IG5ldyBNYXRjaFN0YXRlKCk7XHJcbiAgc3RhdGUubWF0Y2hUYWcgPSBtYXRjaFRhZztcclxuICBzdGF0ZS5jb250ZXh0ID0gY29udGV4dCB8fCBuZXcgUGF0dGVybkNvbnRleHQoKTtcclxuXHJcbiAgdmFyIHJvb3QgPSBuZXcgUGF0dGVyblBhdGgoKTtcclxuICByb290LnBhdGhzID0gcm9vdHM7XHJcbiAgdmFyIHN0YXJ0Tm9kZSA9IG5ldyBQYXRoTm9kZShudWxsLCByb290LCAnJyk7XHJcbiAgc3RhdGUuY2FuZGlkYXRlUGF0aHMucHVzaChzdGFydE5vZGUpO1xyXG5cclxuICByZXR1cm4gc3RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogTWF0Y2ggdGhlIG5leHQgY2hhcmFjdGVyXHJcbiAqIEBwYXJhbSBzdGF0ZSB7TWF0Y2hTdGF0ZX0gLSBUaGUgY3VycmVudCBtYXRjaGluZyBzdGF0ZVxyXG4gKiBAcGFyYW0gYyB7U3RyaW5nfSAtIFRoZSBuZXh0IGNoYXJhY3RlclxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIHRoaXMgaXMgc3RpbGwgYSB2YWxpZCBtYXRjaCwgZmFsc2Ugb3RoZXJ3aXNlXHJcbiAqL1xyXG5QYXR0ZXJuTWF0Y2hlci5wcm90b3R5cGUubWF0Y2hOZXh0ID0gZnVuY3Rpb24gbWF0Y2hOZXh0KHN0YXRlLCBjKSB7XHJcbiAgaWYgKCFzdGF0ZSlcclxuICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgdmFyIGNhbmRpZGF0ZVBhdGhzID0gc3RhdGUuY2FuZGlkYXRlUGF0aHM7XHJcbiAgdmFyIG5ld0NhbmRpZGF0ZXMgPSBzdGF0ZS5uZXdDYW5kaWRhdGVzO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FuZGlkYXRlUGF0aHMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBjYW5kaWRhdGUgPSBjYW5kaWRhdGVQYXRoc1tpXTtcclxuXHJcbiAgICAvLyBmaXJzdCBjaGVjayBpZiBhbnkgb2YgdGhlIGNoaWxkIG5vZGVzIHZhbGlkYXRlIHdpdGggdGhlIG5ldyBjaGFyYWN0ZXIgYW5kIHJlbWVtYmVyIHRoZW0gYXMgY2FuZGlkYXRlc1xyXG4gICAgLy8gYW55IGNoaWxkcmVuIGNhbiBvbmx5IGJlIGNhbmRpZGF0ZXMgaWYgdGhlIGZpbmFsIHZhbGlkYXRpb24gb2YgdGhlIGN1cnJlbnQgdmFsdWUgc3VjY2VlZHNcclxuICAgIGlmICghY2FuZGlkYXRlLnRva2VuIHx8IHRoaXMudmFsaWRhdGVUb2tlbihzdGF0ZS5jb250ZXh0LCBjYW5kaWRhdGUsIHRydWUpKVxyXG4gICAgICB0aGlzLnZhbGlkYXRlQ2hpbGRyZW4oc3RhdGUuY29udGV4dCwgY2FuZGlkYXRlLnBhdGgucGF0aHMsIGNhbmRpZGF0ZSwgYywgbmV3Q2FuZGlkYXRlcywgMCk7XHJcblxyXG4gICAgLy8gdG9rZW4gY2FuIGJlIG51bGwgZm9yIHRoZSByb290IG5vZGUgYnV0IG5vIHZhbGlkYXRpb24gbmVlZHMgdG8gYmUgZG9uZSBmb3IgdGhhdFxyXG4gICAgaWYgKGNhbmRpZGF0ZS50b2tlbiAhPSBudWxsKSB7XHJcbiAgICAgIC8vIHZhbGlkYXRlIHRoaXMgY2FuZGlkYXRlIGFuZCByZW1vdmUgaXQgaWYgaXQgZG9lc24ndCB2YWxpZGF0ZSBhbnltb3JlXHJcbiAgICAgIGNhbmRpZGF0ZS5pc0ZpbmFsaXplZCA9IGZhbHNlO1xyXG4gICAgICBjYW5kaWRhdGUudGV4dFZhbHVlICs9IGM7XHJcbiAgICAgIGlmICh0aGlzLnZhbGlkYXRlVG9rZW4oc3RhdGUuY29udGV4dCwgY2FuZGlkYXRlLCBmYWxzZSkpXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICB9XHJcbiAgICBjYW5kaWRhdGVQYXRocy5zcGxpY2UoaS0tLCAxKTtcclxuICB9XHJcbiAgY2FuZGlkYXRlUGF0aHMucHVzaC5hcHBseShjYW5kaWRhdGVQYXRocywgbmV3Q2FuZGlkYXRlcyk7XHJcbiAgbmV3Q2FuZGlkYXRlcy5sZW5ndGggPSAwO1xyXG5cclxuICByZXR1cm4gY2FuZGlkYXRlUGF0aHMubGVuZ3RoID4gMDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBc3NlbWJsZSB0aGUgcmVzdWx0cyBhZnRlciB0aGUgbGFzdCBjaGFyYWN0ZXIgaGFzIGJlZW4gbWF0Y2hlZFxyXG4gKiBAcGFyYW0gY3VycmVudFN0YXRlIHtNYXRjaFN0YXRlfSAtIFRoZSBjdXJyZW50IG1hdGNoaW5nIHN0YXRlXHJcbiAqIEByZXR1cm5zIHtPYmplY3RbXX0gLSBUaGUgbGlzdCBvZiBtYXRjaGVzXHJcbiAqL1xyXG5QYXR0ZXJuTWF0Y2hlci5wcm90b3R5cGUubWF0Y2hSZXN1bHRzID0gZnVuY3Rpb24gbWF0Y2hSZXN1bHRzKGN1cnJlbnRTdGF0ZSkge1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZWdpc3RlciBhIHZhbGlkYXRpb24gb2JqZWN0IGZvciB0aGUgdGFnXHJcbiAqIEBwYXJhbSB0YWdcclxuICogQHBhcmFtIHZhbGlkYXRvclxyXG4gKi9cclxuUGF0dGVybk1hdGNoZXIucHJvdG90eXBlLnJlZ2lzdGVyVmFsaWRhdG9yID0gZnVuY3Rpb24gcmVnaXN0ZXJWYWxpZGF0b3IodGFnLCB2YWxpZGF0b3IpIHtcclxuICB0aGlzLnZhbGlkYXRvcnNbdGFnXSA9IHZhbGlkYXRvcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgdmFsdWUgaXMgd2l0aGluIHRoZSByZXF1aXJlZCBsZW5ndGggZm9yIHRva2VuXHJcbiAqIEBwYXJhbSB0b2tlblxyXG4gKiBAcGFyYW0gdmFsdWVcclxuICogQHBhcmFtIGlzRmluYWxcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5QYXR0ZXJuTWF0Y2hlci5wcm90b3R5cGUudmFsaWRhdGVDb3VudCA9IGZ1bmN0aW9uIHZhbGlkYXRlQ291bnQodG9rZW4sIHZhbHVlLCBpc0ZpbmFsKSB7XHJcbiAgcmV0dXJuICghaXNGaW5hbCB8fCB2YWx1ZS5sZW5ndGggPj0gdG9rZW4ubWluQ291bnQpICYmIHZhbHVlLmxlbmd0aCA8PSB0b2tlbi5tYXhDb3VudDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgdGhlIG5leHQgY2hhcmFjdGVyIHRvIHRoZSBtYXRjaGVkIHBhdGhcclxuICogQHBhcmFtIGNvbnRleHQge1BhdHRlcm5Db250ZXh0fSAtIFRoZSBjdXJyZW50IG1hdGNoaW5nIGNvbnRleHRcclxuICogQHBhcmFtIG5vZGUge1BhdGhOb2RlfSAtIFRoZSBub2RlIHdlIGFyZSB2YWxpZGF0aW5nXHJcbiAqIEBwYXJhbSBpc0ZpbmFsIHtib29sZWFufSAtIFRydWUgaWYgdGhpcyBpcyB0aGUgZmluYWwgbWF0Y2ggYW5kIG5vIGZ1cnRoZXIgdmFsdWVzIHdpbGwgYmUgYWRkZWRcclxuICogQHJldHVybnMge2Jvb2xlYW59IC0gdHJ1ZSBpZiB0aGUgdmFsdWUgY2FuIGJlIHBhcnNlZCBzdWNjZXNzZnVsbHkgdXNpbmcgdGhlIHRva2VuXHJcbiAqL1xyXG5QYXR0ZXJuTWF0Y2hlci5wcm90b3R5cGUudmFsaWRhdGVUb2tlbiA9IGZ1bmN0aW9uIHZhbGlkYXRlVG9rZW4oY29udGV4dCwgbm9kZSwgaXNGaW5hbCkge1xyXG4gIC8vIGlmIGl0IGlzIGZpbmFsaXplZCB0aGVuIGl0IGlzIGRlZmluaXRlbHkgYWxzbyB2YWxpZFxyXG4gIGlmIChub2RlLmlzRmluYWxpemVkKVxyXG4gICAgcmV0dXJuIHRydWU7XHJcblxyXG4gIHZhciB0b2tlbiA9IG5vZGUudG9rZW47XHJcbiAgdmFyIHRleHRWYWx1ZSA9IG5vZGUudGV4dFZhbHVlO1xyXG5cclxuICAvLyBtYXRjaCBleGFjdCB2YWx1ZXMgZmlyc3RcclxuICBpZiAoIXRleHRWYWx1ZSlcclxuICAgIHJldHVybiBmYWxzZTtcclxuICBpZiAodG9rZW4uZXhhY3RNYXRjaClcclxuICAgIHJldHVybiAoKGlzRmluYWwgJiYgdG9rZW4udmFsdWUgPT09IHRleHRWYWx1ZSkgfHwgKCFpc0ZpbmFsICYmIHN0cmluZ1V0aWxzLnN0YXJ0c1dpdGgodG9rZW4udmFsdWUsIHRleHRWYWx1ZSkpKTtcclxuXHJcbiAgLy8gdGVzdCBpbmJ1aWx0IHRva2VucyBmaXJzdFxyXG4gIHN3aXRjaCAodG9rZW4udmFsdWUpIHtcclxuICAgIC8vIHdoaXRlc3BhY2VcclxuICAgIGNhc2UgJyAnOlxyXG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZUNvdW50KHRva2VuLCB0ZXh0VmFsdWUsIGlzRmluYWwpICYmIHN0cmluZ1V0aWxzLm1hdGNoQWxsKHRleHRWYWx1ZSwgJyBcXHQnKTtcclxuICAgIGNhc2UgJ25ld2xpbmUnOlxyXG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZUNvdW50KHRva2VuLCB0ZXh0VmFsdWUsIGlzRmluYWwpICYmIHN0cmluZ1V0aWxzLm1hdGNoQWxsKHRleHRWYWx1ZSwgJ1xcclxcbicpO1xyXG4gICAgY2FzZSAnZW1wdHlsaW5lJzpcclxuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVDb3VudCh0b2tlbiwgdGV4dFZhbHVlLCBpc0ZpbmFsKSAmJiBzdHJpbmdVdGlscy5tYXRjaEFsbCh0ZXh0VmFsdWUsICdcXHJcXG4gXFx0Jyk7XHJcbiAgICBjYXNlICdsZXR0ZXInOlxyXG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZUNvdW50KHRva2VuLCB0ZXh0VmFsdWUsIGlzRmluYWwpICYmIHN0cmluZ1V0aWxzLm1hdGNoQWxsKHRleHRWYWx1ZSwgTEVUVEVSX0NIQVJBQ1RFUlMpO1xyXG4gICAgY2FzZSAnYW55JzpcclxuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVDb3VudCh0b2tlbiwgdGV4dFZhbHVlLCBpc0ZpbmFsKTtcclxuICB9XHJcblxyXG4gIC8vIGNoZWNrIHBhdHRlcm4gdGFncyBhbmQgZG8gYSBzdWIgbWF0Y2ggZm9yIGVhY2ggb2YgdGhlbVxyXG4gIGlmICh0aGlzLmNvbXBpbGVkUGF0dGVybnNbdG9rZW4udmFsdWVdKSB7XHJcbiAgICAvLyBzdWIgbWF0Y2hpbmcgaXMgcG9zc2libGUsIHNvIHN0YXJ0IGEgbmV3IG9uZSBvciBjb250aW51ZSB0aGUgcHJldmlvdXMgb25lXHJcbiAgICBpZiAobm9kZS5tYXRjaFN0YXRlID09IG51bGwpXHJcbiAgICAgIG5vZGUubWF0Y2hTdGF0ZSA9IHRoaXMubWF0Y2hTdGFydChjb250ZXh0LCB0b2tlbi52YWx1ZSk7XHJcbiAgICAvLyBpZiB0aGlzIGlzIHRoZSBsYXN0IG1hdGNoIHRoZW4gYXNzZW1ibGUgdGhlIHJlc3VsdHNcclxuICAgIGlmIChpc0ZpbmFsKVxyXG4gICAgICByZXR1cm4gdGhpcy5oYXNSZXN1bHRzKG5vZGUubWF0Y2hTdGF0ZSk7XHJcbiAgICByZXR1cm4gdGhpcy5tYXRjaE5leHQobm9kZS5tYXRjaFN0YXRlLCB0ZXh0VmFsdWVbdGV4dFZhbHVlLmxlbmd0aCAtIDFdKTtcclxuICB9XHJcblxyXG4gIC8vIGNoZWNrIGlmIGEgdmFsaWRhdG9yIGlzIHJlZ2lzdGVyZWQgZm9yIHRoaXMgdG9rZW5cclxuICB2YXIgdmFsaWRhdG9yID0gdGhpcy52YWxpZGF0b3JzW3Rva2VuLnZhbHVlXTtcclxuICBpZiAoIXZhbGlkYXRvcilcclxuICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgcmV0dXJuIHZhbGlkYXRvci52YWxpZGF0ZVRva2VuKHRva2VuLCB0ZXh0VmFsdWUsIGlzRmluYWwpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlY3Vyc2l2ZWx5IGNoZWNrIGNhbmRpZGF0ZXNcclxuICogQHBhcmFtIGNvbnRleHQge1BhdHRlcm5Db250ZXh0fVxyXG4gKiBAcGFyYW0gcGF0aHMge29iamVjdFtdfVxyXG4gKiBAcGFyYW0gbm9kZSB7UGF0aE5vZGV9XHJcbiAqIEBwYXJhbSB2YWwge3N0cmluZ31cclxuICogQHBhcmFtIG5ld0NhbmRpZGF0ZXMge1BhdGhOb2RlW119XHJcbiAqIEBwYXJhbSBkZXB0aCB7bnVtYmVyfVxyXG4gKi9cclxuUGF0dGVybk1hdGNoZXIucHJvdG90eXBlLnZhbGlkYXRlQ2hpbGRyZW4gPSBmdW5jdGlvbiB2YWxpZGF0ZUNoaWxkcmVuKGNvbnRleHQsIHBhdGhzLCBub2RlLCB2YWwsIG5ld0NhbmRpZGF0ZXMsIGRlcHRoKSB7XHJcblxyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVybk1hdGNoZXI7XHJcblxyXG5cclxuLypcclxuXHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gTWF0Y2hlcyBkYXRhIGJhc2VkIG9uIHBhdHRlcm5zXHJcbiAvLy8gPC9zdW1tYXJ5PlxyXG4gcHVibGljIGNsYXNzIFBhdHRlcm5NYXRjaGVyXHJcbiB7XHJcbiBwcml2YXRlIGNvbnN0IFN0cmluZyBMZXR0ZXJDaGFyYWN0ZXJzID0gXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCI7XHJcblxyXG4gLy8vIDxzdW1tYXJ5PlxyXG4gLy8vIEFsbCBjdXJyZW50bHkgYWN0aXZlIHBhdHRlcm5zXHJcbiAvLy8gPC9zdW1tYXJ5PlxyXG4gcHJpdmF0ZSByZWFkb25seSBEaWN0aW9uYXJ5PFN0cmluZywgTGlzdDxQYXR0ZXJuPj4gcGF0dGVybnMgPSBuZXcgRGljdGlvbmFyeTxTdHJpbmcsIExpc3Q8UGF0dGVybj4+KCk7XHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gQWxsIGFjdGl2ZSBwYXR0ZXJucyBjb21waWxlZCBmb3IgdXNlXHJcbiAvLy8gPC9zdW1tYXJ5PlxyXG4gcHJpdmF0ZSByZWFkb25seSBEaWN0aW9uYXJ5PFN0cmluZywgRGljdGlvbmFyeTxUb2tlbiwgUGF0dGVyblBhdGg+PiBjb21waWxlZFBhdHRlcm5zID0gbmV3IERpY3Rpb25hcnk8U3RyaW5nLCBEaWN0aW9uYXJ5PFRva2VuLCBQYXR0ZXJuUGF0aD4+KCk7XHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gQWxsIHJlZ2lzdGVyZWQgdmFsaWRhdG9yc1xyXG4gLy8vIDwvc3VtbWFyeT5cclxuIHByaXZhdGUgcmVhZG9ubHkgRGljdGlvbmFyeTxTdHJpbmcsIElUb2tlblZhbGlkYXRvcj4gdmFsaWRhdG9ycyA9IG5ldyBEaWN0aW9uYXJ5PFN0cmluZywgSVRva2VuVmFsaWRhdG9yPigpO1xyXG5cclxuIC8vLyA8c3VtbWFyeT5cclxuIC8vLyBDb25zdHJ1Y3RvclxyXG4gLy8vIDwvc3VtbWFyeT5cclxuIHB1YmxpYyBQYXR0ZXJuTWF0Y2hlcihQYXR0ZXJuW10gcGF0dGVybnMpXHJcbiB7XHJcbiBpZiAocGF0dGVybnMuTGVuZ3RoID4gMClcclxuIEFkZFBhdHRlcm5zKFwiXCIsIHBhdHRlcm5zKTtcclxuIH1cclxuXHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gQ2xlYXIgYWxsIGNvbXBpbGVkIHBhdHRlcm5zXHJcbiAvLy8gPC9zdW1tYXJ5PlxyXG4gcHVibGljIHZvaWQgQ2xlYXJQYXR0ZXJucygpXHJcbiB7XHJcbiB0aGlzLnBhdHRlcm5zLkNsZWFyKCk7XHJcbiB0aGlzLmNvbXBpbGVkUGF0dGVybnMuQ2xlYXIoKTtcclxuIH1cclxuXHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gQWRkIG1vcmUgcGF0dGVybnMgdG8gdGhlIGNvbXBpbGVkIG9uZXNcclxuIC8vLyA8L3N1bW1hcnk+XHJcbiBwdWJsaWMgdm9pZCBBZGRQYXR0ZXJucyhTdHJpbmcgbWF0Y2hUYWcsIFBhdHRlcm5bXSBuZXdQYXR0ZXJucylcclxuIHtcclxuIExpc3Q8UGF0dGVybj4gdGFyZ2V0UGF0dGVybnM7XHJcbiAjaWYgU0NSSVBUU0hBUlBcclxuIGlmICgodGFyZ2V0UGF0dGVybnMgPSBEaWN0aW9uYXJ5VXRpbHMuVHJ5R2V0UGF0dGVybnModGhpcy5wYXR0ZXJucywgbWF0Y2hUYWcpKSA9PSBudWxsKVxyXG4gI2Vsc2VcclxuIGlmICghdGhpcy5wYXR0ZXJucy5UcnlHZXRWYWx1ZShtYXRjaFRhZywgb3V0IHRhcmdldFBhdHRlcm5zKSlcclxuICNlbmRpZlxyXG4gdGhpcy5wYXR0ZXJuc1ttYXRjaFRhZ10gPSB0YXJnZXRQYXR0ZXJucyA9IG5ldyBMaXN0PFBhdHRlcm4+KG5ld1BhdHRlcm5zLkxlbmd0aCk7XHJcblxyXG4gRGljdGlvbmFyeTxUb2tlbiwgUGF0dGVyblBhdGg+IHBhdGhSb290O1xyXG4gI2lmIFNDUklQVFNIQVJQXHJcbiBpZiAoKHBhdGhSb290ID0gRGljdGlvbmFyeVV0aWxzLlRyeUdldFBhdHRlcm5QYXRoKGNvbXBpbGVkUGF0dGVybnMsIG1hdGNoVGFnKSkgPT0gbnVsbClcclxuIGNvbXBpbGVkUGF0dGVybnNbbWF0Y2hUYWddID0gcGF0aFJvb3QgPSBuZXcgRGljdGlvbmFyeTxUb2tlbiwgUGF0dGVyblBhdGg+KCk7XHJcbiAjZWxzZVxyXG4gaWYgKCF0aGlzLmNvbXBpbGVkUGF0dGVybnMuVHJ5R2V0VmFsdWUobWF0Y2hUYWcsIG91dCBwYXRoUm9vdCkpXHJcbiB0aGlzLmNvbXBpbGVkUGF0dGVybnNbbWF0Y2hUYWddID0gcGF0aFJvb3QgPSBuZXcgRGljdGlvbmFyeTxUb2tlbiwgUGF0dGVyblBhdGg+KCk7XHJcbiAjZW5kaWZcclxuXHJcbiAvLyBwYXJzZSBlYWNoIHBhdHRlcm4gaW50byB0b2tlbnMgYW5kIHRoZW4gcGFyc2UgdGhlIHRva2Vuc1xyXG4gTGlzdDxUb2tlbj4gdG9rZW5zID0gbmV3IExpc3Q8VG9rZW4+KCk7XHJcbiBmb3IgKEludDMyIHBhdHRlcm5JbmRleCA9IDA7IHBhdHRlcm5JbmRleCA8IG5ld1BhdHRlcm5zLkxlbmd0aDsgcGF0dGVybkluZGV4KyspXHJcbiB7XHJcbiBQYXR0ZXJuIHAgPSBuZXdQYXR0ZXJuc1twYXR0ZXJuSW5kZXhdO1xyXG5cclxuIC8vIGlmIHRoZSBwYXR0ZXJuIHdhcyBhZGRlZCBiZWZvcmUgdGhlbiBkb24ndCBkbyBpdCBhZ2FpblxyXG4gaWYgKHRhcmdldFBhdHRlcm5zLkNvbnRhaW5zKHApKVxyXG4gY29udGludWU7XHJcblxyXG4gSW50MzIgdGFyZ2V0SW5kZXggPSB0YXJnZXRQYXR0ZXJucy5Db3VudDtcclxuIHRhcmdldFBhdHRlcm5zLkFkZChwKTtcclxuXHJcbiBTdHJpbmcgcGF0dGVybiA9IHAuTWF0Y2g7XHJcblxyXG4gLy9cclxuIC8vIHBhcnNlIHRoZSBwYXR0ZXJuIGludG8gdG9rZW5zXHJcbiAvL1xyXG5cclxuIHRva2Vucy5DbGVhcigpO1xyXG4gU3RyaW5nIGN1cnJlbnRUb2tlbiA9IFwiXCI7XHJcbiBJbnQzMiBpO1xyXG4gZm9yIChpID0gMDsgaSA8IHBhdHRlcm4uTGVuZ3RoOyBpKyspXHJcbiB7XHJcbiBzd2l0Y2ggKHBhdHRlcm5baV0pXHJcbiB7XHJcbiBjYXNlICd7JzpcclxuIGlmIChjdXJyZW50VG9rZW4uTGVuZ3RoID09IDApXHJcbiBicmVhaztcclxuIHRva2Vucy5BZGQobmV3IFRva2VuKGN1cnJlbnRUb2tlbiwgdHJ1ZSkpO1xyXG4gY3VycmVudFRva2VuID0gXCJcIjtcclxuIGJyZWFrO1xyXG4gY2FzZSAnfSc6XHJcbiB0b2tlbnMuQWRkKG5ldyBUb2tlbihjdXJyZW50VG9rZW4sIGZhbHNlKSk7XHJcbiBjdXJyZW50VG9rZW4gPSBcIlwiO1xyXG4gYnJlYWs7XHJcbiBkZWZhdWx0OlxyXG4gY3VycmVudFRva2VuICs9IHBhdHRlcm5baV07XHJcbiBicmVhaztcclxuIH1cclxuIH1cclxuXHJcbiBpZighU3RyaW5nLklzTnVsbE9yRW1wdHkoY3VycmVudFRva2VuKSlcclxuIHRva2Vucy5BZGQobmV3IFRva2VuKGN1cnJlbnRUb2tlbiwgdHJ1ZSkpO1xyXG5cclxuIGlmICh0b2tlbnMuQ291bnQgPT0gMClcclxuIGNvbnRpbnVlO1xyXG5cclxuIC8vXHJcbiAvLyBDb21waWxlIHRoZSB0b2tlbnMgaW50byB0aGUgdHJlZVxyXG4gLy9cclxuXHJcbiBQYXR0ZXJuUGF0aCBwYXRoID0gbnVsbDtcclxuIERpY3Rpb25hcnk8VG9rZW4sIFBhdHRlcm5QYXRoPiBwYXRocyA9IHBhdGhSb290O1xyXG4gZm9yIChpID0gMDsgaSA8IHRva2Vucy5Db3VudDsgaSsrKVxyXG4ge1xyXG4gVG9rZW4gdG9rZW4gPSB0b2tlbnNbaV07XHJcbiAvLyBjaGVjayBpZiB0aGUgZXhhY3Qgc2FtZSBub2RlIGV4aXN0cyBhbmQgdGFrZSBpdCBpZiBpdCBkb2VzXHJcbiBQYXR0ZXJuUGF0aCBuZXh0UGF0aDtcclxuICNpZiBTQ1JJUFRTSEFSUFxyXG4gaWYgKChuZXh0UGF0aCA9IERpY3Rpb25hcnlVdGlscy5UcnlHZXRQYXRoKHBhdGhzLCB0b2tlbikpID09IG51bGwpXHJcbiAjZWxzZVxyXG4gaWYgKCFwYXRocy5UcnlHZXRWYWx1ZSh0b2tlbiwgb3V0IG5leHRQYXRoKSlcclxuICNlbmRpZlxyXG4ge1xyXG4gbmV4dFBhdGggPSBuZXcgUGF0dGVyblBhdGgoKTtcclxuIHBhdGhzW3Rva2VuXSA9IG5leHRQYXRoO1xyXG4gfVxyXG4gcGF0aCA9IG5leHRQYXRoO1xyXG4gcGF0aHMgPSBuZXh0UGF0aC5QYXRocztcclxuIH1cclxuIGlmIChwYXRoICE9IG51bGwpXHJcbiB7XHJcbiBpZiAocGF0aC5NYXRjaGVkUGF0dGVybnMgPT0gbnVsbClcclxuIHBhdGguTWF0Y2hlZFBhdHRlcm5zID0gbmV3IExpc3Q8SW50MzI+KCk7XHJcbiBpZiAoIXBhdGguTWF0Y2hlZFBhdHRlcm5zLkNvbnRhaW5zKHRhcmdldEluZGV4KSlcclxuIHBhdGguTWF0Y2hlZFBhdHRlcm5zLkFkZCh0YXJnZXRJbmRleCk7XHJcbiB9XHJcbiB9XHJcbiB9XHJcblxyXG5cclxuIC8vLyA8c3VtbWFyeT5cclxuIC8vLyBNYXRjaCB0aGUgdmFsdWUgYWdhaW5zdCBhbGwgcGF0dGVybnMgYW5kIHJldHVybiB0aGUgb25lcyB0aGF0IGZpdFxyXG4gLy8vIDwvc3VtbWFyeT5cclxuIC8vLyA8cGFyYW0gbmFtZT1cInZhbHVlXCI+PC9wYXJhbT5cclxuIC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcbiBwdWJsaWMgTGlzdDxPYmplY3Q+IE1hdGNoKFN0cmluZyB2YWx1ZSlcclxuIHtcclxuIHJldHVybiBNYXRjaChuZXcgUGF0dGVybkNvbnRleHQoKSwgdmFsdWUpO1xyXG4gfVxyXG5cclxuIC8vLyA8c3VtbWFyeT5cclxuIC8vLyBNYXRjaCB0aGUgdmFsdWUgYWdhaW5zdCBhbGwgcGF0dGVybnMgYW5kIHJldHVybiB0aGUgb25lcyB0aGF0IGZpdFxyXG4gLy8vIDwvc3VtbWFyeT5cclxuIC8vLyA8cGFyYW0gbmFtZT1cImNvbnRleHRcIj5UaGUgY3VycmVudCBjb250ZXh0IGZvciBtYXRjaGluZzwvcGFyYW0+XHJcbiAvLy8gPHBhcmFtIG5hbWU9XCJ2YWx1ZVwiPjwvcGFyYW0+XHJcbiAvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG4gcHVibGljIExpc3Q8T2JqZWN0PiBNYXRjaChQYXR0ZXJuQ29udGV4dCBjb250ZXh0LCBTdHJpbmcgdmFsdWUpXHJcbiB7XHJcbiBMaXN0PE9iamVjdD4gcmVzdWx0cyA9IG5ldyBMaXN0PE9iamVjdD4oKTtcclxuIGlmIChTdHJpbmcuSXNOdWxsT3JFbXB0eSh2YWx1ZSkpXHJcbiByZXR1cm4gcmVzdWx0cztcclxuXHJcbiBPYmplY3Qgc3RhdGUgPSBNYXRjaFN0YXJ0KGNvbnRleHQsIFwiXCIpO1xyXG4gZm9yIChpbnQgaSA9IDA7IGkgPCB2YWx1ZS5MZW5ndGg7IGkrKylcclxuIHtcclxuIGNoYXIgYyA9IHZhbHVlW2ldO1xyXG4gaWYgKCFNYXRjaE5leHQoc3RhdGUsIGMpKVxyXG4gcmV0dXJuIHJlc3VsdHM7XHJcbiB9XHJcblxyXG4gcmVzdWx0cyA9IE1hdGNoUmVzdWx0cyhzdGF0ZSk7XHJcbiAvLyByZXZlcnNlIHJlc3VsdHMgc2luY2UgdGhlIGxvbmdlc3QgbWF0Y2hlcyB3aWxsIGJlIGZvdW5kIGxhc3QgYnV0IGFyZSB0aGUgbW9zdCBzcGVjaWZpY1xyXG4gcmVzdWx0cy5SZXZlcnNlKCk7XHJcbiByZXR1cm4gcmVzdWx0cztcclxuIH1cclxuXHJcblxyXG4gLy8vIDxzdW1tYXJ5PlxyXG4gLy8vIEJlZ2luIGEgcGFyc2luZyBzZXNzaW9uXHJcbiAvLy8gPC9zdW1tYXJ5PlxyXG4gLy8vIDxwYXJhbSBuYW1lPVwiY29udGV4dFwiPjwvcGFyYW0+XHJcbiAvLy8gPHBhcmFtIG5hbWU9XCJtYXRjaFRhZ1wiPjwvcGFyYW0+XHJcbiAvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG4gcHVibGljIE9iamVjdCBNYXRjaFN0YXJ0KFBhdHRlcm5Db250ZXh0IGNvbnRleHQsIFN0cmluZyBtYXRjaFRhZylcclxuIHtcclxuIERpY3Rpb25hcnk8VG9rZW4sIFBhdHRlcm5QYXRoPiByb290cztcclxuICNpZiBTQ1JJUFRTSEFSUFxyXG4gaWYgKChyb290cyA9IERpY3Rpb25hcnlVdGlscy5UcnlHZXRQYXR0ZXJuUGF0aChjb21waWxlZFBhdHRlcm5zLCBtYXRjaFRhZykpID09IG51bGwpXHJcbiAjZWxzZVxyXG4gaWYgKCF0aGlzLmNvbXBpbGVkUGF0dGVybnMuVHJ5R2V0VmFsdWUobWF0Y2hUYWcsIG91dCByb290cykpXHJcbiAjZW5kaWZcclxuIHJldHVybiBudWxsO1xyXG5cclxuIE1hdGNoU3RhdGUgc3RhdGUgPSBuZXcgTWF0Y2hTdGF0ZSgpO1xyXG4gc3RhdGUuTWF0Y2hUYWcgPSBtYXRjaFRhZztcclxuIHN0YXRlLkNvbnRleHQgPSBjb250ZXh0ID8/IG5ldyBQYXR0ZXJuQ29udGV4dCgpO1xyXG5cclxuIFBhdHRlcm5QYXRoIHJvb3QgPSBuZXcgUGF0dGVyblBhdGgoKTtcclxuIHJvb3QuUGF0aHMgPSByb290cztcclxuIFBhdGhOb2RlIHN0YXJ0Tm9kZSA9IG5ldyBQYXRoTm9kZShudWxsLCByb290LCBcIlwiKTtcclxuIHN0YXRlLkNhbmRpZGF0ZVBhdGhzLkFkZChzdGFydE5vZGUpO1xyXG5cclxuIHJldHVybiBzdGF0ZTtcclxuIH1cclxuXHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gTWF0Y2ggdGhlIG5leHQgY2hhcmFjdGVyXHJcbiAvLy8gPC9zdW1tYXJ5PlxyXG4gLy8vIDxwYXJhbSBuYW1lPVwiY3VycmVudFN0YXRlXCI+VGhlIGN1cnJlbnQgbWF0Y2hpbmcgc3RhdGU8L3BhcmFtPlxyXG4gLy8vIDxwYXJhbSBuYW1lPVwiY1wiPlRoZSBuZXh0IGNoYXJhY3RlcjwvcGFyYW0+XHJcbiAvLy8gPHJldHVybnM+UmV0dXJucyB0cnVlIGlmIHRoaXMgaXMgc3RpbGwgYSB2YWxpZCBtYXRjaCwgZmFsc2Ugb3RoZXJ3aXNlPC9yZXR1cm5zPlxyXG4gcHVibGljIEJvb2xlYW4gTWF0Y2hOZXh0KE9iamVjdCBjdXJyZW50U3RhdGUsIENoYXIgYylcclxuIHtcclxuIE1hdGNoU3RhdGUgc3RhdGUgPSBjdXJyZW50U3RhdGUgYXMgIE1hdGNoU3RhdGU7XHJcbiBpZiAoc3RhdGUgPT0gbnVsbClcclxuIHJldHVybiBmYWxzZTtcclxuXHJcbiBMaXN0PFBhdGhOb2RlPiBjYW5kaWRhdGVQYXRocyA9IHN0YXRlLkNhbmRpZGF0ZVBhdGhzO1xyXG4gTGlzdDxQYXRoTm9kZT4gbmV3Q2FuZGlkYXRlcyA9IHN0YXRlLk5ld0NhbmRpZGF0ZXM7XHJcbiBmb3IgKEludDMyIGkgPSAwOyBpIDwgY2FuZGlkYXRlUGF0aHMuQ291bnQ7IGkrKylcclxuIHtcclxuIFBhdGhOb2RlIGNhbmRpZGF0ZSA9IGNhbmRpZGF0ZVBhdGhzW2ldO1xyXG5cclxuIC8vIGZpcnN0IGNoZWNrIGlmIGFueSBvZiB0aGUgY2hpbGQgbm9kZXMgdmFsaWRhdGUgd2l0aCB0aGUgbmV3IGNoYXJhY3RlciBhbmQgcmVtZW1iZXIgdGhlbSBhcyBjYW5kaWRhdGVzXHJcbiAvLyBhbnkgY2hpbGRyZW4gY2FuIG9ubHkgYmUgY2FuZGlkYXRlcyBpZiB0aGUgZmluYWwgdmFsaWRhdGlvbiBvZiB0aGUgY3VycmVudCB2YWx1ZSBzdWNjZWVkc1xyXG4gaWYgKGNhbmRpZGF0ZS5Ub2tlbiA9PSBudWxsIHx8IFZhbGlkYXRlVG9rZW4oc3RhdGUuQ29udGV4dCwgY2FuZGlkYXRlLCB0cnVlKSlcclxuIFZhbGlkYXRlQ2hpbGRyZW4oc3RhdGUuQ29udGV4dCwgY2FuZGlkYXRlLlBhdGguUGF0aHMsIGNhbmRpZGF0ZSwgYy5Ub1N0cmluZyhDdWx0dXJlSW5mby5JbnZhcmlhbnRDdWx0dXJlKSwgbmV3Q2FuZGlkYXRlcywgMCk7XHJcblxyXG4gLy8gdG9rZW4gY2FuIGJlIG51bGwgZm9yIHRoZSByb290IG5vZGUgYnV0IG5vIHZhbGlkYXRpb24gbmVlZHMgdG8gYmUgZG9uZSBmb3IgdGhhdFxyXG4gaWYgKGNhbmRpZGF0ZS5Ub2tlbiAhPSBudWxsKVxyXG4ge1xyXG4gLy8gdmFsaWRhdGUgdGhpcyBjYW5kaWRhdGUgYW5kIHJlbW92ZSBpdCBpZiBpdCBkb2Vzbid0IHZhbGlkYXRlIGFueW1vcmVcclxuIGNhbmRpZGF0ZS5Jc0ZpbmFsaXplZCA9IGZhbHNlO1xyXG4gY2FuZGlkYXRlLlRleHRWYWx1ZSArPSBjO1xyXG4gaWYgKFZhbGlkYXRlVG9rZW4oc3RhdGUuQ29udGV4dCwgY2FuZGlkYXRlLCBmYWxzZSkpXHJcbiBjb250aW51ZTtcclxuIH1cclxuIGNhbmRpZGF0ZVBhdGhzLlJlbW92ZUF0KGktLSk7XHJcbiB9XHJcbiBjYW5kaWRhdGVQYXRocy5BZGRSYW5nZShuZXdDYW5kaWRhdGVzKTtcclxuIG5ld0NhbmRpZGF0ZXMuQ2xlYXIoKTtcclxuXHJcbiByZXR1cm4gY2FuZGlkYXRlUGF0aHMuQ291bnQgPiAwO1xyXG4gfVxyXG5cclxuXHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gQXNzZW1ibGUgdGhlIHJlc3VsdHMgYWZ0ZXIgdGhlIGxhc3QgY2hhcmFjdGVyIGhhcyBiZWVuIG1hdGNoZWRcclxuIC8vLyA8L3N1bW1hcnk+XHJcbiAvLy8gPHBhcmFtIG5hbWU9XCJjdXJyZW50U3RhdGVcIj48L3BhcmFtPlxyXG4gLy8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuIHB1YmxpYyBCb29sZWFuIEhhc1Jlc3VsdHMoT2JqZWN0IGN1cnJlbnRTdGF0ZSlcclxuIHtcclxuIE1hdGNoU3RhdGUgc3RhdGUgPSBjdXJyZW50U3RhdGUgYXMgTWF0Y2hTdGF0ZTtcclxuIGlmIChzdGF0ZSA9PSBudWxsKVxyXG4gcmV0dXJuIGZhbHNlO1xyXG5cclxuIExpc3Q8UGF0aE5vZGU+IGNhbmRpZGF0ZVBhdGhzID0gc3RhdGUuQ2FuZGlkYXRlUGF0aHM7XHJcblxyXG4gaWYgKCF0aGlzLnBhdHRlcm5zLkNvbnRhaW5zS2V5KHN0YXRlLk1hdGNoVGFnKSlcclxuIHJldHVybiBmYWxzZTtcclxuXHJcbiAvLyBmZXRjaCBwYXR0ZXJucyBmb3IgYWxsIG1hdGNoaW5nIGNhbmRpZGF0ZXNcclxuIGZvcmVhY2ggKFBhdGhOb2RlIHBhdGggaW4gY2FuZGlkYXRlUGF0aHMpXHJcbiB7XHJcbiAvLyBkbyBmaW5hbCB2YWxpZGF0aW9uXHJcbiBpZiAoIVZhbGlkYXRlVG9rZW4oc3RhdGUuQ29udGV4dCwgcGF0aCwgdHJ1ZSkpXHJcbiBjb250aW51ZTtcclxuIEJvb2xlYW4gcmVzdWx0ID0gZmFsc2U7XHJcbiBNYXRjaFRvTGFzdChwYXRoLlBhdGgsIGRlbGVnYXRlIHsgcmVzdWx0ID0gdHJ1ZTsgfSwgMCk7XHJcbiByZXR1cm4gcmVzdWx0O1xyXG4gfVxyXG4gcmV0dXJuIGZhbHNlO1xyXG4gfVxyXG5cclxuXHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gQXNzZW1ibGUgdGhlIHJlc3VsdHMgYWZ0ZXIgdGhlIGxhc3QgY2hhcmFjdGVyIGhhcyBiZWVuIG1hdGNoZWRcclxuIC8vLyA8L3N1bW1hcnk+XHJcbiAvLy8gPHBhcmFtIG5hbWU9XCJjdXJyZW50U3RhdGVcIj48L3BhcmFtPlxyXG4gLy8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuIHB1YmxpYyBMaXN0PE9iamVjdD4gTWF0Y2hSZXN1bHRzKE9iamVjdCBjdXJyZW50U3RhdGUpXHJcbiB7XHJcbiBMaXN0PE9iamVjdD4gcmVzdWx0cyA9IG5ldyBMaXN0PE9iamVjdD4oKTtcclxuXHJcbiBNYXRjaFN0YXRlIHN0YXRlID0gY3VycmVudFN0YXRlIGFzIE1hdGNoU3RhdGU7XHJcbiBpZiAoc3RhdGUgPT0gbnVsbClcclxuIHJldHVybiByZXN1bHRzO1xyXG5cclxuIExpc3Q8UGF0aE5vZGU+IGNhbmRpZGF0ZVBhdGhzID0gc3RhdGUuQ2FuZGlkYXRlUGF0aHM7XHJcblxyXG4gLy8gZ2V0IHRoZSBwYXR0ZXJucyBmb3IgdGhpcyB0YWdcclxuIExpc3Q8UGF0dGVybj4gdGFyZ2V0UGF0dGVybnM7XHJcbiAjaWYgU0NSSVBUU0hBUlBcclxuIGlmICgodGFyZ2V0UGF0dGVybnMgPSBEaWN0aW9uYXJ5VXRpbHMuVHJ5R2V0UGF0dGVybnMocGF0dGVybnMsIHN0YXRlLk1hdGNoVGFnKSkgPT0gbnVsbClcclxuICNlbHNlXHJcbiBpZiAoIXRoaXMucGF0dGVybnMuVHJ5R2V0VmFsdWUoc3RhdGUuTWF0Y2hUYWcsIG91dCB0YXJnZXRQYXR0ZXJucykpXHJcbiAjZW5kaWZcclxuIHJldHVybiByZXN1bHRzO1xyXG5cclxuIC8vIGZldGNoIHBhdHRlcm5zIGZvciBhbGwgbWF0Y2hpbmcgY2FuZGlkYXRlc1xyXG4gZm9yZWFjaCAoUGF0aE5vZGUgcGF0aCBpbiBjYW5kaWRhdGVQYXRocylcclxuIHtcclxuIC8vIGRvIGZpbmFsIHZhbGlkYXRpb25cclxuIGlmICghVmFsaWRhdGVUb2tlbihzdGF0ZS5Db250ZXh0LCBwYXRoLCB0cnVlKSlcclxuIGNvbnRpbnVlO1xyXG4gRmluYWxpemVWYWx1ZShwYXRoKTtcclxuIExpc3Q8T2JqZWN0PiBwcmV2aW91c1ZhbHVlcyA9IG5ldyBMaXN0PE9iamVjdD4ocGF0aC5QcmV2aW91c1ZhbHVlcyk7XHJcbiBwcmV2aW91c1ZhbHVlcy5BZGQocGF0aC5WYWx1ZSk7XHJcbiBNYXRjaFRvTGFzdChwYXRoLlBhdGgsIGRlbGVnYXRlKFBhdHRlcm5QYXRoIG1hdGNoLCBJbnQzMiBkZXB0aClcclxuIHtcclxuIC8vIGFkZCBlbXB0eSB2YWx1ZXMgZm9yIHJlbWFpbmluZyB0b2tlbnNcclxuIE9iamVjdFtdIHZhbHVlcyA9IG5ldyBPYmplY3RbcHJldmlvdXNWYWx1ZXMuQ291bnQgKyBkZXB0aF07XHJcbiBmb3IgKEludDMyIGkgPSAwOyBpIDwgcHJldmlvdXNWYWx1ZXMuQ291bnQ7IGkrKylcclxuIHZhbHVlc1tpXSA9IHByZXZpb3VzVmFsdWVzW2ldO1xyXG4gZm9yIChJbnQzMiBtID0gMDsgbSA8IG1hdGNoLk1hdGNoZWRQYXR0ZXJucy5Db3VudDsgbSsrKVxyXG4ge1xyXG4gUGF0dGVybiBwYXR0ZXJuID0gdGFyZ2V0UGF0dGVybnNbbWF0Y2guTWF0Y2hlZFBhdHRlcm5zW21dXTtcclxuIE9iamVjdCByZXN1bHQgPSBwYXR0ZXJuLlBhcnNlKHN0YXRlLkNvbnRleHQsIHZhbHVlcyk7XHJcbiAvLyBvbmx5IGFkZCBpZiBpdCBpcyBub3QgaW4gdGhlIGxpc3QgeWV0XHJcbiBpZiAoIXJlc3VsdHMuQ29udGFpbnMocmVzdWx0KSlcclxuIHJlc3VsdHMuQWRkKHJlc3VsdCk7XHJcbiB9XHJcbiB9LCAwKTtcclxuIH1cclxuIHJldHVybiByZXN1bHRzO1xyXG4gfVxyXG5cclxuIHByaXZhdGUgdm9pZCBWYWxpZGF0ZUNoaWxkcmVuKFBhdHRlcm5Db250ZXh0IGNvbnRleHQsIElFbnVtZXJhYmxlPEtleVZhbHVlUGFpcjxUb2tlbiwgUGF0dGVyblBhdGg+PiBwYXRocywgUGF0aE5vZGUgbm9kZSwgU3RyaW5nIHZhbCwgTGlzdDxQYXRoTm9kZT4gbmV3Q2FuZGlkYXRlcywgSW50MzIgZGVwdGgpXHJcbiB7XHJcbiAvLyBmaXJzdCBjaGVjayBpZiBhbnkgb2YgdGhlIGNoaWxkIG5vZGVzIHZhbGlkYXRlIHdpdGggdGhlIG5ldyBjaGFyYWN0ZXIgYW5kIHJlbWVtYmVyIHRoZW0gYXMgY2FuZGlkYXRlc1xyXG4gZm9yZWFjaCAoS2V5VmFsdWVQYWlyPFRva2VuLCBQYXR0ZXJuUGF0aD4gY2hpbGRQYXRoIGluIHBhdGhzKVxyXG4ge1xyXG4gUGF0aE5vZGUgY2hpbGROb2RlID0gbmV3IFBhdGhOb2RlKGNoaWxkUGF0aC5LZXksIGNoaWxkUGF0aC5WYWx1ZSwgdmFsKTtcclxuIC8vIGlmIHplcm8gY291bnQgaXMgYWxsb3dlZCBpdCBkb2VzIG5vdCBtYXR0ZXIgd2hldGhlciB0aGUgY2hpbGQgdmFsaWRhdGVzIG9yIG5vdCwgd2UgYWx3YXlzIHRyeSBjaGlsZHJlbiBhcyB3ZWxsXHJcbiBpZiAoY2hpbGRQYXRoLktleS5NaW5Db3VudCA9PSAwKVxyXG4gVmFsaWRhdGVDaGlsZHJlbihjb250ZXh0LCBjaGlsZFBhdGguVmFsdWUuUGF0aHMsIG5vZGUsIHZhbCwgbmV3Q2FuZGlkYXRlcywgZGVwdGggKyAxKTtcclxuIGlmICghVmFsaWRhdGVUb2tlbihjb250ZXh0LCBjaGlsZE5vZGUsIGZhbHNlKSlcclxuIHtcclxuIC8vIHRva2VuIGRpZCBub3QgdmFsaWRhdGUgYnV0IDAgY291bnQgaXMgYWxsb3dlZFxyXG4gLy9pZiAoY2hpbGRQYXRoLktleS5NaW5Db3VudCA9PSAwKVxyXG4gLy9cdFZhbGlkYXRlQ2hpbGRyZW4oY2hpbGRQYXRoLlZhbHVlLlBhdGhzLCBub2RlLCB2YWwsIG5ld0NhbmRpZGF0ZXMsIGRlcHRoICsgMSk7XHJcbiBjb250aW51ZTtcclxuIH1cclxuXHJcbiAvLyB2YWxpZGF0ZWQgc3VjY2Vzc2Z1bGx5IHNvIGFkZCBhIG5ldyBjYW5kaWRhdGVcclxuIC8vIGFkZCBlbXB0eSB2YWx1ZXMgZm9yIGFsbCBza2lwcGVkIHRva2Vuc1xyXG4gY2hpbGROb2RlLlByZXZpb3VzVmFsdWVzLkFkZFJhbmdlKG5vZGUuUHJldmlvdXNWYWx1ZXMpO1xyXG4gaWYgKG5vZGUuVG9rZW4gIT0gbnVsbClcclxuIHtcclxuIEZpbmFsaXplVmFsdWUobm9kZSk7XHJcbiBjaGlsZE5vZGUuUHJldmlvdXNWYWx1ZXMuQWRkKG5vZGUuVmFsdWUpO1xyXG4gfVxyXG4gZm9yIChJbnQzMiBpID0gMDsgaSA8IGRlcHRoOyBpKyspXHJcbiBjaGlsZE5vZGUuUHJldmlvdXNWYWx1ZXMuQWRkKG51bGwpO1xyXG4gbmV3Q2FuZGlkYXRlcy5BZGQoY2hpbGROb2RlKTtcclxuIH1cclxuIH1cclxuXHJcbiBwcml2YXRlIHZvaWQgTWF0Y2hUb0xhc3QoUGF0dGVyblBhdGggcGF0aCwgQWN0aW9uPFBhdHRlcm5QYXRoLCBJbnQzMj4gYWRkLCBJbnQzMiBkZXB0aClcclxuIHtcclxuIGlmIChwYXRoLk1hdGNoZWRQYXR0ZXJucyAhPSBudWxsKVxyXG4gYWRkKHBhdGgsIGRlcHRoKTtcclxuIC8vIGNoZWNrIGNoaWxkcmVuIGlmIHRoZXkgYWxsb3cgMCBsZW5ndGggYXMgd2VsbFxyXG4gZm9yZWFjaCAoS2V5VmFsdWVQYWlyPFRva2VuLCBQYXR0ZXJuUGF0aD4gY2hpbGRQYXRoIGluIHBhdGguUGF0aHMpXHJcbiB7XHJcbiBpZiAoY2hpbGRQYXRoLktleS5NaW5Db3VudCA+IDApXHJcbiBjb250aW51ZTtcclxuIE1hdGNoVG9MYXN0KGNoaWxkUGF0aC5WYWx1ZSwgYWRkLCBkZXB0aCArIDEpO1xyXG4gfVxyXG5cclxuIH1cclxuXHJcblxyXG4gLy8vIDxzdW1tYXJ5PlxyXG4gLy8vIFJlZ2lzdGVyIGEgdmFsaWRhdGlvbiBvYmplY3QgZm9yIHRoZSB0YWdcclxuIC8vLyA8L3N1bW1hcnk+XHJcbiAvLy8gPHBhcmFtIG5hbWU9XCJ0YWdcIj48L3BhcmFtPlxyXG4gLy8vIDxwYXJhbSBuYW1lPVwidmFsaWRhdG9yXCI+PC9wYXJhbT5cclxuIHB1YmxpYyB2b2lkIFJlZ2lzdGVyVmFsaWRhdG9yKFN0cmluZyB0YWcsIElUb2tlblZhbGlkYXRvciB2YWxpZGF0b3IpXHJcbiB7XHJcbiB0aGlzLnZhbGlkYXRvcnNbdGFnXSA9IHZhbGlkYXRvcjtcclxuIH1cclxuXHJcblxyXG5cclxuIHByaXZhdGUgQm9vbGVhbiBWYWxpZGF0ZUNvdW50KFRva2VuIHRva2VuLCBTdHJpbmcgdmFsdWUsIEJvb2xlYW4gaXNGaW5hbClcclxuIHtcclxuIHJldHVybiAoIWlzRmluYWwgfHwgdmFsdWUuTGVuZ3RoID49IHRva2VuLk1pbkNvdW50KSAmJiB2YWx1ZS5MZW5ndGggPD0gdG9rZW4uTWF4Q291bnQ7XHJcbiB9XHJcblxyXG4gLy8vIDxzdW1tYXJ5PlxyXG4gLy8vIEFkZCB0aGUgbmV4dCBjaGFyYWN0ZXIgdG8gdGhlIG1hdGNoZWQgcGF0aFxyXG4gLy8vIDwvc3VtbWFyeT5cclxuIC8vLyA8cGFyYW0gbmFtZT1cImNvbnRleHRcIj5UaGUgY3VycmVudCBtYXRjaGluZyBjb250ZXh0PC9wYXJhbT5cclxuIC8vLyA8cGFyYW0gbmFtZT1cIm5vZGVcIj5UaGUgbm9kZSB3ZSBhcmUgdmFsaWRhdGluZzwvcGFyYW0+XHJcbiAvLy8gPHBhcmFtIG5hbWU9XCJpc0ZpbmFsXCI+VHJ1ZSBpZiB0aGlzIGlzIHRoZSBmaW5hbCBtYXRjaCBhbmQgbm8gZnVydGhlciB2YWx1ZXMgd2lsbCBiZSBhZGRlZDwvcGFyYW0+XHJcbiAvLy8gPHJldHVybnM+UmV0dXJucyB0cnVlIGlmIHRoZSB2YWx1ZSBjYW4gYmUgcGFyc2VkIHN1Y2Nlc3NmdWxseSB1c2luZyB0aGUgdG9rZW48L3JldHVybnM+XHJcbiBwcml2YXRlIEJvb2xlYW4gVmFsaWRhdGVUb2tlbihQYXR0ZXJuQ29udGV4dCBjb250ZXh0LCBQYXRoTm9kZSBub2RlLCBCb29sZWFuIGlzRmluYWwpXHJcbiB7XHJcbiAvLyBpZiBpdCBpcyBmaW5hbHplZCB0aGVuIGl0IGlzIGRlZmluaXRlbHkgYWxzbyB2YWxpZFxyXG4gaWYgKG5vZGUuSXNGaW5hbGl6ZWQpXHJcbiByZXR1cm4gdHJ1ZTtcclxuXHJcbiBUb2tlbiB0b2tlbiA9IG5vZGUuVG9rZW47XHJcbiBTdHJpbmcgdGV4dFZhbHVlID0gbm9kZS5UZXh0VmFsdWU7XHJcblxyXG4gLy8gbWF0Y2ggZXhhY3QgdmFsdWVzIGZpcnN0XHJcbiBpZiAoU3RyaW5nLklzTnVsbE9yRW1wdHkodGV4dFZhbHVlKSlcclxuIHJldHVybiBmYWxzZTtcclxuIGlmICh0b2tlbi5FeGFjdE1hdGNoKVxyXG4gcmV0dXJuICgoaXNGaW5hbCAmJiB0b2tlbi5WYWx1ZSA9PSB0ZXh0VmFsdWUpIHx8ICghaXNGaW5hbCAmJiB0b2tlbi5WYWx1ZS5TdGFydHNXaXRoKHRleHRWYWx1ZSkpKTtcclxuXHJcbiAvLyB0ZXN0IGluYnVpbHQgdG9rZW5zIGZpcnN0XHJcbiBzd2l0Y2ggKHRva2VuLlZhbHVlKVxyXG4ge1xyXG4gLy8gd2hpdGVzcGFjZVxyXG4gY2FzZSBcIiBcIjpcclxuIHJldHVybiBWYWxpZGF0ZUNvdW50KHRva2VuLCB0ZXh0VmFsdWUsIGlzRmluYWwpICYmIFN0cmluZ1V0aWxzLk1hdGNoQWxsKHRleHRWYWx1ZSwgXCIgXFx0XCIpO1xyXG4gY2FzZSBcIm5ld2xpbmVcIjpcclxuIHJldHVybiBWYWxpZGF0ZUNvdW50KHRva2VuLCB0ZXh0VmFsdWUsIGlzRmluYWwpICYmIFN0cmluZ1V0aWxzLk1hdGNoQWxsKHRleHRWYWx1ZSwgXCJcXHJcXG5cIik7XHJcbiBjYXNlIFwiZW1wdHlsaW5lXCI6XHJcbiByZXR1cm4gVmFsaWRhdGVDb3VudCh0b2tlbiwgdGV4dFZhbHVlLCBpc0ZpbmFsKSAmJiBTdHJpbmdVdGlscy5NYXRjaEFsbCh0ZXh0VmFsdWUsIFwiXFxyXFxuIFxcdFwiKTtcclxuIGNhc2UgXCJsZXR0ZXJcIjpcclxuIHJldHVybiBWYWxpZGF0ZUNvdW50KHRva2VuLCB0ZXh0VmFsdWUsIGlzRmluYWwpICYmIFN0cmluZ1V0aWxzLk1hdGNoQWxsKHRleHRWYWx1ZSwgTGV0dGVyQ2hhcmFjdGVycyk7XHJcbiBjYXNlIFwiYW55XCI6XHJcbiByZXR1cm4gVmFsaWRhdGVDb3VudCh0b2tlbiwgdGV4dFZhbHVlLCBpc0ZpbmFsKTtcclxuIH1cclxuXHJcbiAvLyBjaGVjayBwYXR0ZXJuIHRhZ3MgYW5kIGRvIGEgc3ViIG1hdGNoIGZvciBlYWNoIG9mIHRoZW1cclxuIGlmICh0aGlzLmNvbXBpbGVkUGF0dGVybnMuQ29udGFpbnNLZXkodG9rZW4uVmFsdWUpKVxyXG4ge1xyXG4gLy8gc3ViIG1hdGNoaW5nIGlzIHBvc3NpYmxlLCBzbyBzdGFydCBhIG5ldyBvbmUgb3IgY29udGludWUgdGhlIHByZXZpb3VzIG9uZVxyXG4gaWYgKG5vZGUuTWF0Y2hTdGF0ZSA9PSBudWxsKVxyXG4gbm9kZS5NYXRjaFN0YXRlID0gTWF0Y2hTdGFydChjb250ZXh0LCB0b2tlbi5WYWx1ZSk7XHJcbiAvLyBpZiB0aGlzIGlzIHRoZSBsYXN0IG1hdGNoIHRoZW4gYXNzZW1ibGUgdGhlIHJlc3VsdHNcclxuIGlmIChpc0ZpbmFsKVxyXG4gcmV0dXJuIEhhc1Jlc3VsdHMobm9kZS5NYXRjaFN0YXRlKTtcclxuIHJldHVybiBNYXRjaE5leHQobm9kZS5NYXRjaFN0YXRlLCB0ZXh0VmFsdWVbdGV4dFZhbHVlLkxlbmd0aCAtIDFdKTtcclxuIH1cclxuXHJcbiAvLyBjaGVjayBpZiBhIHZhbGlkYXRvciBpcyByZWdpc3RlcmVkIGZvciB0aGlzIHRva2VuXHJcbiBJVG9rZW5WYWxpZGF0b3IgdmFsaWRhdG9yO1xyXG4gI2lmIFNDUklQVFNIQVJQXHJcbiBpZiAoKHZhbGlkYXRvciA9IERpY3Rpb25hcnlVdGlscy5UcnlHZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRva2VuLlZhbHVlKSkgPT0gbnVsbClcclxuICNlbHNlXHJcbiBpZiAoIXRoaXMudmFsaWRhdG9ycy5UcnlHZXRWYWx1ZSh0b2tlbi5WYWx1ZSwgb3V0IHZhbGlkYXRvcikpXHJcbiAjZW5kaWZcclxuIHJldHVybiBmYWxzZTtcclxuXHJcbiByZXR1cm4gdmFsaWRhdG9yLlZhbGlkYXRlVG9rZW4odG9rZW4sIHRleHRWYWx1ZSwgaXNGaW5hbCk7XHJcbiB9XHJcblxyXG5cclxuIC8vLyA8c3VtbWFyeT5cclxuIC8vLyBQYXJzZXMgdGhlIFRleHRWYWx1ZSBvZiB0aGUgbm9kZSBpbnRvIHRoZSBmaW5hbCB2YWx1ZVxyXG4gLy8vIDwvc3VtbWFyeT5cclxuIC8vLyA8cGFyYW0gbmFtZT1cIm5vZGVcIj48L3BhcmFtPlxyXG4gLy8vIDxyZXR1cm5zPlJldHVybnMgdHJ1ZSBpZiBzdWNjZXNzZnVsLCBmYWxzZSBpZiB0aGUgVGV4dFZhbHVlIGlzIG5vdCB2YWxpZDwvcmV0dXJucz5cclxuIHByaXZhdGUgdm9pZCBGaW5hbGl6ZVZhbHVlKFBhdGhOb2RlIG5vZGUpXHJcbiB7XHJcbiAvLyBhbHJlYWR5IGZpbmFsaXplZFxyXG4gaWYgKG5vZGUuSXNGaW5hbGl6ZWQpXHJcbiByZXR1cm47XHJcblxyXG4gVG9rZW4gdG9rZW4gPSBub2RlLlRva2VuO1xyXG4gU3RyaW5nIHRleHRWYWx1ZSA9IG5vZGUuVGV4dFZhbHVlO1xyXG5cclxuIGlmICh0b2tlbi5FeGFjdE1hdGNoIHx8IHRva2VuLlZhbHVlID09IFwiIFwiIHx8IHRva2VuLlZhbHVlID09IFwibmV3bGluZVwiIHx8IHRva2VuLlZhbHVlID09IFwiZW1wdHlsaW5lXCIgfHwgdG9rZW4uVmFsdWUgPT0gXCJsZXR0ZXJcIilcclxuIHtcclxuIG5vZGUuVmFsdWUgPSB0ZXh0VmFsdWU7XHJcbiBub2RlLklzRmluYWxpemVkID0gdHJ1ZTtcclxuIHJldHVybjtcclxuIH1cclxuXHJcbiAvLyBjaGVjayBwYXR0ZXJuIHRhZ3MgYW5kIGRvIGEgc3ViIG1hdGNoIGZvciBlYWNoIG9mIHRoZW1cclxuIGlmICh0aGlzLmNvbXBpbGVkUGF0dGVybnMuQ29udGFpbnNLZXkodG9rZW4uVmFsdWUpICYmIG5vZGUuTWF0Y2hTdGF0ZSAhPSBudWxsKVxyXG4ge1xyXG4gbm9kZS5WYWx1ZSA9IG51bGw7XHJcbiBMaXN0PE9iamVjdD4gcmVzdWx0cyA9IE1hdGNoUmVzdWx0cyhub2RlLk1hdGNoU3RhdGUpO1xyXG4gaWYgKHJlc3VsdHMuQ291bnQgPT0gMClcclxuIHJldHVybjtcclxuIC8vIFRPRE86IGNhbiBiZSBtdWx0aXBsZSByZXN1bHRzLCBjaG9vc2UgdGhlIGNvcnJlY3Qgb25lIGRlcGVuZGluZyBvbiB1c2VyIGN1bHR1cmVcclxuIG5vZGUuVmFsdWUgPSByZXN1bHRzWzBdO1xyXG4gbm9kZS5Jc0ZpbmFsaXplZCA9IHRydWU7XHJcbiByZXR1cm47XHJcbiB9XHJcblxyXG4gLy8gY2hlY2sgaWYgYSB2YWxpZGF0b3IgaXMgcmVnaXN0ZXJlZCBmb3IgdGhpcyB0b2tlblxyXG4gSVRva2VuVmFsaWRhdG9yIHZhbGlkYXRvcjtcclxuICNpZiBTQ1JJUFRTSEFSUFxyXG4gaWYgKCh2YWxpZGF0b3IgPSBEaWN0aW9uYXJ5VXRpbHMuVHJ5R2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzLCB0b2tlbi5WYWx1ZSkpICE9IG51bGwpXHJcbiAjZWxzZVxyXG4gaWYgKHRoaXMudmFsaWRhdG9ycy5UcnlHZXRWYWx1ZSh0b2tlbi5WYWx1ZSwgb3V0IHZhbGlkYXRvcikpXHJcbiAjZW5kaWZcclxuIHtcclxuIG5vZGUuVmFsdWUgPSB2YWxpZGF0b3IuRmluYWxpemVWYWx1ZSh0b2tlbiwgdGV4dFZhbHVlKTtcclxuIG5vZGUuSXNGaW5hbGl6ZWQgPSB0cnVlO1xyXG4gfVxyXG4gfVxyXG4gfVxyXG4gKi9cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovX01lZGlhL3Byb2plY3RzL2RhdGFwYXJzZXIvc3JjL1BhdHRlcm5NYXRjaGVyLmpzXG4gKiovIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgSmVucyBvbiAyNi4wNi4yMDE1LlxyXG4gKiBQcm92aWRlcyB1dGlsaXRpZXMgZm9yIGFycmF5cyBzdWNoIGFzIGNoZWNraW5nIHdoZXRoZXIgYW4gb2JqZWN0IHN1cHBvcnRpbmcgdGhlIEVxdWFscyBpbnRlcmZhY2UgaXMgY29udGFpbmVkXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGFycmF5VXRpbHMgPSB7XHJcblx0LyoqXHJcblx0ICogQ2hlY2tzIHdoZXRoZXIgdGhlIGFycmF5IGNvbnRhaW5zIG9iaiB1c2luZyBhIGN1c3RvbSBjb21wYXJlciBpZiBhdmFpbGFibGVcclxuXHQgKiBAcGFyYW0gYXIge3tlcXVhbHM6IGZ1bmN0aW9ufVtdfVxyXG5cdCAqIEBwYXJhbSBvYmoge3tlcXVhbHM6IGZ1bmN0aW9ufX1cclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRjb250YWluczogZnVuY3Rpb24oYXIsIG9iaikge1xyXG5cdFx0aWYgKCFhcilcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0Ly8gY2hlY2sgc3RyaWN0IGVxdWFsaXR5IGZpcnN0LCBzaG91bGQgYmUgZmFzdGVzdFxyXG5cdFx0aWYgKGFyLmluZGV4T2Yob2JqKSAhPT0gLTEpXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cclxuXHRcdHZhciBoYXNFcXVhbHMgPSAoISFvYmogJiYgdHlwZW9mIG9iai5lcXVhbHMgPT09ICdmdW5jdGlvbicpO1xyXG5cclxuXHRcdC8vIGNoZWNrIGFsbCBlbGVtZW50c1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgb3RoZXIgPSBhcltpXTtcclxuXHRcdFx0dmFyIHJlc3VsdDtcclxuXHRcdFx0aWYgKGhhc0VxdWFscylcclxuXHRcdFx0XHRyZXN1bHQgPSBvYmouZXF1YWxzKG90aGVyKTtcclxuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIG90aGVyLmVxdWFscyA9PT0gJ2Z1bmN0aW9uJylcclxuXHRcdFx0XHRyZXN1bHQgPSBvdGhlci5lcXVhbHMob2JqKTtcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJlc3VsdCA9IChvYmogPT09IG90aGVyKTtcclxuXHRcdFx0aWYgKHJlc3VsdClcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5VXRpbHM7XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L19NZWRpYS9wcm9qZWN0cy9kYXRhcGFyc2VyL3NyYy91dGlscy9hcnJheVV0aWxzLmpzXG4gKiovIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgSmVucyBvbiAyNi4wNi4yMDE1LlxyXG4gKiBQcm92aWRlcyB1dGlsaXRpZXMgZm9yIHN0cmluZ3NcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgc3RyaW5nVXRpbHMgPSB7XHJcblx0LyoqXHJcblx0ICogQ2hlY2tzIHdoZXRoZXIgc3RyIHN0YXJ0cyB3aXRoIHZhbFxyXG5cdCAqIEBwYXJhbSBzdHIge3N0cmluZ31cclxuXHQgKiBAcGFyYW0gdmFsIHtzdHJpbmd9XHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0c3RhcnRzV2l0aDogZnVuY3Rpb24oc3RyLCB2YWwpIHtcclxuXHRcdHJldHVybiAhIXN0ciAmJiAhIXZhbCAmJiAoc3RyLmxlbmd0aCA+IHZhbC5sZW5ndGgpICYmICAoc3RyLmluZGV4T2YodmFsKSA9PT0gMCk7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogTWF0Y2ggYWxsIGNoYXJhY3RlcnMgaW4gdGhlIHN0cmluZyBhZ2FpbnN0IGFsbCBjaGFyYWN0ZXJzIGluIHRoZSBnaXZlbiBhcnJheSBvciBzdHJpbmdcclxuXHQgKiBAcGFyYW0gc3RyIHtzdHJpbmd9IC0gVGhlIHN0cmluZyB0byB0ZXN0XHJcblx0ICogQHBhcmFtIGNoYXJzIHtzdHJpbmd8c3RyaW5nW119IC0gVGhlIGNoYXJhY3RlcnMgdG8gdGVzdCBmb3JcclxuXHQgKiBAcGFyYW0gc3RhcnRJbmRleCB7bnVtYmVyPX0gLSBJbmRleCBvZiB0aGUgZmlyc3QgY2hhcmFjdGVyIHRvIHRlc3RcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGFsbCBjaGFyYWN0ZXJzIGluIHRoZSBzdHJpbmcgYXJlIGNvbnRhaW5lZCBpbiBjaGFyc1xyXG5cdCAqL1xyXG5cdG1hdGNoQWxsOiBmdW5jdGlvbihzdHIsIGNoYXJzLCBzdGFydEluZGV4KSB7XHJcblx0XHRpZiAoIXN0ciB8fCAhY2hhcnMpXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdGZvciAodmFyIGkgPSBzdGFydEluZGV4IHx8IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGMgPSBzdHIuY2hhckF0KGkpO1xyXG5cdFx0XHRpZiAoY2hhcnMuaW5kZXhPZihjKSA9PT0gLTEpXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3RyaW5nVXRpbHM7XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L19NZWRpYS9wcm9qZWN0cy9kYXRhcGFyc2VyL3NyYy91dGlscy9zdHJpbmdVdGlscy5qc1xuICoqLyIsIi8qKlxyXG4gKiBUb2tlbiB2YWx1ZSBmb3IgcGFyc2VkIHBhdHRlcm5zXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgVG9rZW5cclxuICogQHBhcmFtIHZhbHVlIHtzdHJpbmd9XHJcbiAqIEBwYXJhbSBleGFjdE1hdGNoIHtib29sZWFufVxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbnZhciBUb2tlbiA9IGZ1bmN0aW9uKHZhbHVlLCBleGFjdE1hdGNoKSB7XHJcblx0dGhpcy5leGFjdE1hdGNoID0gISFleGFjdE1hdGNoO1xyXG5cdGlmICh0aGlzLmV4YWN0TWF0Y2gpXHJcblx0e1xyXG5cdFx0dGhpcy52YWx1ZSA9IHZhbHVlO1xyXG5cdFx0dGhpcy5taW5Db3VudCA9IHRoaXMubWF4Q291bnQgPSAxO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0dmFyIHBhcnRzID0gKHZhbHVlIHx8ICcnKS5zcGxpdCgnOicpO1xyXG5cdHRoaXMudmFsdWUgPSAocGFydHMubGVuZ3RoID4gMCA/IHBhcnRzWzBdIDogJycpO1xyXG5cdGlmIChwYXJ0cy5sZW5ndGggPT09IDEpXHJcblx0XHR0aGlzLm1pbkNvdW50ID0gdGhpcy5tYXhDb3VudCA9IDE7XHJcblx0ZWxzZSBpZiAocGFydHMubGVuZ3RoID4gMSlcclxuXHR7XHJcblx0XHRzd2l0Y2ggKHBhcnRzWzFdKVxyXG5cdFx0e1xyXG5cdFx0XHRjYXNlICcnOlxyXG5cdFx0XHRcdHRoaXMubWluQ291bnQgPSAxO1xyXG5cdFx0XHRcdHRoaXMubWF4Q291bnQgPSAxO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICcrJzpcclxuXHRcdFx0XHR0aGlzLm1pbkNvdW50ID0gMTtcclxuXHRcdFx0XHR0aGlzLm1heENvdW50ID0gdGhpcy5NQVhfVkFMVUU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJyonOlxyXG5cdFx0XHRcdHRoaXMubWluQ291bnQgPSAwO1xyXG5cdFx0XHRcdHRoaXMubWF4Q291bnQgPSB0aGlzLk1BWF9WQUxVRTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnPyc6XHJcblx0XHRcdFx0dGhpcy5taW5Db3VudCA9IDA7XHJcblx0XHRcdFx0dGhpcy5tYXhDb3VudCA9IDE7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dmFyIGNvdW50UGFydHMgPSBwYXJ0c1sxXS5zcGxpdCgnLScpO1xyXG5cdFx0XHRcdGlmIChjb3VudFBhcnRzLmxlbmd0aCA9PT0gMSlcclxuXHRcdFx0XHRcdHRoaXMubWluQ291bnQgPSB0aGlzLm1heENvdW50ID0gcGFyc2VJbnQoY291bnRQYXJ0c1swXSk7XHJcblx0XHRcdFx0ZWxzZSBpZiAoY291bnRQYXJ0cy5sZW5ndGggPj0gMilcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR0aGlzLm1pbkNvdW50ID0gcGFyc2VJbnQoY291bnRQYXJ0c1swXSB8fCAnMCcpO1xyXG5cdFx0XHRcdFx0dGhpcy5tYXhDb3VudCA9IHBhcnNlSW50KGNvdW50UGFydHNbMV0gfHwgJzAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8vIGRvbid0IGFsbG93IG1heCB0byBiZSBzbWFsbGVyIHRoYW4gbWluXHJcblx0aWYgKHRoaXMubWF4Q291bnQgPCB0aGlzLm1pbkNvdW50KVxyXG5cdFx0dGhpcy5tYXhDb3VudCA9IHRoaXMubWluQ291bnQ7XHJcbn07XHJcbi8qKlxyXG4gKiBNYXhpbXVtIHRpbWVzIHRoYXQgYSB0b2tlbiB3aXRob3V0IHJlc3RyaWN0aW9uIGNhbiBiZSByZXBlYXRlZFxyXG4gKiBAY29uc3RcclxuICovXHJcblRva2VuLnByb3RvdHlwZS5NQVhfVkFMVUUgPSAxMDAwO1xyXG5cclxuVG9rZW4ucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHRva2VuKSB7XHJcblx0aWYgKCF0b2tlbikgcmV0dXJuIGZhbHNlO1xyXG5cdHJldHVybiB0b2tlbi52YWx1ZSA9PT0gdGhpcy52YWx1ZSAmJlxyXG5cdFx0XHR0b2tlbi5taW5Db3VudCA9PT0gdGhpcy5taW5Db3VudCAmJlxyXG5cdFx0XHR0b2tlbi5tYXhDb3VudCA9PT0gdGhpcy5tYXhDb3VudCAmJlxyXG5cdFx0XHR0b2tlbi5leGFjdE1hdGNoID09PSB0aGlzLmV4YWN0TWF0Y2g7XHJcbn07XHJcblRva2VuLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG5cdGlmICh0aGlzLmV4YWN0TWF0Y2gpXHJcblx0XHRyZXR1cm4gdGhpcy52YWx1ZTtcclxuXHRyZXR1cm4gdGhpcy52YWx1ZSArICc6JyArIHRoaXMubWluQ291bnQgKyAnLScgKyB0aGlzLm1heENvdW50O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUb2tlbjtcclxuXHJcbi8qXHJcblx0cHVibGljIGNsYXNzIFRva2VuXHJcblx0e1xyXG5cdFx0cHVibGljIFN0cmluZyBWYWx1ZTtcclxuXHRcdHB1YmxpYyBJbnQzMiBNaW5Db3VudDtcclxuXHRcdHB1YmxpYyBJbnQzMiBNYXhDb3VudDtcclxuXHRcdHB1YmxpYyBCb29sZWFuIEV4YWN0TWF0Y2g7XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFBhcnNlIHRoZSB0b2tlblxyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdC8vLyA8cGFyYW0gbmFtZT1cInZhbHVlXCI+PC9wYXJhbT5cclxuXHRcdC8vLyA8cGFyYW0gbmFtZT1cImV4YWN0TWF0Y2hcIj48L3BhcmFtPlxyXG5cdFx0cHVibGljIFRva2VuKFN0cmluZyB2YWx1ZSwgQm9vbGVhbiBleGFjdE1hdGNoKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoZXhhY3RNYXRjaClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRoaXMuVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHR0aGlzLk1pbkNvdW50ID0gdGhpcy5NYXhDb3VudCA9IDE7XHJcblx0XHRcdFx0dGhpcy5FeGFjdE1hdGNoID0gdHJ1ZTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcbiNpZiAhU0NSSVBUU0hBUlBcclxuXHRcdFx0U3RyaW5nW10gcGFydHMgPSB2YWx1ZS5TcGxpdChuZXcgQ2hhcltdIHsgJzonIH0sIFN0cmluZ1NwbGl0T3B0aW9ucy5SZW1vdmVFbXB0eUVudHJpZXMpO1xyXG4jZWxzZVxyXG5cdFx0XHRTdHJpbmdbXSBwYXJ0cyA9IFN0cmluZ1V0aWxzLlNwbGl0KHZhbHVlLCAnOicpO1xyXG4jZW5kaWZcclxuXHRcdFx0dGhpcy5WYWx1ZSA9IHBhcnRzWzBdO1xyXG5cdFx0XHRpZiAocGFydHMuTGVuZ3RoID09IDEpXHJcblx0XHRcdFx0dGhpcy5NaW5Db3VudCA9IHRoaXMuTWF4Q291bnQgPSAxO1xyXG5cdFx0XHRlbHNlIGlmIChwYXJ0cy5MZW5ndGggPiAxKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c3dpdGNoIChwYXJ0c1sxXSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRjYXNlIFwiXCI6XHJcblx0XHRcdFx0XHRcdHRoaXMuTWluQ291bnQgPSAxO1xyXG5cdFx0XHRcdFx0XHR0aGlzLk1heENvdW50ID0gMTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIFwiK1wiOlxyXG5cdFx0XHRcdFx0XHR0aGlzLk1pbkNvdW50ID0gMTtcclxuXHRcdFx0XHRcdFx0dGhpcy5NYXhDb3VudCA9IEludDMyLk1heFZhbHVlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgXCIqXCI6XHJcblx0XHRcdFx0XHRcdHRoaXMuTWluQ291bnQgPSAwO1xyXG5cdFx0XHRcdFx0XHR0aGlzLk1heENvdW50ID0gSW50MzIuTWF4VmFsdWU7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSBcIj9cIjpcclxuXHRcdFx0XHRcdFx0dGhpcy5NaW5Db3VudCA9IDA7XHJcblx0XHRcdFx0XHRcdHRoaXMuTWF4Q291bnQgPSAxO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdFN0cmluZ1tdIGNvdW50UGFydHMgPSBwYXJ0c1sxXS5TcGxpdCgnLScpO1xyXG5cdFx0XHRcdFx0XHRpZiAoY291bnRQYXJ0cy5MZW5ndGggPT0gMSlcclxuXHRcdFx0XHRcdFx0XHR0aGlzLk1pbkNvdW50ID0gdGhpcy5NYXhDb3VudCA9IEludDMyLlBhcnNlKGNvdW50UGFydHNbMF0pO1xyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIChjb3VudFBhcnRzLkxlbmd0aCA9PSAyKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5NaW5Db3VudCA9IEludDMyLlBhcnNlKGNvdW50UGFydHNbMF0pO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuTWF4Q291bnQgPSBJbnQzMi5QYXJzZShjb3VudFBhcnRzWzFdKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcbiNpZiAhU0NSSVBUU0hBUlBcclxuXHRcdHB1YmxpYyBvdmVycmlkZSBCb29sZWFuIEVxdWFscyhvYmplY3Qgb2JqKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoUmVmZXJlbmNlRXF1YWxzKG51bGwsIG9iaikpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0aWYgKFJlZmVyZW5jZUVxdWFscyh0aGlzLCBvYmopKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0aWYgKG9iai5HZXRUeXBlKCkgIT0gR2V0VHlwZSgpKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdHJldHVybiBFcXVhbHMoKFRva2VuKW9iaik7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJvdGVjdGVkIGJvb2wgRXF1YWxzKFRva2VuIG90aGVyKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gc3RyaW5nLkVxdWFscyh0aGlzLlZhbHVlLCBvdGhlci5WYWx1ZSkgJiYgdGhpcy5NaW5Db3VudCA9PSBvdGhlci5NaW5Db3VudCAmJiB0aGlzLk1heENvdW50ID09IG90aGVyLk1heENvdW50ICYmIHRoaXMuRXhhY3RNYXRjaC5FcXVhbHMob3RoZXIuRXhhY3RNYXRjaCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG92ZXJyaWRlIGludCBHZXRIYXNoQ29kZSgpXHJcblx0XHR7XHJcblx0XHRcdHVuY2hlY2tlZFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aW50IGhhc2hDb2RlID0gKHRoaXMuVmFsdWUgIT0gbnVsbCA/IHRoaXMuVmFsdWUuR2V0SGFzaENvZGUoKSA6IDApO1xyXG5cdFx0XHRcdGhhc2hDb2RlID0gKGhhc2hDb2RlICogMzk3KSBeIHRoaXMuTWluQ291bnQ7XHJcblx0XHRcdFx0aGFzaENvZGUgPSAoaGFzaENvZGUgKiAzOTcpIF4gdGhpcy5NYXhDb3VudDtcclxuXHRcdFx0XHRoYXNoQ29kZSA9IChoYXNoQ29kZSAqIDM5NykgXiB0aGlzLkV4YWN0TWF0Y2guR2V0SGFzaENvZGUoKTtcclxuXHRcdFx0XHRyZXR1cm4gaGFzaENvZGU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgU3RyaW5nIFRvU3RyaW5nKClcclxuXHRcdHtcclxuXHRcdFx0aWYgKHRoaXMuRXhhY3RNYXRjaClcclxuXHRcdFx0XHRyZXR1cm4gU3RyaW5nLkZvcm1hdChcInswfVwiLCB0aGlzLlZhbHVlKTtcclxuXHRcdFx0cmV0dXJuIFN0cmluZy5Gb3JtYXQoXCJ7MH06ezF9LXsyfVwiLCB0aGlzLlZhbHVlLCB0aGlzLk1pbkNvdW50LCB0aGlzLk1heENvdW50KTtcclxuXHRcdH1cclxuI2VuZGlmXHJcblx0fVxyXG4qL1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9fTWVkaWEvcHJvamVjdHMvZGF0YXBhcnNlci9zcmMvbWF0Y2hpbmcvVG9rZW4uanNcbiAqKi8iLCIvKipcclxuICogS2VlcHMgdHJlZSBpbmZvcm1hdGlvbiBmb3IgcGF0dGVybnNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbmV3IHBhdGNoXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxudmFyIFBhdHRlcm5QYXRoID0gZnVuY3Rpb24oKSB7XHJcblx0Ly8gUGF0aHMgZm9yIGFsbCB0b2tlbnNcclxuXHR0aGlzLnBhdGhzID0ge307XHJcblx0Ly8gQW55IHBhdHRlcm5zIGZpbmlzaGluZyBhdCB0aGlzIHBhdGhcclxuXHR0aGlzLm1hdGNoZWRQYXR0ZXJucyA9IFtdO1xyXG5cclxufTtcclxuUGF0dGVyblBhdGgucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIG1hdGNoZXMgPSAodGhpcy5tYXRjaGVkUGF0dGVybnMgfHwgW10pLmpvaW4oJywgJyk7XHJcblx0dmFyIGNoaWxkcmVuID0gKHRoaXMucGF0aHMubWFwKGZ1bmN0aW9uKHRva2VuKSB7XHJcblx0XHRyZXR1cm4gdG9rZW4udG9TdHJpbmcoKTtcclxuXHR9KSkuam9pbignLCAnKTtcclxuXHRyZXR1cm4gbWF0Y2hlcyArICcgOjogJyArIGNoaWxkcmVuO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuUGF0aDtcclxuXHJcbi8qXHJcblx0aW50ZXJuYWwgY2xhc3MgUGF0dGVyblBhdGhcclxuXHR7XHJcbiNpZiAhU0NSSVBUU0hBUlBcclxuXHRcdHB1YmxpYyBvdmVycmlkZSBTdHJpbmcgVG9TdHJpbmcoKVxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgbWF0Y2hlcyA9IFN0cmluZy5Kb2luKFwiLCBcIiwgdGhpcy5NYXRjaGVkUGF0dGVybnMgPz8gbmV3IExpc3Q8SW50MzI+KDApKTtcclxuXHRcdFx0dmFyIGNoaWxkcmVuID0gU3RyaW5nLkpvaW4oXCIsIFwiLCB0aGlzLlBhdGhzLktleXMuU2VsZWN0KHQgPT4gdC5Ub1N0cmluZygpKSk7XHJcblx0XHRcdHJldHVybiBTdHJpbmcuRm9ybWF0KFwiezB9IDo6IHsxfVwiLCBtYXRjaGVzLCBjaGlsZHJlbik7XHJcblx0XHR9XHJcbiNlbmRpZlxyXG5cclxuXHRcdHB1YmxpYyBEaWN0aW9uYXJ5PFRva2VuLCBQYXR0ZXJuUGF0aD4gUGF0aHMgPSBuZXcgRGljdGlvbmFyeTxUb2tlbiwgUGF0dGVyblBhdGg+KCk7XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIEFueSBwYXR0ZXJucyBmaW5pc2hpbmcgYXQgdGhpcyBwYXRoXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0cHVibGljIExpc3Q8SW50MzI+IE1hdGNoZWRQYXR0ZXJucztcclxuXHR9XHJcbiovXHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L19NZWRpYS9wcm9qZWN0cy9kYXRhcGFyc2VyL3NyYy9tYXRjaGluZy9QYXR0ZXJuUGF0aC5qc1xuICoqLyIsIi8qKlxyXG4gKiBIb2xkcyBzdGF0ZSBmb3IgYSBtYXRjaGluZyBzZXNzaW9uXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIE1hdGNoU3RhdGUgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLm1hdGNoVGFnID0gbnVsbDtcclxuXHR0aGlzLmNhbmRpZGF0ZVBhdGhzID0gW107XHJcblx0dGhpcy5uZXdDYW5kaWRhdGVzID0gW107XHJcblxyXG5cdHRoaXMuY29udGV4dCA9IG51bGw7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoU3RhdGU7XHJcblxyXG4vKlxyXG5cdGludGVybmFsIGNsYXNzIE1hdGNoU3RhdGVcclxuXHR7XHJcblx0XHRwdWJsaWMgU3RyaW5nIE1hdGNoVGFnO1xyXG5cdFx0cHVibGljIExpc3Q8UGF0aE5vZGU+IENhbmRpZGF0ZVBhdGhzID0gbmV3IExpc3Q8UGF0aE5vZGU+KCk7XHJcblx0XHRwdWJsaWMgTGlzdDxQYXRoTm9kZT4gTmV3Q2FuZGlkYXRlcyA9IG5ldyBMaXN0PFBhdGhOb2RlPigpO1xyXG5cclxuXHRcdHB1YmxpYyBQYXR0ZXJuQ29udGV4dCBDb250ZXh0IHsgZ2V0OyBzZXQ7IH1cclxuXHR9XHJcbiovXHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L19NZWRpYS9wcm9qZWN0cy9kYXRhcGFyc2VyL3NyYy9NYXRjaFN0YXRlLmpzXG4gKiovIiwiLyoqXHJcbiAqIEEgbm9kZSBpbiB0aGUgY3VycmVudCBwYXJzaW5nIHNlc3Npb25cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbmV3IG5vZGUgdG8gaG9sZCBwYXJzaW5nIHN0YXRlXHJcbiAqIEBwYXJhbSB0b2tlblxyXG4gKiBAcGFyYW0gcGF0aFxyXG4gKiBAcGFyYW0gdGV4dFZhbHVlXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxudmFyIFBhdGhOb2RlID0gZnVuY3Rpb24odG9rZW4sIHBhdGgsIHRleHRWYWx1ZSkge1xyXG5cdC8vIFRoZSB0b2tlbiBmb3IgY29tcGFyaXNvblxyXG5cdHRoaXMudG9rZW4gPSB0b2tlbjtcclxuXHJcblx0Ly8gVGhlIG1hdGNoaW5nIHBhdGggZm9yIGdvaW5nIGRlZXBlclxyXG5cdHRoaXMucGF0aCA9IHBhdGg7XHJcblxyXG5cdC8vIFRoZSB2YWx1ZSB3aGljaCBzdGlsbCBtYXRjaGVzIHRoaXMgcGF0aFxyXG5cdHRoaXMudGV4dFZhbHVlID0gdGV4dFZhbHVlO1xyXG5cclxuXHQvLyBUaGUgZmluYWwgYXNzZW1ibGVkIHZhbHVlXHJcblx0dGhpcy52YWx1ZSA9IG51bGw7XHJcblx0Ly8gQWxsIHZhbHVlcyBvZiBlYXJsaWVyIHRva2Vuc1xyXG5cdHRoaXMucHJldmlvdXNWYWx1ZXMgPSBbXTtcclxuXHJcblx0Ly8gVHJ1ZSBpZiB0aGUgdmFsdWUgaGFzIGJlZW4gZmluYWxpemVkIGFuZCBhc3NpZ25lZFxyXG5cdHRoaXMuaXNGaW5hbGl6ZWQgPSBudWxsO1xyXG5cclxuXHQvLyBSZW1lbWJlciB0aGUgY3VycmVudCBzdGF0ZSBvZiBhbnkgbWF0Y2hpbmcgYWxnb3JpdGhtXHJcblx0dGhpcy5tYXRjaFN0YXRlID0gbnVsbDtcclxufTtcclxuXHJcblBhdGhOb2RlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLnRleHRWYWx1ZSArICcgPSAnICsgdGhpcy50b2tlbjtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0aE5vZGU7XHJcblxyXG4vKlxyXG5cdGludGVybmFsIGNsYXNzIFBhdGhOb2RlXHJcblx0e1xyXG5cdFx0cHVibGljIG92ZXJyaWRlIHN0cmluZyBUb1N0cmluZygpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiBTdHJpbmcuRm9ybWF0KFwiezB9ID0gezF9XCIsIHRoaXMuVGV4dFZhbHVlLCB0aGlzLlRva2VuKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gVGhlIHRva2VuIGZvciBjb21wYXJpc29uXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0cHVibGljIFRva2VuIFRva2VuO1xyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBUaGUgbWF0Y2hpbmcgcGF0aCBmb3IgZ29pbmcgZGVlcGVyXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0cHVibGljIFBhdHRlcm5QYXRoIFBhdGg7XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFRoZSB2YWx1ZSB3aGljaCBzdGlsbCBtYXRjaGVzIHRoaXMgcGF0aFxyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdHB1YmxpYyBTdHJpbmcgVGV4dFZhbHVlO1xyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBUaGUgZmluYWwgYXNzZW1ibGVkIHZhbHVlXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0cHVibGljIE9iamVjdCBWYWx1ZTtcclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBBbGwgdmFsdWVzIG9mIGVhcmxpZXIgdG9rZW5zXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0cHVibGljIExpc3Q8T2JqZWN0PiBQcmV2aW91c1ZhbHVlcyA9IG5ldyBMaXN0PE9iamVjdD4oKTtcclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gVHJ1ZSBpZiB0aGUgdmFsdWUgaGFzIGJlZW4gZmluYWxpemVkIGFuZCBhc3NpZ25lZFxyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdHB1YmxpYyBCb29sZWFuIElzRmluYWxpemVkO1xyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBSZW1lbWJlciB0aGUgY3VycmVudCBzdGF0ZSBvZiBhbnkgbWF0Y2hpbmcgYWxnb3JpdGhtXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0cHVibGljIE9iamVjdCBNYXRjaFN0YXRlO1xyXG5cclxuXHRcdHB1YmxpYyBQYXRoTm9kZShUb2tlbiB0b2tlbiwgUGF0dGVyblBhdGggcGF0aCwgU3RyaW5nIHRleHRWYWx1ZSlcclxuXHRcdHtcclxuXHRcdFx0dGhpcy5Ub2tlbiA9IHRva2VuO1xyXG5cdFx0XHR0aGlzLlBhdGggPSBwYXRoO1xyXG5cdFx0XHR0aGlzLlRleHRWYWx1ZSA9IHRleHRWYWx1ZTtcclxuXHRcdH1cclxuXHR9XHJcbiovXHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L19NZWRpYS9wcm9qZWN0cy9kYXRhcGFyc2VyL3NyYy9tYXRjaGluZy9QYXRoTm9kZS5qc1xuICoqLyIsIi8qKlxyXG4gKiBDb250ZXh0IGZvciBwYXR0ZXJuIG1hdGNoaW5nXHJcbiAqIEhvbGRzIHZhbHVlcyB3aGljaCBtYXkgaW5mbHVlbmNlIHBhcnNpbmcgb3V0Y29tZSBsaWtlIGN1cnJlbnQgZGF0ZSBhbmQgdGltZSwgbG9jYXRpb24gb3IgbGFuZ3VhZ2VcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgUGF0dGVybkNvbnRleHQgPSBmdW5jdGlvbihjdXJyZW50RGF0ZSkge1xyXG5cdHRoaXMuY3VycmVudERhdGUgPSBjdXJyZW50RGF0ZSB8fCBuZXcgRGF0ZSgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuQ29udGV4dDtcclxuXHJcbi8qXHJcblx0cHVibGljIGNsYXNzIFBhdHRlcm5Db250ZXh0XHJcblx0e1xyXG5cdFx0cHVibGljIExvY2FsRGF0ZSBDdXJyZW50RGF0ZSB7IGdldDsgc2V0OyB9XHJcblxyXG5cdFx0cHVibGljIFBhdHRlcm5Db250ZXh0KClcclxuXHRcdHtcclxuXHRcdFx0Q3VycmVudERhdGUgPSBuZXcgTG9jYWxEYXRlKERhdGVUaW1lLlV0Y05vdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIFBhdHRlcm5Db250ZXh0KExvY2FsRGF0ZSBjdXJyZW50RGF0ZSlcclxuXHRcdHtcclxuXHRcdFx0Q3VycmVudERhdGUgPSBjdXJyZW50RGF0ZTtcclxuXHRcdH1cclxuXHR9XHJcbiovXHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L19NZWRpYS9wcm9qZWN0cy9kYXRhcGFyc2VyL3NyYy9QYXR0ZXJuQ29udGV4dC5qc1xuICoqLyIsIi8qKlxyXG4gKiBQYXJzZXMgZGF0YSB2YWx1ZXMgdG8gZmlndXJlIG91dCB3aGF0IGFjdHVhbCB0eXBlIHRoZXkgYXJlXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBNb2R1bGVcclxuICogQHR5cGUge29iamVjdH1cclxuICogQHByb3BlcnR5IHtzdHJpbmdbXX0gcGF0dGVyblRhZ3MgLSBhdmFpbGFibGUgcGF0dGVybiB0YWdzXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nW119IHRva2VuVGFncyAtIGF2YWlsYWJsZSB0b2tlbiB0YWdzXHJcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24oc3RyaW5nKX0gZ2V0UGF0dGVybnMgLSByZXR1cm5zIHBhdHRlcm5zIGZvciBhIHRhZ1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBQYXR0ZXJuTWF0Y2hlciA9IHJlcXVpcmUoJy4vUGF0dGVybk1hdGNoZXInKTtcclxuXHJcbnZhciBtb2R1bGVUeXBlcyA9IFtcclxuXHRyZXF1aXJlKCcuL21vZHVsZXMvQm9vbGVhblBhcnNlck1vZHVsZScpXHJcblx0LypyZXF1aXJlKCcuL21vZHVsZXMvTnVtYmVyUGFyc2VyTW9kdWxlJyksXHJcblx0cmVxdWlyZSgnLi9tb2R1bGVzL0RhdGVQYXJzZXJNb2R1bGUnKSxcclxuXHRyZXF1aXJlKCcuL21vZHVsZXMvQWRkcmVzc1BhcnNlck1vZHVsZScpLFxyXG5cdHJlcXVpcmUoJy4vbW9kdWxlcy9DdXJyZW5jeVBhcnNlck1vZHVsZScpLFxyXG5cdHJlcXVpcmUoJy4vbW9kdWxlcy9VcmxQYXJzZXJNb2R1bGUnKSxcclxuXHRyZXF1aXJlKCcuL21vZHVsZXMvSXBQYXJzZXJNb2R1bGUnKSxcclxuXHRyZXF1aXJlKCcuL21vZHVsZXMvRW1haWxQYXJzZXJNb2R1bGUnKSovXHJcbl07XHJcbi8vdmFyIGRhdGVNb2R1bGVUeXBlcyA9IFtcclxuXHQvKnJlcXVpcmUoJy4vbW9kdWxlcy9OdW1iZXJQYXJzZXJNb2R1bGUnKSxcclxuXHRyZXF1aXJlKCcuL21vZHVsZXMvRGF0ZVBhcnNlck1vZHVsZScpKi9cclxuLy9dO1xyXG5cclxudmFyIGRlZmF1bHRQYXR0ZXJuTWF0Y2hlciA9IG51bGw7XHJcbi8vdmFyIGRhdGVQYXR0ZXJuTWF0Y2hlciA9IG51bGw7XHJcbnZhciBuYW1lZFBhdHRlcm5NYXRjaGVycyA9IHt9O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBuZXcgUGF0dGVybk1hdGNoZXIgb2JqZWN0IGluY2x1ZGluZyB0aGUgc3BlY2lmaWVkIG1vZHVsZXNcclxuICogQHBhcmFtIG1vZHVsZXMge01vZHVsZVtdfSAtIExpc3Qgb2YgbW9kdWxlcyB0byBpbmNsdWRlXHJcbiAqIEByZXR1cm5zIHtQYXR0ZXJuTWF0Y2hlcn1cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBtYWtlUGF0dGVybk1hdGNoZXIobW9kdWxlcykge1xyXG5cdHZhciBtYXRjaGVyID0gbmV3IFBhdHRlcm5NYXRjaGVyKFtdKTtcclxuXHRpZiAoIW1vZHVsZXMpXHJcblx0XHRyZXR1cm4gbWF0Y2hlcjtcclxuXHJcblx0bW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKE1vZHVsZSkge1xyXG5cdFx0dmFyIG1vZHVsZSA9IG5ldyBNb2R1bGUoKTtcclxuXHRcdHZhciBpLCB0YWc7XHJcblxyXG5cdFx0Ly8gYWRkIHBhdHRlcm5zXHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbW9kdWxlLnBhdHRlcm5UYWdzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRhZyA9IG1vZHVsZS5wYXR0ZXJuVGFnc1tpXTtcclxuXHRcdFx0bWF0Y2hlci5hZGRQYXR0ZXJucyh0YWcsIG1vZHVsZS5nZXRQYXR0ZXJucyh0YWcpKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyByZWdpc3RlciB2YWxpZGF0b3JzXHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbW9kdWxlLnRva2VuVGFncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR0YWcgPSBtb2R1bGUudG9rZW5UYWdzW2ldO1xyXG5cdFx0XHRtYXRjaGVyLnJlZ2lzdGVyVmFsaWRhdG9yKHRhZywgbW9kdWxlKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRyZXR1cm4gbWF0Y2hlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIE1ha2Ugc3VyZSB0aGUgZGVmYXVsdCBwYXR0ZXJuIG1hdGNoZXIgaW5jbHVkaW5nIGFsbCBwYXR0ZXJucyBpcyBhdmFpbGFibGUgYW5kIHJldHVybiBpdFxyXG4gKiBAcmV0dXJucyB7UGF0dGVybk1hdGNoZXJ9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXREZWZhdWx0UGF0dGVybk1hdGNoZXIoKSB7XHJcblx0aWYgKCFkZWZhdWx0UGF0dGVybk1hdGNoZXIpXHJcblx0XHRkZWZhdWx0UGF0dGVybk1hdGNoZXIgPSBtYWtlUGF0dGVybk1hdGNoZXIobW9kdWxlVHlwZXMpO1xyXG5cdHJldHVybiBkZWZhdWx0UGF0dGVybk1hdGNoZXI7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgZGF0YSBwYXJzZXIgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgYW5kIG1vZHVsZXMuIElmIG5hbWUgYW5kIG1vZHVsZXMgaXMgZW1wdHksIG1hdGNoZXMgYWxsIGRlZmF1bHQgcGF0dGVybnMuXHJcbiAqIEBwYXJhbSBuYW1lXHJcbiAqIEBwYXJhbSBtb2R1bGVzXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxudmFyIERhdGFQYXJzZXIgPSBmdW5jdGlvbihuYW1lLCBtb2R1bGVzKSB7XHJcblx0aWYgKCFuYW1lIHx8ICFtb2R1bGVzKSB7XHJcblx0XHR0aGlzLnBhdHRlcm5NYXRjaGVyID0gZ2V0RGVmYXVsdFBhdHRlcm5NYXRjaGVyKCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGlmIChuYW1lZFBhdHRlcm5NYXRjaGVyc1tuYW1lXSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMucGF0dGVybk1hdGNoZXIgPSBtYWtlUGF0dGVybk1hdGNoZXIobW9kdWxlcyk7XHJcblx0XHRuYW1lZFBhdHRlcm5NYXRjaGVyc1tuYW1lXSA9IHRoaXMucGF0dGVybk1hdGNoZXI7XHJcblx0fVxyXG59O1xyXG5cclxuLypcclxue1xyXG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFR5cGVbXSBNb2R1bGVUeXBlcyA9XHJcblx0e1xyXG5cdFx0dHlwZW9mKE51bWJlclBhcnNlck1vZHVsZSksIHR5cGVvZihEYXRlUGFyc2VyTW9kdWxlKSwgdHlwZW9mKEFkZHJlc3NQYXJzZXJNb2R1bGUpLCB0eXBlb2YoQ3VycmVuY3lQYXJzZXJNb2R1bGUpLCB0eXBlb2YoQm9vbGVhblBhcnNlck1vZHVsZSksXHJcblx0XHR0eXBlb2YoVXJsUGFyc2VyTW9kdWxlKSwgdHlwZW9mKElwUGFyc2VyTW9kdWxlKSwgdHlwZW9mKEVtYWlsUGFyc2VyTW9kdWxlKVxyXG5cdH07XHJcblx0cHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgVHlwZVtdIERhdGVNb2R1bGVUeXBlcyA9XHJcblx0e1xyXG5cdFx0dHlwZW9mKE51bWJlclBhcnNlck1vZHVsZSksIHR5cGVvZihEYXRlUGFyc2VyTW9kdWxlKVxyXG5cdH07XHJcblx0cHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUGF0dGVybk1hdGNoZXIgRGVmYXVsdFBhdHRlcm5NYXRjaGVyO1xyXG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBhdHRlcm5NYXRjaGVyIERhdGVQYXR0ZXJuTWF0Y2hlcjtcclxuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBEaWN0aW9uYXJ5PFN0cmluZywgUGF0dGVybk1hdGNoZXI+IE5hbWVkUGF0dGVybk1hdGNoZXJzID0gbmV3IERpY3Rpb25hcnk8U3RyaW5nLCBQYXR0ZXJuTWF0Y2hlcj4oKTtcclxuXHJcblx0cHJpdmF0ZSByZWFkb25seSBQYXR0ZXJuTWF0Y2hlciBwYXR0ZXJuTWF0Y2hlcjtcclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBEZWZhdWx0IGNvbnRleHQgZm9yIHBhcnNpbmdcclxuXHQvLy8gPC9zdW1tYXJ5PlxyXG5cdHB1YmxpYyBQYXR0ZXJuQ29udGV4dCBEZWZhdWx0UGF0dGVybkNvbnRleHQgeyBnZXQ7IHNldDsgfVxyXG5cclxuXHQvLy8gPHN1bW1hcnk+XHJcblx0Ly8vIExvYWQgYWxsIHBhdHRlcm5zIGZyb20gdGhlIGRlZmluZWQgbW9kdWxlc1xyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0c3RhdGljIERhdGFQYXJzZXIoKVxyXG5cdHtcclxuXHRcdERlZmF1bHRQYXR0ZXJuTWF0Y2hlciA9IG1ha2VQYXR0ZXJuTWF0Y2hlcihNb2R1bGVUeXBlcyk7XHJcblx0XHREYXRlUGF0dGVybk1hdGNoZXIgPSBtYWtlUGF0dGVybk1hdGNoZXIoRGF0ZU1vZHVsZVR5cGVzKTtcclxuXHR9XHJcblxyXG5cdC8vLyA8c3VtbWFyeT5cclxuXHQvLy8gVXNlIHRoZSBkZWZhdWx0IHBhdHRlcm4gbWF0Y2hlclxyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0cHVibGljIERhdGFQYXJzZXIoKVxyXG5cdHtcclxuXHRcdHRoaXMucGF0dGVybk1hdGNoZXIgPSBEZWZhdWx0UGF0dGVybk1hdGNoZXI7XHJcblx0fVxyXG5cclxuXHQvLy8gPHN1bW1hcnk+XHJcblx0Ly8vIExvYWQgYWxsIHBhdHRlcm5zIGZyb20gdGhlIGRlZmluZWQgbW9kdWxlc1xyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0cHVibGljIERhdGFQYXJzZXIoU3RyaW5nIG5hbWUsIFR5cGVbXSBtb2R1bGVzKVxyXG5cdHtcclxuXHRcdGlmIChTdHJpbmcuSXNOdWxsT3JFbXB0eShuYW1lKSB8fCBtb2R1bGVzID09IG51bGwpXHJcblx0XHR7XHJcblx0XHRcdHRoaXMucGF0dGVybk1hdGNoZXIgPSBEZWZhdWx0UGF0dGVybk1hdGNoZXI7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoTmFtZWRQYXR0ZXJuTWF0Y2hlcnMuVHJ5R2V0VmFsdWUobmFtZSwgb3V0IHRoaXMucGF0dGVybk1hdGNoZXIpICYmIHRoaXMucGF0dGVybk1hdGNoZXIgIT0gbnVsbClcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMucGF0dGVybk1hdGNoZXIgPSBtYWtlUGF0dGVybk1hdGNoZXIobW9kdWxlcyk7XHJcblx0XHROYW1lZFBhdHRlcm5NYXRjaGVyc1tuYW1lXSA9IHRoaXMucGF0dGVybk1hdGNoZXI7XHJcblx0fVxyXG5cclxuXHJcblx0cHJpdmF0ZSBzdGF0aWMgUGF0dGVybk1hdGNoZXIgbWFrZVBhdHRlcm5NYXRjaGVyKFR5cGVbXSBtb2R1bGVzKVxyXG5cdHtcclxuXHRcdFBhdHRlcm5NYXRjaGVyIG1hdGNoZXIgPSBuZXcgUGF0dGVybk1hdGNoZXIobmV3IFBhdHRlcm5bMF0pO1xyXG5cclxuXHRcdGZvcmVhY2ggKFR5cGUgbW9kdWxlVHlwZSBpbiBtb2R1bGVzKVxyXG5cdFx0e1xyXG5cdFx0XHRJUGFyc2VyTW9kdWxlIG1vZHVsZSA9IEFjdGl2YXRvci5DcmVhdGVJbnN0YW5jZShtb2R1bGVUeXBlKSBhcyBJUGFyc2VyTW9kdWxlO1xyXG5cdFx0XHRpZiAobW9kdWxlID09IG51bGwpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0Ly8gYWRkIHBhdHRlcm5zXHJcblx0XHRcdGZvcmVhY2ggKFN0cmluZyB0YWcgaW4gbW9kdWxlLlBhdHRlcm5UYWdzKVxyXG5cdFx0XHRcdG1hdGNoZXIuQWRkUGF0dGVybnModGFnLCBtb2R1bGUuR2V0UGF0dGVybnModGFnKSk7XHJcblxyXG5cdFx0XHQvLyByZWdpc3RlciB2YWxpZGF0b3JzXHJcblx0XHRcdGZvcmVhY2ggKFN0cmluZyB0YWcgaW4gbW9kdWxlLlRva2VuVGFncylcclxuXHRcdFx0XHRtYXRjaGVyLlJlZ2lzdGVyVmFsaWRhdG9yKHRhZywgbW9kdWxlKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBtYXRjaGVyO1xyXG5cdH1cclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBQYXJzZSBhIHZhbHVlIGludG8gYWxsIHBvc3NpYmxlIG5hdGl2ZSB0eXBlc1xyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0Ly8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj48L3BhcmFtPlxyXG5cdC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcblx0cHVibGljIExpc3Q8SVZhbHVlPiBQYXJzZShTdHJpbmcgdmFsdWUpXHJcblx0e1xyXG5cdFx0cmV0dXJuIFBhcnNlKERlZmF1bHRQYXR0ZXJuQ29udGV4dCA/PyBuZXcgUGF0dGVybkNvbnRleHQoKSwgdmFsdWUpO1xyXG5cdH1cclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBQYXJzZSBhIHZhbHVlIGludG8gYWxsIHBvc3NpYmxlIG5hdGl2ZSB0eXBlc1xyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0Ly8vIDxwYXJhbSBuYW1lPVwiY29udGV4dFwiPjwvcGFyYW0+XHJcblx0Ly8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj48L3BhcmFtPlxyXG5cdC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcblx0cHVibGljIExpc3Q8SVZhbHVlPiBQYXJzZShQYXR0ZXJuQ29udGV4dCBjb250ZXh0LCBTdHJpbmcgdmFsdWUpXHJcblx0e1xyXG5cdFx0TGlzdDxPYmplY3Q+IG1hdGNoUmVzdWx0cyA9IHRoaXMucGF0dGVybk1hdGNoZXIuTWF0Y2goY29udGV4dCwgdmFsdWUpO1xyXG5cdFx0cmV0dXJuIChtYXRjaFJlc3VsdHMgPT0gbnVsbCA/IG5ldyBMaXN0PElWYWx1ZT4oKSA6IG1hdGNoUmVzdWx0cy5DYXN0PElWYWx1ZT4oKS5Ub0xpc3QoKSk7XHJcblx0fVxyXG5cclxuXHQvLy8gPHN1bW1hcnk+XHJcblx0Ly8vIFBhcnNlIGEgdmFsdWUgYXMgYSBMb2NhbERhdGVcclxuXHQvLy8gPC9zdW1tYXJ5PlxyXG5cdC8vLyA8cGFyYW0gbmFtZT1cInZhbHVlXCI+PC9wYXJhbT5cclxuXHQvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG5cdHB1YmxpYyBMb2NhbERhdGUgUGFyc2VEYXRlKFN0cmluZyB2YWx1ZSlcclxuXHR7XHJcblx0XHRyZXR1cm4gUGFyc2VEYXRlKERlZmF1bHRQYXR0ZXJuQ29udGV4dCA/PyBuZXcgUGF0dGVybkNvbnRleHQoKSwgdmFsdWUpO1xyXG5cdH1cclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBQYXJzZSBhIHZhbHVlIGFzIGEgTG9jYWxEYXRlXHJcblx0Ly8vIDwvc3VtbWFyeT5cclxuXHQvLy8gPHBhcmFtIG5hbWU9XCJjb250ZXh0XCI+PC9wYXJhbT5cclxuXHQvLy8gPHBhcmFtIG5hbWU9XCJ2YWx1ZVwiPjwvcGFyYW0+XHJcblx0Ly8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuXHRwdWJsaWMgTG9jYWxEYXRlIFBhcnNlRGF0ZShQYXR0ZXJuQ29udGV4dCBjb250ZXh0LCBTdHJpbmcgdmFsdWUpXHJcblx0e1xyXG5cdFx0TGlzdDxPYmplY3Q+IHJlc3VsdHMgPSBEYXRlUGF0dGVybk1hdGNoZXIuTWF0Y2goY29udGV4dCwgdmFsdWUpO1xyXG5cdFx0TG9jYWxEYXRlIGRhdGVSZXN1bHQgPSByZXN1bHRzLk9mVHlwZTxMb2NhbERhdGU+KCkuRmlyc3RPckRlZmF1bHQoKTtcclxuXHRcdHJldHVybiBkYXRlUmVzdWx0O1xyXG5cdH1cclxufVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEYXRhUGFyc2VyO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9fTWVkaWEvcHJvamVjdHMvZGF0YXBhcnNlci9zcmMvRGF0YVBhcnNlci5qc1xuICoqLyIsIi8qKlxyXG4gKiBWYWxpZGF0ZXMgYm9vbGVhbnNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgUGF0dGVybiA9IHJlcXVpcmUoJy4uL21hdGNoaW5nL1BhdHRlcm4nKTtcclxudmFyIEJvb2xlYW5WYWx1ZSA9IHJlcXVpcmUoJy4uL3ZhbHVlcy9Cb29sZWFuVmFsdWUnKTtcclxuXHJcblxyXG4vKipcclxuICogTWFrZSB0aGUgZmluYWwgb3V0cHV0IHZhbHVlXHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7Qm9vbGVhblZhbHVlfVxyXG4gKi9cclxuZnVuY3Rpb24gbWFrZSh2YWx1ZSkge1xyXG5cdHZhciBib29sVmFsdWUgPSBmYWxzZTtcclxuXHRpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpXHJcblx0XHRib29sVmFsdWUgPSB2YWx1ZTtcclxuXHRlbHNlIGlmICh2YWx1ZSlcclxuXHR7XHJcblx0XHR2YXIgbG93ZXJWYWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcclxuXHRcdGJvb2xWYWx1ZSA9ICh0aGlzLmNvbnN0LnRydWVWYWx1ZXMuaW5kZXhPZihsb3dlclZhbHVlKSAhPT0gLTEpO1xyXG5cdH1cclxuXHRyZXR1cm4gbmV3IEJvb2xlYW5WYWx1ZShib29sVmFsdWUpO1xyXG59XHJcbi8qKlxyXG4gKiBSZXVzYWJsZSB3cmFwcGVyIGZvciB0aGUgdHdvIHBhdHRlcm5zXHJcbiAqIEBwYXJhbSB2XHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZVBhdHRlcm4odikge1xyXG5cdG1ha2UodlsxXSk7XHJcbn1cclxuXHJcbnZhciBtYWluUGF0dGVybnMgPSBbXHJcblx0bmV3IFBhdHRlcm4oJ3tlbXB0eWxpbmU6Kn17Ym9vbGVhbnRydWV9e2VtcHR5bGluZToqfScsIHBhcnNlUGF0dGVybiksXHJcblx0bmV3IFBhdHRlcm4oJ3tlbXB0eWxpbmU6Kn17Ym9vbGVhbmZhbHNlfXtlbXB0eWxpbmU6Kn0nLCBwYXJzZVBhdHRlcm4pXHJcbl07XHJcblxyXG5cclxuLyoqXHJcbiAqIFNpbmdsZXRvbiBNb2R1bGUgdG8gcGFyc2UgYm9vbGVhbiB2YWx1ZXNcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG52YXIgQm9vbGVhblBhcnNlck1vZHVsZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuY29uc3QgPSB7XHJcblx0XHR0cnVlVmFsdWVzOiBbICcxJywgJ3RydWUnLCAnd2FocicgXSxcclxuXHRcdGZhbHNlVmFsdWVzOiBbICcwJywgJ2ZhbHNlJywgJ2ZhbHNjaCcgXVxyXG5cdH07XHJcblxyXG5cdHRoaXMucGF0dGVyblRhZ3MgPSBbJyddO1xyXG5cdHRoaXMudG9rZW5UYWdzID0gWydib29sZWFuZmFsc2UnLCAnYm9vbGVhbnRydWUnXTtcclxufTtcclxuLyoqXHJcbiAqIFJldHVybiB0aGUgcGF0dGVybnMgZm9yIHRoZSB0YWdcclxuICogQHBhcmFtIHRhZyB7c3RyaW5nfVxyXG4gKi9cclxuQm9vbGVhblBhcnNlck1vZHVsZS5wcm90b3R5cGUuZ2V0UGF0dGVybnMgPSBmdW5jdGlvbih0YWcpIHtcclxuXHRpZiAodGFnID09PSAnJylcclxuXHRcdHJldHVybiBtYWluUGF0dGVybnM7XHJcblx0cmV0dXJuIFtdO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb29sZWFuUGFyc2VyTW9kdWxlO1xyXG5cclxuLypcclxuXHRwdWJsaWMgY2xhc3MgQm9vbGVhblBhcnNlck1vZHVsZSA6IElQYXJzZXJNb2R1bGVcclxuXHR7XHJcblx0XHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBIYXNoU2V0PFN0cmluZz4gVHJ1ZVZhbHVlcyA9IG5ldyBIYXNoU2V0PFN0cmluZz4geyBcInRydWVcIiwgXCJ3YWhyXCIgfTtcclxuXHRcdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEhhc2hTZXQ8U3RyaW5nPiBGYWxzZVZhbHVlcyA9IG5ldyBIYXNoU2V0PFN0cmluZz4geyBcImZhbHNlXCIsIFwiZmFsc2NoXCIgfTtcclxuXHJcblx0XHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBQYXR0ZXJuW10gTWFpblBhdHRlcm5zID1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5ldyBQYXR0ZXJuKFwie2VtcHR5bGluZToqfXtib29sZWFudHJ1ZX17ZW1wdHlsaW5lOip9XCIsIHYgPT4gTWFrZSh2WzFdKSksXHJcbiAgICAgICAgICAgIG5ldyBQYXR0ZXJuKFwie2VtcHR5bGluZToqfXtib29sZWFuZmFsc2V9e2VtcHR5bGluZToqfVwiLCB2ID0+IE1ha2UodlsxXSkpXHJcbiAgICAgICAgfTtcclxuXHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIE1ha2UgdGhlIGZpbmFsIG91dHB1dCB2YWx1ZVxyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdC8vLyA8cGFyYW0gbmFtZT1cInZhbHVlXCI+PC9wYXJhbT5cclxuXHRcdC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcblx0XHRwcml2YXRlIHN0YXRpYyBCb29sZWFuVmFsdWUgTWFrZShPYmplY3QgdmFsdWUpXHJcblx0XHR7XHJcblx0XHRcdHZhciBib29sVmFsdWUgPSBmYWxzZTtcclxuXHRcdFx0aWYgKHZhbHVlIGlzIEJvb2xlYW4pXHJcblx0XHRcdFx0Ym9vbFZhbHVlID0gKEJvb2xlYW4pIHZhbHVlO1xyXG5cdFx0XHRpZiAodmFsdWUgIT0gbnVsbClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdFN0cmluZyBsb3dlclZhbHVlID0gdmFsdWUuVG9TdHJpbmcoKS5Ub0xvd2VyKCk7XHJcblx0XHRcdFx0Ym9vbFZhbHVlID0gVHJ1ZVZhbHVlcy5Db250YWlucyhsb3dlclZhbHVlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbmV3IEJvb2xlYW5WYWx1ZShib29sVmFsdWUpO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gUmV0dXJucyB0aGUgZGVmaW5lZCB0YWdzIGZvciB3aGljaCBwYXR0ZXJucyBleGlzdFxyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdHB1YmxpYyBTdHJpbmdbXSBQYXR0ZXJuVGFnc1xyXG5cdFx0e1xyXG5cdFx0XHRnZXQgeyByZXR1cm4gbmV3W10geyBcIlwiIH07IH1cclxuXHRcdH1cclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gR2V0IHRoZSBwYXR0ZXJucyBmb3IgYSBzcGVjaWZpYyB0YWdcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHQvLy8gPHBhcmFtIG5hbWU9XCJwYXR0ZXJuVGFnXCI+PC9wYXJhbT5cclxuXHRcdC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcblx0XHRwdWJsaWMgUGF0dGVybltdIEdldFBhdHRlcm5zKFN0cmluZyBwYXR0ZXJuVGFnKVxyXG5cdFx0e1xyXG5cdFx0XHRzd2l0Y2ggKHBhdHRlcm5UYWcpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjYXNlIFwiXCI6XHJcblx0XHRcdFx0XHRyZXR1cm4gTWFpblBhdHRlcm5zO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBuZXcgUGF0dGVyblswXTtcclxuXHRcdH1cclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gUmV0dXJucyB0aGUgZGVmaW5lZCB0YWdzIHdoaWNoIGNhbiBiZSBwYXJzZWQgYXMgdG9rZW5zXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0cHVibGljIFN0cmluZ1tdIFRva2VuVGFnc1xyXG5cdFx0e1xyXG5cdFx0XHRnZXQgeyByZXR1cm4gbmV3W10geyBcImJvb2xlYW5mYWxzZVwiLCBcImJvb2xlYW50cnVlXCIgfTsgfVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBDYWxsYmFjayBoYW5kbGVyIHdoZW4gYSB2YWx1ZSBoYXMgdG8gYmUgdmFsaWRhdGVkIGFnYWluc3QgYSB0b2tlblxyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdC8vLyA8cGFyYW0gbmFtZT1cInRva2VuXCI+VGhlIHRva2VuIHRvIHZhbGlkYXRlIGFnYWluc3Q8L3BhcmFtPlxyXG5cdFx0Ly8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj5UaGUgdmFsdWUgdG8gdmFsaWRhdGU8L3BhcmFtPlxyXG5cdFx0Ly8vIDxwYXJhbSBuYW1lPVwiaXNGaW5hbFwiPlRydWUgaWYgdGhpcyBpcyB0aGUgZmluYWwgdmFsaWRhdGlvbiBhbmQgbm8gbW9yZSBjaGFyYWN0ZXJzIGFyZSBleHBlY3RlZCBmb3IgdGhlIHZhbHVlPC9wYXJhbT5cclxuXHRcdC8vLyA8cmV0dXJucz5SZXR1cm5zIHRydWUgaWYgdGhlIHZhbHVlIG1hdGNoZXMgdGhlIHRva2VuLCBmYWxzZSBpZiBpdCBkb2Vzbid0IG1hdGNoIG9yIHRoZSB0b2tlbiBpcyB1bmtub3duPC9yZXR1cm5zPlxyXG5cdFx0cHVibGljIEJvb2xlYW4gVmFsaWRhdGVUb2tlbihUb2tlbiB0b2tlbiwgU3RyaW5nIHZhbHVlLCBCb29sZWFuIGlzRmluYWwpXHJcblx0XHR7XHJcblx0XHRcdFN0cmluZyBsb3dlclZhbHVlID0gdmFsdWUuVG9Mb3dlcigpO1xyXG5cdFx0XHRzd2l0Y2ggKHRva2VuLlZhbHVlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y2FzZSBcImJvb2xlYW50cnVlXCI6XHJcblx0XHRcdFx0XHRyZXR1cm4gKGlzRmluYWwgJiYgVHJ1ZVZhbHVlcy5Db250YWlucyhsb3dlclZhbHVlKSkgfHwgKCFpc0ZpbmFsICYmIFN0YXJ0c1dpdGgoVHJ1ZVZhbHVlcywgbG93ZXJWYWx1ZSkpO1xyXG5cdFx0XHRcdGNhc2UgXCJib29sZWFuZmFsc2VcIjpcclxuXHRcdFx0XHRcdHJldHVybiAoaXNGaW5hbCAmJiBGYWxzZVZhbHVlcy5Db250YWlucyhsb3dlclZhbHVlKSkgfHwgKCFpc0ZpbmFsICYmIFN0YXJ0c1dpdGgoRmFsc2VWYWx1ZXMsIGxvd2VyVmFsdWUpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBQYXJzZXMgdGhlIFRleHRWYWx1ZSBvZiB0aGUgbm9kZSBpbnRvIHRoZSBmaW5hbCB2YWx1ZVxyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdC8vLyA8cGFyYW0gbmFtZT1cInRva2VuXCI+VGhlIHRva2VuIHRvIGZpbmFsaXplPC9wYXJhbT5cclxuXHRcdC8vLyA8cGFyYW0gbmFtZT1cInZhbHVlXCI+VGhlIHRleHQgdmFsdWUgdG8gcGFyc2U8L3BhcmFtPlxyXG5cdFx0Ly8vIDxyZXR1cm5zPlJldHVybnMgdGhlIHBhcnNlZCByZXN1bHQ8L3JldHVybnM+XHJcblx0XHRwdWJsaWMgT2JqZWN0IEZpbmFsaXplVmFsdWUoVG9rZW4gdG9rZW4sIFN0cmluZyB2YWx1ZSlcclxuXHRcdHtcclxuXHRcdFx0c3dpdGNoICh0b2tlbi5WYWx1ZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGNhc2UgXCJib29sZWFudHJ1ZVwiOlxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0Y2FzZSBcImJvb2xlYW5mYWxzZVwiOlxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIEJvb2xlYW4gU3RhcnRzV2l0aChJRW51bWVyYWJsZTxTdHJpbmc+IGFsbG93ZWRWYWx1ZXMsIFN0cmluZyB2YWx1ZSlcclxuXHRcdHtcclxuXHRcdFx0Zm9yZWFjaCAoU3RyaW5nIGFsbG93ZWRWYWx1ZSBpbiBhbGxvd2VkVmFsdWVzKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKGFsbG93ZWRWYWx1ZS5TdGFydHNXaXRoKHZhbHVlKSlcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuKi9cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovX01lZGlhL3Byb2plY3RzL2RhdGFwYXJzZXIvc3JjL21vZHVsZXMvQm9vbGVhblBhcnNlck1vZHVsZS5qc1xuICoqLyIsIi8qKlxyXG4gKiBQYXR0ZXJuIG9iamVjdFxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBQYXR0ZXJuID0gZnVuY3Rpb24obWF0Y2gsIHBhcnNlcikge1xyXG5cdHRoaXMubWF0Y2ggPSBtYXRjaCB8fCAnJztcclxuXHR0aGlzLnBhcnNlciA9IHBhcnNlcjtcclxufTtcclxuXHJcblBhdHRlcm4ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMubWF0Y2g7XHJcbn07XHJcblBhdHRlcm4ucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oY29udGV4dCwgdmFsdWVzKSB7XHJcblx0cmV0dXJuIHRoaXMucGFyc2VyKGNvbnRleHQsIHZhbHVlcyk7XHJcbn07XHJcblBhdHRlcm4ucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKG90aGVyKSB7XHJcblx0aWYgKCFvdGhlcikgcmV0dXJuIGZhbHNlO1xyXG5cdHJldHVybiB0aGlzLm1hdGNoID09PSBvdGhlci5tYXRjaDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVybjtcclxuXHJcbi8qXHJcblx0cHVibGljIGNsYXNzIFBhdHRlcm5cclxuXHR7XHJcblx0XHRwdWJsaWMgU3RyaW5nIE1hdGNoIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5cdFx0cHVibGljIEZ1bmM8UGF0dGVybkNvbnRleHQsIE9iamVjdFtdLCBPYmplY3Q+IFBhcnNlciB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuXHRcdHB1YmxpYyBGdW5jPE9iamVjdFtdLCBPYmplY3Q+IFBhcnNlck5vQ29udGV4dCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuXHJcblx0XHRwdWJsaWMgUGF0dGVybihTdHJpbmcgbWF0Y2gsIEZ1bmM8T2JqZWN0W10sIE9iamVjdD4gcGFyc2VyKVxyXG5cdFx0e1xyXG5cdFx0XHRNYXRjaCA9IG1hdGNoO1xyXG5cdFx0XHRQYXJzZXJOb0NvbnRleHQgPSBwYXJzZXI7XHJcblx0XHR9XHJcblx0XHRwdWJsaWMgUGF0dGVybihTdHJpbmcgbWF0Y2gsIEZ1bmM8UGF0dGVybkNvbnRleHQsIE9iamVjdFtdLCBPYmplY3Q+IHBhcnNlcilcclxuXHRcdHtcclxuXHRcdFx0TWF0Y2ggPSBtYXRjaDtcclxuXHRcdFx0UGFyc2VyID0gcGFyc2VyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBPYmplY3QgUGFyc2UoUGF0dGVybkNvbnRleHQgY29udGV4dCwgT2JqZWN0W10gdmFsdWVzKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoUGFyc2VyTm9Db250ZXh0ICE9IG51bGwpXHJcblx0XHRcdFx0cmV0dXJuIFBhcnNlck5vQ29udGV4dCh2YWx1ZXMpO1xyXG5cdFx0XHRyZXR1cm4gUGFyc2VyKGNvbnRleHQsIHZhbHVlcyk7XHJcblx0XHR9XHJcblxyXG4jaWYgIVNDUklQVFNIQVJQXHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgQm9vbGVhbiBFcXVhbHMoT2JqZWN0IG9iailcclxuXHRcdHtcclxuXHRcdFx0aWYgKFJlZmVyZW5jZUVxdWFscyhudWxsLCBvYmopKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChSZWZlcmVuY2VFcXVhbHModGhpcywgb2JqKSkgcmV0dXJuIHRydWU7XHJcblx0XHRcdGlmIChvYmouR2V0VHlwZSgpICE9IEdldFR5cGUoKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRyZXR1cm4gRXF1YWxzKChQYXR0ZXJuKSBvYmopO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByb3RlY3RlZCBCb29sZWFuIEVxdWFscyhQYXR0ZXJuIG90aGVyKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gU3RyaW5nLkVxdWFscyhNYXRjaCwgb3RoZXIuTWF0Y2gpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBvdmVycmlkZSBJbnQzMiBHZXRIYXNoQ29kZSgpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiAoTWF0Y2ggIT0gbnVsbCA/IE1hdGNoLkdldEhhc2hDb2RlKCkgOiAwKTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgU3RyaW5nIFRvU3RyaW5nKClcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIE1hdGNoO1xyXG5cdFx0fVxyXG4jZW5kaWZcclxuKi9cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovX01lZGlhL3Byb2plY3RzL2RhdGFwYXJzZXIvc3JjL21hdGNoaW5nL1BhdHRlcm4uanNcbiAqKi8iLCIvKipcclxuICogQm9vbGVhbiByZXN1bHQgd3JhcHBlclxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBCb29sZWFuVmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdHRoaXMuYm9vbCA9ICEhdmFsdWU7XHJcbn07XHJcbkJvb2xlYW5WYWx1ZS5wcm90b3R5cGUudmFsdWVPZiA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLmJvb2w7XHJcbn07XHJcbkJvb2xlYW5WYWx1ZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5ib29sLnRvU3RyaW5nKCk7XHJcbn07XHJcbkJvb2xlYW5WYWx1ZS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24ob3RoZXIpIHtcclxuXHRpZiAoIShvdGhlciBpbnN0YW5jZW9mIEJvb2xlYW5WYWx1ZSkpXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0cmV0dXJuIHRoaXMuYm9vbCA9PT0gb3RoZXIuYm9vbDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQm9vbGVhblZhbHVlO1xyXG5cclxuLypcclxuXHRwdWJsaWMgc3RydWN0IEJvb2xlYW5WYWx1ZSA6IElWYWx1ZVxyXG5cdHtcclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBUaGUgYm9vbGVhbiB2YWx1ZVxyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdFtKc29uUHJvcGVydHkoXCJ2XCIpXVxyXG5cdFx0cHVibGljIEJvb2xlYW4gQm9vbDtcclxuXHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIEdlbmVyaWMgYWNjZXNzIHRvIHRoZSBtb3N0IHByb21pbmVudCB2YWx1ZSAubmV0IHR5cGVcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHRwdWJsaWMgT2JqZWN0IFZhbHVlXHJcblx0XHR7XHJcblx0XHRcdGdldCB7IHJldHVybiBCb29sOyB9XHJcblx0XHRcdHNldCB7IEJvb2wgPSAoQm9vbGVhbil2YWx1ZTsgfVxyXG5cdFx0fVxyXG5cclxuXHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFNlcmlhbGl6ZSB0aGUgdmFsdWUgdG8gYmluYXJ5IGRhdGFcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHQvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG5cdFx0cHVibGljIEJ5dGVbXSBUb0JpbmFyeSgpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiBCaXRDb252ZXJ0ZXIuR2V0Qnl0ZXMoQm9vbCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFJlYWQgdGhlIHZhbHVlIGRhdGEgZnJvbSBiaW5hcnlcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHQvLy8gPHBhcmFtIG5hbWU9XCJkYXRhXCI+PC9wYXJhbT5cclxuXHRcdHB1YmxpYyB2b2lkIEZyb21CaW5hcnkoQnl0ZVtdIGRhdGEpXHJcblx0XHR7XHJcblx0XHRcdEJvb2wgPSBCaXRDb252ZXJ0ZXIuVG9Cb29sZWFuKGRhdGEsIDApO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gQ29uc3RydWN0b3JcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHQvLy8gPHBhcmFtIG5hbWU9XCJ2YWx1ZVwiPjwvcGFyYW0+XHJcblx0XHRwdWJsaWMgQm9vbGVhblZhbHVlKEJvb2xlYW4gdmFsdWUpXHJcblx0XHR7XHJcblx0XHRcdHRoaXMuQm9vbCA9IHZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBvdmVycmlkZSBTdHJpbmcgVG9TdHJpbmcoKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gU3RyaW5nLkZvcm1hdChcInswfVwiLCB0aGlzLkJvb2wpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBvdmVycmlkZSBCb29sZWFuIEVxdWFscyhvYmplY3Qgb2JqKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoIShvYmogaXMgQm9vbGVhblZhbHVlKSlcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdEJvb2xlYW5WYWx1ZSBvdGhlciA9IChCb29sZWFuVmFsdWUpb2JqO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5Cb29sLkVxdWFscyhvdGhlci5Cb29sKTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgaW50IEdldEhhc2hDb2RlKClcclxuXHRcdHtcclxuXHRcdFx0dW5jaGVja2VkXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5Cb29sLkdldEhhc2hDb2RlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc3RhdGljIGJvb2wgb3BlcmF0b3IgPT0oQm9vbGVhblZhbHVlIGEsIEJvb2xlYW5WYWx1ZSBiKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gYS5Cb29sLkVxdWFscyhiLkJvb2wpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBzdGF0aWMgYm9vbCBvcGVyYXRvciAhPShCb29sZWFuVmFsdWUgYSwgQm9vbGVhblZhbHVlIGIpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiAhYS5Cb29sLkVxdWFscyhiLkJvb2wpO1xyXG5cdFx0fVxyXG5cdH1cclxuKi9cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovX01lZGlhL3Byb2plY3RzL2RhdGFwYXJzZXIvc3JjL3ZhbHVlcy9Cb29sZWFuVmFsdWUuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9