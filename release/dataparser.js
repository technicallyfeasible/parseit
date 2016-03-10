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
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(14);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Entry point for the DataParser library
	 */
	
	module.exports = {
	  PatternMatcher: __webpack_require__(2),
	  DataParser: __webpack_require__(10)
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Matches patterns according to registered rules
	 */
	
	var arrayUtils = __webpack_require__(3);
	var stringUtils = __webpack_require__(4);
	var Token = __webpack_require__(5);
	var PatternPath = __webpack_require__(6);
	var MatchState = __webpack_require__(7);
	var PathNode = __webpack_require__(8);
	var PatternContext = __webpack_require__(9);
	
	/** @const */
	var LETTER_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	
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
	
	  var targetPatterns = this.patterns[matchTag];
	  if (!targetPatterns) {
	    targetPatterns = this.patterns[matchTag] = [];
	  }
	
	  var pathRoot = this.compiledPatterns[matchTag];
	  if (!pathRoot) {
	    pathRoot = this.compiledPatterns[matchTag] = {};
	  }
	
	  // parse each pattern into tokens and then parse the tokens
	  var tokens = [];
	  for (var patternIndex = 0; patternIndex < newPatterns.length; patternIndex++) {
	    var p = newPatterns[patternIndex];
	
	    // if the pattern was added before then don't do it again
	    if (arrayUtils.contains(targetPatterns, p)) {
	      continue;
	    }
	
	    var targetIndex = targetPatterns.length;
	    targetPatterns.push(p);
	
	    var pattern = p.match;
	
	    //
	    // parse the pattern into tokens
	    //
	
	    tokens.length = 0;
	    var currentToken = '';
	    var i = undefined;
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
	
	    var path = null;
	    var paths = pathRoot;
	    for (i = 0; i < tokens.length; i++) {
	      var token = tokens[i];
	      var tokenKey = token.toString();
	      // check if the exact same node exists and take it if it does
	      var nextPath = paths[tokenKey];
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
	
	  var state = this.matchStart(context, '');
	  for (var i = 0; i < value.length; i++) {
	    var c = value.charAt(i);
	    if (!this.matchNext(state, c)) {
	      return [];
	    }
	  }
	
	  var results = this.matchResults(state);
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
	  if (!roots) {
	    return null;
	  }
	
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
	  if (!state) {
	    return false;
	  }
	
	  var candidatePaths = state.candidatePaths;
	  var newCandidates = state.newCandidates;
	  for (var i = 0; i < candidatePaths.length; i++) {
	    var candidate = candidatePaths[i];
	
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
	  if (node.isFinalized) {
	    return true;
	  }
	
	  var token = node.token;
	  var textValue = node.textValue;
	
	  // match exact values first
	  if (!textValue) {
	    return false;
	  }
	  if (token.exactMatch) {
	    return isFinal && token.value === textValue || !isFinal && stringUtils.startsWith(token.value, textValue);
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
	  var validator = this.validators[token.value];
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
	  // first check if any of the child nodes validate with the new character and remember them as candidates
	  // foreach (KeyValuePair<Token, PatternPath> childPath in paths)
	  for (var i = 0; i < paths.length; i++) {
	    var childPath = paths[i];
	    /*PathNode childNode = new PathNode(childPath.token, childPath.patternPath, val);
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
	    newCandidates.Add(childNode);*/
	  }
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

/***/ },
/* 3 */
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
		contains: function contains(ar, obj) {
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
/* 4 */
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
		startsWith: function startsWith(str, val) {
			return !!str && !!val && str.length > val.length && str.indexOf(val) === 0;
		},
	
		/**
	  * Match all characters in the string against all characters in the given array or string
	  * @param str {string} - The string to test
	  * @param chars {string|string[]} - The characters to test for
	  * @param startIndex {number=} - Index of the first character to test
	  * @returns {boolean} - true if all characters in the string are contained in chars
	  */
		matchAll: function matchAll(str, chars, startIndex) {
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
/* 5 */
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
	
	var Token = function Token(value, exactMatch) {
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
/* 6 */
/***/ function(module, exports) {

	/**
	 * Keeps tree information for patterns
	 */
	
	'use strict';
	
	/**
	 * Create a new patch
	 * @constructor
	 */
	
	var PatternPath = function PatternPath() {
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
/* 7 */
/***/ function(module, exports) {

	/**
	 * Holds state for a matching session
	 */
	
	'use strict';
	
	var MatchState = function MatchState() {
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
/* 8 */
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
	
	var PathNode = function PathNode(token, path, textValue) {
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
/* 9 */
/***/ function(module, exports) {

	/**
	 * Context for pattern matching
	 * Holds values which may influence parsing outcome like current date and time, location or language
	 */
	
	'use strict';
	
	var PatternContext = function PatternContext(currentDate) {
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
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
	
	var PatternMatcher = __webpack_require__(2);
	var PatternContext = __webpack_require__(9);
	
	var moduleTypes = [__webpack_require__(11)
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
	var DataParser = function DataParser(name, modules) {
		if (!name || !modules) {
			this.patternMatcher = getDefaultPatternMatcher();
		} else {
			if (namedPatternMatchers[name]) return;
	
			this.patternMatcher = makePatternMatcher(modules);
			namedPatternMatchers[name] = this.patternMatcher;
		}
	};
	
	/**
	 * Parse a value into all possible native types
	 * @param value
	 * @param context
	 * @returns {Array}
	 */
	DataParser.prototype.parse = function (value, context) {
		var matchResults = this.patternMatcher.match(context || new PatternContext(), value);
		return matchResults || [];
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Validates booleans
	 */
	
	'use strict';
	
	var Pattern = __webpack_require__(12);
	var BooleanValue = __webpack_require__(13);
	
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
	var BooleanParserModule = function BooleanParserModule() {
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
/* 12 */
/***/ function(module, exports) {

	/**
	 * Pattern object
	 */
	
	'use strict';
	
	var Pattern = function Pattern(match, parser) {
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
/* 13 */
/***/ function(module, exports) {

	/**
	 * Boolean result wrapper
	 */
	
	'use strict';
	
	var BooleanValue = function BooleanValue(value) {
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

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';
	
	/*eslint-env browser*/
	/*global __resourceQuery*/
	
	var options = {
	  path: "/__webpack_hmr",
	  timeout: 20 * 1000,
	  overlay: true,
	  reload: false,
	  log: true,
	  warn: true
	};
	if (false) {
	  var querystring = require('querystring');
	  var overrides = querystring.parse(__resourceQuery.slice(1));
	  if (overrides.path) options.path = overrides.path;
	  if (overrides.timeout) options.timeout = overrides.timeout;
	  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
	  if (overrides.reload) options.reload = overrides.reload !== 'false';
	  if (overrides.noInfo && overrides.noInfo !== 'false') {
	    options.log = false;
	  }
	  if (overrides.quiet && overrides.quiet !== 'false') {
	    options.log = false;
	    options.warn = false;
	  }
	}
	
	if (typeof window === 'undefined') {
	  // do nothing
	} else if (typeof window.EventSource === 'undefined') {
	    console.warn("webpack-hot-middleware's client requires EventSource to work. " + "You should include a polyfill if you want to support this browser: " + "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools");
	  } else {
	    connect(window.EventSource);
	  }
	
	function connect(EventSource) {
	  var source = new EventSource(options.path);
	  var lastActivity = new Date();
	
	  source.onopen = handleOnline;
	  source.onmessage = handleMessage;
	  source.onerror = handleDisconnect;
	
	  var timer = setInterval(function () {
	    if (new Date() - lastActivity > options.timeout) {
	      handleDisconnect();
	    }
	  }, options.timeout / 2);
	
	  function handleOnline() {
	    if (options.log) console.log("[HMR] connected");
	    lastActivity = new Date();
	  }
	
	  function handleMessage(event) {
	    lastActivity = new Date();
	    if (event.data == '💓') {
	      return;
	    }
	    try {
	      processMessage(JSON.parse(event.data));
	    } catch (ex) {
	      if (options.warn) {
	        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
	      }
	    }
	  }
	
	  function handleDisconnect() {
	    clearInterval(timer);
	    source.close();
	    setTimeout(function () {
	      connect(EventSource);
	    }, options.timeout);
	  }
	}
	
	var strip = __webpack_require__(15);
	
	var overlay;
	if (typeof document !== 'undefined' && options.overlay) {
	  overlay = __webpack_require__(17);
	}
	
	function problems(type, obj) {
	  if (options.warn) {
	    console.warn("[HMR] bundle has " + type + ":");
	    obj[type].forEach(function (msg) {
	      console.warn("[HMR] " + strip(msg));
	    });
	  }
	  if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
	}
	
	function success() {
	  if (overlay) overlay.clear();
	}
	
	var processUpdate = __webpack_require__(20);
	
	var customHandler;
	function processMessage(obj) {
	  if (obj.action == "building") {
	    if (options.log) console.log("[HMR] bundle rebuilding");
	  } else if (obj.action == "built") {
	    if (options.log) console.log("[HMR] bundle " + (obj.name ? obj.name + " " : "") + "rebuilt in " + obj.time + "ms");
	    if (obj.errors.length > 0) {
	      problems('errors', obj);
	    } else {
	      if (obj.warnings.length > 0) problems('warnings', obj);
	      success();
	
	      processUpdate(obj.hash, obj.modules, options);
	    }
	  } else if (customHandler) {
	    customHandler(obj);
	  }
	}
	
	if (module) {
	  module.exports = {
	    subscribe: function subscribe(handler) {
	      customHandler = handler;
	    },
	    useCustomOverlay: function useCustomOverlay(customOverlay) {
	      overlay = customOverlay;
	    }
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./../webpack/buildin/module.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))(module)))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ansiRegex = __webpack_require__(16)();
	
	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function () {
		return (/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g
		);
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*eslint-env browser*/
	
	var clientOverlay = document.createElement('div');
	var styles = {
	  display: 'none',
	  background: 'rgba(0,0,0,0.85)',
	  color: '#E8E8E8',
	  lineHeight: '1.2',
	  whiteSpace: 'pre',
	  fontFamily: 'Menlo, Consolas, monospace',
	  fontSize: '13px',
	  position: 'fixed',
	  zIndex: 9999,
	  padding: '10px',
	  left: 0,
	  right: 0,
	  top: 0,
	  bottom: 0,
	  overflow: 'auto'
	};
	for (var key in styles) {
	  clientOverlay.style[key] = styles[key];
	}
	
	if (document.body) {
	  document.body.appendChild(clientOverlay);
	}
	
	var ansiHTML = __webpack_require__(18);
	var colors = {
	  reset: ['transparent', 'transparent'],
	  black: '181818',
	  red: 'E36049',
	  green: 'B3CB74',
	  yellow: 'FFD080',
	  blue: '7CAFC2',
	  magenta: '7FACCA',
	  cyan: 'C3C2EF',
	  lightgrey: 'EBE7E3',
	  darkgrey: '6D7891'
	};
	ansiHTML.setColors(colors);
	
	var Entities = __webpack_require__(19).AllHtmlEntities;
	var entities = new Entities();
	
	exports.showProblems = function showProblems(type, lines) {
	  clientOverlay.innerHTML = '';
	  clientOverlay.style.display = 'block';
	  lines.forEach(function (msg) {
	    msg = ansiHTML(entities.encode(msg));
	    var div = document.createElement('div');
	    div.style.marginBottom = '26px';
	    div.innerHTML = problemType(type) + ' in ' + msg;
	    clientOverlay.appendChild(div);
	  });
	};
	
	exports.clear = function clear() {
	  clientOverlay.innerHTML = '';
	  clientOverlay.style.display = 'none';
	};
	
	var problemColors = {
	  errors: colors.red,
	  warnings: colors.yellow
	};
	
	function problemType(type) {
	  var color = problemColors[type] || colors.red;
	  return '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' + type.slice(0, -1).toUpperCase() + '</span>';
	}

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	module.exports = ansiHTML;
	
	// Reference to https://github.com/sindresorhus/ansi-regex
	var re_ansi = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/;
	
	var _defColors = {
	  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
	  black: '000',
	  red: 'ff0000',
	  green: '209805',
	  yellow: 'e8bf03',
	  blue: '0000ff',
	  magenta: 'ff00ff',
	  cyan: '00ffee',
	  lightgrey: 'f0f0f0',
	  darkgrey: '888'
	};
	var _styles = {
	  30: 'black',
	  31: 'red',
	  32: 'green',
	  33: 'yellow',
	  34: 'blue',
	  35: 'magenta',
	  36: 'cyan',
	  37: 'lightgrey'
	};
	var _openTags = {
	  '1': 'font-weight:bold', // bold
	  '2': 'opacity:0.8', // dim
	  '3': '<i>', // italic
	  '4': '<u>', // underscore
	  '8': 'display:none', // hidden
	  '9': '<del>' };
	// delete
	var _closeTags = {
	  '23': '</i>', // reset italic
	  '24': '</u>', // reset underscore
	  '29': '</del>' // reset delete
	};
	[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
	  _closeTags[n] = '</span>';
	});
	
	/**
	 * Converts text with ANSI color codes to HTML markup.
	 * @param {String} text
	 * @returns {*}
	 */
	function ansiHTML(text) {
	  // Returns the text if the string has no ANSI escape code.
	  if (!re_ansi.test(text)) {
	    return text;
	  }
	
	  // Cache opened sequence.
	  var ansiCodes = [];
	  // Replace with markup.
	  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
	    var ot = _openTags[seq];
	    if (ot) {
	      // If current sequence has been opened, close it.
	      if (!! ~ansiCodes.indexOf(seq)) {
	        ansiCodes.pop();
	        return '</span>';
	      }
	      // Open tag.
	      ansiCodes.push(seq);
	      return ot[0] == '<' ? ot : '<span style="' + ot + ';">';
	    }
	
	    var ct = _closeTags[seq];
	    if (ct) {
	      // Pop sequence
	      ansiCodes.pop();
	      return ct;
	    }
	    return '';
	  });
	
	  // Make sure tags are closed.
	  var l = ansiCodes.length;
	  l > 0 && (ret += Array(l + 1).join('</span>'));
	
	  return ret;
	}
	
	/**
	 * Customize colors.
	 * @param {Object} colors reference to _defColors
	 */
	ansiHTML.setColors = function (colors) {
	  if ((typeof colors === 'undefined' ? 'undefined' : _typeof(colors)) != 'object') {
	    throw new Error('`colors` parameter must be an Object.');
	  }
	
	  var _finalColors = {};
	  for (var key in _defColors) {
	    var hex = colors.hasOwnProperty(key) ? colors[key] : null;
	    if (!hex) {
	      _finalColors[key] = _defColors[key];
	      continue;
	    }
	    if ('reset' == key) {
	      if (typeof hex == 'string') {
	        hex = [hex];
	      }
	      if (!Array.isArray(hex) || hex.length == 0 || hex.some(function (h) {
	        return typeof h != 'string';
	      })) {
	        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000');
	      }
	      var defHexColor = _defColors[key];
	      if (!hex[0]) {
	        hex[0] = defHexColor[0];
	      }
	      if (hex.length == 1 || !hex[1]) {
	        hex = [hex[0]];
	        hex.push(defHexColor[1]);
	      }
	
	      hex = hex.slice(0, 2);
	    } else if (typeof hex != 'string') {
	      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000');
	    }
	    _finalColors[key] = hex;
	  }
	  _setTags(_finalColors);
	};
	
	/**
	 * Reset colors.
	 */
	ansiHTML.reset = function () {
	  _setTags(_defColors);
	};
	
	/**
	 * Expose tags, including open and close.
	 * @type {Object}
	 */
	ansiHTML.tags = {
	  get open() {
	    return _openTags;
	  },
	  get close() {
	    return _closeTags;
	  }
	};
	
	function _setTags(colors) {
	  // reset all
	  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1];
	  // inverse
	  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0];
	  // dark grey
	  _openTags['90'] = 'color:#' + colors.darkgrey;
	
	  for (var code in _styles) {
	    var color = _styles[code];
	    var oriColor = colors[color] || '000';
	    _openTags[code] = 'color:#' + oriColor;
	    code = parseInt(code);
	    _openTags[(code + 10).toString()] = 'background:#' + oriColor;
	  }
	}
	
	ansiHTML.reset();

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
	  XmlEntities: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./lib/xml-entities.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())),
	  Html4Entities: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./lib/html4-entities.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())),
	  Html5Entities: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./lib/html5-entities.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())),
	  AllHtmlEntities: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./lib/html5-entities.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {"use strict";
	
	/**
	 * Based heavily on https://github.com/webpack/webpack/blob/
	 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
	 * Original copyright Tobias Koppers @sokra (MIT license)
	 */
	
	/* global window __webpack_hash__ */
	
	if (true) {
	  throw new Error("[HMR] Hot Module Replacement is disabled.");
	}
	
	var hmrDocsUrl = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"; // eslint-disable-line max-len
	
	var lastHash;
	var failureStatuses = { abort: 1, fail: 1 };
	var applyOptions = { ignoreUnaccepted: true };
	
	function upToDate(hash) {
	  if (hash) lastHash = hash;
	  return lastHash == __webpack_hash__;
	}
	
	module.exports = function (hash, moduleMap, options) {
	  var reload = options.reload;
	  if (!upToDate(hash) && module.hot.status() == "idle") {
	    if (options.log) console.log("[HMR] Checking for updates on the server...");
	    check();
	  }
	
	  function check() {
	    module.hot.check(function (err, updatedModules) {
	      if (err) return handleError(err);
	
	      if (!updatedModules) {
	        if (options.warn) {
	          console.warn("[HMR] Cannot find update (Full reload needed)");
	          console.warn("[HMR] (Probably because of restarting the server)");
	        }
	        performReload();
	        return null;
	      }
	
	      module.hot.apply(applyOptions, function (applyErr, renewedModules) {
	        if (applyErr) return handleError(applyErr);
	
	        if (!upToDate()) check();
	
	        logUpdates(updatedModules, renewedModules);
	      });
	    });
	  }
	
	  function logUpdates(updatedModules, renewedModules) {
	    var unacceptedModules = updatedModules.filter(function (moduleId) {
	      return renewedModules && renewedModules.indexOf(moduleId) < 0;
	    });
	
	    if (unacceptedModules.length > 0) {
	      if (options.warn) {
	        console.warn("[HMR] The following modules couldn't be hot updated: " + "(Full reload needed)\n" + "This is usually because the modules which have changed " + "(and their parents) do not know how to hot reload themselves. " + "See " + hmrDocsUrl + " for more details.");
	        unacceptedModules.forEach(function (moduleId) {
	          console.warn("[HMR]  - " + moduleMap[moduleId]);
	        });
	      }
	      performReload();
	      return;
	    }
	
	    if (options.log) {
	      if (!renewedModules || renewedModules.length === 0) {
	        console.log("[HMR] Nothing hot updated.");
	      } else {
	        console.log("[HMR] Updated modules:");
	        renewedModules.forEach(function (moduleId) {
	          console.log("[HMR]  - " + moduleMap[moduleId]);
	        });
	      }
	
	      if (upToDate()) {
	        console.log("[HMR] App is up to date.");
	      }
	    }
	  }
	
	  function handleError(err) {
	    if (module.hot.status() in failureStatuses) {
	      if (options.warn) {
	        console.warn("[HMR] Cannot check for update (Full reload needed)");
	        console.warn("[HMR] " + err.stack || err.message);
	      }
	      performReload();
	      return;
	    }
	    if (options.warn) {
	      console.warn("[HMR] Update check failed: " + err.stack || err.message);
	    }
	  }
	
	  function performReload() {
	    if (reload) {
	      if (options.warn) console.warn("[HMR] Reloading page");
	      window.location.reload();
	    }
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./../webpack/buildin/module.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))(module)))

/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxYzliMDk2NzM1NGNjMTc2MjA3ZSIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUGF0dGVybk1hdGNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2FycmF5VXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL3N0cmluZ1V0aWxzLmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRjaGluZy9Ub2tlbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWF0Y2hpbmcvUGF0dGVyblBhdGguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGNoU3RhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hdGNoaW5nL1BhdGhOb2RlLmpzIiwid2VicGFjazovLy8uL3NyYy9QYXR0ZXJuQ29udGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvRGF0YVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbW9kdWxlcy9Cb29sZWFuUGFyc2VyTW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRjaGluZy9QYXR0ZXJuLmpzIiwid2VicGFjazovLy8uL3NyYy92YWx1ZXMvQm9vbGVhblZhbHVlLmpzIiwid2VicGFjazovLy8od2VicGFjayktaG90LW1pZGRsZXdhcmUvY2xpZW50LmpzIiwid2VicGFjazovLy8uL34vc3RyaXAtYW5zaS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2Fuc2ktcmVnZXgvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS1ob3QtbWlkZGxld2FyZS9jbGllbnQtb3ZlcmxheS5qcyIsIndlYnBhY2s6Ly8vLi9+L2Fuc2ktaHRtbC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L2h0bWwtZW50aXRpZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS1ob3QtbWlkZGxld2FyZS9wcm9jZXNzLXVwZGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xDQSxRQUFPLE9BQVAsR0FBaUI7QUFDZixtQkFBZ0Isb0JBQVEsQ0FBUixDQUFoQjtBQUNBLGVBQVksb0JBQVEsRUFBUixDQUFaO0VBRkYsQzs7Ozs7Ozs7Ozs7O0FDQUEsS0FBTSxhQUFhLG9CQUFRLENBQVIsQ0FBYjtBQUNOLEtBQU0sY0FBYyxvQkFBUSxDQUFSLENBQWQ7QUFDTixLQUFNLFFBQVEsb0JBQVEsQ0FBUixDQUFSO0FBQ04sS0FBTSxjQUFjLG9CQUFRLENBQVIsQ0FBZDtBQUNOLEtBQU0sYUFBYSxvQkFBUSxDQUFSLENBQWI7QUFDTixLQUFNLFdBQVcsb0JBQVEsQ0FBUixDQUFYO0FBQ04sS0FBTSxpQkFBaUIsb0JBQVEsQ0FBUixDQUFqQjs7O0FBR04sS0FBTSxvQkFBb0Isc0RBQXBCOzs7Ozs7O0FBT04sVUFBUyxjQUFULENBQXdCLFFBQXhCLEVBQWtDOztBQUVoQyxRQUFLLFFBQUwsR0FBZ0IsRUFBaEI7O0FBRmdDLE9BSWhDLENBQUssZ0JBQUwsR0FBd0IsRUFBeEI7O0FBSmdDLE9BTWhDLENBQUssVUFBTCxHQUFrQixFQUFsQixDQU5nQzs7QUFRaEMsT0FBSSxRQUFKLEVBQWM7QUFDWixVQUFLLFdBQUwsQ0FBaUIsRUFBakIsRUFBcUIsUUFBckIsRUFEWTtJQUFkO0VBUkY7Ozs7O0FBZ0JBLGdCQUFlLFNBQWYsQ0FBeUIsYUFBekIsR0FBeUMsU0FBUyxhQUFULEdBQXlCO0FBQ2hFLFFBQUssUUFBTCxDQUFjLE1BQWQsR0FBdUIsQ0FBdkIsQ0FEZ0U7QUFFaEUsUUFBSyxnQkFBTCxDQUFzQixNQUF0QixHQUErQixDQUEvQixDQUZnRTtFQUF6Qjs7Ozs7OztBQVV6QyxnQkFBZSxTQUFmLENBQXlCLFdBQXpCLEdBQXVDLFNBQVMsV0FBVCxDQUFxQixRQUFyQixFQUErQixXQUEvQixFQUE0Qzs7QUFFakYsT0FBSSxDQUFDLFdBQUQsSUFBZ0IsQ0FBQyxZQUFZLE1BQVosRUFBb0I7QUFDdkMsWUFEdUM7SUFBekM7O0FBSUEsT0FBSSxpQkFBaUIsS0FBSyxRQUFMLENBQWMsUUFBZCxDQUFqQixDQU42RTtBQU9qRixPQUFJLENBQUMsY0FBRCxFQUFpQjtBQUNuQixzQkFBaUIsS0FBSyxRQUFMLENBQWMsUUFBZCxJQUEwQixFQUExQixDQURFO0lBQXJCOztBQUlBLE9BQUksV0FBVyxLQUFLLGdCQUFMLENBQXNCLFFBQXRCLENBQVgsQ0FYNkU7QUFZakYsT0FBSSxDQUFDLFFBQUQsRUFBVztBQUNiLGdCQUFXLEtBQUssZ0JBQUwsQ0FBc0IsUUFBdEIsSUFBa0MsRUFBbEMsQ0FERTtJQUFmOzs7QUFaaUYsT0FpQjNFLFNBQVMsRUFBVCxDQWpCMkU7QUFrQmpGLFFBQUssSUFBSSxlQUFlLENBQWYsRUFBa0IsZUFBZSxZQUFZLE1BQVosRUFBb0IsY0FBOUQsRUFBOEU7QUFDNUUsU0FBTSxJQUFJLFlBQVksWUFBWixDQUFKOzs7QUFEc0UsU0FJeEUsV0FBVyxRQUFYLENBQW9CLGNBQXBCLEVBQW9DLENBQXBDLENBQUosRUFBNEM7QUFDMUMsZ0JBRDBDO01BQTVDOztBQUlBLFNBQU0sY0FBYyxlQUFlLE1BQWYsQ0FSd0Q7QUFTNUUsb0JBQWUsSUFBZixDQUFvQixDQUFwQixFQVQ0RTs7QUFXNUUsU0FBTSxVQUFVLEVBQUUsS0FBRjs7Ozs7O0FBWDRELFdBaUI1RSxDQUFPLE1BQVAsR0FBZ0IsQ0FBaEIsQ0FqQjRFO0FBa0I1RSxTQUFJLGVBQWUsRUFBZixDQWxCd0U7QUFtQjVFLFNBQUksYUFBSixDQW5CNEU7QUFvQjVFLFVBQUssSUFBSSxDQUFKLEVBQU8sSUFBSSxRQUFRLE1BQVIsRUFBZ0IsR0FBaEMsRUFBcUM7QUFDbkMsZUFBUSxRQUFRLENBQVIsQ0FBUjtBQUNFLGNBQUssR0FBTDtBQUNFLGVBQUksQ0FBQyxhQUFhLE1BQWIsRUFBcUI7QUFDeEIsbUJBRHdCO1lBQTFCO0FBR0Esa0JBQU8sSUFBUCxDQUFZLElBQUksS0FBSixDQUFVLFlBQVYsRUFBd0IsSUFBeEIsQ0FBWixFQUpGO0FBS0UsMEJBQWUsRUFBZixDQUxGO0FBTUUsaUJBTkY7QUFERixjQVFPLEdBQUw7QUFDRSxrQkFBTyxJQUFQLENBQVksSUFBSSxLQUFKLENBQVUsWUFBVixFQUF3QixLQUF4QixDQUFaLEVBREY7QUFFRSwwQkFBZSxFQUFmLENBRkY7QUFHRSxpQkFIRjtBQVJGO0FBYUksMkJBQWdCLFFBQVEsQ0FBUixDQUFoQixDQURGO0FBRUUsaUJBRkY7QUFaRixRQURtQztNQUFyQzs7QUFtQkEsU0FBSSxZQUFKLEVBQWtCO0FBQ2hCLGNBQU8sSUFBUCxDQUFZLElBQUksS0FBSixDQUFVLFlBQVYsRUFBd0IsSUFBeEIsQ0FBWixFQURnQjtNQUFsQjs7QUFJQSxTQUFJLENBQUMsT0FBTyxNQUFQLEVBQWU7QUFDbEIsZ0JBRGtCO01BQXBCOzs7Ozs7QUEzQzRFLFNBbUR4RSxPQUFPLElBQVAsQ0FuRHdFO0FBb0Q1RSxTQUFJLFFBQVEsUUFBUixDQXBEd0U7QUFxRDVFLFVBQUssSUFBSSxDQUFKLEVBQU8sSUFBSSxPQUFPLE1BQVAsRUFBZSxHQUEvQixFQUFvQztBQUNsQyxXQUFNLFFBQVEsT0FBTyxDQUFQLENBQVIsQ0FENEI7QUFFbEMsV0FBTSxXQUFXLE1BQU0sUUFBTixFQUFYOztBQUY0QixXQUk5QixXQUFXLE1BQU0sUUFBTixDQUFYLENBSjhCO0FBS2xDLFdBQUksQ0FBQyxRQUFELEVBQVc7QUFDYixvQkFBVyxNQUFNLFFBQU4sSUFBa0IsSUFBSSxXQUFKLEVBQWxCLENBREU7UUFBZjtBQUdBLGNBQU8sUUFBUCxDQVJrQztBQVNsQyxlQUFRLFNBQVMsS0FBVCxDQVQwQjtNQUFwQztBQVdBLFNBQUksSUFBSixFQUFVO0FBQ1IsV0FBSSxDQUFDLEtBQUssZUFBTCxFQUFzQjtBQUN6QixjQUFLLGVBQUwsR0FBdUIsRUFBdkIsQ0FEeUI7UUFBM0I7QUFHQSxXQUFJLEtBQUssZUFBTCxDQUFxQixPQUFyQixDQUE2QixXQUE3QixNQUE4QyxDQUFDLENBQUQsRUFBSTtBQUNwRCxjQUFLLGVBQUwsQ0FBcUIsSUFBckIsQ0FBMEIsV0FBMUIsRUFEb0Q7UUFBdEQ7TUFKRjtJQWhFRjtFQWxCcUM7Ozs7Ozs7O0FBbUd2QyxnQkFBZSxTQUFmLENBQXlCLEtBQXpCLEdBQWlDLFNBQVMsS0FBVCxDQUFlLE9BQWYsRUFBd0IsS0FBeEIsRUFBK0I7QUFDOUQsT0FBSSxDQUFDLEtBQUQsRUFBUTtBQUNWLFlBQU8sRUFBUCxDQURVO0lBQVo7O0FBSUEsT0FBTSxRQUFRLEtBQUssVUFBTCxDQUFnQixPQUFoQixFQUF5QixFQUF6QixDQUFSLENBTHdEO0FBTTlELFFBQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLE1BQU0sTUFBTixFQUFjLEdBQWxDLEVBQXVDO0FBQ3JDLFNBQU0sSUFBSSxNQUFNLE1BQU4sQ0FBYSxDQUFiLENBQUosQ0FEK0I7QUFFckMsU0FBSSxDQUFDLEtBQUssU0FBTCxDQUFlLEtBQWYsRUFBc0IsQ0FBdEIsQ0FBRCxFQUEyQjtBQUM3QixjQUFPLEVBQVAsQ0FENkI7TUFBL0I7SUFGRjs7QUFPQSxPQUFNLFVBQVUsS0FBSyxZQUFMLENBQWtCLEtBQWxCLENBQVY7O0FBYndELFVBZTlELENBQVEsT0FBUixHQWY4RDtBQWdCOUQsVUFBTyxPQUFQLENBaEI4RDtFQUEvQjs7Ozs7Ozs7QUF5QmpDLGdCQUFlLFNBQWYsQ0FBeUIsVUFBekIsR0FBc0MsU0FBUyxVQUFULENBQW9CLE9BQXBCLEVBQTZCLFFBQTdCLEVBQXVDO0FBQzNFLE9BQU0sUUFBUSxLQUFLLGdCQUFMLENBQXNCLFFBQXRCLENBQVIsQ0FEcUU7QUFFM0UsT0FBSSxDQUFDLEtBQUQsRUFBUTtBQUNWLFlBQU8sSUFBUCxDQURVO0lBQVo7O0FBSUEsT0FBTSxRQUFRLElBQUksVUFBSixFQUFSLENBTnFFO0FBTzNFLFNBQU0sUUFBTixHQUFpQixRQUFqQixDQVAyRTtBQVEzRSxTQUFNLE9BQU4sR0FBZ0IsV0FBVyxJQUFJLGNBQUosRUFBWCxDQVIyRDs7QUFVM0UsT0FBTSxPQUFPLElBQUksV0FBSixFQUFQLENBVnFFO0FBVzNFLFFBQUssS0FBTCxHQUFhLEtBQWIsQ0FYMkU7QUFZM0UsT0FBTSxZQUFZLElBQUksUUFBSixDQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsRUFBekIsQ0FBWixDQVpxRTtBQWEzRSxTQUFNLGNBQU4sQ0FBcUIsSUFBckIsQ0FBMEIsU0FBMUIsRUFiMkU7O0FBZTNFLFVBQU8sS0FBUCxDQWYyRTtFQUF2Qzs7Ozs7Ozs7QUF3QnRDLGdCQUFlLFNBQWYsQ0FBeUIsU0FBekIsR0FBcUMsU0FBUyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLENBQTFCLEVBQTZCO0FBQ2hFLE9BQUksQ0FBQyxLQUFELEVBQVE7QUFDVixZQUFPLEtBQVAsQ0FEVTtJQUFaOztBQUlBLE9BQU0saUJBQWlCLE1BQU0sY0FBTixDQUx5QztBQU1oRSxPQUFNLGdCQUFnQixNQUFNLGFBQU4sQ0FOMEM7QUFPaEUsUUFBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksZUFBZSxNQUFmLEVBQXVCLEdBQTNDLEVBQWdEO0FBQzlDLFNBQU0sWUFBWSxlQUFlLENBQWYsQ0FBWjs7OztBQUR3QyxTQUsxQyxDQUFDLFVBQVUsS0FBVixJQUFtQixLQUFLLGFBQUwsQ0FBbUIsTUFBTSxPQUFOLEVBQWUsU0FBbEMsRUFBNkMsSUFBN0MsQ0FBcEIsRUFBd0U7QUFDMUUsWUFBSyxnQkFBTCxDQUFzQixNQUFNLE9BQU4sRUFBZSxVQUFVLElBQVYsQ0FBZSxLQUFmLEVBQXNCLFNBQTNELEVBQXNFLENBQXRFLEVBQXlFLGFBQXpFLEVBQXdGLENBQXhGLEVBRDBFO01BQTVFOzs7QUFMOEMsU0FVMUMsVUFBVSxLQUFWLElBQW1CLElBQW5CLEVBQXlCOztBQUUzQixpQkFBVSxXQUFWLEdBQXdCLEtBQXhCLENBRjJCO0FBRzNCLGlCQUFVLFNBQVYsSUFBdUIsQ0FBdkIsQ0FIMkI7QUFJM0IsV0FBSSxLQUFLLGFBQUwsQ0FBbUIsTUFBTSxPQUFOLEVBQWUsU0FBbEMsRUFBNkMsS0FBN0MsQ0FBSixFQUF5RDtBQUN2RCxrQkFEdUQ7UUFBekQ7TUFKRjtBQVFBLG9CQUFlLE1BQWYsQ0FBc0IsR0FBdEIsRUFBMkIsQ0FBM0IsRUFsQjhDO0lBQWhEO0FBb0JBLGtCQUFlLElBQWYsQ0FBb0IsS0FBcEIsQ0FBMEIsY0FBMUIsRUFBMEMsYUFBMUMsRUEzQmdFO0FBNEJoRSxpQkFBYyxNQUFkLEdBQXVCLENBQXZCLENBNUJnRTs7QUE4QmhFLFVBQU8sZUFBZSxNQUFmLEdBQXdCLENBQXhCLENBOUJ5RDtFQUE3Qjs7Ozs7OztBQXNDckMsZ0JBQWUsU0FBZixDQUF5QixZQUF6QixHQUF3QyxTQUFTLFlBQVQsQ0FBc0IsWUFBdEIsRUFBb0MsRUFBcEM7Ozs7Ozs7QUFTeEMsZ0JBQWUsU0FBZixDQUF5QixpQkFBekIsR0FBNkMsU0FBUyxpQkFBVCxDQUEyQixHQUEzQixFQUFnQyxTQUFoQyxFQUEyQztBQUN0RixRQUFLLFVBQUwsQ0FBZ0IsR0FBaEIsSUFBdUIsU0FBdkIsQ0FEc0Y7RUFBM0M7Ozs7Ozs7OztBQVc3QyxnQkFBZSxTQUFmLENBQXlCLGFBQXpCLEdBQXlDLFNBQVMsYUFBVCxDQUF1QixLQUF2QixFQUE4QixLQUE5QixFQUFxQyxPQUFyQyxFQUE4QztBQUNyRixVQUFPLENBQUMsQ0FBQyxPQUFELElBQVksTUFBTSxNQUFOLElBQWdCLE1BQU0sUUFBTixDQUE3QixJQUFnRCxNQUFNLE1BQU4sSUFBZ0IsTUFBTSxRQUFOLENBRGM7RUFBOUM7Ozs7Ozs7OztBQVd6QyxnQkFBZSxTQUFmLENBQXlCLGFBQXpCLEdBQXlDLFNBQVMsYUFBVCxDQUF1QixPQUF2QixFQUFnQyxJQUFoQyxFQUFzQyxPQUF0QyxFQUErQzs7QUFFdEYsT0FBSSxLQUFLLFdBQUwsRUFBa0I7QUFDcEIsWUFBTyxJQUFQLENBRG9CO0lBQXRCOztBQUlBLE9BQU0sUUFBUSxLQUFLLEtBQUwsQ0FOd0U7QUFPdEYsT0FBTSxZQUFZLEtBQUssU0FBTDs7O0FBUG9FLE9BVWxGLENBQUMsU0FBRCxFQUFZO0FBQ2QsWUFBTyxLQUFQLENBRGM7SUFBaEI7QUFHQSxPQUFJLE1BQU0sVUFBTixFQUFrQjtBQUNwQixZQUFRLE9BQUMsSUFBVyxNQUFNLEtBQU4sS0FBZ0IsU0FBaEIsSUFBK0IsQ0FBQyxPQUFELElBQVksWUFBWSxVQUFaLENBQXVCLE1BQU0sS0FBTixFQUFhLFNBQXBDLENBQVosQ0FEL0I7SUFBdEI7OztBQWJzRixXQWtCOUUsTUFBTSxLQUFOOztBQUVOLFVBQUssR0FBTDtBQUNFLGNBQU8sS0FBSyxhQUFMLENBQW1CLEtBQW5CLEVBQTBCLFNBQTFCLEVBQXFDLE9BQXJDLEtBQWlELFlBQVksUUFBWixDQUFxQixTQUFyQixFQUFnQyxLQUFoQyxDQUFqRCxDQURUO0FBRkYsVUFJTyxTQUFMO0FBQ0UsY0FBTyxLQUFLLGFBQUwsQ0FBbUIsS0FBbkIsRUFBMEIsU0FBMUIsRUFBcUMsT0FBckMsS0FBaUQsWUFBWSxRQUFaLENBQXFCLFNBQXJCLEVBQWdDLE1BQWhDLENBQWpELENBRFQ7QUFKRixVQU1PLFdBQUw7QUFDRSxjQUFPLEtBQUssYUFBTCxDQUFtQixLQUFuQixFQUEwQixTQUExQixFQUFxQyxPQUFyQyxLQUFpRCxZQUFZLFFBQVosQ0FBcUIsU0FBckIsRUFBZ0MsU0FBaEMsQ0FBakQsQ0FEVDtBQU5GLFVBUU8sUUFBTDtBQUNFLGNBQU8sS0FBSyxhQUFMLENBQW1CLEtBQW5CLEVBQTBCLFNBQTFCLEVBQXFDLE9BQXJDLEtBQWlELFlBQVksUUFBWixDQUFxQixTQUFyQixFQUFnQyxpQkFBaEMsQ0FBakQsQ0FEVDtBQVJGLFVBVU8sS0FBTDtBQUNFLGNBQU8sS0FBSyxhQUFMLENBQW1CLEtBQW5CLEVBQTBCLFNBQTFCLEVBQXFDLE9BQXJDLENBQVAsQ0FERjtBQVZGO0FBYUksYUFERjtBQVpGOzs7QUFsQnNGLE9BbUNsRixLQUFLLGdCQUFMLENBQXNCLE1BQU0sS0FBTixDQUExQixFQUF3Qzs7QUFFdEMsU0FBSSxLQUFLLFVBQUwsSUFBbUIsSUFBbkIsRUFBeUI7QUFDM0IsWUFBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxDQUFnQixPQUFoQixFQUF5QixNQUFNLEtBQU4sQ0FBM0MsQ0FEMkI7TUFBN0I7O0FBRnNDLFNBTWxDLE9BQUosRUFBYTtBQUNYLGNBQU8sS0FBSyxVQUFMLENBQWdCLEtBQUssVUFBTCxDQUF2QixDQURXO01BQWI7QUFHQSxZQUFPLEtBQUssU0FBTCxDQUFlLEtBQUssVUFBTCxFQUFpQixVQUFVLFVBQVUsTUFBVixHQUFtQixDQUFuQixDQUExQyxDQUFQLENBVHNDO0lBQXhDOzs7QUFuQ3NGLE9BZ0RoRixZQUFZLEtBQUssVUFBTCxDQUFnQixNQUFNLEtBQU4sQ0FBNUIsQ0FoRGdGO0FBaUR0RixPQUFJLENBQUMsU0FBRCxFQUFZO0FBQ2QsWUFBTyxLQUFQLENBRGM7SUFBaEI7O0FBSUEsVUFBTyxVQUFVLGFBQVYsQ0FBd0IsS0FBeEIsRUFBK0IsU0FBL0IsRUFBMEMsT0FBMUMsQ0FBUCxDQXJEc0Y7RUFBL0M7Ozs7Ozs7Ozs7O0FBaUV6QyxnQkFBZSxTQUFmLENBQXlCLGdCQUF6QixHQUE0QyxTQUFTLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLEtBQW5DLEVBQTBDLElBQTFDLEVBQWdELEdBQWhELEVBQXFELGFBQXJELEVBQW9FLEtBQXBFLEVBQTJFOzs7QUFHckgsUUFBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksTUFBTSxNQUFOLEVBQWMsR0FBbEMsRUFDQTtBQUNFLFNBQU0sWUFBWSxNQUFNLENBQU4sQ0FBWjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFEUixJQURBO0VBSDBDOztBQWlDNUMsUUFBTyxPQUFQLEdBQWlCLGNBQWpCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcFdBOztBQUVBLEtBQUksYUFBYTs7Ozs7OztBQU9oQixZQUFVLGtCQUFTLEVBQVQsRUFBYSxHQUFiLEVBQWtCO0FBQzNCLE9BQUksQ0FBQyxFQUFELEVBQ0gsT0FBTyxLQUFQLENBREQ7O0FBRDJCLE9BSXZCLEdBQUcsT0FBSCxDQUFXLEdBQVgsTUFBb0IsQ0FBQyxDQUFELEVBQ3ZCLE9BQU8sSUFBUCxDQUREOztBQUdBLE9BQUksWUFBYSxDQUFDLENBQUMsR0FBRCxJQUFRLE9BQU8sSUFBSSxNQUFKLEtBQWUsVUFBdEI7OztBQVBDLFFBVXRCLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxHQUFHLE1BQUgsRUFBVyxHQUEvQixFQUFvQztBQUNuQyxRQUFJLFFBQVEsR0FBRyxDQUFILENBQVIsQ0FEK0I7QUFFbkMsUUFBSSxNQUFKLENBRm1DO0FBR25DLFFBQUksU0FBSixFQUNDLFNBQVMsSUFBSSxNQUFKLENBQVcsS0FBWCxDQUFULENBREQsS0FFSyxJQUFJLE9BQU8sTUFBTSxNQUFOLEtBQWlCLFVBQXhCLEVBQ1IsU0FBUyxNQUFNLE1BQU4sQ0FBYSxHQUFiLENBQVQsQ0FESSxLQUdKLFNBQVUsUUFBUSxLQUFSLENBSE47QUFJTCxRQUFJLE1BQUosRUFDQyxPQUFPLElBQVAsQ0FERDtJQVREO0FBWUEsVUFBTyxLQUFQLENBdEIyQjtHQUFsQjtFQVBQOztBQWlDSixRQUFPLE9BQVAsR0FBaUIsVUFBakIsQzs7Ozs7Ozs7Ozs7QUNuQ0E7O0FBRUEsS0FBSSxjQUFjOzs7Ozs7O0FBT2pCLGNBQVksb0JBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUI7QUFDOUIsVUFBTyxDQUFDLENBQUMsR0FBRCxJQUFRLENBQUMsQ0FBQyxHQUFELElBQVMsSUFBSSxNQUFKLEdBQWEsSUFBSSxNQUFKLElBQWlCLElBQUksT0FBSixDQUFZLEdBQVosTUFBcUIsQ0FBckIsQ0FEMUI7R0FBbkI7Ozs7Ozs7OztBQVdaLFlBQVUsa0JBQVMsR0FBVCxFQUFjLEtBQWQsRUFBcUIsVUFBckIsRUFBaUM7QUFDMUMsT0FBSSxDQUFDLEdBQUQsSUFBUSxDQUFDLEtBQUQsRUFDWCxPQUFPLEtBQVAsQ0FERDtBQUVBLFFBQUssSUFBSSxJQUFJLGNBQWMsQ0FBZCxFQUFpQixJQUFJLElBQUksTUFBSixFQUFZLEdBQTlDLEVBQW1EO0FBQ2xELFFBQUksSUFBSSxJQUFJLE1BQUosQ0FBVyxDQUFYLENBQUosQ0FEOEM7QUFFbEQsUUFBSSxNQUFNLE9BQU4sQ0FBYyxDQUFkLE1BQXFCLENBQUMsQ0FBRCxFQUN4QixPQUFPLEtBQVAsQ0FERDtJQUZEO0FBS0EsVUFBTyxJQUFQLENBUjBDO0dBQWpDOztFQWxCUDs7QUErQkosUUFBTyxPQUFQLEdBQWlCLFdBQWpCLEM7Ozs7Ozs7Ozs7QUNsQ0E7Ozs7Ozs7OztBQVFBLEtBQUksUUFBUSxTQUFSLEtBQVEsQ0FBUyxLQUFULEVBQWdCLFVBQWhCLEVBQTRCO0FBQ3ZDLE9BQUssVUFBTCxHQUFrQixDQUFDLENBQUMsVUFBRCxDQURvQjtBQUV2QyxNQUFJLEtBQUssVUFBTCxFQUNKO0FBQ0MsUUFBSyxLQUFMLEdBQWEsS0FBYixDQUREO0FBRUMsUUFBSyxRQUFMLEdBQWdCLEtBQUssUUFBTCxHQUFnQixDQUFoQixDQUZqQjtBQUdDLFVBSEQ7R0FEQTs7QUFPQSxNQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQVQsQ0FBRCxDQUFjLEtBQWQsQ0FBb0IsR0FBcEIsQ0FBUixDQVRtQztBQVV2QyxPQUFLLEtBQUwsR0FBYyxNQUFNLE1BQU4sR0FBZSxDQUFmLEdBQW1CLE1BQU0sQ0FBTixDQUFuQixHQUE4QixFQUE5QixDQVZ5QjtBQVd2QyxNQUFJLE1BQU0sTUFBTixLQUFpQixDQUFqQixFQUNILEtBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsR0FBZ0IsQ0FBaEIsQ0FEakIsS0FFSyxJQUFJLE1BQU0sTUFBTixHQUFlLENBQWYsRUFDVDtBQUNDLFdBQVEsTUFBTSxDQUFOLENBQVI7QUFFQyxTQUFLLEVBQUw7QUFDQyxVQUFLLFFBQUwsR0FBZ0IsQ0FBaEIsQ0FERDtBQUVDLFVBQUssUUFBTCxHQUFnQixDQUFoQixDQUZEO0FBR0MsV0FIRDtBQUZELFNBTU0sR0FBTDtBQUNDLFVBQUssUUFBTCxHQUFnQixDQUFoQixDQUREO0FBRUMsVUFBSyxRQUFMLEdBQWdCLEtBQUssU0FBTCxDQUZqQjtBQUdDLFdBSEQ7QUFORCxTQVVNLEdBQUw7QUFDQyxVQUFLLFFBQUwsR0FBZ0IsQ0FBaEIsQ0FERDtBQUVDLFVBQUssUUFBTCxHQUFnQixLQUFLLFNBQUwsQ0FGakI7QUFHQyxXQUhEO0FBVkQsU0FjTSxHQUFMO0FBQ0MsVUFBSyxRQUFMLEdBQWdCLENBQWhCLENBREQ7QUFFQyxVQUFLLFFBQUwsR0FBZ0IsQ0FBaEIsQ0FGRDtBQUdDLFdBSEQ7QUFkRDtBQW1CRSxTQUFJLGFBQWEsTUFBTSxDQUFOLEVBQVMsS0FBVCxDQUFlLEdBQWYsQ0FBYixDQURMO0FBRUMsU0FBSSxXQUFXLE1BQVgsS0FBc0IsQ0FBdEIsRUFDSCxLQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLEdBQWdCLFNBQVMsV0FBVyxDQUFYLENBQVQsQ0FBaEIsQ0FEakIsS0FFSyxJQUFJLFdBQVcsTUFBWCxJQUFxQixDQUFyQixFQUNUO0FBQ0MsV0FBSyxRQUFMLEdBQWdCLFNBQVMsV0FBVyxDQUFYLEtBQWlCLEdBQWpCLENBQXpCLENBREQ7QUFFQyxXQUFLLFFBQUwsR0FBZ0IsU0FBUyxXQUFXLENBQVgsS0FBaUIsR0FBakIsQ0FBekIsQ0FGRDtNQURLO0FBS0wsV0FURDtBQWxCRCxJQUREO0dBREs7O0FBYmtDLE1BOENuQyxLQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLEVBQ25CLEtBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsQ0FEakI7RUE5Q1c7Ozs7O0FBcURaLE9BQU0sU0FBTixDQUFnQixTQUFoQixHQUE0QixJQUE1Qjs7QUFFQSxPQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsR0FBeUIsVUFBUyxLQUFULEVBQWdCO0FBQ3hDLE1BQUksQ0FBQyxLQUFELEVBQVEsT0FBTyxLQUFQLENBQVo7QUFDQSxTQUFPLE1BQU0sS0FBTixLQUFnQixLQUFLLEtBQUwsSUFDckIsTUFBTSxRQUFOLEtBQW1CLEtBQUssUUFBTCxJQUNuQixNQUFNLFFBQU4sS0FBbUIsS0FBSyxRQUFMLElBQ25CLE1BQU0sVUFBTixLQUFxQixLQUFLLFVBQUwsQ0FMaUI7RUFBaEI7QUFPekIsT0FBTSxTQUFOLENBQWdCLFFBQWhCLEdBQTJCLFlBQVc7QUFDckMsTUFBSSxLQUFLLFVBQUwsRUFDSCxPQUFPLEtBQUssS0FBTCxDQURSO0FBRUEsU0FBTyxLQUFLLEtBQUwsR0FBYSxHQUFiLEdBQW1CLEtBQUssUUFBTCxHQUFnQixHQUFuQyxHQUF5QyxLQUFLLFFBQUwsQ0FIWDtFQUFYOztBQU0zQixRQUFPLE9BQVAsR0FBaUIsS0FBakI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVFQTs7Ozs7OztBQU1BLEtBQUksY0FBYyxTQUFkLFdBQWMsR0FBVzs7QUFFNUIsT0FBSyxLQUFMLEdBQWEsRUFBYjs7QUFGNEIsTUFJNUIsQ0FBSyxlQUFMLEdBQXVCLEVBQXZCLENBSjRCO0VBQVg7QUFPbEIsYUFBWSxTQUFaLENBQXNCLFFBQXRCLEdBQWlDLFlBQVc7QUFDM0MsTUFBSSxVQUFVLENBQUMsS0FBSyxlQUFMLElBQXdCLEVBQXhCLENBQUQsQ0FBNkIsSUFBN0IsQ0FBa0MsSUFBbEMsQ0FBVixDQUR1QztBQUUzQyxNQUFJLFdBQVcsSUFBQyxDQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsVUFBUyxLQUFULEVBQWdCO0FBQzlDLFVBQU8sTUFBTSxRQUFOLEVBQVAsQ0FEOEM7R0FBaEIsQ0FBaEIsQ0FFWCxJQUZXLENBRU4sSUFGTSxDQUFYLENBRnVDO0FBSzNDLFNBQU8sVUFBVSxNQUFWLEdBQW1CLFFBQW5CLENBTG9DO0VBQVg7O0FBUWpDLFFBQU8sT0FBUCxHQUFpQixXQUFqQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JCQTs7QUFFQSxLQUFJLGFBQWEsU0FBYixVQUFhLEdBQVc7QUFDM0IsT0FBSyxRQUFMLEdBQWdCLElBQWhCLENBRDJCO0FBRTNCLE9BQUssY0FBTCxHQUFzQixFQUF0QixDQUYyQjtBQUczQixPQUFLLGFBQUwsR0FBcUIsRUFBckIsQ0FIMkI7O0FBSzNCLE9BQUssT0FBTCxHQUFlLElBQWYsQ0FMMkI7RUFBWDs7QUFRakIsUUFBTyxPQUFQLEdBQWlCLFVBQWpCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWQTs7Ozs7Ozs7OztBQVNBLEtBQUksV0FBVyxTQUFYLFFBQVcsQ0FBUyxLQUFULEVBQWdCLElBQWhCLEVBQXNCLFNBQXRCLEVBQWlDOztBQUUvQyxPQUFLLEtBQUwsR0FBYSxLQUFiOzs7QUFGK0MsTUFLL0MsQ0FBSyxJQUFMLEdBQVksSUFBWjs7O0FBTCtDLE1BUS9DLENBQUssU0FBTCxHQUFpQixTQUFqQjs7O0FBUitDLE1BVy9DLENBQUssS0FBTCxHQUFhLElBQWI7O0FBWCtDLE1BYS9DLENBQUssY0FBTCxHQUFzQixFQUF0Qjs7O0FBYitDLE1BZ0IvQyxDQUFLLFdBQUwsR0FBbUIsSUFBbkI7OztBQWhCK0MsTUFtQi9DLENBQUssVUFBTCxHQUFrQixJQUFsQixDQW5CK0M7RUFBakM7O0FBc0JmLFVBQVMsU0FBVCxDQUFtQixRQUFuQixHQUE4QixZQUFXO0FBQ3hDLFNBQU8sS0FBSyxTQUFMLEdBQWlCLEtBQWpCLEdBQXlCLEtBQUssS0FBTCxDQURRO0VBQVg7O0FBSTlCLFFBQU8sT0FBUCxHQUFpQixRQUFqQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQ0E7O0FBRUEsS0FBSSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBUyxXQUFULEVBQXNCO0FBQzFDLE9BQUssV0FBTCxHQUFtQixlQUFlLElBQUksSUFBSixFQUFmLENBRHVCO0VBQXRCOztBQUlyQixRQUFPLE9BQVAsR0FBaUIsY0FBakI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNDQSxLQUFJLGlCQUFpQixvQkFBUSxDQUFSLENBQWpCO0FBQ0osS0FBSSxpQkFBaUIsb0JBQVEsQ0FBUixDQUFqQjs7QUFFSixLQUFJLGNBQWMsQ0FDakIsb0JBQVEsRUFBUjs7Ozs7Ozs7QUFEaUIsRUFBZDs7Ozs7O0FBZUosS0FBSSx3QkFBd0IsSUFBeEI7O0FBRUosS0FBSSx1QkFBdUIsRUFBdkI7Ozs7Ozs7O0FBU0osVUFBUyxrQkFBVCxDQUE0QixPQUE1QixFQUFxQztBQUNwQyxNQUFJLFVBQVUsSUFBSSxjQUFKLENBQW1CLEVBQW5CLENBQVYsQ0FEZ0M7QUFFcEMsTUFBSSxDQUFDLE9BQUQsRUFDSCxPQUFPLE9BQVAsQ0FERDs7QUFHQSxVQUFRLE9BQVIsQ0FBZ0IsVUFBUyxNQUFULEVBQWlCO0FBQ2hDLE9BQUksU0FBUyxJQUFJLE1BQUosRUFBVCxDQUQ0QjtBQUVoQyxPQUFJLENBQUosRUFBTyxHQUFQOzs7QUFGZ0MsUUFLM0IsSUFBSSxDQUFKLEVBQU8sSUFBSSxPQUFPLFdBQVAsQ0FBbUIsTUFBbkIsRUFBMkIsR0FBM0MsRUFBZ0Q7QUFDL0MsVUFBTSxPQUFPLFdBQVAsQ0FBbUIsQ0FBbkIsQ0FBTixDQUQrQztBQUUvQyxZQUFRLFdBQVIsQ0FBb0IsR0FBcEIsRUFBeUIsT0FBTyxXQUFQLENBQW1CLEdBQW5CLENBQXpCLEVBRitDO0lBQWhEOzs7QUFMZ0MsUUFXM0IsSUFBSSxDQUFKLEVBQU8sSUFBSSxPQUFPLFNBQVAsQ0FBaUIsTUFBakIsRUFBeUIsR0FBekMsRUFBOEM7QUFDN0MsVUFBTSxPQUFPLFNBQVAsQ0FBaUIsQ0FBakIsQ0FBTixDQUQ2QztBQUU3QyxZQUFRLGlCQUFSLENBQTBCLEdBQTFCLEVBQStCLE1BQS9CLEVBRjZDO0lBQTlDO0dBWGUsQ0FBaEIsQ0FMb0M7QUFxQnBDLFNBQU8sT0FBUCxDQXJCb0M7RUFBckM7Ozs7OztBQTRCQSxVQUFTLHdCQUFULEdBQW9DO0FBQ25DLE1BQUksQ0FBQyxxQkFBRCxFQUNILHdCQUF3QixtQkFBbUIsV0FBbkIsQ0FBeEIsQ0FERDtBQUVBLFNBQU8scUJBQVAsQ0FIbUM7RUFBcEM7Ozs7Ozs7O0FBYUEsS0FBSSxhQUFhLFNBQWIsVUFBYSxDQUFTLElBQVQsRUFBZSxPQUFmLEVBQXdCO0FBQ3hDLE1BQUksQ0FBQyxJQUFELElBQVMsQ0FBQyxPQUFELEVBQVU7QUFDdEIsUUFBSyxjQUFMLEdBQXNCLDBCQUF0QixDQURzQjtHQUF2QixNQUVPO0FBQ04sT0FBSSxxQkFBcUIsSUFBckIsQ0FBSixFQUNDLE9BREQ7O0FBR0EsUUFBSyxjQUFMLEdBQXNCLG1CQUFtQixPQUFuQixDQUF0QixDQUpNO0FBS04sd0JBQXFCLElBQXJCLElBQTZCLEtBQUssY0FBTCxDQUx2QjtHQUZQO0VBRGdCOzs7Ozs7OztBQWtCakIsWUFBVyxTQUFYLENBQXFCLEtBQXJCLEdBQTZCLFVBQVMsS0FBVCxFQUFnQixPQUFoQixFQUF5QjtBQUNwRCxNQUFNLGVBQWUsS0FBSyxjQUFMLENBQW9CLEtBQXBCLENBQTBCLFdBQVcsSUFBSSxjQUFKLEVBQVgsRUFBaUMsS0FBM0QsQ0FBZixDQUQ4QztBQUVwRCxTQUFPLGdCQUFnQixFQUFoQixDQUY2QztFQUF6Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtJN0IsUUFBTyxPQUFQLEdBQWlCLFVBQWpCLEM7Ozs7Ozs7Ozs7QUNsT0E7O0FBRUEsS0FBSSxVQUFVLG9CQUFRLEVBQVIsQ0FBVjtBQUNKLEtBQUksZUFBZSxvQkFBUSxFQUFSLENBQWY7Ozs7Ozs7QUFRSixVQUFTLElBQVQsQ0FBYyxLQUFkLEVBQXFCO0FBQ3BCLE1BQUksWUFBWSxLQUFaLENBRGdCO0FBRXBCLE1BQUksT0FBTyxLQUFQLEtBQWlCLFNBQWpCLEVBQ0gsWUFBWSxLQUFaLENBREQsS0FFSyxJQUFJLEtBQUosRUFDTDtBQUNDLE9BQUksYUFBYSxNQUFNLFFBQU4sR0FBaUIsV0FBakIsRUFBYixDQURMO0FBRUMsZUFBYSxLQUFLLEtBQUwsQ0FBVyxVQUFYLENBQXNCLE9BQXRCLENBQThCLFVBQTlCLE1BQThDLENBQUMsQ0FBRCxDQUY1RDtHQURLO0FBS0wsU0FBTyxJQUFJLFlBQUosQ0FBaUIsU0FBakIsQ0FBUCxDQVRvQjtFQUFyQjs7Ozs7QUFlQSxVQUFTLFlBQVQsQ0FBc0IsQ0FBdEIsRUFBeUI7QUFDeEIsT0FBSyxFQUFFLENBQUYsQ0FBTCxFQUR3QjtFQUF6Qjs7QUFJQSxLQUFJLGVBQWUsQ0FDbEIsSUFBSSxPQUFKLENBQVkseUNBQVosRUFBdUQsWUFBdkQsQ0FEa0IsRUFFbEIsSUFBSSxPQUFKLENBQVksMENBQVosRUFBd0QsWUFBeEQsQ0FGa0IsQ0FBZjs7Ozs7O0FBVUosS0FBSSxzQkFBc0IsU0FBdEIsbUJBQXNCLEdBQVc7QUFDcEMsT0FBSyxLQUFMLEdBQWE7QUFDWixlQUFZLENBQUUsR0FBRixFQUFPLE1BQVAsRUFBZSxNQUFmLENBQVo7QUFDQSxnQkFBYSxDQUFFLEdBQUYsRUFBTyxPQUFQLEVBQWdCLFFBQWhCLENBQWI7R0FGRCxDQURvQzs7QUFNcEMsT0FBSyxXQUFMLEdBQW1CLENBQUMsRUFBRCxDQUFuQixDQU5vQztBQU9wQyxPQUFLLFNBQUwsR0FBaUIsQ0FBQyxjQUFELEVBQWlCLGFBQWpCLENBQWpCLENBUG9DO0VBQVg7Ozs7O0FBYTFCLHFCQUFvQixTQUFwQixDQUE4QixXQUE5QixHQUE0QyxVQUFTLEdBQVQsRUFBYztBQUN6RCxNQUFJLFFBQVEsRUFBUixFQUNILE9BQU8sWUFBUCxDQUREO0FBRUEsU0FBTyxFQUFQLENBSHlEO0VBQWQ7O0FBTTVDLFFBQU8sT0FBUCxHQUFpQixtQkFBakI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0RBOztBQUVBLEtBQUksVUFBVSxTQUFWLE9BQVUsQ0FBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCO0FBQ3JDLE9BQUssS0FBTCxHQUFhLFNBQVMsRUFBVCxDQUR3QjtBQUVyQyxPQUFLLE1BQUwsR0FBYyxNQUFkLENBRnFDO0VBQXhCOztBQUtkLFNBQVEsU0FBUixDQUFrQixRQUFsQixHQUE2QixZQUFXO0FBQ3ZDLFNBQU8sS0FBSyxLQUFMLENBRGdDO0VBQVg7QUFHN0IsU0FBUSxTQUFSLENBQWtCLEtBQWxCLEdBQTBCLFVBQVMsT0FBVCxFQUFrQixNQUFsQixFQUEwQjtBQUNuRCxTQUFPLEtBQUssTUFBTCxDQUFZLE9BQVosRUFBcUIsTUFBckIsQ0FBUCxDQURtRDtFQUExQjtBQUcxQixTQUFRLFNBQVIsQ0FBa0IsTUFBbEIsR0FBMkIsVUFBUyxLQUFULEVBQWdCO0FBQzFDLE1BQUksQ0FBQyxLQUFELEVBQVEsT0FBTyxLQUFQLENBQVo7QUFDQSxTQUFPLEtBQUssS0FBTCxLQUFlLE1BQU0sS0FBTixDQUZvQjtFQUFoQjs7QUFLM0IsUUFBTyxPQUFQLEdBQWlCLE9BQWpCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEJBOztBQUVBLEtBQUksZUFBZSxTQUFmLFlBQWUsQ0FBUyxLQUFULEVBQWdCO0FBQ2xDLE9BQUssSUFBTCxHQUFZLENBQUMsQ0FBQyxLQUFELENBRHFCO0VBQWhCO0FBR25CLGNBQWEsU0FBYixDQUF1QixPQUF2QixHQUFpQyxZQUFXO0FBQzNDLFNBQU8sS0FBSyxJQUFMLENBRG9DO0VBQVg7QUFHakMsY0FBYSxTQUFiLENBQXVCLFFBQXZCLEdBQWtDLFlBQVc7QUFDNUMsU0FBTyxLQUFLLElBQUwsQ0FBVSxRQUFWLEVBQVAsQ0FENEM7RUFBWDtBQUdsQyxjQUFhLFNBQWIsQ0FBdUIsTUFBdkIsR0FBZ0MsVUFBUyxLQUFULEVBQWdCO0FBQy9DLE1BQUksRUFBRSxpQkFBaUIsWUFBakIsQ0FBRixFQUNILE9BQU8sS0FBUCxDQUREO0FBRUEsU0FBTyxLQUFLLElBQUwsS0FBYyxNQUFNLElBQU4sQ0FIMEI7RUFBaEI7O0FBTWhDLFFBQU8sT0FBUCxHQUFpQixZQUFqQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEJBLEtBQUksVUFBVTtBQUNaLFNBQU0sZ0JBQU47QUFDQSxZQUFTLEtBQUssSUFBTDtBQUNULFlBQVMsSUFBVDtBQUNBLFdBQVEsS0FBUjtBQUNBLFFBQUssSUFBTDtBQUNBLFNBQU0sSUFBTjtFQU5FO0FBUUosS0FBSSxLQUFKLEVBQXFCO0FBQ25CLE9BQUksY0FBYyxRQUFRLGFBQVIsQ0FBZCxDQURlO0FBRW5CLE9BQUksWUFBWSxZQUFZLEtBQVosQ0FBa0IsZ0JBQWdCLEtBQWhCLENBQXNCLENBQXRCLENBQWxCLENBQVosQ0FGZTtBQUduQixPQUFJLFVBQVUsSUFBVixFQUFnQixRQUFRLElBQVIsR0FBZSxVQUFVLElBQVYsQ0FBbkM7QUFDQSxPQUFJLFVBQVUsT0FBVixFQUFtQixRQUFRLE9BQVIsR0FBa0IsVUFBVSxPQUFWLENBQXpDO0FBQ0EsT0FBSSxVQUFVLE9BQVYsRUFBbUIsUUFBUSxPQUFSLEdBQWtCLFVBQVUsT0FBVixLQUFzQixPQUF0QixDQUF6QztBQUNBLE9BQUksVUFBVSxNQUFWLEVBQWtCLFFBQVEsTUFBUixHQUFpQixVQUFVLE1BQVYsS0FBcUIsT0FBckIsQ0FBdkM7QUFDQSxPQUFJLFVBQVUsTUFBVixJQUFvQixVQUFVLE1BQVYsS0FBcUIsT0FBckIsRUFBOEI7QUFDcEQsYUFBUSxHQUFSLEdBQWMsS0FBZCxDQURvRDtJQUF0RDtBQUdBLE9BQUksVUFBVSxLQUFWLElBQW1CLFVBQVUsS0FBVixLQUFvQixPQUFwQixFQUE2QjtBQUNsRCxhQUFRLEdBQVIsR0FBYyxLQUFkLENBRGtEO0FBRWxELGFBQVEsSUFBUixHQUFlLEtBQWYsQ0FGa0Q7SUFBcEQ7RUFWRjs7QUFnQkEsS0FBSSxPQUFPLE1BQVAsS0FBa0IsV0FBbEIsRUFBK0I7O0VBQW5DLE1BRU8sSUFBSSxPQUFPLE9BQU8sV0FBUCxLQUF1QixXQUE5QixFQUEyQztBQUNwRCxhQUFRLElBQVIsQ0FDRSxtRUFDQSxxRUFEQSxHQUVBLDJFQUZBLENBREYsQ0FEb0Q7SUFBL0MsTUFNQTtBQUNMLGFBQVEsT0FBTyxXQUFQLENBQVIsQ0FESztJQU5BOztBQVVQLFVBQVMsT0FBVCxDQUFpQixXQUFqQixFQUE4QjtBQUM1QixPQUFJLFNBQVMsSUFBSSxXQUFKLENBQWdCLFFBQVEsSUFBUixDQUF6QixDQUR3QjtBQUU1QixPQUFJLGVBQWUsSUFBSSxJQUFKLEVBQWYsQ0FGd0I7O0FBSTVCLFVBQU8sTUFBUCxHQUFnQixZQUFoQixDQUo0QjtBQUs1QixVQUFPLFNBQVAsR0FBbUIsYUFBbkIsQ0FMNEI7QUFNNUIsVUFBTyxPQUFQLEdBQWlCLGdCQUFqQixDQU40Qjs7QUFRNUIsT0FBSSxRQUFRLFlBQVksWUFBVztBQUNqQyxTQUFJLElBQUssSUFBSixLQUFhLFlBQWIsR0FBNkIsUUFBUSxPQUFSLEVBQWlCO0FBQ2pELDBCQURpRDtNQUFuRDtJQURzQixFQUlyQixRQUFRLE9BQVIsR0FBa0IsQ0FBbEIsQ0FKQyxDQVJ3Qjs7QUFjNUIsWUFBUyxZQUFULEdBQXdCO0FBQ3RCLFNBQUksUUFBUSxHQUFSLEVBQWEsUUFBUSxHQUFSLENBQVksaUJBQVosRUFBakI7QUFDQSxvQkFBZSxJQUFJLElBQUosRUFBZixDQUZzQjtJQUF4Qjs7QUFLQSxZQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEI7QUFDNUIsb0JBQWUsSUFBSSxJQUFKLEVBQWYsQ0FENEI7QUFFNUIsU0FBSSxNQUFNLElBQU4sSUFBYyxJQUFkLEVBQThCO0FBQ2hDLGNBRGdDO01BQWxDO0FBR0EsU0FBSTtBQUNGLHNCQUFlLEtBQUssS0FBTCxDQUFXLE1BQU0sSUFBTixDQUExQixFQURFO01BQUosQ0FFRSxPQUFPLEVBQVAsRUFBVztBQUNYLFdBQUksUUFBUSxJQUFSLEVBQWM7QUFDaEIsaUJBQVEsSUFBUixDQUFhLDBCQUEwQixNQUFNLElBQU4sR0FBYSxJQUF2QyxHQUE4QyxFQUE5QyxDQUFiLENBRGdCO1FBQWxCO01BREE7SUFQSjs7QUFjQSxZQUFTLGdCQUFULEdBQTRCO0FBQzFCLG1CQUFjLEtBQWQsRUFEMEI7QUFFMUIsWUFBTyxLQUFQLEdBRjBCO0FBRzFCLGdCQUFXLFlBQVc7QUFBRSxlQUFRLFdBQVIsRUFBRjtNQUFYLEVBQXNDLFFBQVEsT0FBUixDQUFqRCxDQUgwQjtJQUE1QjtFQWpDRjs7QUF5Q0EsS0FBSSxRQUFRLG9CQUFRLEVBQVIsQ0FBUjs7QUFFSixLQUFJLE9BQUo7QUFDQSxLQUFJLE9BQU8sUUFBUCxLQUFvQixXQUFwQixJQUFtQyxRQUFRLE9BQVIsRUFBaUI7QUFDdEQsYUFBVSxvQkFBUSxFQUFSLENBQVYsQ0FEc0Q7RUFBeEQ7O0FBSUEsVUFBUyxRQUFULENBQWtCLElBQWxCLEVBQXdCLEdBQXhCLEVBQTZCO0FBQzNCLE9BQUksUUFBUSxJQUFSLEVBQWM7QUFDaEIsYUFBUSxJQUFSLENBQWEsc0JBQXNCLElBQXRCLEdBQTZCLEdBQTdCLENBQWIsQ0FEZ0I7QUFFaEIsU0FBSSxJQUFKLEVBQVUsT0FBVixDQUFrQixVQUFTLEdBQVQsRUFBYztBQUM5QixlQUFRLElBQVIsQ0FBYSxXQUFXLE1BQU0sR0FBTixDQUFYLENBQWIsQ0FEOEI7TUFBZCxDQUFsQixDQUZnQjtJQUFsQjtBQU1BLE9BQUksV0FBVyxTQUFTLFVBQVQsRUFBcUIsUUFBUSxZQUFSLENBQXFCLElBQXJCLEVBQTJCLElBQUksSUFBSixDQUEzQixFQUFwQztFQVBGOztBQVVBLFVBQVMsT0FBVCxHQUFtQjtBQUNqQixPQUFJLE9BQUosRUFBYSxRQUFRLEtBQVIsR0FBYjtFQURGOztBQUlBLEtBQUksZ0JBQWdCLG9CQUFRLEVBQVIsQ0FBaEI7O0FBRUosS0FBSSxhQUFKO0FBQ0EsVUFBUyxjQUFULENBQXdCLEdBQXhCLEVBQTZCO0FBQzNCLE9BQUksSUFBSSxNQUFKLElBQWMsVUFBZCxFQUEwQjtBQUM1QixTQUFJLFFBQVEsR0FBUixFQUFhLFFBQVEsR0FBUixDQUFZLHlCQUFaLEVBQWpCO0lBREYsTUFFTyxJQUFJLElBQUksTUFBSixJQUFjLE9BQWQsRUFBdUI7QUFDaEMsU0FBSSxRQUFRLEdBQVIsRUFBYSxRQUFRLEdBQVIsQ0FBWSxtQkFBbUIsSUFBSSxJQUFKLEdBQVcsSUFBSSxJQUFKLEdBQVcsR0FBWCxHQUFpQixFQUE1QixDQUFuQixHQUFxRCxhQUFyRCxHQUFxRSxJQUFJLElBQUosR0FBVyxJQUFoRixDQUFaLENBQWpCO0FBQ0EsU0FBSSxJQUFJLE1BQUosQ0FBVyxNQUFYLEdBQW9CLENBQXBCLEVBQXVCO0FBQ3pCLGdCQUFTLFFBQVQsRUFBbUIsR0FBbkIsRUFEeUI7TUFBM0IsTUFFTztBQUNMLFdBQUksSUFBSSxRQUFKLENBQWEsTUFBYixHQUFzQixDQUF0QixFQUF5QixTQUFTLFVBQVQsRUFBcUIsR0FBckIsRUFBN0I7QUFDQSxpQkFGSzs7QUFJTCxxQkFBYyxJQUFJLElBQUosRUFBVSxJQUFJLE9BQUosRUFBYSxPQUFyQyxFQUpLO01BRlA7SUFGSyxNQVVBLElBQUksYUFBSixFQUFtQjtBQUN4QixtQkFBYyxHQUFkLEVBRHdCO0lBQW5CO0VBYlQ7O0FBa0JBLEtBQUksTUFBSixFQUFZO0FBQ1YsVUFBTyxPQUFQLEdBQWlCO0FBQ2YsZ0JBQVcsU0FBUyxTQUFULENBQW1CLE9BQW5CLEVBQTRCO0FBQ3JDLHVCQUFnQixPQUFoQixDQURxQztNQUE1QjtBQUdYLHVCQUFrQixTQUFTLGdCQUFULENBQTBCLGFBQTFCLEVBQXlDO0FBQ3pELGlCQUFVLGFBQVYsQ0FEeUQ7TUFBekM7SUFKcEIsQ0FEVTs7Ozs7Ozs7QUMxSFo7O0FBQ0EsS0FBSSxZQUFZLG9CQUFRLEVBQVIsR0FBWjs7QUFFSixRQUFPLE9BQVAsR0FBaUIsVUFBVSxHQUFWLEVBQWU7QUFDL0IsU0FBTyxPQUFPLEdBQVAsS0FBZSxRQUFmLEdBQTBCLElBQUksT0FBSixDQUFZLFNBQVosRUFBdUIsRUFBdkIsQ0FBMUIsR0FBdUQsR0FBdkQsQ0FEd0I7RUFBZixDOzs7Ozs7QUNIakI7O0FBQ0EsUUFBTyxPQUFQLEdBQWlCLFlBQVk7QUFDNUIsU0FBTyw4RUFBUDtJQUQ0QjtFQUFaLEM7Ozs7Ozs7Ozs7QUNDakIsS0FBSSxnQkFBZ0IsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWhCO0FBQ0osS0FBSSxTQUFTO0FBQ1gsWUFBUyxNQUFUO0FBQ0EsZUFBWSxrQkFBWjtBQUNBLFVBQU8sU0FBUDtBQUNBLGVBQVksS0FBWjtBQUNBLGVBQVksS0FBWjtBQUNBLGVBQVksNEJBQVo7QUFDQSxhQUFVLE1BQVY7QUFDQSxhQUFVLE9BQVY7QUFDQSxXQUFRLElBQVI7QUFDQSxZQUFTLE1BQVQ7QUFDQSxTQUFNLENBQU47QUFDQSxVQUFPLENBQVA7QUFDQSxRQUFLLENBQUw7QUFDQSxXQUFRLENBQVI7QUFDQSxhQUFVLE1BQVY7RUFmRTtBQWlCSixNQUFLLElBQUksR0FBSixJQUFXLE1BQWhCLEVBQXdCO0FBQ3RCLGlCQUFjLEtBQWQsQ0FBb0IsR0FBcEIsSUFBMkIsT0FBTyxHQUFQLENBQTNCLENBRHNCO0VBQXhCOztBQUlBLEtBQUksU0FBUyxJQUFULEVBQWU7QUFDakIsWUFBUyxJQUFULENBQWMsV0FBZCxDQUEwQixhQUExQixFQURpQjtFQUFuQjs7QUFJQSxLQUFJLFdBQVcsb0JBQVEsRUFBUixDQUFYO0FBQ0osS0FBSSxTQUFTO0FBQ1gsVUFBTyxDQUFDLGFBQUQsRUFBZ0IsYUFBaEIsQ0FBUDtBQUNBLFVBQU8sUUFBUDtBQUNBLFFBQUssUUFBTDtBQUNBLFVBQU8sUUFBUDtBQUNBLFdBQVEsUUFBUjtBQUNBLFNBQU0sUUFBTjtBQUNBLFlBQVMsUUFBVDtBQUNBLFNBQU0sUUFBTjtBQUNBLGNBQVcsUUFBWDtBQUNBLGFBQVUsUUFBVjtFQVZFO0FBWUosVUFBUyxTQUFULENBQW1CLE1BQW5COztBQUVBLEtBQUksV0FBVyxvQkFBUSxFQUFSLEVBQXlCLGVBQXpCO0FBQ2YsS0FBSSxXQUFXLElBQUksUUFBSixFQUFYOztBQUVKLFNBQVEsWUFBUixHQUNBLFNBQVMsWUFBVCxDQUFzQixJQUF0QixFQUE0QixLQUE1QixFQUFtQztBQUNqQyxpQkFBYyxTQUFkLEdBQTBCLEVBQTFCLENBRGlDO0FBRWpDLGlCQUFjLEtBQWQsQ0FBb0IsT0FBcEIsR0FBOEIsT0FBOUIsQ0FGaUM7QUFHakMsU0FBTSxPQUFOLENBQWMsVUFBUyxHQUFULEVBQWM7QUFDMUIsV0FBTSxTQUFTLFNBQVMsTUFBVCxDQUFnQixHQUFoQixDQUFULENBQU4sQ0FEMEI7QUFFMUIsU0FBSSxNQUFNLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFOLENBRnNCO0FBRzFCLFNBQUksS0FBSixDQUFVLFlBQVYsR0FBeUIsTUFBekIsQ0FIMEI7QUFJMUIsU0FBSSxTQUFKLEdBQWdCLFlBQVksSUFBWixJQUFvQixNQUFwQixHQUE2QixHQUE3QixDQUpVO0FBSzFCLG1CQUFjLFdBQWQsQ0FBMEIsR0FBMUIsRUFMMEI7SUFBZCxDQUFkLENBSGlDO0VBQW5DOztBQVlBLFNBQVEsS0FBUixHQUNBLFNBQVMsS0FBVCxHQUFpQjtBQUNmLGlCQUFjLFNBQWQsR0FBMEIsRUFBMUIsQ0FEZTtBQUVmLGlCQUFjLEtBQWQsQ0FBb0IsT0FBcEIsR0FBOEIsTUFBOUIsQ0FGZTtFQUFqQjs7QUFLQSxLQUFJLGdCQUFnQjtBQUNsQixXQUFRLE9BQU8sR0FBUDtBQUNSLGFBQVUsT0FBTyxNQUFQO0VBRlI7O0FBS0osVUFBUyxXQUFULENBQXNCLElBQXRCLEVBQTRCO0FBQzFCLE9BQUksUUFBUSxjQUFjLElBQWQsS0FBdUIsT0FBTyxHQUFQLENBRFQ7QUFFMUIsVUFDRSxvQ0FBb0MsS0FBcEMsR0FBNEMscURBQTVDLEdBQ0UsS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLENBQUMsQ0FBRCxDQUFkLENBQWtCLFdBQWxCLEVBREYsR0FFQSxTQUZBLENBSHdCOzs7Ozs7Ozs7OztBQ3RFNUIsUUFBTyxPQUFQLEdBQWlCLFFBQWpCOzs7QUFHQSxLQUFJLFVBQVUsc0ZBQVY7O0FBRUosS0FBSSxhQUFhO0FBQ2YsVUFBTyxDQUFDLEtBQUQsRUFBUSxLQUFSLENBQVA7QUFDQSxVQUFPLEtBQVA7QUFDQSxRQUFLLFFBQUw7QUFDQSxVQUFPLFFBQVA7QUFDQSxXQUFRLFFBQVI7QUFDQSxTQUFNLFFBQU47QUFDQSxZQUFTLFFBQVQ7QUFDQSxTQUFNLFFBQU47QUFDQSxjQUFXLFFBQVg7QUFDQSxhQUFVLEtBQVY7RUFWRTtBQVlKLEtBQUksVUFBVTtBQUNaLE9BQUksT0FBSjtBQUNBLE9BQUksS0FBSjtBQUNBLE9BQUksT0FBSjtBQUNBLE9BQUksUUFBSjtBQUNBLE9BQUksTUFBSjtBQUNBLE9BQUksU0FBSjtBQUNBLE9BQUksTUFBSjtBQUNBLE9BQUksV0FBSjtFQVJFO0FBVUosS0FBSSxZQUFZO0FBQ2QsUUFBSyxrQkFBTDtBQUNBLFFBQUssYUFBTDtBQUNBLFFBQUssS0FBTDtBQUNBLFFBQUssS0FBTDtBQUNBLFFBQUssY0FBTDtBQUNBLFFBQUssT0FBTCxFQU5FOztBQVFKLEtBQUksYUFBYTtBQUNmLFNBQU0sTUFBTjtBQUNBLFNBQU0sTUFBTjtBQUNBLFNBQU0sUUFBTjtBQUhlLEVBQWI7QUFLSixFQUFDLENBQUQsRUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsRUFBaEIsRUFBb0IsRUFBcEIsRUFBd0IsRUFBeEIsRUFBNEIsT0FBNUIsQ0FBb0MsVUFBVSxDQUFWLEVBQWE7QUFDL0MsY0FBVyxDQUFYLElBQWdCLFNBQWhCLENBRCtDO0VBQWIsQ0FBcEM7Ozs7Ozs7QUFTQSxVQUFTLFFBQVQsQ0FBa0IsSUFBbEIsRUFBd0I7O0FBRXRCLE9BQUksQ0FBQyxRQUFRLElBQVIsQ0FBYSxJQUFiLENBQUQsRUFBcUI7QUFDdkIsWUFBTyxJQUFQLENBRHVCO0lBQXpCOzs7QUFGc0IsT0FPbEIsWUFBWSxFQUFaOztBQVBrQixPQVNsQixNQUFNLEtBQUssT0FBTCxDQUFhLGdCQUFiLEVBQStCLFVBQVUsS0FBVixFQUFpQixHQUFqQixFQUFzQjtBQUM3RCxTQUFJLEtBQUssVUFBVSxHQUFWLENBQUwsQ0FEeUQ7QUFFN0QsU0FBSSxFQUFKLEVBQVE7O0FBRU4sV0FBSSxDQUFDLEVBQUMsQ0FBQyxVQUFVLE9BQVYsQ0FBa0IsR0FBbEIsQ0FBRCxFQUF5QjtBQUM3QixtQkFBVSxHQUFWLEdBRDZCO0FBRTdCLGdCQUFPLFNBQVAsQ0FGNkI7UUFBL0I7O0FBRk0sZ0JBT04sQ0FBVSxJQUFWLENBQWUsR0FBZixFQVBNO0FBUU4sY0FBTyxHQUFHLENBQUgsS0FBUyxHQUFULEdBQWUsRUFBZixHQUFvQixrQkFBa0IsRUFBbEIsR0FBdUIsS0FBdkIsQ0FSckI7TUFBUjs7QUFXQSxTQUFJLEtBQUssV0FBVyxHQUFYLENBQUwsQ0FieUQ7QUFjN0QsU0FBSSxFQUFKLEVBQVE7O0FBRU4saUJBQVUsR0FBVixHQUZNO0FBR04sY0FBTyxFQUFQLENBSE07TUFBUjtBQUtBLFlBQU8sRUFBUCxDQW5CNkQ7SUFBdEIsQ0FBckM7OztBQVRrQixPQWdDbEIsSUFBSSxVQUFVLE1BQVYsQ0FoQ2M7QUFpQ3RCLElBQUMsR0FBSSxDQUFKLEtBQVcsT0FBTyxNQUFNLElBQUksQ0FBSixDQUFOLENBQWEsSUFBYixDQUFrQixTQUFsQixDQUFQLENBQVosQ0FqQ3NCOztBQW1DdEIsVUFBTyxHQUFQLENBbkNzQjtFQUF4Qjs7Ozs7O0FBMENBLFVBQVMsU0FBVCxHQUFxQixVQUFVLE1BQVYsRUFBa0I7QUFDckMsT0FBSSxRQUFPLHVEQUFQLElBQWlCLFFBQWpCLEVBQTJCO0FBQzdCLFdBQU0sSUFBSSxLQUFKLENBQVUsdUNBQVYsQ0FBTixDQUQ2QjtJQUEvQjs7QUFJQSxPQUFJLGVBQWUsRUFBZixDQUxpQztBQU1yQyxRQUFLLElBQUksR0FBSixJQUFXLFVBQWhCLEVBQTRCO0FBQzFCLFNBQUksTUFBTSxPQUFPLGNBQVAsQ0FBc0IsR0FBdEIsSUFBNkIsT0FBTyxHQUFQLENBQTdCLEdBQTJDLElBQTNDLENBRGdCO0FBRTFCLFNBQUksQ0FBQyxHQUFELEVBQU07QUFDUixvQkFBYSxHQUFiLElBQW9CLFdBQVcsR0FBWCxDQUFwQixDQURRO0FBRVIsZ0JBRlE7TUFBVjtBQUlBLFNBQUksV0FBVyxHQUFYLEVBQWdCO0FBQ25CLFdBQUcsT0FBTyxHQUFQLElBQWMsUUFBZCxFQUF1QjtBQUN6QixlQUFNLENBQUMsR0FBRCxDQUFOLENBRHlCO1FBQTFCO0FBR0MsV0FBSSxDQUFDLE1BQU0sT0FBTixDQUFjLEdBQWQsQ0FBRCxJQUF1QixJQUFJLE1BQUosSUFBYyxDQUFkLElBQW1CLElBQUksSUFBSixDQUFTLFVBQVUsQ0FBVixFQUFhO0FBQ2hFLGdCQUFPLE9BQU8sQ0FBUCxJQUFZLFFBQVosQ0FEeUQ7UUFBYixDQUFuRCxFQUVFO0FBQ0osZUFBTSxJQUFJLEtBQUosQ0FBVSxtQkFBbUIsR0FBbkIsR0FBeUIsb0ZBQXpCLENBQWhCLENBREk7UUFGTjtBQUtBLFdBQUksY0FBYyxXQUFXLEdBQVgsQ0FBZCxDQVRjO0FBVWxCLFdBQUcsQ0FBQyxJQUFJLENBQUosQ0FBRCxFQUFRO0FBQ1YsYUFBSSxDQUFKLElBQVMsWUFBWSxDQUFaLENBQVQsQ0FEVTtRQUFYO0FBR0EsV0FBSSxJQUFJLE1BQUosSUFBYyxDQUFkLElBQW1CLENBQUMsSUFBSSxDQUFKLENBQUQsRUFBUztBQUMvQixlQUFNLENBQUMsSUFBSSxDQUFKLENBQUQsQ0FBTixDQUQrQjtBQUU5QixhQUFJLElBQUosQ0FBUyxZQUFZLENBQVosQ0FBVCxFQUY4QjtRQUFoQzs7QUFLQSxhQUFNLElBQUksS0FBSixDQUFVLENBQVYsRUFBYSxDQUFiLENBQU4sQ0FsQmtCO01BQXBCLE1BbUJPLElBQUksT0FBTyxHQUFQLElBQWMsUUFBZCxFQUF3QjtBQUNqQyxhQUFNLElBQUksS0FBSixDQUFVLG1CQUFtQixHQUFuQixHQUF5QiwrQ0FBekIsQ0FBaEIsQ0FEaUM7TUFBNUI7QUFHUCxrQkFBYSxHQUFiLElBQW9CLEdBQXBCLENBNUIwQjtJQUE1QjtBQThCQSxZQUFTLFlBQVQsRUFwQ3FDO0VBQWxCOzs7OztBQTBDckIsVUFBUyxLQUFULEdBQWlCLFlBQVU7QUFDMUIsWUFBUyxVQUFULEVBRDBCO0VBQVY7Ozs7OztBQVFqQixVQUFTLElBQVQsR0FBZ0I7QUFDZCxPQUFJLElBQUosR0FBVztBQUNULFlBQU8sU0FBUCxDQURTO0lBQVg7QUFHQSxPQUFJLEtBQUosR0FBWTtBQUNWLFlBQU8sVUFBUCxDQURVO0lBQVo7RUFKRjs7QUFTQSxVQUFTLFFBQVQsQ0FBa0IsTUFBbEIsRUFBMEI7O0FBRXhCLGFBQVUsR0FBVixJQUFpQix5Q0FBeUMsT0FBTyxLQUFQLENBQWEsQ0FBYixDQUF6QyxHQUEyRCxlQUEzRCxHQUE2RSxPQUFPLEtBQVAsQ0FBYSxDQUFiLENBQTdFOztBQUZPLFlBSXhCLENBQVUsR0FBVixJQUFpQixZQUFZLE9BQU8sS0FBUCxDQUFhLENBQWIsQ0FBWixHQUE4QixlQUE5QixHQUFnRCxPQUFPLEtBQVAsQ0FBYSxDQUFiLENBQWhEOztBQUpPLFlBTXhCLENBQVUsSUFBVixJQUFrQixZQUFZLE9BQU8sUUFBUCxDQU5OOztBQVF4QixRQUFLLElBQUksSUFBSixJQUFZLE9BQWpCLEVBQTBCO0FBQ3hCLFNBQUksUUFBUSxRQUFRLElBQVIsQ0FBUixDQURvQjtBQUV4QixTQUFJLFdBQVcsT0FBTyxLQUFQLEtBQWlCLEtBQWpCLENBRlM7QUFHeEIsZUFBVSxJQUFWLElBQWtCLFlBQVksUUFBWixDQUhNO0FBSXhCLFlBQU8sU0FBUyxJQUFULENBQVAsQ0FKd0I7QUFLeEIsZUFBVSxDQUFDLE9BQU8sRUFBUCxDQUFELENBQVksUUFBWixFQUFWLElBQW9DLGlCQUFpQixRQUFqQixDQUxaO0lBQTFCO0VBUkY7O0FBaUJBLFVBQVMsS0FBVCxHOzs7Ozs7OztBQ3ZLQSxRQUFPLE9BQVAsR0FBaUI7QUFDZixnQkFBYSxvQkFBUSxpSkFBUixDQUFiO0FBQ0Esa0JBQWUsb0JBQVEsbUpBQVIsQ0FBZjtBQUNBLGtCQUFlLG9CQUFRLG1KQUFSLENBQWY7QUFDQSxvQkFBaUIsb0JBQVEsbUpBQVIsQ0FBakI7RUFKRixDOzs7Ozs7Ozs7Ozs7Ozs7O0FDUUEsS0FBSSxJQUFDLEVBQVk7QUFDZixTQUFNLElBQUksS0FBSixDQUFVLDJDQUFWLENBQU4sQ0FEZTtFQUFqQjs7QUFJQSxLQUFJLGFBQWEsd0VBQWI7O0FBRUosS0FBSSxRQUFKO0FBQ0EsS0FBSSxrQkFBa0IsRUFBRSxPQUFPLENBQVAsRUFBVSxNQUFNLENBQU4sRUFBOUI7QUFDSixLQUFJLGVBQWUsRUFBRSxrQkFBa0IsSUFBbEIsRUFBakI7O0FBRUosVUFBUyxRQUFULENBQWtCLElBQWxCLEVBQXdCO0FBQ3RCLE9BQUksSUFBSixFQUFVLFdBQVcsSUFBWCxDQUFWO0FBQ0EsVUFBTyxZQUFZLGdCQUFaLENBRmU7RUFBeEI7O0FBS0EsUUFBTyxPQUFQLEdBQWlCLFVBQVMsSUFBVCxFQUFlLFNBQWYsRUFBMEIsT0FBMUIsRUFBbUM7QUFDbEQsT0FBSSxTQUFTLFFBQVEsTUFBUixDQURxQztBQUVsRCxPQUFJLENBQUMsU0FBUyxJQUFULENBQUQsSUFBbUIsT0FBTyxHQUFQLENBQVcsTUFBWCxNQUF1QixNQUF2QixFQUErQjtBQUNwRCxTQUFJLFFBQVEsR0FBUixFQUFhLFFBQVEsR0FBUixDQUFZLDZDQUFaLEVBQWpCO0FBQ0EsYUFGb0Q7SUFBdEQ7O0FBS0EsWUFBUyxLQUFULEdBQWlCO0FBQ2YsWUFBTyxHQUFQLENBQVcsS0FBWCxDQUFpQixVQUFTLEdBQVQsRUFBYyxjQUFkLEVBQThCO0FBQzdDLFdBQUksR0FBSixFQUFTLE9BQU8sWUFBWSxHQUFaLENBQVAsQ0FBVDs7QUFFQSxXQUFHLENBQUMsY0FBRCxFQUFpQjtBQUNsQixhQUFJLFFBQVEsSUFBUixFQUFjO0FBQ2hCLG1CQUFRLElBQVIsQ0FBYSwrQ0FBYixFQURnQjtBQUVoQixtQkFBUSxJQUFSLENBQWEsbURBQWIsRUFGZ0I7VUFBbEI7QUFJQSx5QkFMa0I7QUFNbEIsZ0JBQU8sSUFBUCxDQU5rQjtRQUFwQjs7QUFTQSxjQUFPLEdBQVAsQ0FBVyxLQUFYLENBQWlCLFlBQWpCLEVBQStCLFVBQVMsUUFBVCxFQUFtQixjQUFuQixFQUFtQztBQUNoRSxhQUFJLFFBQUosRUFBYyxPQUFPLFlBQVksUUFBWixDQUFQLENBQWQ7O0FBRUEsYUFBSSxDQUFDLFVBQUQsRUFBYSxRQUFqQjs7QUFFQSxvQkFBVyxjQUFYLEVBQTJCLGNBQTNCLEVBTGdFO1FBQW5DLENBQS9CLENBWjZDO01BQTlCLENBQWpCLENBRGU7SUFBakI7O0FBdUJBLFlBQVMsVUFBVCxDQUFvQixjQUFwQixFQUFvQyxjQUFwQyxFQUFvRDtBQUNsRCxTQUFJLG9CQUFvQixlQUFlLE1BQWYsQ0FBc0IsVUFBUyxRQUFULEVBQW1CO0FBQy9ELGNBQU8sa0JBQWtCLGVBQWUsT0FBZixDQUF1QixRQUF2QixJQUFtQyxDQUFuQyxDQURzQztNQUFuQixDQUExQyxDQUQ4Qzs7QUFLbEQsU0FBRyxrQkFBa0IsTUFBbEIsR0FBMkIsQ0FBM0IsRUFBOEI7QUFDL0IsV0FBSSxRQUFRLElBQVIsRUFBYztBQUNoQixpQkFBUSxJQUFSLENBQ0UsMERBQ0Esd0JBREEsR0FFQSx5REFGQSxHQUdBLGdFQUhBLEdBSUEsTUFKQSxHQUlTLFVBSlQsR0FJc0Isb0JBSnRCLENBREYsQ0FEZ0I7QUFRaEIsMkJBQWtCLE9BQWxCLENBQTBCLFVBQVMsUUFBVCxFQUFtQjtBQUMzQyxtQkFBUSxJQUFSLENBQWEsY0FBYyxVQUFVLFFBQVYsQ0FBZCxDQUFiLENBRDJDO1VBQW5CLENBQTFCLENBUmdCO1FBQWxCO0FBWUEsdUJBYitCO0FBYy9CLGNBZCtCO01BQWpDOztBQWlCQSxTQUFJLFFBQVEsR0FBUixFQUFhO0FBQ2YsV0FBRyxDQUFDLGNBQUQsSUFBbUIsZUFBZSxNQUFmLEtBQTBCLENBQTFCLEVBQTZCO0FBQ2pELGlCQUFRLEdBQVIsQ0FBWSw0QkFBWixFQURpRDtRQUFuRCxNQUVPO0FBQ0wsaUJBQVEsR0FBUixDQUFZLHdCQUFaLEVBREs7QUFFTCx3QkFBZSxPQUFmLENBQXVCLFVBQVMsUUFBVCxFQUFtQjtBQUN4QyxtQkFBUSxHQUFSLENBQVksY0FBYyxVQUFVLFFBQVYsQ0FBZCxDQUFaLENBRHdDO1VBQW5CLENBQXZCLENBRks7UUFGUDs7QUFTQSxXQUFJLFVBQUosRUFBZ0I7QUFDZCxpQkFBUSxHQUFSLENBQVksMEJBQVosRUFEYztRQUFoQjtNQVZGO0lBdEJGOztBQXNDQSxZQUFTLFdBQVQsQ0FBcUIsR0FBckIsRUFBMEI7QUFDeEIsU0FBSSxPQUFPLEdBQVAsQ0FBVyxNQUFYLE1BQXVCLGVBQXZCLEVBQXdDO0FBQzFDLFdBQUksUUFBUSxJQUFSLEVBQWM7QUFDaEIsaUJBQVEsSUFBUixDQUFhLG9EQUFiLEVBRGdCO0FBRWhCLGlCQUFRLElBQVIsQ0FBYSxXQUFXLElBQUksS0FBSixJQUFhLElBQUksT0FBSixDQUFyQyxDQUZnQjtRQUFsQjtBQUlBLHVCQUwwQztBQU0xQyxjQU4wQztNQUE1QztBQVFBLFNBQUksUUFBUSxJQUFSLEVBQWM7QUFDaEIsZUFBUSxJQUFSLENBQWEsZ0NBQWdDLElBQUksS0FBSixJQUFhLElBQUksT0FBSixDQUExRCxDQURnQjtNQUFsQjtJQVRGOztBQWNBLFlBQVMsYUFBVCxHQUF5QjtBQUN2QixTQUFJLE1BQUosRUFBWTtBQUNWLFdBQUksUUFBUSxJQUFSLEVBQWMsUUFBUSxJQUFSLENBQWEsc0JBQWIsRUFBbEI7QUFDQSxjQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsR0FGVTtNQUFaO0lBREY7RUFsRmUsQyIsImZpbGUiOiJkYXRhcGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0YVBhcnNlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJEYXRhUGFyc2VyXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2pzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgMWM5YjA5NjczNTRjYzE3NjIwN2VcbiAqKi8iLCIvKipcclxuICogRW50cnkgcG9pbnQgZm9yIHRoZSBEYXRhUGFyc2VyIGxpYnJhcnlcclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBQYXR0ZXJuTWF0Y2hlcjogcmVxdWlyZSgnLi9zcmMvUGF0dGVybk1hdGNoZXInKSxcclxuICBEYXRhUGFyc2VyOiByZXF1aXJlKCcuL3NyYy9EYXRhUGFyc2VyJyksXHJcbn07XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vaW5kZXguanNcbiAqKi8iLCIvKipcclxuICogTWF0Y2hlcyBwYXR0ZXJucyBhY2NvcmRpbmcgdG8gcmVnaXN0ZXJlZCBydWxlc1xyXG4gKi9cclxuXHJcbmNvbnN0IGFycmF5VXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzL2FycmF5VXRpbHMnKTtcclxuY29uc3Qgc3RyaW5nVXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzL3N0cmluZ1V0aWxzJyk7XHJcbmNvbnN0IFRva2VuID0gcmVxdWlyZSgnLi9tYXRjaGluZy9Ub2tlbicpO1xyXG5jb25zdCBQYXR0ZXJuUGF0aCA9IHJlcXVpcmUoJy4vbWF0Y2hpbmcvUGF0dGVyblBhdGgnKTtcclxuY29uc3QgTWF0Y2hTdGF0ZSA9IHJlcXVpcmUoJy4vTWF0Y2hTdGF0ZScpO1xyXG5jb25zdCBQYXRoTm9kZSA9IHJlcXVpcmUoJy4vbWF0Y2hpbmcvUGF0aE5vZGUnKTtcclxuY29uc3QgUGF0dGVybkNvbnRleHQgPSByZXF1aXJlKCcuL1BhdHRlcm5Db250ZXh0Jyk7XHJcblxyXG4vKiogQGNvbnN0ICovXHJcbmNvbnN0IExFVFRFUl9DSEFSQUNURVJTID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonO1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIG5ldyBwYXR0ZXJuIG1hdGNoZXIgd2l0aCB0aGUgZ2l2ZW4gYmFzZSBwYXR0ZXJuc1xyXG4gKiBAcGFyYW0gcGF0dGVybnNcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBQYXR0ZXJuTWF0Y2hlcihwYXR0ZXJucykge1xyXG4gIC8vIEFsbCBjdXJyZW50bHkgYWN0aXZlIHBhdHRlcm5zXHJcbiAgdGhpcy5wYXR0ZXJucyA9IHt9O1xyXG4gIC8vIEFsbCBhY3RpdmUgcGF0dGVybnMgY29tcGlsZWQgZm9yIHVzZVxyXG4gIHRoaXMuY29tcGlsZWRQYXR0ZXJucyA9IHt9O1xyXG4gIC8vIEFsbCByZWdpc3RlcmVkIHZhbGlkYXRvcnNcclxuICB0aGlzLnZhbGlkYXRvcnMgPSB7fTtcclxuXHJcbiAgaWYgKHBhdHRlcm5zKSB7XHJcbiAgICB0aGlzLmFkZFBhdHRlcm5zKCcnLCBwYXR0ZXJucyk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ2xlYXIgYWxsIGNvbXBpbGVkIHBhdHRlcm5zXHJcbiAqL1xyXG5QYXR0ZXJuTWF0Y2hlci5wcm90b3R5cGUuY2xlYXJQYXR0ZXJucyA9IGZ1bmN0aW9uIGNsZWFyUGF0dGVybnMoKSB7XHJcbiAgdGhpcy5wYXR0ZXJucy5sZW5ndGggPSAwO1xyXG4gIHRoaXMuY29tcGlsZWRQYXR0ZXJucy5sZW5ndGggPSAwO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZCBtb3JlIHBhdHRlcm5zIHRvIHRoZSBjb21waWxlZCBvbmVzXHJcbiAqIEBwYXJhbSBtYXRjaFRhZ1xyXG4gKiBAcGFyYW0gbmV3UGF0dGVybnNcclxuICovXHJcblBhdHRlcm5NYXRjaGVyLnByb3RvdHlwZS5hZGRQYXR0ZXJucyA9IGZ1bmN0aW9uIGFkZFBhdHRlcm5zKG1hdGNoVGFnLCBuZXdQYXR0ZXJucykge1xyXG4gIC8vIGlmIG5vIHBhdHRlcm5zIGFyZSBpbiB0aGUgbGlzdCB0aGVuIHRoZXJlJ3Mgbm90aGluZyB0byBkb1xyXG4gIGlmICghbmV3UGF0dGVybnMgfHwgIW5ld1BhdHRlcm5zLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgbGV0IHRhcmdldFBhdHRlcm5zID0gdGhpcy5wYXR0ZXJuc1ttYXRjaFRhZ107XHJcbiAgaWYgKCF0YXJnZXRQYXR0ZXJucykge1xyXG4gICAgdGFyZ2V0UGF0dGVybnMgPSB0aGlzLnBhdHRlcm5zW21hdGNoVGFnXSA9IFtdO1xyXG4gIH1cclxuXHJcbiAgbGV0IHBhdGhSb290ID0gdGhpcy5jb21waWxlZFBhdHRlcm5zW21hdGNoVGFnXTtcclxuICBpZiAoIXBhdGhSb290KSB7XHJcbiAgICBwYXRoUm9vdCA9IHRoaXMuY29tcGlsZWRQYXR0ZXJuc1ttYXRjaFRhZ10gPSB7fTtcclxuICB9XHJcblxyXG4gIC8vIHBhcnNlIGVhY2ggcGF0dGVybiBpbnRvIHRva2VucyBhbmQgdGhlbiBwYXJzZSB0aGUgdG9rZW5zXHJcbiAgY29uc3QgdG9rZW5zID0gW107XHJcbiAgZm9yIChsZXQgcGF0dGVybkluZGV4ID0gMDsgcGF0dGVybkluZGV4IDwgbmV3UGF0dGVybnMubGVuZ3RoOyBwYXR0ZXJuSW5kZXgrKykge1xyXG4gICAgY29uc3QgcCA9IG5ld1BhdHRlcm5zW3BhdHRlcm5JbmRleF07XHJcblxyXG4gICAgLy8gaWYgdGhlIHBhdHRlcm4gd2FzIGFkZGVkIGJlZm9yZSB0aGVuIGRvbid0IGRvIGl0IGFnYWluXHJcbiAgICBpZiAoYXJyYXlVdGlscy5jb250YWlucyh0YXJnZXRQYXR0ZXJucywgcCkpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGFyZ2V0SW5kZXggPSB0YXJnZXRQYXR0ZXJucy5sZW5ndGg7XHJcbiAgICB0YXJnZXRQYXR0ZXJucy5wdXNoKHApO1xyXG5cclxuICAgIGNvbnN0IHBhdHRlcm4gPSBwLm1hdGNoO1xyXG5cclxuICAgIC8vXHJcbiAgICAvLyBwYXJzZSB0aGUgcGF0dGVybiBpbnRvIHRva2Vuc1xyXG4gICAgLy9cclxuXHJcbiAgICB0b2tlbnMubGVuZ3RoID0gMDtcclxuICAgIGxldCBjdXJyZW50VG9rZW4gPSAnJztcclxuICAgIGxldCBpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHBhdHRlcm4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgc3dpdGNoIChwYXR0ZXJuW2ldKSB7XHJcbiAgICAgICAgY2FzZSAneyc6XHJcbiAgICAgICAgICBpZiAoIWN1cnJlbnRUb2tlbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0b2tlbnMucHVzaChuZXcgVG9rZW4oY3VycmVudFRva2VuLCB0cnVlKSk7XHJcbiAgICAgICAgICBjdXJyZW50VG9rZW4gPSAnJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ30nOlxyXG4gICAgICAgICAgdG9rZW5zLnB1c2gobmV3IFRva2VuKGN1cnJlbnRUb2tlbiwgZmFsc2UpKTtcclxuICAgICAgICAgIGN1cnJlbnRUb2tlbiA9ICcnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGN1cnJlbnRUb2tlbiArPSBwYXR0ZXJuW2ldO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoY3VycmVudFRva2VuKSB7XHJcbiAgICAgIHRva2Vucy5wdXNoKG5ldyBUb2tlbihjdXJyZW50VG9rZW4sIHRydWUpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRva2Vucy5sZW5ndGgpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9cclxuICAgIC8vIENvbXBpbGUgdGhlIHRva2VucyBpbnRvIHRoZSB0cmVlXHJcbiAgICAvL1xyXG5cclxuICAgIGxldCBwYXRoID0gbnVsbDtcclxuICAgIGxldCBwYXRocyA9IHBhdGhSb290O1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1tpXTtcclxuICAgICAgY29uc3QgdG9rZW5LZXkgPSB0b2tlbi50b1N0cmluZygpO1xyXG4gICAgICAvLyBjaGVjayBpZiB0aGUgZXhhY3Qgc2FtZSBub2RlIGV4aXN0cyBhbmQgdGFrZSBpdCBpZiBpdCBkb2VzXHJcbiAgICAgIGxldCBuZXh0UGF0aCA9IHBhdGhzW3Rva2VuS2V5XTtcclxuICAgICAgaWYgKCFuZXh0UGF0aCkge1xyXG4gICAgICAgIG5leHRQYXRoID0gcGF0aHNbdG9rZW5LZXldID0gbmV3IFBhdHRlcm5QYXRoKCk7XHJcbiAgICAgIH1cclxuICAgICAgcGF0aCA9IG5leHRQYXRoO1xyXG4gICAgICBwYXRocyA9IG5leHRQYXRoLnBhdGhzO1xyXG4gICAgfVxyXG4gICAgaWYgKHBhdGgpIHtcclxuICAgICAgaWYgKCFwYXRoLm1hdGNoZWRQYXR0ZXJucykge1xyXG4gICAgICAgIHBhdGgubWF0Y2hlZFBhdHRlcm5zID0gW107XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHBhdGgubWF0Y2hlZFBhdHRlcm5zLmluZGV4T2YodGFyZ2V0SW5kZXgpID09PSAtMSkge1xyXG4gICAgICAgIHBhdGgubWF0Y2hlZFBhdHRlcm5zLnB1c2godGFyZ2V0SW5kZXgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1hdGNoIHRoZSB2YWx1ZSBhZ2FpbnN0IGFsbCBwYXR0ZXJucyBhbmQgcmV0dXJuIHRoZSBvbmVzIHRoYXQgZml0XHJcbiAqIEBwYXJhbSBjb250ZXh0IC0gVGhlIGN1cnJlbnQgY29udGV4dCBmb3IgbWF0Y2hpbmdcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqIEByZXR1cm5zIHsqfVxyXG4gKi9cclxuUGF0dGVybk1hdGNoZXIucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24gbWF0Y2goY29udGV4dCwgdmFsdWUpIHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBjb25zdCBzdGF0ZSA9IHRoaXMubWF0Y2hTdGFydChjb250ZXh0LCAnJyk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgYyA9IHZhbHVlLmNoYXJBdChpKTtcclxuICAgIGlmICghdGhpcy5tYXRjaE5leHQoc3RhdGUsIGMpKSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHJlc3VsdHMgPSB0aGlzLm1hdGNoUmVzdWx0cyhzdGF0ZSk7XHJcbiAgLy8gcmV2ZXJzZSByZXN1bHRzIHNpbmNlIHRoZSBsb25nZXN0IG1hdGNoZXMgd2lsbCBiZSBmb3VuZCBsYXN0IGJ1dCBhcmUgdGhlIG1vc3Qgc3BlY2lmaWNcclxuICByZXN1bHRzLnJldmVyc2UoKTtcclxuICByZXR1cm4gcmVzdWx0cztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBCZWdpbiBhIHBhcnNpbmcgc2Vzc2lvblxyXG4gKiBAcGFyYW0gY29udGV4dFxyXG4gKiBAcGFyYW0gbWF0Y2hUYWdcclxuICogQHJldHVybnMge01hdGNoU3RhdGV9XHJcbiAqL1xyXG5QYXR0ZXJuTWF0Y2hlci5wcm90b3R5cGUubWF0Y2hTdGFydCA9IGZ1bmN0aW9uIG1hdGNoU3RhcnQoY29udGV4dCwgbWF0Y2hUYWcpIHtcclxuICBjb25zdCByb290cyA9IHRoaXMuY29tcGlsZWRQYXR0ZXJuc1ttYXRjaFRhZ107XHJcbiAgaWYgKCFyb290cykge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBjb25zdCBzdGF0ZSA9IG5ldyBNYXRjaFN0YXRlKCk7XHJcbiAgc3RhdGUubWF0Y2hUYWcgPSBtYXRjaFRhZztcclxuICBzdGF0ZS5jb250ZXh0ID0gY29udGV4dCB8fCBuZXcgUGF0dGVybkNvbnRleHQoKTtcclxuXHJcbiAgY29uc3Qgcm9vdCA9IG5ldyBQYXR0ZXJuUGF0aCgpO1xyXG4gIHJvb3QucGF0aHMgPSByb290cztcclxuICBjb25zdCBzdGFydE5vZGUgPSBuZXcgUGF0aE5vZGUobnVsbCwgcm9vdCwgJycpO1xyXG4gIHN0YXRlLmNhbmRpZGF0ZVBhdGhzLnB1c2goc3RhcnROb2RlKTtcclxuXHJcbiAgcmV0dXJuIHN0YXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1hdGNoIHRoZSBuZXh0IGNoYXJhY3RlclxyXG4gKiBAcGFyYW0gc3RhdGUge01hdGNoU3RhdGV9IC0gVGhlIGN1cnJlbnQgbWF0Y2hpbmcgc3RhdGVcclxuICogQHBhcmFtIGMge1N0cmluZ30gLSBUaGUgbmV4dCBjaGFyYWN0ZXJcclxuICogQHJldHVybnMge2Jvb2xlYW59IC0gdHJ1ZSBpZiB0aGlzIGlzIHN0aWxsIGEgdmFsaWQgbWF0Y2gsIGZhbHNlIG90aGVyd2lzZVxyXG4gKi9cclxuUGF0dGVybk1hdGNoZXIucHJvdG90eXBlLm1hdGNoTmV4dCA9IGZ1bmN0aW9uIG1hdGNoTmV4dChzdGF0ZSwgYykge1xyXG4gIGlmICghc3RhdGUpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNhbmRpZGF0ZVBhdGhzID0gc3RhdGUuY2FuZGlkYXRlUGF0aHM7XHJcbiAgY29uc3QgbmV3Q2FuZGlkYXRlcyA9IHN0YXRlLm5ld0NhbmRpZGF0ZXM7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYW5kaWRhdGVQYXRocy5sZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgY2FuZGlkYXRlID0gY2FuZGlkYXRlUGF0aHNbaV07XHJcblxyXG4gICAgLy8gZmlyc3QgY2hlY2sgaWYgYW55IG9mIHRoZSBjaGlsZCBub2RlcyB2YWxpZGF0ZSB3aXRoIHRoZSBuZXcgY2hhcmFjdGVyIGFuZCByZW1lbWJlciB0aGVtIGFzIGNhbmRpZGF0ZXNcclxuICAgIC8vIGFueSBjaGlsZHJlbiBjYW4gb25seSBiZSBjYW5kaWRhdGVzIGlmIHRoZSBmaW5hbCB2YWxpZGF0aW9uIG9mIHRoZSBjdXJyZW50IHZhbHVlIHN1Y2NlZWRzXHJcbiAgICBpZiAoIWNhbmRpZGF0ZS50b2tlbiB8fCB0aGlzLnZhbGlkYXRlVG9rZW4oc3RhdGUuY29udGV4dCwgY2FuZGlkYXRlLCB0cnVlKSkge1xyXG4gICAgICB0aGlzLnZhbGlkYXRlQ2hpbGRyZW4oc3RhdGUuY29udGV4dCwgY2FuZGlkYXRlLnBhdGgucGF0aHMsIGNhbmRpZGF0ZSwgYywgbmV3Q2FuZGlkYXRlcywgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdG9rZW4gY2FuIGJlIG51bGwgZm9yIHRoZSByb290IG5vZGUgYnV0IG5vIHZhbGlkYXRpb24gbmVlZHMgdG8gYmUgZG9uZSBmb3IgdGhhdFxyXG4gICAgaWYgKGNhbmRpZGF0ZS50b2tlbiAhPSBudWxsKSB7XHJcbiAgICAgIC8vIHZhbGlkYXRlIHRoaXMgY2FuZGlkYXRlIGFuZCByZW1vdmUgaXQgaWYgaXQgZG9lc24ndCB2YWxpZGF0ZSBhbnltb3JlXHJcbiAgICAgIGNhbmRpZGF0ZS5pc0ZpbmFsaXplZCA9IGZhbHNlO1xyXG4gICAgICBjYW5kaWRhdGUudGV4dFZhbHVlICs9IGM7XHJcbiAgICAgIGlmICh0aGlzLnZhbGlkYXRlVG9rZW4oc3RhdGUuY29udGV4dCwgY2FuZGlkYXRlLCBmYWxzZSkpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2FuZGlkYXRlUGF0aHMuc3BsaWNlKGktLSwgMSk7XHJcbiAgfVxyXG4gIGNhbmRpZGF0ZVBhdGhzLnB1c2guYXBwbHkoY2FuZGlkYXRlUGF0aHMsIG5ld0NhbmRpZGF0ZXMpO1xyXG4gIG5ld0NhbmRpZGF0ZXMubGVuZ3RoID0gMDtcclxuXHJcbiAgcmV0dXJuIGNhbmRpZGF0ZVBhdGhzLmxlbmd0aCA+IDA7XHJcbn07XHJcblxyXG4vKipcclxuICogQXNzZW1ibGUgdGhlIHJlc3VsdHMgYWZ0ZXIgdGhlIGxhc3QgY2hhcmFjdGVyIGhhcyBiZWVuIG1hdGNoZWRcclxuICogQHBhcmFtIGN1cnJlbnRTdGF0ZSB7TWF0Y2hTdGF0ZX0gLSBUaGUgY3VycmVudCBtYXRjaGluZyBzdGF0ZVxyXG4gKiBAcmV0dXJucyB7T2JqZWN0W119IC0gVGhlIGxpc3Qgb2YgbWF0Y2hlc1xyXG4gKi9cclxuUGF0dGVybk1hdGNoZXIucHJvdG90eXBlLm1hdGNoUmVzdWx0cyA9IGZ1bmN0aW9uIG1hdGNoUmVzdWx0cyhjdXJyZW50U3RhdGUpIHtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogUmVnaXN0ZXIgYSB2YWxpZGF0aW9uIG9iamVjdCBmb3IgdGhlIHRhZ1xyXG4gKiBAcGFyYW0gdGFnXHJcbiAqIEBwYXJhbSB2YWxpZGF0b3JcclxuICovXHJcblBhdHRlcm5NYXRjaGVyLnByb3RvdHlwZS5yZWdpc3RlclZhbGlkYXRvciA9IGZ1bmN0aW9uIHJlZ2lzdGVyVmFsaWRhdG9yKHRhZywgdmFsaWRhdG9yKSB7XHJcbiAgdGhpcy52YWxpZGF0b3JzW3RhZ10gPSB2YWxpZGF0b3I7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIHZhbHVlIGlzIHdpdGhpbiB0aGUgcmVxdWlyZWQgbGVuZ3RoIGZvciB0b2tlblxyXG4gKiBAcGFyYW0gdG9rZW5cclxuICogQHBhcmFtIHZhbHVlXHJcbiAqIEBwYXJhbSBpc0ZpbmFsXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuUGF0dGVybk1hdGNoZXIucHJvdG90eXBlLnZhbGlkYXRlQ291bnQgPSBmdW5jdGlvbiB2YWxpZGF0ZUNvdW50KHRva2VuLCB2YWx1ZSwgaXNGaW5hbCkge1xyXG4gIHJldHVybiAoIWlzRmluYWwgfHwgdmFsdWUubGVuZ3RoID49IHRva2VuLm1pbkNvdW50KSAmJiB2YWx1ZS5sZW5ndGggPD0gdG9rZW4ubWF4Q291bnQ7XHJcbn07XHJcblxyXG4vKipcclxuICogQWRkIHRoZSBuZXh0IGNoYXJhY3RlciB0byB0aGUgbWF0Y2hlZCBwYXRoXHJcbiAqIEBwYXJhbSBjb250ZXh0IHtQYXR0ZXJuQ29udGV4dH0gLSBUaGUgY3VycmVudCBtYXRjaGluZyBjb250ZXh0XHJcbiAqIEBwYXJhbSBub2RlIHtQYXRoTm9kZX0gLSBUaGUgbm9kZSB3ZSBhcmUgdmFsaWRhdGluZ1xyXG4gKiBAcGFyYW0gaXNGaW5hbCB7Ym9vbGVhbn0gLSBUcnVlIGlmIHRoaXMgaXMgdGhlIGZpbmFsIG1hdGNoIGFuZCBubyBmdXJ0aGVyIHZhbHVlcyB3aWxsIGJlIGFkZGVkXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSAtIHRydWUgaWYgdGhlIHZhbHVlIGNhbiBiZSBwYXJzZWQgc3VjY2Vzc2Z1bGx5IHVzaW5nIHRoZSB0b2tlblxyXG4gKi9cclxuUGF0dGVybk1hdGNoZXIucHJvdG90eXBlLnZhbGlkYXRlVG9rZW4gPSBmdW5jdGlvbiB2YWxpZGF0ZVRva2VuKGNvbnRleHQsIG5vZGUsIGlzRmluYWwpIHtcclxuICAvLyBpZiBpdCBpcyBmaW5hbGl6ZWQgdGhlbiBpdCBpcyBkZWZpbml0ZWx5IGFsc28gdmFsaWRcclxuICBpZiAobm9kZS5pc0ZpbmFsaXplZCkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBjb25zdCB0b2tlbiA9IG5vZGUudG9rZW47XHJcbiAgY29uc3QgdGV4dFZhbHVlID0gbm9kZS50ZXh0VmFsdWU7XHJcblxyXG4gIC8vIG1hdGNoIGV4YWN0IHZhbHVlcyBmaXJzdFxyXG4gIGlmICghdGV4dFZhbHVlKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIGlmICh0b2tlbi5leGFjdE1hdGNoKSB7XHJcbiAgICByZXR1cm4gKChpc0ZpbmFsICYmIHRva2VuLnZhbHVlID09PSB0ZXh0VmFsdWUpIHx8ICghaXNGaW5hbCAmJiBzdHJpbmdVdGlscy5zdGFydHNXaXRoKHRva2VuLnZhbHVlLCB0ZXh0VmFsdWUpKSk7XHJcbiAgfVxyXG5cclxuICAvLyB0ZXN0IGluYnVpbHQgdG9rZW5zIGZpcnN0XHJcbiAgc3dpdGNoICh0b2tlbi52YWx1ZSkge1xyXG4gICAgLy8gd2hpdGVzcGFjZVxyXG4gICAgY2FzZSAnICc6XHJcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlQ291bnQodG9rZW4sIHRleHRWYWx1ZSwgaXNGaW5hbCkgJiYgc3RyaW5nVXRpbHMubWF0Y2hBbGwodGV4dFZhbHVlLCAnIFxcdCcpO1xyXG4gICAgY2FzZSAnbmV3bGluZSc6XHJcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlQ291bnQodG9rZW4sIHRleHRWYWx1ZSwgaXNGaW5hbCkgJiYgc3RyaW5nVXRpbHMubWF0Y2hBbGwodGV4dFZhbHVlLCAnXFxyXFxuJyk7XHJcbiAgICBjYXNlICdlbXB0eWxpbmUnOlxyXG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZUNvdW50KHRva2VuLCB0ZXh0VmFsdWUsIGlzRmluYWwpICYmIHN0cmluZ1V0aWxzLm1hdGNoQWxsKHRleHRWYWx1ZSwgJ1xcclxcbiBcXHQnKTtcclxuICAgIGNhc2UgJ2xldHRlcic6XHJcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlQ291bnQodG9rZW4sIHRleHRWYWx1ZSwgaXNGaW5hbCkgJiYgc3RyaW5nVXRpbHMubWF0Y2hBbGwodGV4dFZhbHVlLCBMRVRURVJfQ0hBUkFDVEVSUyk7XHJcbiAgICBjYXNlICdhbnknOlxyXG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZUNvdW50KHRva2VuLCB0ZXh0VmFsdWUsIGlzRmluYWwpO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG5cclxuICAvLyBjaGVjayBwYXR0ZXJuIHRhZ3MgYW5kIGRvIGEgc3ViIG1hdGNoIGZvciBlYWNoIG9mIHRoZW1cclxuICBpZiAodGhpcy5jb21waWxlZFBhdHRlcm5zW3Rva2VuLnZhbHVlXSkge1xyXG4gICAgLy8gc3ViIG1hdGNoaW5nIGlzIHBvc3NpYmxlLCBzbyBzdGFydCBhIG5ldyBvbmUgb3IgY29udGludWUgdGhlIHByZXZpb3VzIG9uZVxyXG4gICAgaWYgKG5vZGUubWF0Y2hTdGF0ZSA9PSBudWxsKSB7XHJcbiAgICAgIG5vZGUubWF0Y2hTdGF0ZSA9IHRoaXMubWF0Y2hTdGFydChjb250ZXh0LCB0b2tlbi52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICAvLyBpZiB0aGlzIGlzIHRoZSBsYXN0IG1hdGNoIHRoZW4gYXNzZW1ibGUgdGhlIHJlc3VsdHNcclxuICAgIGlmIChpc0ZpbmFsKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmhhc1Jlc3VsdHMobm9kZS5tYXRjaFN0YXRlKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLm1hdGNoTmV4dChub2RlLm1hdGNoU3RhdGUsIHRleHRWYWx1ZVt0ZXh0VmFsdWUubGVuZ3RoIC0gMV0pO1xyXG4gIH1cclxuXHJcbiAgLy8gY2hlY2sgaWYgYSB2YWxpZGF0b3IgaXMgcmVnaXN0ZXJlZCBmb3IgdGhpcyB0b2tlblxyXG4gIGNvbnN0IHZhbGlkYXRvciA9IHRoaXMudmFsaWRhdG9yc1t0b2tlbi52YWx1ZV07XHJcbiAgaWYgKCF2YWxpZGF0b3IpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiB2YWxpZGF0b3IudmFsaWRhdGVUb2tlbih0b2tlbiwgdGV4dFZhbHVlLCBpc0ZpbmFsKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZWN1cnNpdmVseSBjaGVjayBjYW5kaWRhdGVzXHJcbiAqIEBwYXJhbSBjb250ZXh0IHtQYXR0ZXJuQ29udGV4dH1cclxuICogQHBhcmFtIHBhdGhzIHtvYmplY3RbXX1cclxuICogQHBhcmFtIG5vZGUge1BhdGhOb2RlfVxyXG4gKiBAcGFyYW0gdmFsIHtzdHJpbmd9XHJcbiAqIEBwYXJhbSBuZXdDYW5kaWRhdGVzIHtQYXRoTm9kZVtdfVxyXG4gKiBAcGFyYW0gZGVwdGgge251bWJlcn1cclxuICovXHJcblBhdHRlcm5NYXRjaGVyLnByb3RvdHlwZS52YWxpZGF0ZUNoaWxkcmVuID0gZnVuY3Rpb24gdmFsaWRhdGVDaGlsZHJlbihjb250ZXh0LCBwYXRocywgbm9kZSwgdmFsLCBuZXdDYW5kaWRhdGVzLCBkZXB0aCkge1xyXG4gIC8vIGZpcnN0IGNoZWNrIGlmIGFueSBvZiB0aGUgY2hpbGQgbm9kZXMgdmFsaWRhdGUgd2l0aCB0aGUgbmV3IGNoYXJhY3RlciBhbmQgcmVtZW1iZXIgdGhlbSBhcyBjYW5kaWRhdGVzXHJcbiAgLy8gZm9yZWFjaCAoS2V5VmFsdWVQYWlyPFRva2VuLCBQYXR0ZXJuUGF0aD4gY2hpbGRQYXRoIGluIHBhdGhzKVxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aHMubGVuZ3RoOyBpKyspXHJcbiAge1xyXG4gICAgY29uc3QgY2hpbGRQYXRoID0gcGF0aHNbaV07XHJcbiAgICAvKlBhdGhOb2RlIGNoaWxkTm9kZSA9IG5ldyBQYXRoTm9kZShjaGlsZFBhdGgudG9rZW4sIGNoaWxkUGF0aC5wYXR0ZXJuUGF0aCwgdmFsKTtcclxuICAgIC8vIGlmIHplcm8gY291bnQgaXMgYWxsb3dlZCBpdCBkb2VzIG5vdCBtYXR0ZXIgd2hldGhlciB0aGUgY2hpbGQgdmFsaWRhdGVzIG9yIG5vdCwgd2UgYWx3YXlzIHRyeSBjaGlsZHJlbiBhcyB3ZWxsXHJcbiAgICBpZiAoY2hpbGRQYXRoLktleS5NaW5Db3VudCA9PSAwKVxyXG4gICAgICBWYWxpZGF0ZUNoaWxkcmVuKGNvbnRleHQsIGNoaWxkUGF0aC5WYWx1ZS5QYXRocywgbm9kZSwgdmFsLCBuZXdDYW5kaWRhdGVzLCBkZXB0aCArIDEpO1xyXG4gICAgaWYgKCFWYWxpZGF0ZVRva2VuKGNvbnRleHQsIGNoaWxkTm9kZSwgZmFsc2UpKVxyXG4gICAge1xyXG4gICAgICAvLyB0b2tlbiBkaWQgbm90IHZhbGlkYXRlIGJ1dCAwIGNvdW50IGlzIGFsbG93ZWRcclxuICAgICAgLy9pZiAoY2hpbGRQYXRoLktleS5NaW5Db3VudCA9PSAwKVxyXG4gICAgICAvL1x0VmFsaWRhdGVDaGlsZHJlbihjaGlsZFBhdGguVmFsdWUuUGF0aHMsIG5vZGUsIHZhbCwgbmV3Q2FuZGlkYXRlcywgZGVwdGggKyAxKTtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdmFsaWRhdGVkIHN1Y2Nlc3NmdWxseSBzbyBhZGQgYSBuZXcgY2FuZGlkYXRlXHJcbiAgICAvLyBhZGQgZW1wdHkgdmFsdWVzIGZvciBhbGwgc2tpcHBlZCB0b2tlbnNcclxuICAgIGNoaWxkTm9kZS5QcmV2aW91c1ZhbHVlcy5BZGRSYW5nZShub2RlLlByZXZpb3VzVmFsdWVzKTtcclxuICAgIGlmIChub2RlLlRva2VuICE9IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIEZpbmFsaXplVmFsdWUobm9kZSk7XHJcbiAgICAgIGNoaWxkTm9kZS5QcmV2aW91c1ZhbHVlcy5BZGQobm9kZS5WYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBmb3IgKEludDMyIGkgPSAwOyBpIDwgZGVwdGg7IGkrKylcclxuICAgIGNoaWxkTm9kZS5QcmV2aW91c1ZhbHVlcy5BZGQobnVsbCk7XHJcbiAgICBuZXdDYW5kaWRhdGVzLkFkZChjaGlsZE5vZGUpOyovXHJcbiAgfVxyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVybk1hdGNoZXI7XHJcblxyXG5cclxuLypcclxuXHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gTWF0Y2hlcyBkYXRhIGJhc2VkIG9uIHBhdHRlcm5zXHJcbiAvLy8gPC9zdW1tYXJ5PlxyXG4gcHVibGljIGNsYXNzIFBhdHRlcm5NYXRjaGVyXHJcbiB7XHJcbiBwcml2YXRlIGNvbnN0IFN0cmluZyBMZXR0ZXJDaGFyYWN0ZXJzID0gXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCI7XHJcblxyXG4gLy8vIDxzdW1tYXJ5PlxyXG4gLy8vIEFsbCBjdXJyZW50bHkgYWN0aXZlIHBhdHRlcm5zXHJcbiAvLy8gPC9zdW1tYXJ5PlxyXG4gcHJpdmF0ZSByZWFkb25seSBEaWN0aW9uYXJ5PFN0cmluZywgTGlzdDxQYXR0ZXJuPj4gcGF0dGVybnMgPSBuZXcgRGljdGlvbmFyeTxTdHJpbmcsIExpc3Q8UGF0dGVybj4+KCk7XHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gQWxsIGFjdGl2ZSBwYXR0ZXJucyBjb21waWxlZCBmb3IgdXNlXHJcbiAvLy8gPC9zdW1tYXJ5PlxyXG4gcHJpdmF0ZSByZWFkb25seSBEaWN0aW9uYXJ5PFN0cmluZywgRGljdGlvbmFyeTxUb2tlbiwgUGF0dGVyblBhdGg+PiBjb21waWxlZFBhdHRlcm5zID0gbmV3IERpY3Rpb25hcnk8U3RyaW5nLCBEaWN0aW9uYXJ5PFRva2VuLCBQYXR0ZXJuUGF0aD4+KCk7XHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gQWxsIHJlZ2lzdGVyZWQgdmFsaWRhdG9yc1xyXG4gLy8vIDwvc3VtbWFyeT5cclxuIHByaXZhdGUgcmVhZG9ubHkgRGljdGlvbmFyeTxTdHJpbmcsIElUb2tlblZhbGlkYXRvcj4gdmFsaWRhdG9ycyA9IG5ldyBEaWN0aW9uYXJ5PFN0cmluZywgSVRva2VuVmFsaWRhdG9yPigpO1xyXG5cclxuIC8vLyA8c3VtbWFyeT5cclxuIC8vLyBDb25zdHJ1Y3RvclxyXG4gLy8vIDwvc3VtbWFyeT5cclxuIHB1YmxpYyBQYXR0ZXJuTWF0Y2hlcihQYXR0ZXJuW10gcGF0dGVybnMpXHJcbiB7XHJcbiBpZiAocGF0dGVybnMuTGVuZ3RoID4gMClcclxuIEFkZFBhdHRlcm5zKFwiXCIsIHBhdHRlcm5zKTtcclxuIH1cclxuXHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gQ2xlYXIgYWxsIGNvbXBpbGVkIHBhdHRlcm5zXHJcbiAvLy8gPC9zdW1tYXJ5PlxyXG4gcHVibGljIHZvaWQgQ2xlYXJQYXR0ZXJucygpXHJcbiB7XHJcbiB0aGlzLnBhdHRlcm5zLkNsZWFyKCk7XHJcbiB0aGlzLmNvbXBpbGVkUGF0dGVybnMuQ2xlYXIoKTtcclxuIH1cclxuXHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gQWRkIG1vcmUgcGF0dGVybnMgdG8gdGhlIGNvbXBpbGVkIG9uZXNcclxuIC8vLyA8L3N1bW1hcnk+XHJcbiBwdWJsaWMgdm9pZCBBZGRQYXR0ZXJucyhTdHJpbmcgbWF0Y2hUYWcsIFBhdHRlcm5bXSBuZXdQYXR0ZXJucylcclxuIHtcclxuIExpc3Q8UGF0dGVybj4gdGFyZ2V0UGF0dGVybnM7XHJcbiAjaWYgU0NSSVBUU0hBUlBcclxuIGlmICgodGFyZ2V0UGF0dGVybnMgPSBEaWN0aW9uYXJ5VXRpbHMuVHJ5R2V0UGF0dGVybnModGhpcy5wYXR0ZXJucywgbWF0Y2hUYWcpKSA9PSBudWxsKVxyXG4gI2Vsc2VcclxuIGlmICghdGhpcy5wYXR0ZXJucy5UcnlHZXRWYWx1ZShtYXRjaFRhZywgb3V0IHRhcmdldFBhdHRlcm5zKSlcclxuICNlbmRpZlxyXG4gdGhpcy5wYXR0ZXJuc1ttYXRjaFRhZ10gPSB0YXJnZXRQYXR0ZXJucyA9IG5ldyBMaXN0PFBhdHRlcm4+KG5ld1BhdHRlcm5zLkxlbmd0aCk7XHJcblxyXG4gRGljdGlvbmFyeTxUb2tlbiwgUGF0dGVyblBhdGg+IHBhdGhSb290O1xyXG4gI2lmIFNDUklQVFNIQVJQXHJcbiBpZiAoKHBhdGhSb290ID0gRGljdGlvbmFyeVV0aWxzLlRyeUdldFBhdHRlcm5QYXRoKGNvbXBpbGVkUGF0dGVybnMsIG1hdGNoVGFnKSkgPT0gbnVsbClcclxuIGNvbXBpbGVkUGF0dGVybnNbbWF0Y2hUYWddID0gcGF0aFJvb3QgPSBuZXcgRGljdGlvbmFyeTxUb2tlbiwgUGF0dGVyblBhdGg+KCk7XHJcbiAjZWxzZVxyXG4gaWYgKCF0aGlzLmNvbXBpbGVkUGF0dGVybnMuVHJ5R2V0VmFsdWUobWF0Y2hUYWcsIG91dCBwYXRoUm9vdCkpXHJcbiB0aGlzLmNvbXBpbGVkUGF0dGVybnNbbWF0Y2hUYWddID0gcGF0aFJvb3QgPSBuZXcgRGljdGlvbmFyeTxUb2tlbiwgUGF0dGVyblBhdGg+KCk7XHJcbiAjZW5kaWZcclxuXHJcbiAvLyBwYXJzZSBlYWNoIHBhdHRlcm4gaW50byB0b2tlbnMgYW5kIHRoZW4gcGFyc2UgdGhlIHRva2Vuc1xyXG4gTGlzdDxUb2tlbj4gdG9rZW5zID0gbmV3IExpc3Q8VG9rZW4+KCk7XHJcbiBmb3IgKEludDMyIHBhdHRlcm5JbmRleCA9IDA7IHBhdHRlcm5JbmRleCA8IG5ld1BhdHRlcm5zLkxlbmd0aDsgcGF0dGVybkluZGV4KyspXHJcbiB7XHJcbiBQYXR0ZXJuIHAgPSBuZXdQYXR0ZXJuc1twYXR0ZXJuSW5kZXhdO1xyXG5cclxuIC8vIGlmIHRoZSBwYXR0ZXJuIHdhcyBhZGRlZCBiZWZvcmUgdGhlbiBkb24ndCBkbyBpdCBhZ2FpblxyXG4gaWYgKHRhcmdldFBhdHRlcm5zLkNvbnRhaW5zKHApKVxyXG4gY29udGludWU7XHJcblxyXG4gSW50MzIgdGFyZ2V0SW5kZXggPSB0YXJnZXRQYXR0ZXJucy5Db3VudDtcclxuIHRhcmdldFBhdHRlcm5zLkFkZChwKTtcclxuXHJcbiBTdHJpbmcgcGF0dGVybiA9IHAuTWF0Y2g7XHJcblxyXG4gLy9cclxuIC8vIHBhcnNlIHRoZSBwYXR0ZXJuIGludG8gdG9rZW5zXHJcbiAvL1xyXG5cclxuIHRva2Vucy5DbGVhcigpO1xyXG4gU3RyaW5nIGN1cnJlbnRUb2tlbiA9IFwiXCI7XHJcbiBJbnQzMiBpO1xyXG4gZm9yIChpID0gMDsgaSA8IHBhdHRlcm4uTGVuZ3RoOyBpKyspXHJcbiB7XHJcbiBzd2l0Y2ggKHBhdHRlcm5baV0pXHJcbiB7XHJcbiBjYXNlICd7JzpcclxuIGlmIChjdXJyZW50VG9rZW4uTGVuZ3RoID09IDApXHJcbiBicmVhaztcclxuIHRva2Vucy5BZGQobmV3IFRva2VuKGN1cnJlbnRUb2tlbiwgdHJ1ZSkpO1xyXG4gY3VycmVudFRva2VuID0gXCJcIjtcclxuIGJyZWFrO1xyXG4gY2FzZSAnfSc6XHJcbiB0b2tlbnMuQWRkKG5ldyBUb2tlbihjdXJyZW50VG9rZW4sIGZhbHNlKSk7XHJcbiBjdXJyZW50VG9rZW4gPSBcIlwiO1xyXG4gYnJlYWs7XHJcbiBkZWZhdWx0OlxyXG4gY3VycmVudFRva2VuICs9IHBhdHRlcm5baV07XHJcbiBicmVhaztcclxuIH1cclxuIH1cclxuXHJcbiBpZighU3RyaW5nLklzTnVsbE9yRW1wdHkoY3VycmVudFRva2VuKSlcclxuIHRva2Vucy5BZGQobmV3IFRva2VuKGN1cnJlbnRUb2tlbiwgdHJ1ZSkpO1xyXG5cclxuIGlmICh0b2tlbnMuQ291bnQgPT0gMClcclxuIGNvbnRpbnVlO1xyXG5cclxuIC8vXHJcbiAvLyBDb21waWxlIHRoZSB0b2tlbnMgaW50byB0aGUgdHJlZVxyXG4gLy9cclxuXHJcbiBQYXR0ZXJuUGF0aCBwYXRoID0gbnVsbDtcclxuIERpY3Rpb25hcnk8VG9rZW4sIFBhdHRlcm5QYXRoPiBwYXRocyA9IHBhdGhSb290O1xyXG4gZm9yIChpID0gMDsgaSA8IHRva2Vucy5Db3VudDsgaSsrKVxyXG4ge1xyXG4gVG9rZW4gdG9rZW4gPSB0b2tlbnNbaV07XHJcbiAvLyBjaGVjayBpZiB0aGUgZXhhY3Qgc2FtZSBub2RlIGV4aXN0cyBhbmQgdGFrZSBpdCBpZiBpdCBkb2VzXHJcbiBQYXR0ZXJuUGF0aCBuZXh0UGF0aDtcclxuICNpZiBTQ1JJUFRTSEFSUFxyXG4gaWYgKChuZXh0UGF0aCA9IERpY3Rpb25hcnlVdGlscy5UcnlHZXRQYXRoKHBhdGhzLCB0b2tlbikpID09IG51bGwpXHJcbiAjZWxzZVxyXG4gaWYgKCFwYXRocy5UcnlHZXRWYWx1ZSh0b2tlbiwgb3V0IG5leHRQYXRoKSlcclxuICNlbmRpZlxyXG4ge1xyXG4gbmV4dFBhdGggPSBuZXcgUGF0dGVyblBhdGgoKTtcclxuIHBhdGhzW3Rva2VuXSA9IG5leHRQYXRoO1xyXG4gfVxyXG4gcGF0aCA9IG5leHRQYXRoO1xyXG4gcGF0aHMgPSBuZXh0UGF0aC5QYXRocztcclxuIH1cclxuIGlmIChwYXRoICE9IG51bGwpXHJcbiB7XHJcbiBpZiAocGF0aC5NYXRjaGVkUGF0dGVybnMgPT0gbnVsbClcclxuIHBhdGguTWF0Y2hlZFBhdHRlcm5zID0gbmV3IExpc3Q8SW50MzI+KCk7XHJcbiBpZiAoIXBhdGguTWF0Y2hlZFBhdHRlcm5zLkNvbnRhaW5zKHRhcmdldEluZGV4KSlcclxuIHBhdGguTWF0Y2hlZFBhdHRlcm5zLkFkZCh0YXJnZXRJbmRleCk7XHJcbiB9XHJcbiB9XHJcbiB9XHJcblxyXG5cclxuIC8vLyA8c3VtbWFyeT5cclxuIC8vLyBNYXRjaCB0aGUgdmFsdWUgYWdhaW5zdCBhbGwgcGF0dGVybnMgYW5kIHJldHVybiB0aGUgb25lcyB0aGF0IGZpdFxyXG4gLy8vIDwvc3VtbWFyeT5cclxuIC8vLyA8cGFyYW0gbmFtZT1cInZhbHVlXCI+PC9wYXJhbT5cclxuIC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcbiBwdWJsaWMgTGlzdDxPYmplY3Q+IE1hdGNoKFN0cmluZyB2YWx1ZSlcclxuIHtcclxuIHJldHVybiBNYXRjaChuZXcgUGF0dGVybkNvbnRleHQoKSwgdmFsdWUpO1xyXG4gfVxyXG5cclxuIC8vLyA8c3VtbWFyeT5cclxuIC8vLyBNYXRjaCB0aGUgdmFsdWUgYWdhaW5zdCBhbGwgcGF0dGVybnMgYW5kIHJldHVybiB0aGUgb25lcyB0aGF0IGZpdFxyXG4gLy8vIDwvc3VtbWFyeT5cclxuIC8vLyA8cGFyYW0gbmFtZT1cImNvbnRleHRcIj5UaGUgY3VycmVudCBjb250ZXh0IGZvciBtYXRjaGluZzwvcGFyYW0+XHJcbiAvLy8gPHBhcmFtIG5hbWU9XCJ2YWx1ZVwiPjwvcGFyYW0+XHJcbiAvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG4gcHVibGljIExpc3Q8T2JqZWN0PiBNYXRjaChQYXR0ZXJuQ29udGV4dCBjb250ZXh0LCBTdHJpbmcgdmFsdWUpXHJcbiB7XHJcbiBMaXN0PE9iamVjdD4gcmVzdWx0cyA9IG5ldyBMaXN0PE9iamVjdD4oKTtcclxuIGlmIChTdHJpbmcuSXNOdWxsT3JFbXB0eSh2YWx1ZSkpXHJcbiByZXR1cm4gcmVzdWx0cztcclxuXHJcbiBPYmplY3Qgc3RhdGUgPSBNYXRjaFN0YXJ0KGNvbnRleHQsIFwiXCIpO1xyXG4gZm9yIChpbnQgaSA9IDA7IGkgPCB2YWx1ZS5MZW5ndGg7IGkrKylcclxuIHtcclxuIGNoYXIgYyA9IHZhbHVlW2ldO1xyXG4gaWYgKCFNYXRjaE5leHQoc3RhdGUsIGMpKVxyXG4gcmV0dXJuIHJlc3VsdHM7XHJcbiB9XHJcblxyXG4gcmVzdWx0cyA9IE1hdGNoUmVzdWx0cyhzdGF0ZSk7XHJcbiAvLyByZXZlcnNlIHJlc3VsdHMgc2luY2UgdGhlIGxvbmdlc3QgbWF0Y2hlcyB3aWxsIGJlIGZvdW5kIGxhc3QgYnV0IGFyZSB0aGUgbW9zdCBzcGVjaWZpY1xyXG4gcmVzdWx0cy5SZXZlcnNlKCk7XHJcbiByZXR1cm4gcmVzdWx0cztcclxuIH1cclxuXHJcblxyXG4gLy8vIDxzdW1tYXJ5PlxyXG4gLy8vIEJlZ2luIGEgcGFyc2luZyBzZXNzaW9uXHJcbiAvLy8gPC9zdW1tYXJ5PlxyXG4gLy8vIDxwYXJhbSBuYW1lPVwiY29udGV4dFwiPjwvcGFyYW0+XHJcbiAvLy8gPHBhcmFtIG5hbWU9XCJtYXRjaFRhZ1wiPjwvcGFyYW0+XHJcbiAvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG4gcHVibGljIE9iamVjdCBNYXRjaFN0YXJ0KFBhdHRlcm5Db250ZXh0IGNvbnRleHQsIFN0cmluZyBtYXRjaFRhZylcclxuIHtcclxuIERpY3Rpb25hcnk8VG9rZW4sIFBhdHRlcm5QYXRoPiByb290cztcclxuICNpZiBTQ1JJUFRTSEFSUFxyXG4gaWYgKChyb290cyA9IERpY3Rpb25hcnlVdGlscy5UcnlHZXRQYXR0ZXJuUGF0aChjb21waWxlZFBhdHRlcm5zLCBtYXRjaFRhZykpID09IG51bGwpXHJcbiAjZWxzZVxyXG4gaWYgKCF0aGlzLmNvbXBpbGVkUGF0dGVybnMuVHJ5R2V0VmFsdWUobWF0Y2hUYWcsIG91dCByb290cykpXHJcbiAjZW5kaWZcclxuIHJldHVybiBudWxsO1xyXG5cclxuIE1hdGNoU3RhdGUgc3RhdGUgPSBuZXcgTWF0Y2hTdGF0ZSgpO1xyXG4gc3RhdGUuTWF0Y2hUYWcgPSBtYXRjaFRhZztcclxuIHN0YXRlLkNvbnRleHQgPSBjb250ZXh0ID8/IG5ldyBQYXR0ZXJuQ29udGV4dCgpO1xyXG5cclxuIFBhdHRlcm5QYXRoIHJvb3QgPSBuZXcgUGF0dGVyblBhdGgoKTtcclxuIHJvb3QuUGF0aHMgPSByb290cztcclxuIFBhdGhOb2RlIHN0YXJ0Tm9kZSA9IG5ldyBQYXRoTm9kZShudWxsLCByb290LCBcIlwiKTtcclxuIHN0YXRlLkNhbmRpZGF0ZVBhdGhzLkFkZChzdGFydE5vZGUpO1xyXG5cclxuIHJldHVybiBzdGF0ZTtcclxuIH1cclxuXHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gTWF0Y2ggdGhlIG5leHQgY2hhcmFjdGVyXHJcbiAvLy8gPC9zdW1tYXJ5PlxyXG4gLy8vIDxwYXJhbSBuYW1lPVwiY3VycmVudFN0YXRlXCI+VGhlIGN1cnJlbnQgbWF0Y2hpbmcgc3RhdGU8L3BhcmFtPlxyXG4gLy8vIDxwYXJhbSBuYW1lPVwiY1wiPlRoZSBuZXh0IGNoYXJhY3RlcjwvcGFyYW0+XHJcbiAvLy8gPHJldHVybnM+UmV0dXJucyB0cnVlIGlmIHRoaXMgaXMgc3RpbGwgYSB2YWxpZCBtYXRjaCwgZmFsc2Ugb3RoZXJ3aXNlPC9yZXR1cm5zPlxyXG4gcHVibGljIEJvb2xlYW4gTWF0Y2hOZXh0KE9iamVjdCBjdXJyZW50U3RhdGUsIENoYXIgYylcclxuIHtcclxuIE1hdGNoU3RhdGUgc3RhdGUgPSBjdXJyZW50U3RhdGUgYXMgIE1hdGNoU3RhdGU7XHJcbiBpZiAoc3RhdGUgPT0gbnVsbClcclxuIHJldHVybiBmYWxzZTtcclxuXHJcbiBMaXN0PFBhdGhOb2RlPiBjYW5kaWRhdGVQYXRocyA9IHN0YXRlLkNhbmRpZGF0ZVBhdGhzO1xyXG4gTGlzdDxQYXRoTm9kZT4gbmV3Q2FuZGlkYXRlcyA9IHN0YXRlLk5ld0NhbmRpZGF0ZXM7XHJcbiBmb3IgKEludDMyIGkgPSAwOyBpIDwgY2FuZGlkYXRlUGF0aHMuQ291bnQ7IGkrKylcclxuIHtcclxuIFBhdGhOb2RlIGNhbmRpZGF0ZSA9IGNhbmRpZGF0ZVBhdGhzW2ldO1xyXG5cclxuIC8vIGZpcnN0IGNoZWNrIGlmIGFueSBvZiB0aGUgY2hpbGQgbm9kZXMgdmFsaWRhdGUgd2l0aCB0aGUgbmV3IGNoYXJhY3RlciBhbmQgcmVtZW1iZXIgdGhlbSBhcyBjYW5kaWRhdGVzXHJcbiAvLyBhbnkgY2hpbGRyZW4gY2FuIG9ubHkgYmUgY2FuZGlkYXRlcyBpZiB0aGUgZmluYWwgdmFsaWRhdGlvbiBvZiB0aGUgY3VycmVudCB2YWx1ZSBzdWNjZWVkc1xyXG4gaWYgKGNhbmRpZGF0ZS5Ub2tlbiA9PSBudWxsIHx8IFZhbGlkYXRlVG9rZW4oc3RhdGUuQ29udGV4dCwgY2FuZGlkYXRlLCB0cnVlKSlcclxuIFZhbGlkYXRlQ2hpbGRyZW4oc3RhdGUuQ29udGV4dCwgY2FuZGlkYXRlLlBhdGguUGF0aHMsIGNhbmRpZGF0ZSwgYy5Ub1N0cmluZyhDdWx0dXJlSW5mby5JbnZhcmlhbnRDdWx0dXJlKSwgbmV3Q2FuZGlkYXRlcywgMCk7XHJcblxyXG4gLy8gdG9rZW4gY2FuIGJlIG51bGwgZm9yIHRoZSByb290IG5vZGUgYnV0IG5vIHZhbGlkYXRpb24gbmVlZHMgdG8gYmUgZG9uZSBmb3IgdGhhdFxyXG4gaWYgKGNhbmRpZGF0ZS5Ub2tlbiAhPSBudWxsKVxyXG4ge1xyXG4gLy8gdmFsaWRhdGUgdGhpcyBjYW5kaWRhdGUgYW5kIHJlbW92ZSBpdCBpZiBpdCBkb2Vzbid0IHZhbGlkYXRlIGFueW1vcmVcclxuIGNhbmRpZGF0ZS5Jc0ZpbmFsaXplZCA9IGZhbHNlO1xyXG4gY2FuZGlkYXRlLlRleHRWYWx1ZSArPSBjO1xyXG4gaWYgKFZhbGlkYXRlVG9rZW4oc3RhdGUuQ29udGV4dCwgY2FuZGlkYXRlLCBmYWxzZSkpXHJcbiBjb250aW51ZTtcclxuIH1cclxuIGNhbmRpZGF0ZVBhdGhzLlJlbW92ZUF0KGktLSk7XHJcbiB9XHJcbiBjYW5kaWRhdGVQYXRocy5BZGRSYW5nZShuZXdDYW5kaWRhdGVzKTtcclxuIG5ld0NhbmRpZGF0ZXMuQ2xlYXIoKTtcclxuXHJcbiByZXR1cm4gY2FuZGlkYXRlUGF0aHMuQ291bnQgPiAwO1xyXG4gfVxyXG5cclxuXHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gQXNzZW1ibGUgdGhlIHJlc3VsdHMgYWZ0ZXIgdGhlIGxhc3QgY2hhcmFjdGVyIGhhcyBiZWVuIG1hdGNoZWRcclxuIC8vLyA8L3N1bW1hcnk+XHJcbiAvLy8gPHBhcmFtIG5hbWU9XCJjdXJyZW50U3RhdGVcIj48L3BhcmFtPlxyXG4gLy8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuIHB1YmxpYyBCb29sZWFuIEhhc1Jlc3VsdHMoT2JqZWN0IGN1cnJlbnRTdGF0ZSlcclxuIHtcclxuIE1hdGNoU3RhdGUgc3RhdGUgPSBjdXJyZW50U3RhdGUgYXMgTWF0Y2hTdGF0ZTtcclxuIGlmIChzdGF0ZSA9PSBudWxsKVxyXG4gcmV0dXJuIGZhbHNlO1xyXG5cclxuIExpc3Q8UGF0aE5vZGU+IGNhbmRpZGF0ZVBhdGhzID0gc3RhdGUuQ2FuZGlkYXRlUGF0aHM7XHJcblxyXG4gaWYgKCF0aGlzLnBhdHRlcm5zLkNvbnRhaW5zS2V5KHN0YXRlLk1hdGNoVGFnKSlcclxuIHJldHVybiBmYWxzZTtcclxuXHJcbiAvLyBmZXRjaCBwYXR0ZXJucyBmb3IgYWxsIG1hdGNoaW5nIGNhbmRpZGF0ZXNcclxuIGZvcmVhY2ggKFBhdGhOb2RlIHBhdGggaW4gY2FuZGlkYXRlUGF0aHMpXHJcbiB7XHJcbiAvLyBkbyBmaW5hbCB2YWxpZGF0aW9uXHJcbiBpZiAoIVZhbGlkYXRlVG9rZW4oc3RhdGUuQ29udGV4dCwgcGF0aCwgdHJ1ZSkpXHJcbiBjb250aW51ZTtcclxuIEJvb2xlYW4gcmVzdWx0ID0gZmFsc2U7XHJcbiBNYXRjaFRvTGFzdChwYXRoLlBhdGgsIGRlbGVnYXRlIHsgcmVzdWx0ID0gdHJ1ZTsgfSwgMCk7XHJcbiByZXR1cm4gcmVzdWx0O1xyXG4gfVxyXG4gcmV0dXJuIGZhbHNlO1xyXG4gfVxyXG5cclxuXHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gQXNzZW1ibGUgdGhlIHJlc3VsdHMgYWZ0ZXIgdGhlIGxhc3QgY2hhcmFjdGVyIGhhcyBiZWVuIG1hdGNoZWRcclxuIC8vLyA8L3N1bW1hcnk+XHJcbiAvLy8gPHBhcmFtIG5hbWU9XCJjdXJyZW50U3RhdGVcIj48L3BhcmFtPlxyXG4gLy8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuIHB1YmxpYyBMaXN0PE9iamVjdD4gTWF0Y2hSZXN1bHRzKE9iamVjdCBjdXJyZW50U3RhdGUpXHJcbiB7XHJcbiBMaXN0PE9iamVjdD4gcmVzdWx0cyA9IG5ldyBMaXN0PE9iamVjdD4oKTtcclxuXHJcbiBNYXRjaFN0YXRlIHN0YXRlID0gY3VycmVudFN0YXRlIGFzIE1hdGNoU3RhdGU7XHJcbiBpZiAoc3RhdGUgPT0gbnVsbClcclxuIHJldHVybiByZXN1bHRzO1xyXG5cclxuIExpc3Q8UGF0aE5vZGU+IGNhbmRpZGF0ZVBhdGhzID0gc3RhdGUuQ2FuZGlkYXRlUGF0aHM7XHJcblxyXG4gLy8gZ2V0IHRoZSBwYXR0ZXJucyBmb3IgdGhpcyB0YWdcclxuIExpc3Q8UGF0dGVybj4gdGFyZ2V0UGF0dGVybnM7XHJcbiAjaWYgU0NSSVBUU0hBUlBcclxuIGlmICgodGFyZ2V0UGF0dGVybnMgPSBEaWN0aW9uYXJ5VXRpbHMuVHJ5R2V0UGF0dGVybnMocGF0dGVybnMsIHN0YXRlLk1hdGNoVGFnKSkgPT0gbnVsbClcclxuICNlbHNlXHJcbiBpZiAoIXRoaXMucGF0dGVybnMuVHJ5R2V0VmFsdWUoc3RhdGUuTWF0Y2hUYWcsIG91dCB0YXJnZXRQYXR0ZXJucykpXHJcbiAjZW5kaWZcclxuIHJldHVybiByZXN1bHRzO1xyXG5cclxuIC8vIGZldGNoIHBhdHRlcm5zIGZvciBhbGwgbWF0Y2hpbmcgY2FuZGlkYXRlc1xyXG4gZm9yZWFjaCAoUGF0aE5vZGUgcGF0aCBpbiBjYW5kaWRhdGVQYXRocylcclxuIHtcclxuIC8vIGRvIGZpbmFsIHZhbGlkYXRpb25cclxuIGlmICghVmFsaWRhdGVUb2tlbihzdGF0ZS5Db250ZXh0LCBwYXRoLCB0cnVlKSlcclxuIGNvbnRpbnVlO1xyXG4gRmluYWxpemVWYWx1ZShwYXRoKTtcclxuIExpc3Q8T2JqZWN0PiBwcmV2aW91c1ZhbHVlcyA9IG5ldyBMaXN0PE9iamVjdD4ocGF0aC5QcmV2aW91c1ZhbHVlcyk7XHJcbiBwcmV2aW91c1ZhbHVlcy5BZGQocGF0aC5WYWx1ZSk7XHJcbiBNYXRjaFRvTGFzdChwYXRoLlBhdGgsIGRlbGVnYXRlKFBhdHRlcm5QYXRoIG1hdGNoLCBJbnQzMiBkZXB0aClcclxuIHtcclxuIC8vIGFkZCBlbXB0eSB2YWx1ZXMgZm9yIHJlbWFpbmluZyB0b2tlbnNcclxuIE9iamVjdFtdIHZhbHVlcyA9IG5ldyBPYmplY3RbcHJldmlvdXNWYWx1ZXMuQ291bnQgKyBkZXB0aF07XHJcbiBmb3IgKEludDMyIGkgPSAwOyBpIDwgcHJldmlvdXNWYWx1ZXMuQ291bnQ7IGkrKylcclxuIHZhbHVlc1tpXSA9IHByZXZpb3VzVmFsdWVzW2ldO1xyXG4gZm9yIChJbnQzMiBtID0gMDsgbSA8IG1hdGNoLk1hdGNoZWRQYXR0ZXJucy5Db3VudDsgbSsrKVxyXG4ge1xyXG4gUGF0dGVybiBwYXR0ZXJuID0gdGFyZ2V0UGF0dGVybnNbbWF0Y2guTWF0Y2hlZFBhdHRlcm5zW21dXTtcclxuIE9iamVjdCByZXN1bHQgPSBwYXR0ZXJuLlBhcnNlKHN0YXRlLkNvbnRleHQsIHZhbHVlcyk7XHJcbiAvLyBvbmx5IGFkZCBpZiBpdCBpcyBub3QgaW4gdGhlIGxpc3QgeWV0XHJcbiBpZiAoIXJlc3VsdHMuQ29udGFpbnMocmVzdWx0KSlcclxuIHJlc3VsdHMuQWRkKHJlc3VsdCk7XHJcbiB9XHJcbiB9LCAwKTtcclxuIH1cclxuIHJldHVybiByZXN1bHRzO1xyXG4gfVxyXG5cclxuIHByaXZhdGUgdm9pZCBWYWxpZGF0ZUNoaWxkcmVuKFBhdHRlcm5Db250ZXh0IGNvbnRleHQsIElFbnVtZXJhYmxlPEtleVZhbHVlUGFpcjxUb2tlbiwgUGF0dGVyblBhdGg+PiBwYXRocywgUGF0aE5vZGUgbm9kZSwgU3RyaW5nIHZhbCwgTGlzdDxQYXRoTm9kZT4gbmV3Q2FuZGlkYXRlcywgSW50MzIgZGVwdGgpXHJcbiB7XHJcbiAvLyBmaXJzdCBjaGVjayBpZiBhbnkgb2YgdGhlIGNoaWxkIG5vZGVzIHZhbGlkYXRlIHdpdGggdGhlIG5ldyBjaGFyYWN0ZXIgYW5kIHJlbWVtYmVyIHRoZW0gYXMgY2FuZGlkYXRlc1xyXG4gZm9yZWFjaCAoS2V5VmFsdWVQYWlyPFRva2VuLCBQYXR0ZXJuUGF0aD4gY2hpbGRQYXRoIGluIHBhdGhzKVxyXG4ge1xyXG4gUGF0aE5vZGUgY2hpbGROb2RlID0gbmV3IFBhdGhOb2RlKGNoaWxkUGF0aC5LZXksIGNoaWxkUGF0aC5WYWx1ZSwgdmFsKTtcclxuIC8vIGlmIHplcm8gY291bnQgaXMgYWxsb3dlZCBpdCBkb2VzIG5vdCBtYXR0ZXIgd2hldGhlciB0aGUgY2hpbGQgdmFsaWRhdGVzIG9yIG5vdCwgd2UgYWx3YXlzIHRyeSBjaGlsZHJlbiBhcyB3ZWxsXHJcbiBpZiAoY2hpbGRQYXRoLktleS5NaW5Db3VudCA9PSAwKVxyXG4gVmFsaWRhdGVDaGlsZHJlbihjb250ZXh0LCBjaGlsZFBhdGguVmFsdWUuUGF0aHMsIG5vZGUsIHZhbCwgbmV3Q2FuZGlkYXRlcywgZGVwdGggKyAxKTtcclxuIGlmICghVmFsaWRhdGVUb2tlbihjb250ZXh0LCBjaGlsZE5vZGUsIGZhbHNlKSlcclxuIHtcclxuIC8vIHRva2VuIGRpZCBub3QgdmFsaWRhdGUgYnV0IDAgY291bnQgaXMgYWxsb3dlZFxyXG4gLy9pZiAoY2hpbGRQYXRoLktleS5NaW5Db3VudCA9PSAwKVxyXG4gLy9cdFZhbGlkYXRlQ2hpbGRyZW4oY2hpbGRQYXRoLlZhbHVlLlBhdGhzLCBub2RlLCB2YWwsIG5ld0NhbmRpZGF0ZXMsIGRlcHRoICsgMSk7XHJcbiBjb250aW51ZTtcclxuIH1cclxuXHJcbiAvLyB2YWxpZGF0ZWQgc3VjY2Vzc2Z1bGx5IHNvIGFkZCBhIG5ldyBjYW5kaWRhdGVcclxuIC8vIGFkZCBlbXB0eSB2YWx1ZXMgZm9yIGFsbCBza2lwcGVkIHRva2Vuc1xyXG4gY2hpbGROb2RlLlByZXZpb3VzVmFsdWVzLkFkZFJhbmdlKG5vZGUuUHJldmlvdXNWYWx1ZXMpO1xyXG4gaWYgKG5vZGUuVG9rZW4gIT0gbnVsbClcclxuIHtcclxuIEZpbmFsaXplVmFsdWUobm9kZSk7XHJcbiBjaGlsZE5vZGUuUHJldmlvdXNWYWx1ZXMuQWRkKG5vZGUuVmFsdWUpO1xyXG4gfVxyXG4gZm9yIChJbnQzMiBpID0gMDsgaSA8IGRlcHRoOyBpKyspXHJcbiBjaGlsZE5vZGUuUHJldmlvdXNWYWx1ZXMuQWRkKG51bGwpO1xyXG4gbmV3Q2FuZGlkYXRlcy5BZGQoY2hpbGROb2RlKTtcclxuIH1cclxuIH1cclxuXHJcbiBwcml2YXRlIHZvaWQgTWF0Y2hUb0xhc3QoUGF0dGVyblBhdGggcGF0aCwgQWN0aW9uPFBhdHRlcm5QYXRoLCBJbnQzMj4gYWRkLCBJbnQzMiBkZXB0aClcclxuIHtcclxuIGlmIChwYXRoLk1hdGNoZWRQYXR0ZXJucyAhPSBudWxsKVxyXG4gYWRkKHBhdGgsIGRlcHRoKTtcclxuIC8vIGNoZWNrIGNoaWxkcmVuIGlmIHRoZXkgYWxsb3cgMCBsZW5ndGggYXMgd2VsbFxyXG4gZm9yZWFjaCAoS2V5VmFsdWVQYWlyPFRva2VuLCBQYXR0ZXJuUGF0aD4gY2hpbGRQYXRoIGluIHBhdGguUGF0aHMpXHJcbiB7XHJcbiBpZiAoY2hpbGRQYXRoLktleS5NaW5Db3VudCA+IDApXHJcbiBjb250aW51ZTtcclxuIE1hdGNoVG9MYXN0KGNoaWxkUGF0aC5WYWx1ZSwgYWRkLCBkZXB0aCArIDEpO1xyXG4gfVxyXG5cclxuIH1cclxuXHJcblxyXG4gLy8vIDxzdW1tYXJ5PlxyXG4gLy8vIFJlZ2lzdGVyIGEgdmFsaWRhdGlvbiBvYmplY3QgZm9yIHRoZSB0YWdcclxuIC8vLyA8L3N1bW1hcnk+XHJcbiAvLy8gPHBhcmFtIG5hbWU9XCJ0YWdcIj48L3BhcmFtPlxyXG4gLy8vIDxwYXJhbSBuYW1lPVwidmFsaWRhdG9yXCI+PC9wYXJhbT5cclxuIHB1YmxpYyB2b2lkIFJlZ2lzdGVyVmFsaWRhdG9yKFN0cmluZyB0YWcsIElUb2tlblZhbGlkYXRvciB2YWxpZGF0b3IpXHJcbiB7XHJcbiB0aGlzLnZhbGlkYXRvcnNbdGFnXSA9IHZhbGlkYXRvcjtcclxuIH1cclxuXHJcblxyXG4gcHJpdmF0ZSBCb29sZWFuIFZhbGlkYXRlQ291bnQoVG9rZW4gdG9rZW4sIFN0cmluZyB2YWx1ZSwgQm9vbGVhbiBpc0ZpbmFsKVxyXG4ge1xyXG4gcmV0dXJuICghaXNGaW5hbCB8fCB2YWx1ZS5MZW5ndGggPj0gdG9rZW4uTWluQ291bnQpICYmIHZhbHVlLkxlbmd0aCA8PSB0b2tlbi5NYXhDb3VudDtcclxuIH1cclxuXHJcbiAvLy8gPHN1bW1hcnk+XHJcbiAvLy8gQWRkIHRoZSBuZXh0IGNoYXJhY3RlciB0byB0aGUgbWF0Y2hlZCBwYXRoXHJcbiAvLy8gPC9zdW1tYXJ5PlxyXG4gLy8vIDxwYXJhbSBuYW1lPVwiY29udGV4dFwiPlRoZSBjdXJyZW50IG1hdGNoaW5nIGNvbnRleHQ8L3BhcmFtPlxyXG4gLy8vIDxwYXJhbSBuYW1lPVwibm9kZVwiPlRoZSBub2RlIHdlIGFyZSB2YWxpZGF0aW5nPC9wYXJhbT5cclxuIC8vLyA8cGFyYW0gbmFtZT1cImlzRmluYWxcIj5UcnVlIGlmIHRoaXMgaXMgdGhlIGZpbmFsIG1hdGNoIGFuZCBubyBmdXJ0aGVyIHZhbHVlcyB3aWxsIGJlIGFkZGVkPC9wYXJhbT5cclxuIC8vLyA8cmV0dXJucz5SZXR1cm5zIHRydWUgaWYgdGhlIHZhbHVlIGNhbiBiZSBwYXJzZWQgc3VjY2Vzc2Z1bGx5IHVzaW5nIHRoZSB0b2tlbjwvcmV0dXJucz5cclxuIHByaXZhdGUgQm9vbGVhbiBWYWxpZGF0ZVRva2VuKFBhdHRlcm5Db250ZXh0IGNvbnRleHQsIFBhdGhOb2RlIG5vZGUsIEJvb2xlYW4gaXNGaW5hbClcclxuIHtcclxuIC8vIGlmIGl0IGlzIGZpbmFsemVkIHRoZW4gaXQgaXMgZGVmaW5pdGVseSBhbHNvIHZhbGlkXHJcbiBpZiAobm9kZS5Jc0ZpbmFsaXplZClcclxuIHJldHVybiB0cnVlO1xyXG5cclxuIFRva2VuIHRva2VuID0gbm9kZS5Ub2tlbjtcclxuIFN0cmluZyB0ZXh0VmFsdWUgPSBub2RlLlRleHRWYWx1ZTtcclxuXHJcbiAvLyBtYXRjaCBleGFjdCB2YWx1ZXMgZmlyc3RcclxuIGlmIChTdHJpbmcuSXNOdWxsT3JFbXB0eSh0ZXh0VmFsdWUpKVxyXG4gcmV0dXJuIGZhbHNlO1xyXG4gaWYgKHRva2VuLkV4YWN0TWF0Y2gpXHJcbiByZXR1cm4gKChpc0ZpbmFsICYmIHRva2VuLlZhbHVlID09IHRleHRWYWx1ZSkgfHwgKCFpc0ZpbmFsICYmIHRva2VuLlZhbHVlLlN0YXJ0c1dpdGgodGV4dFZhbHVlKSkpO1xyXG5cclxuIC8vIHRlc3QgaW5idWlsdCB0b2tlbnMgZmlyc3RcclxuIHN3aXRjaCAodG9rZW4uVmFsdWUpXHJcbiB7XHJcbiAvLyB3aGl0ZXNwYWNlXHJcbiBjYXNlIFwiIFwiOlxyXG4gcmV0dXJuIFZhbGlkYXRlQ291bnQodG9rZW4sIHRleHRWYWx1ZSwgaXNGaW5hbCkgJiYgU3RyaW5nVXRpbHMuTWF0Y2hBbGwodGV4dFZhbHVlLCBcIiBcXHRcIik7XHJcbiBjYXNlIFwibmV3bGluZVwiOlxyXG4gcmV0dXJuIFZhbGlkYXRlQ291bnQodG9rZW4sIHRleHRWYWx1ZSwgaXNGaW5hbCkgJiYgU3RyaW5nVXRpbHMuTWF0Y2hBbGwodGV4dFZhbHVlLCBcIlxcclxcblwiKTtcclxuIGNhc2UgXCJlbXB0eWxpbmVcIjpcclxuIHJldHVybiBWYWxpZGF0ZUNvdW50KHRva2VuLCB0ZXh0VmFsdWUsIGlzRmluYWwpICYmIFN0cmluZ1V0aWxzLk1hdGNoQWxsKHRleHRWYWx1ZSwgXCJcXHJcXG4gXFx0XCIpO1xyXG4gY2FzZSBcImxldHRlclwiOlxyXG4gcmV0dXJuIFZhbGlkYXRlQ291bnQodG9rZW4sIHRleHRWYWx1ZSwgaXNGaW5hbCkgJiYgU3RyaW5nVXRpbHMuTWF0Y2hBbGwodGV4dFZhbHVlLCBMZXR0ZXJDaGFyYWN0ZXJzKTtcclxuIGNhc2UgXCJhbnlcIjpcclxuIHJldHVybiBWYWxpZGF0ZUNvdW50KHRva2VuLCB0ZXh0VmFsdWUsIGlzRmluYWwpO1xyXG4gfVxyXG5cclxuIC8vIGNoZWNrIHBhdHRlcm4gdGFncyBhbmQgZG8gYSBzdWIgbWF0Y2ggZm9yIGVhY2ggb2YgdGhlbVxyXG4gaWYgKHRoaXMuY29tcGlsZWRQYXR0ZXJucy5Db250YWluc0tleSh0b2tlbi5WYWx1ZSkpXHJcbiB7XHJcbiAvLyBzdWIgbWF0Y2hpbmcgaXMgcG9zc2libGUsIHNvIHN0YXJ0IGEgbmV3IG9uZSBvciBjb250aW51ZSB0aGUgcHJldmlvdXMgb25lXHJcbiBpZiAobm9kZS5NYXRjaFN0YXRlID09IG51bGwpXHJcbiBub2RlLk1hdGNoU3RhdGUgPSBNYXRjaFN0YXJ0KGNvbnRleHQsIHRva2VuLlZhbHVlKTtcclxuIC8vIGlmIHRoaXMgaXMgdGhlIGxhc3QgbWF0Y2ggdGhlbiBhc3NlbWJsZSB0aGUgcmVzdWx0c1xyXG4gaWYgKGlzRmluYWwpXHJcbiByZXR1cm4gSGFzUmVzdWx0cyhub2RlLk1hdGNoU3RhdGUpO1xyXG4gcmV0dXJuIE1hdGNoTmV4dChub2RlLk1hdGNoU3RhdGUsIHRleHRWYWx1ZVt0ZXh0VmFsdWUuTGVuZ3RoIC0gMV0pO1xyXG4gfVxyXG5cclxuIC8vIGNoZWNrIGlmIGEgdmFsaWRhdG9yIGlzIHJlZ2lzdGVyZWQgZm9yIHRoaXMgdG9rZW5cclxuIElUb2tlblZhbGlkYXRvciB2YWxpZGF0b3I7XHJcbiAjaWYgU0NSSVBUU0hBUlBcclxuIGlmICgodmFsaWRhdG9yID0gRGljdGlvbmFyeVV0aWxzLlRyeUdldFZhbGlkYXRvcnModmFsaWRhdG9ycywgdG9rZW4uVmFsdWUpKSA9PSBudWxsKVxyXG4gI2Vsc2VcclxuIGlmICghdGhpcy52YWxpZGF0b3JzLlRyeUdldFZhbHVlKHRva2VuLlZhbHVlLCBvdXQgdmFsaWRhdG9yKSlcclxuICNlbmRpZlxyXG4gcmV0dXJuIGZhbHNlO1xyXG5cclxuIHJldHVybiB2YWxpZGF0b3IuVmFsaWRhdGVUb2tlbih0b2tlbiwgdGV4dFZhbHVlLCBpc0ZpbmFsKTtcclxuIH1cclxuXHJcblxyXG4gLy8vIDxzdW1tYXJ5PlxyXG4gLy8vIFBhcnNlcyB0aGUgVGV4dFZhbHVlIG9mIHRoZSBub2RlIGludG8gdGhlIGZpbmFsIHZhbHVlXHJcbiAvLy8gPC9zdW1tYXJ5PlxyXG4gLy8vIDxwYXJhbSBuYW1lPVwibm9kZVwiPjwvcGFyYW0+XHJcbiAvLy8gPHJldHVybnM+UmV0dXJucyB0cnVlIGlmIHN1Y2Nlc3NmdWwsIGZhbHNlIGlmIHRoZSBUZXh0VmFsdWUgaXMgbm90IHZhbGlkPC9yZXR1cm5zPlxyXG4gcHJpdmF0ZSB2b2lkIEZpbmFsaXplVmFsdWUoUGF0aE5vZGUgbm9kZSlcclxuIHtcclxuIC8vIGFscmVhZHkgZmluYWxpemVkXHJcbiBpZiAobm9kZS5Jc0ZpbmFsaXplZClcclxuIHJldHVybjtcclxuXHJcbiBUb2tlbiB0b2tlbiA9IG5vZGUuVG9rZW47XHJcbiBTdHJpbmcgdGV4dFZhbHVlID0gbm9kZS5UZXh0VmFsdWU7XHJcblxyXG4gaWYgKHRva2VuLkV4YWN0TWF0Y2ggfHwgdG9rZW4uVmFsdWUgPT0gXCIgXCIgfHwgdG9rZW4uVmFsdWUgPT0gXCJuZXdsaW5lXCIgfHwgdG9rZW4uVmFsdWUgPT0gXCJlbXB0eWxpbmVcIiB8fCB0b2tlbi5WYWx1ZSA9PSBcImxldHRlclwiKVxyXG4ge1xyXG4gbm9kZS5WYWx1ZSA9IHRleHRWYWx1ZTtcclxuIG5vZGUuSXNGaW5hbGl6ZWQgPSB0cnVlO1xyXG4gcmV0dXJuO1xyXG4gfVxyXG5cclxuIC8vIGNoZWNrIHBhdHRlcm4gdGFncyBhbmQgZG8gYSBzdWIgbWF0Y2ggZm9yIGVhY2ggb2YgdGhlbVxyXG4gaWYgKHRoaXMuY29tcGlsZWRQYXR0ZXJucy5Db250YWluc0tleSh0b2tlbi5WYWx1ZSkgJiYgbm9kZS5NYXRjaFN0YXRlICE9IG51bGwpXHJcbiB7XHJcbiBub2RlLlZhbHVlID0gbnVsbDtcclxuIExpc3Q8T2JqZWN0PiByZXN1bHRzID0gTWF0Y2hSZXN1bHRzKG5vZGUuTWF0Y2hTdGF0ZSk7XHJcbiBpZiAocmVzdWx0cy5Db3VudCA9PSAwKVxyXG4gcmV0dXJuO1xyXG4gLy8gVE9ETzogY2FuIGJlIG11bHRpcGxlIHJlc3VsdHMsIGNob29zZSB0aGUgY29ycmVjdCBvbmUgZGVwZW5kaW5nIG9uIHVzZXIgY3VsdHVyZVxyXG4gbm9kZS5WYWx1ZSA9IHJlc3VsdHNbMF07XHJcbiBub2RlLklzRmluYWxpemVkID0gdHJ1ZTtcclxuIHJldHVybjtcclxuIH1cclxuXHJcbiAvLyBjaGVjayBpZiBhIHZhbGlkYXRvciBpcyByZWdpc3RlcmVkIGZvciB0aGlzIHRva2VuXHJcbiBJVG9rZW5WYWxpZGF0b3IgdmFsaWRhdG9yO1xyXG4gI2lmIFNDUklQVFNIQVJQXHJcbiBpZiAoKHZhbGlkYXRvciA9IERpY3Rpb25hcnlVdGlscy5UcnlHZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRva2VuLlZhbHVlKSkgIT0gbnVsbClcclxuICNlbHNlXHJcbiBpZiAodGhpcy52YWxpZGF0b3JzLlRyeUdldFZhbHVlKHRva2VuLlZhbHVlLCBvdXQgdmFsaWRhdG9yKSlcclxuICNlbmRpZlxyXG4ge1xyXG4gbm9kZS5WYWx1ZSA9IHZhbGlkYXRvci5GaW5hbGl6ZVZhbHVlKHRva2VuLCB0ZXh0VmFsdWUpO1xyXG4gbm9kZS5Jc0ZpbmFsaXplZCA9IHRydWU7XHJcbiB9XHJcbiB9XHJcbiB9XHJcbiAqL1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9QYXR0ZXJuTWF0Y2hlci5qc1xuICoqLyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEplbnMgb24gMjYuMDYuMjAxNS5cclxuICogUHJvdmlkZXMgdXRpbGl0aWVzIGZvciBhcnJheXMgc3VjaCBhcyBjaGVja2luZyB3aGV0aGVyIGFuIG9iamVjdCBzdXBwb3J0aW5nIHRoZSBFcXVhbHMgaW50ZXJmYWNlIGlzIGNvbnRhaW5lZFxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBhcnJheVV0aWxzID0ge1xyXG5cdC8qKlxyXG5cdCAqIENoZWNrcyB3aGV0aGVyIHRoZSBhcnJheSBjb250YWlucyBvYmogdXNpbmcgYSBjdXN0b20gY29tcGFyZXIgaWYgYXZhaWxhYmxlXHJcblx0ICogQHBhcmFtIGFyIHt7ZXF1YWxzOiBmdW5jdGlvbn1bXX1cclxuXHQgKiBAcGFyYW0gb2JqIHt7ZXF1YWxzOiBmdW5jdGlvbn19XHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0Y29udGFpbnM6IGZ1bmN0aW9uKGFyLCBvYmopIHtcclxuXHRcdGlmICghYXIpXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdC8vIGNoZWNrIHN0cmljdCBlcXVhbGl0eSBmaXJzdCwgc2hvdWxkIGJlIGZhc3Rlc3RcclxuXHRcdGlmIChhci5pbmRleE9mKG9iaikgIT09IC0xKVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHJcblx0XHR2YXIgaGFzRXF1YWxzID0gKCEhb2JqICYmIHR5cGVvZiBvYmouZXF1YWxzID09PSAnZnVuY3Rpb24nKTtcclxuXHJcblx0XHQvLyBjaGVjayBhbGwgZWxlbWVudHNcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXIubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIG90aGVyID0gYXJbaV07XHJcblx0XHRcdHZhciByZXN1bHQ7XHJcblx0XHRcdGlmIChoYXNFcXVhbHMpXHJcblx0XHRcdFx0cmVzdWx0ID0gb2JqLmVxdWFscyhvdGhlcik7XHJcblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBvdGhlci5lcXVhbHMgPT09ICdmdW5jdGlvbicpXHJcblx0XHRcdFx0cmVzdWx0ID0gb3RoZXIuZXF1YWxzKG9iaik7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXN1bHQgPSAob2JqID09PSBvdGhlcik7XHJcblx0XHRcdGlmIChyZXN1bHQpXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVV0aWxzO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy91dGlscy9hcnJheVV0aWxzLmpzXG4gKiovIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgSmVucyBvbiAyNi4wNi4yMDE1LlxyXG4gKiBQcm92aWRlcyB1dGlsaXRpZXMgZm9yIHN0cmluZ3NcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgc3RyaW5nVXRpbHMgPSB7XHJcblx0LyoqXHJcblx0ICogQ2hlY2tzIHdoZXRoZXIgc3RyIHN0YXJ0cyB3aXRoIHZhbFxyXG5cdCAqIEBwYXJhbSBzdHIge3N0cmluZ31cclxuXHQgKiBAcGFyYW0gdmFsIHtzdHJpbmd9XHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0c3RhcnRzV2l0aDogZnVuY3Rpb24oc3RyLCB2YWwpIHtcclxuXHRcdHJldHVybiAhIXN0ciAmJiAhIXZhbCAmJiAoc3RyLmxlbmd0aCA+IHZhbC5sZW5ndGgpICYmICAoc3RyLmluZGV4T2YodmFsKSA9PT0gMCk7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogTWF0Y2ggYWxsIGNoYXJhY3RlcnMgaW4gdGhlIHN0cmluZyBhZ2FpbnN0IGFsbCBjaGFyYWN0ZXJzIGluIHRoZSBnaXZlbiBhcnJheSBvciBzdHJpbmdcclxuXHQgKiBAcGFyYW0gc3RyIHtzdHJpbmd9IC0gVGhlIHN0cmluZyB0byB0ZXN0XHJcblx0ICogQHBhcmFtIGNoYXJzIHtzdHJpbmd8c3RyaW5nW119IC0gVGhlIGNoYXJhY3RlcnMgdG8gdGVzdCBmb3JcclxuXHQgKiBAcGFyYW0gc3RhcnRJbmRleCB7bnVtYmVyPX0gLSBJbmRleCBvZiB0aGUgZmlyc3QgY2hhcmFjdGVyIHRvIHRlc3RcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGFsbCBjaGFyYWN0ZXJzIGluIHRoZSBzdHJpbmcgYXJlIGNvbnRhaW5lZCBpbiBjaGFyc1xyXG5cdCAqL1xyXG5cdG1hdGNoQWxsOiBmdW5jdGlvbihzdHIsIGNoYXJzLCBzdGFydEluZGV4KSB7XHJcblx0XHRpZiAoIXN0ciB8fCAhY2hhcnMpXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdGZvciAodmFyIGkgPSBzdGFydEluZGV4IHx8IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGMgPSBzdHIuY2hhckF0KGkpO1xyXG5cdFx0XHRpZiAoY2hhcnMuaW5kZXhPZihjKSA9PT0gLTEpXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3RyaW5nVXRpbHM7XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3V0aWxzL3N0cmluZ1V0aWxzLmpzXG4gKiovIiwiLyoqXHJcbiAqIFRva2VuIHZhbHVlIGZvciBwYXJzZWQgcGF0dGVybnNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhIG5ldyBUb2tlblxyXG4gKiBAcGFyYW0gdmFsdWUge3N0cmluZ31cclxuICogQHBhcmFtIGV4YWN0TWF0Y2gge2Jvb2xlYW59XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxudmFyIFRva2VuID0gZnVuY3Rpb24odmFsdWUsIGV4YWN0TWF0Y2gpIHtcclxuXHR0aGlzLmV4YWN0TWF0Y2ggPSAhIWV4YWN0TWF0Y2g7XHJcblx0aWYgKHRoaXMuZXhhY3RNYXRjaClcclxuXHR7XHJcblx0XHR0aGlzLnZhbHVlID0gdmFsdWU7XHJcblx0XHR0aGlzLm1pbkNvdW50ID0gdGhpcy5tYXhDb3VudCA9IDE7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHR2YXIgcGFydHMgPSAodmFsdWUgfHwgJycpLnNwbGl0KCc6Jyk7XHJcblx0dGhpcy52YWx1ZSA9IChwYXJ0cy5sZW5ndGggPiAwID8gcGFydHNbMF0gOiAnJyk7XHJcblx0aWYgKHBhcnRzLmxlbmd0aCA9PT0gMSlcclxuXHRcdHRoaXMubWluQ291bnQgPSB0aGlzLm1heENvdW50ID0gMTtcclxuXHRlbHNlIGlmIChwYXJ0cy5sZW5ndGggPiAxKVxyXG5cdHtcclxuXHRcdHN3aXRjaCAocGFydHNbMV0pXHJcblx0XHR7XHJcblx0XHRcdGNhc2UgJyc6XHJcblx0XHRcdFx0dGhpcy5taW5Db3VudCA9IDE7XHJcblx0XHRcdFx0dGhpcy5tYXhDb3VudCA9IDE7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJysnOlxyXG5cdFx0XHRcdHRoaXMubWluQ291bnQgPSAxO1xyXG5cdFx0XHRcdHRoaXMubWF4Q291bnQgPSB0aGlzLk1BWF9WQUxVRTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnKic6XHJcblx0XHRcdFx0dGhpcy5taW5Db3VudCA9IDA7XHJcblx0XHRcdFx0dGhpcy5tYXhDb3VudCA9IHRoaXMuTUFYX1ZBTFVFO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICc/JzpcclxuXHRcdFx0XHR0aGlzLm1pbkNvdW50ID0gMDtcclxuXHRcdFx0XHR0aGlzLm1heENvdW50ID0gMTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHR2YXIgY291bnRQYXJ0cyA9IHBhcnRzWzFdLnNwbGl0KCctJyk7XHJcblx0XHRcdFx0aWYgKGNvdW50UGFydHMubGVuZ3RoID09PSAxKVxyXG5cdFx0XHRcdFx0dGhpcy5taW5Db3VudCA9IHRoaXMubWF4Q291bnQgPSBwYXJzZUludChjb3VudFBhcnRzWzBdKTtcclxuXHRcdFx0XHRlbHNlIGlmIChjb3VudFBhcnRzLmxlbmd0aCA+PSAyKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHRoaXMubWluQ291bnQgPSBwYXJzZUludChjb3VudFBhcnRzWzBdIHx8ICcwJyk7XHJcblx0XHRcdFx0XHR0aGlzLm1heENvdW50ID0gcGFyc2VJbnQoY291bnRQYXJ0c1sxXSB8fCAnMCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblx0Ly8gZG9uJ3QgYWxsb3cgbWF4IHRvIGJlIHNtYWxsZXIgdGhhbiBtaW5cclxuXHRpZiAodGhpcy5tYXhDb3VudCA8IHRoaXMubWluQ291bnQpXHJcblx0XHR0aGlzLm1heENvdW50ID0gdGhpcy5taW5Db3VudDtcclxufTtcclxuLyoqXHJcbiAqIE1heGltdW0gdGltZXMgdGhhdCBhIHRva2VuIHdpdGhvdXQgcmVzdHJpY3Rpb24gY2FuIGJlIHJlcGVhdGVkXHJcbiAqIEBjb25zdFxyXG4gKi9cclxuVG9rZW4ucHJvdG90eXBlLk1BWF9WQUxVRSA9IDEwMDA7XHJcblxyXG5Ub2tlbi5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odG9rZW4pIHtcclxuXHRpZiAoIXRva2VuKSByZXR1cm4gZmFsc2U7XHJcblx0cmV0dXJuIHRva2VuLnZhbHVlID09PSB0aGlzLnZhbHVlICYmXHJcblx0XHRcdHRva2VuLm1pbkNvdW50ID09PSB0aGlzLm1pbkNvdW50ICYmXHJcblx0XHRcdHRva2VuLm1heENvdW50ID09PSB0aGlzLm1heENvdW50ICYmXHJcblx0XHRcdHRva2VuLmV4YWN0TWF0Y2ggPT09IHRoaXMuZXhhY3RNYXRjaDtcclxufTtcclxuVG9rZW4ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcblx0aWYgKHRoaXMuZXhhY3RNYXRjaClcclxuXHRcdHJldHVybiB0aGlzLnZhbHVlO1xyXG5cdHJldHVybiB0aGlzLnZhbHVlICsgJzonICsgdGhpcy5taW5Db3VudCArICctJyArIHRoaXMubWF4Q291bnQ7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRva2VuO1xyXG5cclxuLypcclxuXHRwdWJsaWMgY2xhc3MgVG9rZW5cclxuXHR7XHJcblx0XHRwdWJsaWMgU3RyaW5nIFZhbHVlO1xyXG5cdFx0cHVibGljIEludDMyIE1pbkNvdW50O1xyXG5cdFx0cHVibGljIEludDMyIE1heENvdW50O1xyXG5cdFx0cHVibGljIEJvb2xlYW4gRXhhY3RNYXRjaDtcclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gUGFyc2UgdGhlIHRva2VuXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0Ly8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj48L3BhcmFtPlxyXG5cdFx0Ly8vIDxwYXJhbSBuYW1lPVwiZXhhY3RNYXRjaFwiPjwvcGFyYW0+XHJcblx0XHRwdWJsaWMgVG9rZW4oU3RyaW5nIHZhbHVlLCBCb29sZWFuIGV4YWN0TWF0Y2gpXHJcblx0XHR7XHJcblx0XHRcdGlmIChleGFjdE1hdGNoKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGhpcy5WYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdHRoaXMuTWluQ291bnQgPSB0aGlzLk1heENvdW50ID0gMTtcclxuXHRcdFx0XHR0aGlzLkV4YWN0TWF0Y2ggPSB0cnVlO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuI2lmICFTQ1JJUFRTSEFSUFxyXG5cdFx0XHRTdHJpbmdbXSBwYXJ0cyA9IHZhbHVlLlNwbGl0KG5ldyBDaGFyW10geyAnOicgfSwgU3RyaW5nU3BsaXRPcHRpb25zLlJlbW92ZUVtcHR5RW50cmllcyk7XHJcbiNlbHNlXHJcblx0XHRcdFN0cmluZ1tdIHBhcnRzID0gU3RyaW5nVXRpbHMuU3BsaXQodmFsdWUsICc6Jyk7XHJcbiNlbmRpZlxyXG5cdFx0XHR0aGlzLlZhbHVlID0gcGFydHNbMF07XHJcblx0XHRcdGlmIChwYXJ0cy5MZW5ndGggPT0gMSlcclxuXHRcdFx0XHR0aGlzLk1pbkNvdW50ID0gdGhpcy5NYXhDb3VudCA9IDE7XHJcblx0XHRcdGVsc2UgaWYgKHBhcnRzLkxlbmd0aCA+IDEpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzd2l0Y2ggKHBhcnRzWzFdKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGNhc2UgXCJcIjpcclxuXHRcdFx0XHRcdFx0dGhpcy5NaW5Db3VudCA9IDE7XHJcblx0XHRcdFx0XHRcdHRoaXMuTWF4Q291bnQgPSAxO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgXCIrXCI6XHJcblx0XHRcdFx0XHRcdHRoaXMuTWluQ291bnQgPSAxO1xyXG5cdFx0XHRcdFx0XHR0aGlzLk1heENvdW50ID0gSW50MzIuTWF4VmFsdWU7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSBcIipcIjpcclxuXHRcdFx0XHRcdFx0dGhpcy5NaW5Db3VudCA9IDA7XHJcblx0XHRcdFx0XHRcdHRoaXMuTWF4Q291bnQgPSBJbnQzMi5NYXhWYWx1ZTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIFwiP1wiOlxyXG5cdFx0XHRcdFx0XHR0aGlzLk1pbkNvdW50ID0gMDtcclxuXHRcdFx0XHRcdFx0dGhpcy5NYXhDb3VudCA9IDE7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdFx0U3RyaW5nW10gY291bnRQYXJ0cyA9IHBhcnRzWzFdLlNwbGl0KCctJyk7XHJcblx0XHRcdFx0XHRcdGlmIChjb3VudFBhcnRzLkxlbmd0aCA9PSAxKVxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuTWluQ291bnQgPSB0aGlzLk1heENvdW50ID0gSW50MzIuUGFyc2UoY291bnRQYXJ0c1swXSk7XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGNvdW50UGFydHMuTGVuZ3RoID09IDIpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLk1pbkNvdW50ID0gSW50MzIuUGFyc2UoY291bnRQYXJ0c1swXSk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5NYXhDb3VudCA9IEludDMyLlBhcnNlKGNvdW50UGFydHNbMV0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuI2lmICFTQ1JJUFRTSEFSUFxyXG5cdFx0cHVibGljIG92ZXJyaWRlIEJvb2xlYW4gRXF1YWxzKG9iamVjdCBvYmopXHJcblx0XHR7XHJcblx0XHRcdGlmIChSZWZlcmVuY2VFcXVhbHMobnVsbCwgb2JqKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAoUmVmZXJlbmNlRXF1YWxzKHRoaXMsIG9iaikpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRpZiAob2JqLkdldFR5cGUoKSAhPSBHZXRUeXBlKCkpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIEVxdWFscygoVG9rZW4pb2JqKTtcclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgYm9vbCBFcXVhbHMoVG9rZW4gb3RoZXIpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiBzdHJpbmcuRXF1YWxzKHRoaXMuVmFsdWUsIG90aGVyLlZhbHVlKSAmJiB0aGlzLk1pbkNvdW50ID09IG90aGVyLk1pbkNvdW50ICYmIHRoaXMuTWF4Q291bnQgPT0gb3RoZXIuTWF4Q291bnQgJiYgdGhpcy5FeGFjdE1hdGNoLkVxdWFscyhvdGhlci5FeGFjdE1hdGNoKTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgaW50IEdldEhhc2hDb2RlKClcclxuXHRcdHtcclxuXHRcdFx0dW5jaGVja2VkXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpbnQgaGFzaENvZGUgPSAodGhpcy5WYWx1ZSAhPSBudWxsID8gdGhpcy5WYWx1ZS5HZXRIYXNoQ29kZSgpIDogMCk7XHJcblx0XHRcdFx0aGFzaENvZGUgPSAoaGFzaENvZGUgKiAzOTcpIF4gdGhpcy5NaW5Db3VudDtcclxuXHRcdFx0XHRoYXNoQ29kZSA9IChoYXNoQ29kZSAqIDM5NykgXiB0aGlzLk1heENvdW50O1xyXG5cdFx0XHRcdGhhc2hDb2RlID0gKGhhc2hDb2RlICogMzk3KSBeIHRoaXMuRXhhY3RNYXRjaC5HZXRIYXNoQ29kZSgpO1xyXG5cdFx0XHRcdHJldHVybiBoYXNoQ29kZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBvdmVycmlkZSBTdHJpbmcgVG9TdHJpbmcoKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAodGhpcy5FeGFjdE1hdGNoKVxyXG5cdFx0XHRcdHJldHVybiBTdHJpbmcuRm9ybWF0KFwiezB9XCIsIHRoaXMuVmFsdWUpO1xyXG5cdFx0XHRyZXR1cm4gU3RyaW5nLkZvcm1hdChcInswfTp7MX0tezJ9XCIsIHRoaXMuVmFsdWUsIHRoaXMuTWluQ291bnQsIHRoaXMuTWF4Q291bnQpO1xyXG5cdFx0fVxyXG4jZW5kaWZcclxuXHR9XHJcbiovXHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL21hdGNoaW5nL1Rva2VuLmpzXG4gKiovIiwiLyoqXHJcbiAqIEtlZXBzIHRyZWUgaW5mb3JtYXRpb24gZm9yIHBhdHRlcm5zXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIG5ldyBwYXRjaFxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbnZhciBQYXR0ZXJuUGF0aCA9IGZ1bmN0aW9uKCkge1xyXG5cdC8vIFBhdGhzIGZvciBhbGwgdG9rZW5zXHJcblx0dGhpcy5wYXRocyA9IHt9O1xyXG5cdC8vIEFueSBwYXR0ZXJucyBmaW5pc2hpbmcgYXQgdGhpcyBwYXRoXHJcblx0dGhpcy5tYXRjaGVkUGF0dGVybnMgPSBbXTtcclxuXHJcbn07XHJcblBhdHRlcm5QYXRoLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBtYXRjaGVzID0gKHRoaXMubWF0Y2hlZFBhdHRlcm5zIHx8IFtdKS5qb2luKCcsICcpO1xyXG5cdHZhciBjaGlsZHJlbiA9ICh0aGlzLnBhdGhzLm1hcChmdW5jdGlvbih0b2tlbikge1xyXG5cdFx0cmV0dXJuIHRva2VuLnRvU3RyaW5nKCk7XHJcblx0fSkpLmpvaW4oJywgJyk7XHJcblx0cmV0dXJuIG1hdGNoZXMgKyAnIDo6ICcgKyBjaGlsZHJlbjtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVyblBhdGg7XHJcblxyXG4vKlxyXG5cdGludGVybmFsIGNsYXNzIFBhdHRlcm5QYXRoXHJcblx0e1xyXG4jaWYgIVNDUklQVFNIQVJQXHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgU3RyaW5nIFRvU3RyaW5nKClcclxuXHRcdHtcclxuXHRcdFx0dmFyIG1hdGNoZXMgPSBTdHJpbmcuSm9pbihcIiwgXCIsIHRoaXMuTWF0Y2hlZFBhdHRlcm5zID8/IG5ldyBMaXN0PEludDMyPigwKSk7XHJcblx0XHRcdHZhciBjaGlsZHJlbiA9IFN0cmluZy5Kb2luKFwiLCBcIiwgdGhpcy5QYXRocy5LZXlzLlNlbGVjdCh0ID0+IHQuVG9TdHJpbmcoKSkpO1xyXG5cdFx0XHRyZXR1cm4gU3RyaW5nLkZvcm1hdChcInswfSA6OiB7MX1cIiwgbWF0Y2hlcywgY2hpbGRyZW4pO1xyXG5cdFx0fVxyXG4jZW5kaWZcclxuXHJcblx0XHRwdWJsaWMgRGljdGlvbmFyeTxUb2tlbiwgUGF0dGVyblBhdGg+IFBhdGhzID0gbmV3IERpY3Rpb25hcnk8VG9rZW4sIFBhdHRlcm5QYXRoPigpO1xyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBBbnkgcGF0dGVybnMgZmluaXNoaW5nIGF0IHRoaXMgcGF0aFxyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdHB1YmxpYyBMaXN0PEludDMyPiBNYXRjaGVkUGF0dGVybnM7XHJcblx0fVxyXG4qL1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9tYXRjaGluZy9QYXR0ZXJuUGF0aC5qc1xuICoqLyIsIi8qKlxyXG4gKiBIb2xkcyBzdGF0ZSBmb3IgYSBtYXRjaGluZyBzZXNzaW9uXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIE1hdGNoU3RhdGUgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLm1hdGNoVGFnID0gbnVsbDtcclxuXHR0aGlzLmNhbmRpZGF0ZVBhdGhzID0gW107XHJcblx0dGhpcy5uZXdDYW5kaWRhdGVzID0gW107XHJcblxyXG5cdHRoaXMuY29udGV4dCA9IG51bGw7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoU3RhdGU7XHJcblxyXG4vKlxyXG5cdGludGVybmFsIGNsYXNzIE1hdGNoU3RhdGVcclxuXHR7XHJcblx0XHRwdWJsaWMgU3RyaW5nIE1hdGNoVGFnO1xyXG5cdFx0cHVibGljIExpc3Q8UGF0aE5vZGU+IENhbmRpZGF0ZVBhdGhzID0gbmV3IExpc3Q8UGF0aE5vZGU+KCk7XHJcblx0XHRwdWJsaWMgTGlzdDxQYXRoTm9kZT4gTmV3Q2FuZGlkYXRlcyA9IG5ldyBMaXN0PFBhdGhOb2RlPigpO1xyXG5cclxuXHRcdHB1YmxpYyBQYXR0ZXJuQ29udGV4dCBDb250ZXh0IHsgZ2V0OyBzZXQ7IH1cclxuXHR9XHJcbiovXHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL01hdGNoU3RhdGUuanNcbiAqKi8iLCIvKipcclxuICogQSBub2RlIGluIHRoZSBjdXJyZW50IHBhcnNpbmcgc2Vzc2lvblxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBuZXcgbm9kZSB0byBob2xkIHBhcnNpbmcgc3RhdGVcclxuICogQHBhcmFtIHRva2VuXHJcbiAqIEBwYXJhbSBwYXRoXHJcbiAqIEBwYXJhbSB0ZXh0VmFsdWVcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG52YXIgUGF0aE5vZGUgPSBmdW5jdGlvbih0b2tlbiwgcGF0aCwgdGV4dFZhbHVlKSB7XHJcblx0Ly8gVGhlIHRva2VuIGZvciBjb21wYXJpc29uXHJcblx0dGhpcy50b2tlbiA9IHRva2VuO1xyXG5cclxuXHQvLyBUaGUgbWF0Y2hpbmcgcGF0aCBmb3IgZ29pbmcgZGVlcGVyXHJcblx0dGhpcy5wYXRoID0gcGF0aDtcclxuXHJcblx0Ly8gVGhlIHZhbHVlIHdoaWNoIHN0aWxsIG1hdGNoZXMgdGhpcyBwYXRoXHJcblx0dGhpcy50ZXh0VmFsdWUgPSB0ZXh0VmFsdWU7XHJcblxyXG5cdC8vIFRoZSBmaW5hbCBhc3NlbWJsZWQgdmFsdWVcclxuXHR0aGlzLnZhbHVlID0gbnVsbDtcclxuXHQvLyBBbGwgdmFsdWVzIG9mIGVhcmxpZXIgdG9rZW5zXHJcblx0dGhpcy5wcmV2aW91c1ZhbHVlcyA9IFtdO1xyXG5cclxuXHQvLyBUcnVlIGlmIHRoZSB2YWx1ZSBoYXMgYmVlbiBmaW5hbGl6ZWQgYW5kIGFzc2lnbmVkXHJcblx0dGhpcy5pc0ZpbmFsaXplZCA9IG51bGw7XHJcblxyXG5cdC8vIFJlbWVtYmVyIHRoZSBjdXJyZW50IHN0YXRlIG9mIGFueSBtYXRjaGluZyBhbGdvcml0aG1cclxuXHR0aGlzLm1hdGNoU3RhdGUgPSBudWxsO1xyXG59O1xyXG5cclxuUGF0aE5vZGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMudGV4dFZhbHVlICsgJyA9ICcgKyB0aGlzLnRva2VuO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXRoTm9kZTtcclxuXHJcbi8qXHJcblx0aW50ZXJuYWwgY2xhc3MgUGF0aE5vZGVcclxuXHR7XHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvU3RyaW5nKClcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIFN0cmluZy5Gb3JtYXQoXCJ7MH0gPSB7MX1cIiwgdGhpcy5UZXh0VmFsdWUsIHRoaXMuVG9rZW4pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBUaGUgdG9rZW4gZm9yIGNvbXBhcmlzb25cclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHRwdWJsaWMgVG9rZW4gVG9rZW47XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFRoZSBtYXRjaGluZyBwYXRoIGZvciBnb2luZyBkZWVwZXJcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHRwdWJsaWMgUGF0dGVyblBhdGggUGF0aDtcclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gVGhlIHZhbHVlIHdoaWNoIHN0aWxsIG1hdGNoZXMgdGhpcyBwYXRoXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0cHVibGljIFN0cmluZyBUZXh0VmFsdWU7XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFRoZSBmaW5hbCBhc3NlbWJsZWQgdmFsdWVcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHRwdWJsaWMgT2JqZWN0IFZhbHVlO1xyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIEFsbCB2YWx1ZXMgb2YgZWFybGllciB0b2tlbnNcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHRwdWJsaWMgTGlzdDxPYmplY3Q+IFByZXZpb3VzVmFsdWVzID0gbmV3IExpc3Q8T2JqZWN0PigpO1xyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBUcnVlIGlmIHRoZSB2YWx1ZSBoYXMgYmVlbiBmaW5hbGl6ZWQgYW5kIGFzc2lnbmVkXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0cHVibGljIEJvb2xlYW4gSXNGaW5hbGl6ZWQ7XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFJlbWVtYmVyIHRoZSBjdXJyZW50IHN0YXRlIG9mIGFueSBtYXRjaGluZyBhbGdvcml0aG1cclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHRwdWJsaWMgT2JqZWN0IE1hdGNoU3RhdGU7XHJcblxyXG5cdFx0cHVibGljIFBhdGhOb2RlKFRva2VuIHRva2VuLCBQYXR0ZXJuUGF0aCBwYXRoLCBTdHJpbmcgdGV4dFZhbHVlKVxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLlRva2VuID0gdG9rZW47XHJcblx0XHRcdHRoaXMuUGF0aCA9IHBhdGg7XHJcblx0XHRcdHRoaXMuVGV4dFZhbHVlID0gdGV4dFZhbHVlO1xyXG5cdFx0fVxyXG5cdH1cclxuKi9cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbWF0Y2hpbmcvUGF0aE5vZGUuanNcbiAqKi8iLCIvKipcclxuICogQ29udGV4dCBmb3IgcGF0dGVybiBtYXRjaGluZ1xyXG4gKiBIb2xkcyB2YWx1ZXMgd2hpY2ggbWF5IGluZmx1ZW5jZSBwYXJzaW5nIG91dGNvbWUgbGlrZSBjdXJyZW50IGRhdGUgYW5kIHRpbWUsIGxvY2F0aW9uIG9yIGxhbmd1YWdlXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFBhdHRlcm5Db250ZXh0ID0gZnVuY3Rpb24oY3VycmVudERhdGUpIHtcclxuXHR0aGlzLmN1cnJlbnREYXRlID0gY3VycmVudERhdGUgfHwgbmV3IERhdGUoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVybkNvbnRleHQ7XHJcblxyXG4vKlxyXG5cdHB1YmxpYyBjbGFzcyBQYXR0ZXJuQ29udGV4dFxyXG5cdHtcclxuXHRcdHB1YmxpYyBMb2NhbERhdGUgQ3VycmVudERhdGUgeyBnZXQ7IHNldDsgfVxyXG5cclxuXHRcdHB1YmxpYyBQYXR0ZXJuQ29udGV4dCgpXHJcblx0XHR7XHJcblx0XHRcdEN1cnJlbnREYXRlID0gbmV3IExvY2FsRGF0ZShEYXRlVGltZS5VdGNOb3cpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBQYXR0ZXJuQ29udGV4dChMb2NhbERhdGUgY3VycmVudERhdGUpXHJcblx0XHR7XHJcblx0XHRcdEN1cnJlbnREYXRlID0gY3VycmVudERhdGU7XHJcblx0XHR9XHJcblx0fVxyXG4qL1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9QYXR0ZXJuQ29udGV4dC5qc1xuICoqLyIsIi8qKlxyXG4gKiBQYXJzZXMgZGF0YSB2YWx1ZXMgdG8gZmlndXJlIG91dCB3aGF0IGFjdHVhbCB0eXBlIHRoZXkgYXJlXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBNb2R1bGVcclxuICogQHR5cGUge29iamVjdH1cclxuICogQHByb3BlcnR5IHtzdHJpbmdbXX0gcGF0dGVyblRhZ3MgLSBhdmFpbGFibGUgcGF0dGVybiB0YWdzXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nW119IHRva2VuVGFncyAtIGF2YWlsYWJsZSB0b2tlbiB0YWdzXHJcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24oc3RyaW5nKX0gZ2V0UGF0dGVybnMgLSByZXR1cm5zIHBhdHRlcm5zIGZvciBhIHRhZ1xyXG4gKi9cclxuXHJcbnZhciBQYXR0ZXJuTWF0Y2hlciA9IHJlcXVpcmUoJy4vUGF0dGVybk1hdGNoZXInKTtcclxudmFyIFBhdHRlcm5Db250ZXh0ID0gcmVxdWlyZSgnLi9QYXR0ZXJuQ29udGV4dCcpO1xyXG5cclxudmFyIG1vZHVsZVR5cGVzID0gW1xyXG5cdHJlcXVpcmUoJy4vbW9kdWxlcy9Cb29sZWFuUGFyc2VyTW9kdWxlJylcclxuXHQvKnJlcXVpcmUoJy4vbW9kdWxlcy9OdW1iZXJQYXJzZXJNb2R1bGUnKSxcclxuXHRyZXF1aXJlKCcuL21vZHVsZXMvRGF0ZVBhcnNlck1vZHVsZScpLFxyXG5cdHJlcXVpcmUoJy4vbW9kdWxlcy9BZGRyZXNzUGFyc2VyTW9kdWxlJyksXHJcblx0cmVxdWlyZSgnLi9tb2R1bGVzL0N1cnJlbmN5UGFyc2VyTW9kdWxlJyksXHJcblx0cmVxdWlyZSgnLi9tb2R1bGVzL1VybFBhcnNlck1vZHVsZScpLFxyXG5cdHJlcXVpcmUoJy4vbW9kdWxlcy9JcFBhcnNlck1vZHVsZScpLFxyXG5cdHJlcXVpcmUoJy4vbW9kdWxlcy9FbWFpbFBhcnNlck1vZHVsZScpKi9cclxuXTtcclxuLy92YXIgZGF0ZU1vZHVsZVR5cGVzID0gW1xyXG5cdC8qcmVxdWlyZSgnLi9tb2R1bGVzL051bWJlclBhcnNlck1vZHVsZScpLFxyXG5cdHJlcXVpcmUoJy4vbW9kdWxlcy9EYXRlUGFyc2VyTW9kdWxlJykqL1xyXG4vL107XHJcblxyXG52YXIgZGVmYXVsdFBhdHRlcm5NYXRjaGVyID0gbnVsbDtcclxuLy92YXIgZGF0ZVBhdHRlcm5NYXRjaGVyID0gbnVsbDtcclxudmFyIG5hbWVkUGF0dGVybk1hdGNoZXJzID0ge307XHJcblxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIG5ldyBQYXR0ZXJuTWF0Y2hlciBvYmplY3QgaW5jbHVkaW5nIHRoZSBzcGVjaWZpZWQgbW9kdWxlc1xyXG4gKiBAcGFyYW0gbW9kdWxlcyB7TW9kdWxlW119IC0gTGlzdCBvZiBtb2R1bGVzIHRvIGluY2x1ZGVcclxuICogQHJldHVybnMge1BhdHRlcm5NYXRjaGVyfVxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIG1ha2VQYXR0ZXJuTWF0Y2hlcihtb2R1bGVzKSB7XHJcblx0dmFyIG1hdGNoZXIgPSBuZXcgUGF0dGVybk1hdGNoZXIoW10pO1xyXG5cdGlmICghbW9kdWxlcylcclxuXHRcdHJldHVybiBtYXRjaGVyO1xyXG5cclxuXHRtb2R1bGVzLmZvckVhY2goZnVuY3Rpb24oTW9kdWxlKSB7XHJcblx0XHR2YXIgbW9kdWxlID0gbmV3IE1vZHVsZSgpO1xyXG5cdFx0dmFyIGksIHRhZztcclxuXHJcblx0XHQvLyBhZGQgcGF0dGVybnNcclxuXHRcdGZvciAoaSA9IDA7IGkgPCBtb2R1bGUucGF0dGVyblRhZ3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dGFnID0gbW9kdWxlLnBhdHRlcm5UYWdzW2ldO1xyXG5cdFx0XHRtYXRjaGVyLmFkZFBhdHRlcm5zKHRhZywgbW9kdWxlLmdldFBhdHRlcm5zKHRhZykpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHJlZ2lzdGVyIHZhbGlkYXRvcnNcclxuXHRcdGZvciAoaSA9IDA7IGkgPCBtb2R1bGUudG9rZW5UYWdzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRhZyA9IG1vZHVsZS50b2tlblRhZ3NbaV07XHJcblx0XHRcdG1hdGNoZXIucmVnaXN0ZXJWYWxpZGF0b3IodGFnLCBtb2R1bGUpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdHJldHVybiBtYXRjaGVyO1xyXG59XHJcblxyXG4vKipcclxuICogTWFrZSBzdXJlIHRoZSBkZWZhdWx0IHBhdHRlcm4gbWF0Y2hlciBpbmNsdWRpbmcgYWxsIHBhdHRlcm5zIGlzIGF2YWlsYWJsZSBhbmQgcmV0dXJuIGl0XHJcbiAqIEByZXR1cm5zIHtQYXR0ZXJuTWF0Y2hlcn1cclxuICovXHJcbmZ1bmN0aW9uIGdldERlZmF1bHRQYXR0ZXJuTWF0Y2hlcigpIHtcclxuXHRpZiAoIWRlZmF1bHRQYXR0ZXJuTWF0Y2hlcilcclxuXHRcdGRlZmF1bHRQYXR0ZXJuTWF0Y2hlciA9IG1ha2VQYXR0ZXJuTWF0Y2hlcihtb2R1bGVUeXBlcyk7XHJcblx0cmV0dXJuIGRlZmF1bHRQYXR0ZXJuTWF0Y2hlcjtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBkYXRhIHBhcnNlciB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSBhbmQgbW9kdWxlcy4gSWYgbmFtZSBhbmQgbW9kdWxlcyBpcyBlbXB0eSwgbWF0Y2hlcyBhbGwgZGVmYXVsdCBwYXR0ZXJucy5cclxuICogQHBhcmFtIG5hbWVcclxuICogQHBhcmFtIG1vZHVsZXNcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG52YXIgRGF0YVBhcnNlciA9IGZ1bmN0aW9uKG5hbWUsIG1vZHVsZXMpIHtcclxuXHRpZiAoIW5hbWUgfHwgIW1vZHVsZXMpIHtcclxuXHRcdHRoaXMucGF0dGVybk1hdGNoZXIgPSBnZXREZWZhdWx0UGF0dGVybk1hdGNoZXIoKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0aWYgKG5hbWVkUGF0dGVybk1hdGNoZXJzW25hbWVdKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dGhpcy5wYXR0ZXJuTWF0Y2hlciA9IG1ha2VQYXR0ZXJuTWF0Y2hlcihtb2R1bGVzKTtcclxuXHRcdG5hbWVkUGF0dGVybk1hdGNoZXJzW25hbWVdID0gdGhpcy5wYXR0ZXJuTWF0Y2hlcjtcclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICogUGFyc2UgYSB2YWx1ZSBpbnRvIGFsbCBwb3NzaWJsZSBuYXRpdmUgdHlwZXNcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqIEBwYXJhbSBjb250ZXh0XHJcbiAqIEByZXR1cm5zIHtBcnJheX1cclxuICovXHJcbkRhdGFQYXJzZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24odmFsdWUsIGNvbnRleHQpIHtcclxuICBjb25zdCBtYXRjaFJlc3VsdHMgPSB0aGlzLnBhdHRlcm5NYXRjaGVyLm1hdGNoKGNvbnRleHQgfHwgbmV3IFBhdHRlcm5Db250ZXh0KCksIHZhbHVlKTtcclxuICByZXR1cm4gbWF0Y2hSZXN1bHRzIHx8IFtdO1xyXG59O1xyXG5cclxuLypcclxue1xyXG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFR5cGVbXSBNb2R1bGVUeXBlcyA9XHJcblx0e1xyXG5cdFx0dHlwZW9mKE51bWJlclBhcnNlck1vZHVsZSksIHR5cGVvZihEYXRlUGFyc2VyTW9kdWxlKSwgdHlwZW9mKEFkZHJlc3NQYXJzZXJNb2R1bGUpLCB0eXBlb2YoQ3VycmVuY3lQYXJzZXJNb2R1bGUpLCB0eXBlb2YoQm9vbGVhblBhcnNlck1vZHVsZSksXHJcblx0XHR0eXBlb2YoVXJsUGFyc2VyTW9kdWxlKSwgdHlwZW9mKElwUGFyc2VyTW9kdWxlKSwgdHlwZW9mKEVtYWlsUGFyc2VyTW9kdWxlKVxyXG5cdH07XHJcblx0cHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgVHlwZVtdIERhdGVNb2R1bGVUeXBlcyA9XHJcblx0e1xyXG5cdFx0dHlwZW9mKE51bWJlclBhcnNlck1vZHVsZSksIHR5cGVvZihEYXRlUGFyc2VyTW9kdWxlKVxyXG5cdH07XHJcblx0cHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUGF0dGVybk1hdGNoZXIgRGVmYXVsdFBhdHRlcm5NYXRjaGVyO1xyXG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBhdHRlcm5NYXRjaGVyIERhdGVQYXR0ZXJuTWF0Y2hlcjtcclxuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBEaWN0aW9uYXJ5PFN0cmluZywgUGF0dGVybk1hdGNoZXI+IE5hbWVkUGF0dGVybk1hdGNoZXJzID0gbmV3IERpY3Rpb25hcnk8U3RyaW5nLCBQYXR0ZXJuTWF0Y2hlcj4oKTtcclxuXHJcblx0cHJpdmF0ZSByZWFkb25seSBQYXR0ZXJuTWF0Y2hlciBwYXR0ZXJuTWF0Y2hlcjtcclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBEZWZhdWx0IGNvbnRleHQgZm9yIHBhcnNpbmdcclxuXHQvLy8gPC9zdW1tYXJ5PlxyXG5cdHB1YmxpYyBQYXR0ZXJuQ29udGV4dCBEZWZhdWx0UGF0dGVybkNvbnRleHQgeyBnZXQ7IHNldDsgfVxyXG5cclxuXHQvLy8gPHN1bW1hcnk+XHJcblx0Ly8vIExvYWQgYWxsIHBhdHRlcm5zIGZyb20gdGhlIGRlZmluZWQgbW9kdWxlc1xyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0c3RhdGljIERhdGFQYXJzZXIoKVxyXG5cdHtcclxuXHRcdERlZmF1bHRQYXR0ZXJuTWF0Y2hlciA9IG1ha2VQYXR0ZXJuTWF0Y2hlcihNb2R1bGVUeXBlcyk7XHJcblx0XHREYXRlUGF0dGVybk1hdGNoZXIgPSBtYWtlUGF0dGVybk1hdGNoZXIoRGF0ZU1vZHVsZVR5cGVzKTtcclxuXHR9XHJcblxyXG5cdC8vLyA8c3VtbWFyeT5cclxuXHQvLy8gVXNlIHRoZSBkZWZhdWx0IHBhdHRlcm4gbWF0Y2hlclxyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0cHVibGljIERhdGFQYXJzZXIoKVxyXG5cdHtcclxuXHRcdHRoaXMucGF0dGVybk1hdGNoZXIgPSBEZWZhdWx0UGF0dGVybk1hdGNoZXI7XHJcblx0fVxyXG5cclxuXHQvLy8gPHN1bW1hcnk+XHJcblx0Ly8vIExvYWQgYWxsIHBhdHRlcm5zIGZyb20gdGhlIGRlZmluZWQgbW9kdWxlc1xyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0cHVibGljIERhdGFQYXJzZXIoU3RyaW5nIG5hbWUsIFR5cGVbXSBtb2R1bGVzKVxyXG5cdHtcclxuXHRcdGlmIChTdHJpbmcuSXNOdWxsT3JFbXB0eShuYW1lKSB8fCBtb2R1bGVzID09IG51bGwpXHJcblx0XHR7XHJcblx0XHRcdHRoaXMucGF0dGVybk1hdGNoZXIgPSBEZWZhdWx0UGF0dGVybk1hdGNoZXI7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoTmFtZWRQYXR0ZXJuTWF0Y2hlcnMuVHJ5R2V0VmFsdWUobmFtZSwgb3V0IHRoaXMucGF0dGVybk1hdGNoZXIpICYmIHRoaXMucGF0dGVybk1hdGNoZXIgIT0gbnVsbClcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMucGF0dGVybk1hdGNoZXIgPSBtYWtlUGF0dGVybk1hdGNoZXIobW9kdWxlcyk7XHJcblx0XHROYW1lZFBhdHRlcm5NYXRjaGVyc1tuYW1lXSA9IHRoaXMucGF0dGVybk1hdGNoZXI7XHJcblx0fVxyXG5cclxuXHJcblx0cHJpdmF0ZSBzdGF0aWMgUGF0dGVybk1hdGNoZXIgbWFrZVBhdHRlcm5NYXRjaGVyKFR5cGVbXSBtb2R1bGVzKVxyXG5cdHtcclxuXHRcdFBhdHRlcm5NYXRjaGVyIG1hdGNoZXIgPSBuZXcgUGF0dGVybk1hdGNoZXIobmV3IFBhdHRlcm5bMF0pO1xyXG5cclxuXHRcdGZvcmVhY2ggKFR5cGUgbW9kdWxlVHlwZSBpbiBtb2R1bGVzKVxyXG5cdFx0e1xyXG5cdFx0XHRJUGFyc2VyTW9kdWxlIG1vZHVsZSA9IEFjdGl2YXRvci5DcmVhdGVJbnN0YW5jZShtb2R1bGVUeXBlKSBhcyBJUGFyc2VyTW9kdWxlO1xyXG5cdFx0XHRpZiAobW9kdWxlID09IG51bGwpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0Ly8gYWRkIHBhdHRlcm5zXHJcblx0XHRcdGZvcmVhY2ggKFN0cmluZyB0YWcgaW4gbW9kdWxlLlBhdHRlcm5UYWdzKVxyXG5cdFx0XHRcdG1hdGNoZXIuQWRkUGF0dGVybnModGFnLCBtb2R1bGUuR2V0UGF0dGVybnModGFnKSk7XHJcblxyXG5cdFx0XHQvLyByZWdpc3RlciB2YWxpZGF0b3JzXHJcblx0XHRcdGZvcmVhY2ggKFN0cmluZyB0YWcgaW4gbW9kdWxlLlRva2VuVGFncylcclxuXHRcdFx0XHRtYXRjaGVyLlJlZ2lzdGVyVmFsaWRhdG9yKHRhZywgbW9kdWxlKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBtYXRjaGVyO1xyXG5cdH1cclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBQYXJzZSBhIHZhbHVlIGludG8gYWxsIHBvc3NpYmxlIG5hdGl2ZSB0eXBlc1xyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0Ly8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj48L3BhcmFtPlxyXG5cdC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcblx0cHVibGljIExpc3Q8SVZhbHVlPiBQYXJzZShTdHJpbmcgdmFsdWUpXHJcblx0e1xyXG5cdFx0cmV0dXJuIFBhcnNlKERlZmF1bHRQYXR0ZXJuQ29udGV4dCA/PyBuZXcgUGF0dGVybkNvbnRleHQoKSwgdmFsdWUpO1xyXG5cdH1cclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBQYXJzZSBhIHZhbHVlIGludG8gYWxsIHBvc3NpYmxlIG5hdGl2ZSB0eXBlc1xyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0Ly8vIDxwYXJhbSBuYW1lPVwiY29udGV4dFwiPjwvcGFyYW0+XHJcblx0Ly8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj48L3BhcmFtPlxyXG5cdC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcblx0cHVibGljIExpc3Q8SVZhbHVlPiBQYXJzZShQYXR0ZXJuQ29udGV4dCBjb250ZXh0LCBTdHJpbmcgdmFsdWUpXHJcblx0e1xyXG5cdFx0TGlzdDxPYmplY3Q+IG1hdGNoUmVzdWx0cyA9IHRoaXMucGF0dGVybk1hdGNoZXIuTWF0Y2goY29udGV4dCwgdmFsdWUpO1xyXG5cdFx0cmV0dXJuIChtYXRjaFJlc3VsdHMgPT0gbnVsbCA/IG5ldyBMaXN0PElWYWx1ZT4oKSA6IG1hdGNoUmVzdWx0cy5DYXN0PElWYWx1ZT4oKS5Ub0xpc3QoKSk7XHJcblx0fVxyXG5cclxuXHQvLy8gPHN1bW1hcnk+XHJcblx0Ly8vIFBhcnNlIGEgdmFsdWUgYXMgYSBMb2NhbERhdGVcclxuXHQvLy8gPC9zdW1tYXJ5PlxyXG5cdC8vLyA8cGFyYW0gbmFtZT1cInZhbHVlXCI+PC9wYXJhbT5cclxuXHQvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG5cdHB1YmxpYyBMb2NhbERhdGUgUGFyc2VEYXRlKFN0cmluZyB2YWx1ZSlcclxuXHR7XHJcblx0XHRyZXR1cm4gUGFyc2VEYXRlKERlZmF1bHRQYXR0ZXJuQ29udGV4dCA/PyBuZXcgUGF0dGVybkNvbnRleHQoKSwgdmFsdWUpO1xyXG5cdH1cclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBQYXJzZSBhIHZhbHVlIGFzIGEgTG9jYWxEYXRlXHJcblx0Ly8vIDwvc3VtbWFyeT5cclxuXHQvLy8gPHBhcmFtIG5hbWU9XCJjb250ZXh0XCI+PC9wYXJhbT5cclxuXHQvLy8gPHBhcmFtIG5hbWU9XCJ2YWx1ZVwiPjwvcGFyYW0+XHJcblx0Ly8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuXHRwdWJsaWMgTG9jYWxEYXRlIFBhcnNlRGF0ZShQYXR0ZXJuQ29udGV4dCBjb250ZXh0LCBTdHJpbmcgdmFsdWUpXHJcblx0e1xyXG5cdFx0TGlzdDxPYmplY3Q+IHJlc3VsdHMgPSBEYXRlUGF0dGVybk1hdGNoZXIuTWF0Y2goY29udGV4dCwgdmFsdWUpO1xyXG5cdFx0TG9jYWxEYXRlIGRhdGVSZXN1bHQgPSByZXN1bHRzLk9mVHlwZTxMb2NhbERhdGU+KCkuRmlyc3RPckRlZmF1bHQoKTtcclxuXHRcdHJldHVybiBkYXRlUmVzdWx0O1xyXG5cdH1cclxufVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEYXRhUGFyc2VyO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9EYXRhUGFyc2VyLmpzXG4gKiovIiwiLyoqXHJcbiAqIFZhbGlkYXRlcyBib29sZWFuc1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBQYXR0ZXJuID0gcmVxdWlyZSgnLi4vbWF0Y2hpbmcvUGF0dGVybicpO1xyXG52YXIgQm9vbGVhblZhbHVlID0gcmVxdWlyZSgnLi4vdmFsdWVzL0Jvb2xlYW5WYWx1ZScpO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBNYWtlIHRoZSBmaW5hbCBvdXRwdXQgdmFsdWVcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqIEByZXR1cm5zIHtCb29sZWFuVmFsdWV9XHJcbiAqL1xyXG5mdW5jdGlvbiBtYWtlKHZhbHVlKSB7XHJcblx0dmFyIGJvb2xWYWx1ZSA9IGZhbHNlO1xyXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJylcclxuXHRcdGJvb2xWYWx1ZSA9IHZhbHVlO1xyXG5cdGVsc2UgaWYgKHZhbHVlKVxyXG5cdHtcclxuXHRcdHZhciBsb3dlclZhbHVlID0gdmFsdWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0Ym9vbFZhbHVlID0gKHRoaXMuY29uc3QudHJ1ZVZhbHVlcy5pbmRleE9mKGxvd2VyVmFsdWUpICE9PSAtMSk7XHJcblx0fVxyXG5cdHJldHVybiBuZXcgQm9vbGVhblZhbHVlKGJvb2xWYWx1ZSk7XHJcbn1cclxuLyoqXHJcbiAqIFJldXNhYmxlIHdyYXBwZXIgZm9yIHRoZSB0d28gcGF0dGVybnNcclxuICogQHBhcmFtIHZcclxuICovXHJcbmZ1bmN0aW9uIHBhcnNlUGF0dGVybih2KSB7XHJcblx0bWFrZSh2WzFdKTtcclxufVxyXG5cclxudmFyIG1haW5QYXR0ZXJucyA9IFtcclxuXHRuZXcgUGF0dGVybigne2VtcHR5bGluZToqfXtib29sZWFudHJ1ZX17ZW1wdHlsaW5lOip9JywgcGFyc2VQYXR0ZXJuKSxcclxuXHRuZXcgUGF0dGVybigne2VtcHR5bGluZToqfXtib29sZWFuZmFsc2V9e2VtcHR5bGluZToqfScsIHBhcnNlUGF0dGVybilcclxuXTtcclxuXHJcblxyXG4vKipcclxuICogU2luZ2xldG9uIE1vZHVsZSB0byBwYXJzZSBib29sZWFuIHZhbHVlc1xyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbnZhciBCb29sZWFuUGFyc2VyTW9kdWxlID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5jb25zdCA9IHtcclxuXHRcdHRydWVWYWx1ZXM6IFsgJzEnLCAndHJ1ZScsICd3YWhyJyBdLFxyXG5cdFx0ZmFsc2VWYWx1ZXM6IFsgJzAnLCAnZmFsc2UnLCAnZmFsc2NoJyBdXHJcblx0fTtcclxuXHJcblx0dGhpcy5wYXR0ZXJuVGFncyA9IFsnJ107XHJcblx0dGhpcy50b2tlblRhZ3MgPSBbJ2Jvb2xlYW5mYWxzZScsICdib29sZWFudHJ1ZSddO1xyXG59O1xyXG4vKipcclxuICogUmV0dXJuIHRoZSBwYXR0ZXJucyBmb3IgdGhlIHRhZ1xyXG4gKiBAcGFyYW0gdGFnIHtzdHJpbmd9XHJcbiAqL1xyXG5Cb29sZWFuUGFyc2VyTW9kdWxlLnByb3RvdHlwZS5nZXRQYXR0ZXJucyA9IGZ1bmN0aW9uKHRhZykge1xyXG5cdGlmICh0YWcgPT09ICcnKVxyXG5cdFx0cmV0dXJuIG1haW5QYXR0ZXJucztcclxuXHRyZXR1cm4gW107XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJvb2xlYW5QYXJzZXJNb2R1bGU7XHJcblxyXG4vKlxyXG5cdHB1YmxpYyBjbGFzcyBCb29sZWFuUGFyc2VyTW9kdWxlIDogSVBhcnNlck1vZHVsZVxyXG5cdHtcclxuXHRcdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEhhc2hTZXQ8U3RyaW5nPiBUcnVlVmFsdWVzID0gbmV3IEhhc2hTZXQ8U3RyaW5nPiB7IFwidHJ1ZVwiLCBcIndhaHJcIiB9O1xyXG5cdFx0cHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgSGFzaFNldDxTdHJpbmc+IEZhbHNlVmFsdWVzID0gbmV3IEhhc2hTZXQ8U3RyaW5nPiB7IFwiZmFsc2VcIiwgXCJmYWxzY2hcIiB9O1xyXG5cclxuXHRcdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBhdHRlcm5bXSBNYWluUGF0dGVybnMgPVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmV3IFBhdHRlcm4oXCJ7ZW1wdHlsaW5lOip9e2Jvb2xlYW50cnVlfXtlbXB0eWxpbmU6Kn1cIiwgdiA9PiBNYWtlKHZbMV0pKSxcclxuICAgICAgICAgICAgbmV3IFBhdHRlcm4oXCJ7ZW1wdHlsaW5lOip9e2Jvb2xlYW5mYWxzZX17ZW1wdHlsaW5lOip9XCIsIHYgPT4gTWFrZSh2WzFdKSlcclxuICAgICAgICB9O1xyXG5cclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gTWFrZSB0aGUgZmluYWwgb3V0cHV0IHZhbHVlXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0Ly8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj48L3BhcmFtPlxyXG5cdFx0Ly8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuXHRcdHByaXZhdGUgc3RhdGljIEJvb2xlYW5WYWx1ZSBNYWtlKE9iamVjdCB2YWx1ZSlcclxuXHRcdHtcclxuXHRcdFx0dmFyIGJvb2xWYWx1ZSA9IGZhbHNlO1xyXG5cdFx0XHRpZiAodmFsdWUgaXMgQm9vbGVhbilcclxuXHRcdFx0XHRib29sVmFsdWUgPSAoQm9vbGVhbikgdmFsdWU7XHJcblx0XHRcdGlmICh2YWx1ZSAhPSBudWxsKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0U3RyaW5nIGxvd2VyVmFsdWUgPSB2YWx1ZS5Ub1N0cmluZygpLlRvTG93ZXIoKTtcclxuXHRcdFx0XHRib29sVmFsdWUgPSBUcnVlVmFsdWVzLkNvbnRhaW5zKGxvd2VyVmFsdWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBuZXcgQm9vbGVhblZhbHVlKGJvb2xWYWx1ZSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBSZXR1cm5zIHRoZSBkZWZpbmVkIHRhZ3MgZm9yIHdoaWNoIHBhdHRlcm5zIGV4aXN0XHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0cHVibGljIFN0cmluZ1tdIFBhdHRlcm5UYWdzXHJcblx0XHR7XHJcblx0XHRcdGdldCB7IHJldHVybiBuZXdbXSB7IFwiXCIgfTsgfVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBHZXQgdGhlIHBhdHRlcm5zIGZvciBhIHNwZWNpZmljIHRhZ1xyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdC8vLyA8cGFyYW0gbmFtZT1cInBhdHRlcm5UYWdcIj48L3BhcmFtPlxyXG5cdFx0Ly8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuXHRcdHB1YmxpYyBQYXR0ZXJuW10gR2V0UGF0dGVybnMoU3RyaW5nIHBhdHRlcm5UYWcpXHJcblx0XHR7XHJcblx0XHRcdHN3aXRjaCAocGF0dGVyblRhZylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGNhc2UgXCJcIjpcclxuXHRcdFx0XHRcdHJldHVybiBNYWluUGF0dGVybnM7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG5ldyBQYXR0ZXJuWzBdO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBSZXR1cm5zIHRoZSBkZWZpbmVkIHRhZ3Mgd2hpY2ggY2FuIGJlIHBhcnNlZCBhcyB0b2tlbnNcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHRwdWJsaWMgU3RyaW5nW10gVG9rZW5UYWdzXHJcblx0XHR7XHJcblx0XHRcdGdldCB7IHJldHVybiBuZXdbXSB7IFwiYm9vbGVhbmZhbHNlXCIsIFwiYm9vbGVhbnRydWVcIiB9OyB9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIENhbGxiYWNrIGhhbmRsZXIgd2hlbiBhIHZhbHVlIGhhcyB0byBiZSB2YWxpZGF0ZWQgYWdhaW5zdCBhIHRva2VuXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0Ly8vIDxwYXJhbSBuYW1lPVwidG9rZW5cIj5UaGUgdG9rZW4gdG8gdmFsaWRhdGUgYWdhaW5zdDwvcGFyYW0+XHJcblx0XHQvLy8gPHBhcmFtIG5hbWU9XCJ2YWx1ZVwiPlRoZSB2YWx1ZSB0byB2YWxpZGF0ZTwvcGFyYW0+XHJcblx0XHQvLy8gPHBhcmFtIG5hbWU9XCJpc0ZpbmFsXCI+VHJ1ZSBpZiB0aGlzIGlzIHRoZSBmaW5hbCB2YWxpZGF0aW9uIGFuZCBubyBtb3JlIGNoYXJhY3RlcnMgYXJlIGV4cGVjdGVkIGZvciB0aGUgdmFsdWU8L3BhcmFtPlxyXG5cdFx0Ly8vIDxyZXR1cm5zPlJldHVybnMgdHJ1ZSBpZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGUgdG9rZW4sIGZhbHNlIGlmIGl0IGRvZXNuJ3QgbWF0Y2ggb3IgdGhlIHRva2VuIGlzIHVua25vd248L3JldHVybnM+XHJcblx0XHRwdWJsaWMgQm9vbGVhbiBWYWxpZGF0ZVRva2VuKFRva2VuIHRva2VuLCBTdHJpbmcgdmFsdWUsIEJvb2xlYW4gaXNGaW5hbClcclxuXHRcdHtcclxuXHRcdFx0U3RyaW5nIGxvd2VyVmFsdWUgPSB2YWx1ZS5Ub0xvd2VyKCk7XHJcblx0XHRcdHN3aXRjaCAodG9rZW4uVmFsdWUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjYXNlIFwiYm9vbGVhbnRydWVcIjpcclxuXHRcdFx0XHRcdHJldHVybiAoaXNGaW5hbCAmJiBUcnVlVmFsdWVzLkNvbnRhaW5zKGxvd2VyVmFsdWUpKSB8fCAoIWlzRmluYWwgJiYgU3RhcnRzV2l0aChUcnVlVmFsdWVzLCBsb3dlclZhbHVlKSk7XHJcblx0XHRcdFx0Y2FzZSBcImJvb2xlYW5mYWxzZVwiOlxyXG5cdFx0XHRcdFx0cmV0dXJuIChpc0ZpbmFsICYmIEZhbHNlVmFsdWVzLkNvbnRhaW5zKGxvd2VyVmFsdWUpKSB8fCAoIWlzRmluYWwgJiYgU3RhcnRzV2l0aChGYWxzZVZhbHVlcywgbG93ZXJWYWx1ZSkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFBhcnNlcyB0aGUgVGV4dFZhbHVlIG9mIHRoZSBub2RlIGludG8gdGhlIGZpbmFsIHZhbHVlXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0Ly8vIDxwYXJhbSBuYW1lPVwidG9rZW5cIj5UaGUgdG9rZW4gdG8gZmluYWxpemU8L3BhcmFtPlxyXG5cdFx0Ly8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj5UaGUgdGV4dCB2YWx1ZSB0byBwYXJzZTwvcGFyYW0+XHJcblx0XHQvLy8gPHJldHVybnM+UmV0dXJucyB0aGUgcGFyc2VkIHJlc3VsdDwvcmV0dXJucz5cclxuXHRcdHB1YmxpYyBPYmplY3QgRmluYWxpemVWYWx1ZShUb2tlbiB0b2tlbiwgU3RyaW5nIHZhbHVlKVxyXG5cdFx0e1xyXG5cdFx0XHRzd2l0Y2ggKHRva2VuLlZhbHVlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y2FzZSBcImJvb2xlYW50cnVlXCI6XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRjYXNlIFwiYm9vbGVhbmZhbHNlXCI6XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgQm9vbGVhbiBTdGFydHNXaXRoKElFbnVtZXJhYmxlPFN0cmluZz4gYWxsb3dlZFZhbHVlcywgU3RyaW5nIHZhbHVlKVxyXG5cdFx0e1xyXG5cdFx0XHRmb3JlYWNoIChTdHJpbmcgYWxsb3dlZFZhbHVlIGluIGFsbG93ZWRWYWx1ZXMpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoYWxsb3dlZFZhbHVlLlN0YXJ0c1dpdGgodmFsdWUpKVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4qL1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9tb2R1bGVzL0Jvb2xlYW5QYXJzZXJNb2R1bGUuanNcbiAqKi8iLCIvKipcclxuICogUGF0dGVybiBvYmplY3RcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgUGF0dGVybiA9IGZ1bmN0aW9uKG1hdGNoLCBwYXJzZXIpIHtcclxuXHR0aGlzLm1hdGNoID0gbWF0Y2ggfHwgJyc7XHJcblx0dGhpcy5wYXJzZXIgPSBwYXJzZXI7XHJcbn07XHJcblxyXG5QYXR0ZXJuLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLm1hdGNoO1xyXG59O1xyXG5QYXR0ZXJuLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKGNvbnRleHQsIHZhbHVlcykge1xyXG5cdHJldHVybiB0aGlzLnBhcnNlcihjb250ZXh0LCB2YWx1ZXMpO1xyXG59O1xyXG5QYXR0ZXJuLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbihvdGhlcikge1xyXG5cdGlmICghb3RoZXIpIHJldHVybiBmYWxzZTtcclxuXHRyZXR1cm4gdGhpcy5tYXRjaCA9PT0gb3RoZXIubWF0Y2g7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhdHRlcm47XHJcblxyXG4vKlxyXG5cdHB1YmxpYyBjbGFzcyBQYXR0ZXJuXHJcblx0e1xyXG5cdFx0cHVibGljIFN0cmluZyBNYXRjaCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuXHRcdHB1YmxpYyBGdW5jPFBhdHRlcm5Db250ZXh0LCBPYmplY3RbXSwgT2JqZWN0PiBQYXJzZXIgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblx0XHRwdWJsaWMgRnVuYzxPYmplY3RbXSwgT2JqZWN0PiBQYXJzZXJOb0NvbnRleHQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG5cdFx0cHVibGljIFBhdHRlcm4oU3RyaW5nIG1hdGNoLCBGdW5jPE9iamVjdFtdLCBPYmplY3Q+IHBhcnNlcilcclxuXHRcdHtcclxuXHRcdFx0TWF0Y2ggPSBtYXRjaDtcclxuXHRcdFx0UGFyc2VyTm9Db250ZXh0ID0gcGFyc2VyO1xyXG5cdFx0fVxyXG5cdFx0cHVibGljIFBhdHRlcm4oU3RyaW5nIG1hdGNoLCBGdW5jPFBhdHRlcm5Db250ZXh0LCBPYmplY3RbXSwgT2JqZWN0PiBwYXJzZXIpXHJcblx0XHR7XHJcblx0XHRcdE1hdGNoID0gbWF0Y2g7XHJcblx0XHRcdFBhcnNlciA9IHBhcnNlcjtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgT2JqZWN0IFBhcnNlKFBhdHRlcm5Db250ZXh0IGNvbnRleHQsIE9iamVjdFtdIHZhbHVlcylcclxuXHRcdHtcclxuXHRcdFx0aWYgKFBhcnNlck5vQ29udGV4dCAhPSBudWxsKVxyXG5cdFx0XHRcdHJldHVybiBQYXJzZXJOb0NvbnRleHQodmFsdWVzKTtcclxuXHRcdFx0cmV0dXJuIFBhcnNlcihjb250ZXh0LCB2YWx1ZXMpO1xyXG5cdFx0fVxyXG5cclxuI2lmICFTQ1JJUFRTSEFSUFxyXG5cdFx0cHVibGljIG92ZXJyaWRlIEJvb2xlYW4gRXF1YWxzKE9iamVjdCBvYmopXHJcblx0XHR7XHJcblx0XHRcdGlmIChSZWZlcmVuY2VFcXVhbHMobnVsbCwgb2JqKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAoUmVmZXJlbmNlRXF1YWxzKHRoaXMsIG9iaikpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRpZiAob2JqLkdldFR5cGUoKSAhPSBHZXRUeXBlKCkpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIEVxdWFscygoUGF0dGVybikgb2JqKTtcclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgQm9vbGVhbiBFcXVhbHMoUGF0dGVybiBvdGhlcilcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIFN0cmluZy5FcXVhbHMoTWF0Y2gsIG90aGVyLk1hdGNoKTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgSW50MzIgR2V0SGFzaENvZGUoKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gKE1hdGNoICE9IG51bGwgPyBNYXRjaC5HZXRIYXNoQ29kZSgpIDogMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG92ZXJyaWRlIFN0cmluZyBUb1N0cmluZygpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiBNYXRjaDtcclxuXHRcdH1cclxuI2VuZGlmXHJcbiovXHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL21hdGNoaW5nL1BhdHRlcm4uanNcbiAqKi8iLCIvKipcclxuICogQm9vbGVhbiByZXN1bHQgd3JhcHBlclxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBCb29sZWFuVmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdHRoaXMuYm9vbCA9ICEhdmFsdWU7XHJcbn07XHJcbkJvb2xlYW5WYWx1ZS5wcm90b3R5cGUudmFsdWVPZiA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLmJvb2w7XHJcbn07XHJcbkJvb2xlYW5WYWx1ZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcy5ib29sLnRvU3RyaW5nKCk7XHJcbn07XHJcbkJvb2xlYW5WYWx1ZS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24ob3RoZXIpIHtcclxuXHRpZiAoIShvdGhlciBpbnN0YW5jZW9mIEJvb2xlYW5WYWx1ZSkpXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0cmV0dXJuIHRoaXMuYm9vbCA9PT0gb3RoZXIuYm9vbDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQm9vbGVhblZhbHVlO1xyXG5cclxuLypcclxuXHRwdWJsaWMgc3RydWN0IEJvb2xlYW5WYWx1ZSA6IElWYWx1ZVxyXG5cdHtcclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBUaGUgYm9vbGVhbiB2YWx1ZVxyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdFtKc29uUHJvcGVydHkoXCJ2XCIpXVxyXG5cdFx0cHVibGljIEJvb2xlYW4gQm9vbDtcclxuXHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIEdlbmVyaWMgYWNjZXNzIHRvIHRoZSBtb3N0IHByb21pbmVudCB2YWx1ZSAubmV0IHR5cGVcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHRwdWJsaWMgT2JqZWN0IFZhbHVlXHJcblx0XHR7XHJcblx0XHRcdGdldCB7IHJldHVybiBCb29sOyB9XHJcblx0XHRcdHNldCB7IEJvb2wgPSAoQm9vbGVhbil2YWx1ZTsgfVxyXG5cdFx0fVxyXG5cclxuXHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFNlcmlhbGl6ZSB0aGUgdmFsdWUgdG8gYmluYXJ5IGRhdGFcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHQvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG5cdFx0cHVibGljIEJ5dGVbXSBUb0JpbmFyeSgpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiBCaXRDb252ZXJ0ZXIuR2V0Qnl0ZXMoQm9vbCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFJlYWQgdGhlIHZhbHVlIGRhdGEgZnJvbSBiaW5hcnlcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHQvLy8gPHBhcmFtIG5hbWU9XCJkYXRhXCI+PC9wYXJhbT5cclxuXHRcdHB1YmxpYyB2b2lkIEZyb21CaW5hcnkoQnl0ZVtdIGRhdGEpXHJcblx0XHR7XHJcblx0XHRcdEJvb2wgPSBCaXRDb252ZXJ0ZXIuVG9Cb29sZWFuKGRhdGEsIDApO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gQ29uc3RydWN0b3JcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHQvLy8gPHBhcmFtIG5hbWU9XCJ2YWx1ZVwiPjwvcGFyYW0+XHJcblx0XHRwdWJsaWMgQm9vbGVhblZhbHVlKEJvb2xlYW4gdmFsdWUpXHJcblx0XHR7XHJcblx0XHRcdHRoaXMuQm9vbCA9IHZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBvdmVycmlkZSBTdHJpbmcgVG9TdHJpbmcoKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gU3RyaW5nLkZvcm1hdChcInswfVwiLCB0aGlzLkJvb2wpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBvdmVycmlkZSBCb29sZWFuIEVxdWFscyhvYmplY3Qgb2JqKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoIShvYmogaXMgQm9vbGVhblZhbHVlKSlcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdEJvb2xlYW5WYWx1ZSBvdGhlciA9IChCb29sZWFuVmFsdWUpb2JqO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5Cb29sLkVxdWFscyhvdGhlci5Cb29sKTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgaW50IEdldEhhc2hDb2RlKClcclxuXHRcdHtcclxuXHRcdFx0dW5jaGVja2VkXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5Cb29sLkdldEhhc2hDb2RlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgc3RhdGljIGJvb2wgb3BlcmF0b3IgPT0oQm9vbGVhblZhbHVlIGEsIEJvb2xlYW5WYWx1ZSBiKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gYS5Cb29sLkVxdWFscyhiLkJvb2wpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBzdGF0aWMgYm9vbCBvcGVyYXRvciAhPShCb29sZWFuVmFsdWUgYSwgQm9vbGVhblZhbHVlIGIpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiAhYS5Cb29sLkVxdWFscyhiLkJvb2wpO1xyXG5cdFx0fVxyXG5cdH1cclxuKi9cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdmFsdWVzL0Jvb2xlYW5WYWx1ZS5qc1xuICoqLyIsIi8qZXNsaW50LWVudiBicm93c2VyKi9cbi8qZ2xvYmFsIF9fcmVzb3VyY2VRdWVyeSovXG5cbnZhciBvcHRpb25zID0ge1xuICBwYXRoOiBcIi9fX3dlYnBhY2tfaG1yXCIsXG4gIHRpbWVvdXQ6IDIwICogMTAwMCxcbiAgb3ZlcmxheTogdHJ1ZSxcbiAgcmVsb2FkOiBmYWxzZSxcbiAgbG9nOiB0cnVlLFxuICB3YXJuOiB0cnVlXG59O1xuaWYgKF9fcmVzb3VyY2VRdWVyeSkge1xuICB2YXIgcXVlcnlzdHJpbmcgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xuICB2YXIgb3ZlcnJpZGVzID0gcXVlcnlzdHJpbmcucGFyc2UoX19yZXNvdXJjZVF1ZXJ5LnNsaWNlKDEpKTtcbiAgaWYgKG92ZXJyaWRlcy5wYXRoKSBvcHRpb25zLnBhdGggPSBvdmVycmlkZXMucGF0aDtcbiAgaWYgKG92ZXJyaWRlcy50aW1lb3V0KSBvcHRpb25zLnRpbWVvdXQgPSBvdmVycmlkZXMudGltZW91dDtcbiAgaWYgKG92ZXJyaWRlcy5vdmVybGF5KSBvcHRpb25zLm92ZXJsYXkgPSBvdmVycmlkZXMub3ZlcmxheSAhPT0gJ2ZhbHNlJztcbiAgaWYgKG92ZXJyaWRlcy5yZWxvYWQpIG9wdGlvbnMucmVsb2FkID0gb3ZlcnJpZGVzLnJlbG9hZCAhPT0gJ2ZhbHNlJztcbiAgaWYgKG92ZXJyaWRlcy5ub0luZm8gJiYgb3ZlcnJpZGVzLm5vSW5mbyAhPT0gJ2ZhbHNlJykge1xuICAgIG9wdGlvbnMubG9nID0gZmFsc2U7XG4gIH1cbiAgaWYgKG92ZXJyaWRlcy5xdWlldCAmJiBvdmVycmlkZXMucXVpZXQgIT09ICdmYWxzZScpIHtcbiAgICBvcHRpb25zLmxvZyA9IGZhbHNlO1xuICAgIG9wdGlvbnMud2FybiA9IGZhbHNlO1xuICB9XG59XG5cbmlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAvLyBkbyBub3RoaW5nXG59IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cuRXZlbnRTb3VyY2UgPT09ICd1bmRlZmluZWQnKSB7XG4gIGNvbnNvbGUud2FybihcbiAgICBcIndlYnBhY2staG90LW1pZGRsZXdhcmUncyBjbGllbnQgcmVxdWlyZXMgRXZlbnRTb3VyY2UgdG8gd29yay4gXCIgK1xuICAgIFwiWW91IHNob3VsZCBpbmNsdWRlIGEgcG9seWZpbGwgaWYgeW91IHdhbnQgdG8gc3VwcG9ydCB0aGlzIGJyb3dzZXI6IFwiICtcbiAgICBcImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9TZXJ2ZXItc2VudF9ldmVudHMjVG9vbHNcIlxuICApO1xufSBlbHNlIHtcbiAgY29ubmVjdCh3aW5kb3cuRXZlbnRTb3VyY2UpO1xufVxuXG5mdW5jdGlvbiBjb25uZWN0KEV2ZW50U291cmNlKSB7XG4gIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2Uob3B0aW9ucy5wYXRoKTtcbiAgdmFyIGxhc3RBY3Rpdml0eSA9IG5ldyBEYXRlKCk7XG5cbiAgc291cmNlLm9ub3BlbiA9IGhhbmRsZU9ubGluZTtcbiAgc291cmNlLm9ubWVzc2FnZSA9IGhhbmRsZU1lc3NhZ2U7XG4gIHNvdXJjZS5vbmVycm9yID0gaGFuZGxlRGlzY29ubmVjdDtcblxuICB2YXIgdGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICBpZiAoKG5ldyBEYXRlKCkgLSBsYXN0QWN0aXZpdHkpID4gb3B0aW9ucy50aW1lb3V0KSB7XG4gICAgICBoYW5kbGVEaXNjb25uZWN0KCk7XG4gICAgfVxuICB9LCBvcHRpb25zLnRpbWVvdXQgLyAyKTtcblxuICBmdW5jdGlvbiBoYW5kbGVPbmxpbmUoKSB7XG4gICAgaWYgKG9wdGlvbnMubG9nKSBjb25zb2xlLmxvZyhcIltITVJdIGNvbm5lY3RlZFwiKTtcbiAgICBsYXN0QWN0aXZpdHkgPSBuZXcgRGF0ZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlTWVzc2FnZShldmVudCkge1xuICAgIGxhc3RBY3Rpdml0eSA9IG5ldyBEYXRlKCk7XG4gICAgaWYgKGV2ZW50LmRhdGEgPT0gXCJcXHVEODNEXFx1REM5M1wiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBwcm9jZXNzTWVzc2FnZShKU09OLnBhcnNlKGV2ZW50LmRhdGEpKTtcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgaWYgKG9wdGlvbnMud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJJbnZhbGlkIEhNUiBtZXNzYWdlOiBcIiArIGV2ZW50LmRhdGEgKyBcIlxcblwiICsgZXgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZURpc2Nvbm5lY3QoKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgc291cmNlLmNsb3NlKCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgY29ubmVjdChFdmVudFNvdXJjZSk7IH0sIG9wdGlvbnMudGltZW91dCk7XG4gIH1cblxufVxuXG52YXIgc3RyaXAgPSByZXF1aXJlKCdzdHJpcC1hbnNpJyk7XG5cbnZhciBvdmVybGF5O1xuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgb3B0aW9ucy5vdmVybGF5KSB7XG4gIG92ZXJsYXkgPSByZXF1aXJlKCcuL2NsaWVudC1vdmVybGF5Jyk7XG59XG5cbmZ1bmN0aW9uIHByb2JsZW1zKHR5cGUsIG9iaikge1xuICBpZiAob3B0aW9ucy53YXJuKSB7XG4gICAgY29uc29sZS53YXJuKFwiW0hNUl0gYnVuZGxlIGhhcyBcIiArIHR5cGUgKyBcIjpcIik7XG4gICAgb2JqW3R5cGVdLmZvckVhY2goZnVuY3Rpb24obXNnKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbSE1SXSBcIiArIHN0cmlwKG1zZykpO1xuICAgIH0pO1xuICB9XG4gIGlmIChvdmVybGF5ICYmIHR5cGUgIT09ICd3YXJuaW5ncycpIG92ZXJsYXkuc2hvd1Byb2JsZW1zKHR5cGUsIG9ialt0eXBlXSk7XG59XG5cbmZ1bmN0aW9uIHN1Y2Nlc3MoKSB7XG4gIGlmIChvdmVybGF5KSBvdmVybGF5LmNsZWFyKCk7XG59XG5cbnZhciBwcm9jZXNzVXBkYXRlID0gcmVxdWlyZSgnLi9wcm9jZXNzLXVwZGF0ZScpO1xuXG52YXIgY3VzdG9tSGFuZGxlcjtcbmZ1bmN0aW9uIHByb2Nlc3NNZXNzYWdlKG9iaikge1xuICBpZiAob2JqLmFjdGlvbiA9PSBcImJ1aWxkaW5nXCIpIHtcbiAgICBpZiAob3B0aW9ucy5sb2cpIGNvbnNvbGUubG9nKFwiW0hNUl0gYnVuZGxlIHJlYnVpbGRpbmdcIik7XG4gIH0gZWxzZSBpZiAob2JqLmFjdGlvbiA9PSBcImJ1aWx0XCIpIHtcbiAgICBpZiAob3B0aW9ucy5sb2cpIGNvbnNvbGUubG9nKFwiW0hNUl0gYnVuZGxlIFwiICsgKG9iai5uYW1lID8gb2JqLm5hbWUgKyBcIiBcIiA6IFwiXCIpICsgXCJyZWJ1aWx0IGluIFwiICsgb2JqLnRpbWUgKyBcIm1zXCIpO1xuICAgIGlmIChvYmouZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIHByb2JsZW1zKCdlcnJvcnMnLCBvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob2JqLndhcm5pbmdzLmxlbmd0aCA+IDApIHByb2JsZW1zKCd3YXJuaW5ncycsIG9iaik7XG4gICAgICBzdWNjZXNzKCk7XG5cbiAgICAgIHByb2Nlc3NVcGRhdGUob2JqLmhhc2gsIG9iai5tb2R1bGVzLCBvcHRpb25zKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoY3VzdG9tSGFuZGxlcikge1xuICAgIGN1c3RvbUhhbmRsZXIob2JqKTtcbiAgfVxufVxuXG5pZiAobW9kdWxlKSB7XG4gIG1vZHVsZS5leHBvcnRzID0ge1xuICAgIHN1YnNjcmliZTogZnVuY3Rpb24gc3Vic2NyaWJlKGhhbmRsZXIpIHtcbiAgICAgIGN1c3RvbUhhbmRsZXIgPSBoYW5kbGVyO1xuICAgIH0sXG4gICAgdXNlQ3VzdG9tT3ZlcmxheTogZnVuY3Rpb24gdXNlQ3VzdG9tT3ZlcmxheShjdXN0b21PdmVybGF5KSB7XG4gICAgICBvdmVybGF5ID0gY3VzdG9tT3ZlcmxheTtcbiAgICB9XG4gIH07XG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAod2VicGFjayktaG90LW1pZGRsZXdhcmUvY2xpZW50LmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFuc2lSZWdleCA9IHJlcXVpcmUoJ2Fuc2ktcmVnZXgnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIpIHtcblx0cmV0dXJuIHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnID8gc3RyLnJlcGxhY2UoYW5zaVJlZ2V4LCAnJykgOiBzdHI7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3N0cmlwLWFuc2kvaW5kZXguanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIC9bXFx1MDAxYlxcdTAwOWJdW1soKSM7P10qKD86WzAtOV17MSw0fSg/OjtbMC05XXswLDR9KSopP1swLTlBLU9SWmNmLW5xcnk9PjxdL2c7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2Fuc2ktcmVnZXgvaW5kZXguanNcbiAqKi8iLCIvKmVzbGludC1lbnYgYnJvd3NlciovXG5cbnZhciBjbGllbnRPdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG52YXIgc3R5bGVzID0ge1xuICBkaXNwbGF5OiAnbm9uZScsXG4gIGJhY2tncm91bmQ6ICdyZ2JhKDAsMCwwLDAuODUpJyxcbiAgY29sb3I6ICcjRThFOEU4JyxcbiAgbGluZUhlaWdodDogJzEuMicsXG4gIHdoaXRlU3BhY2U6ICdwcmUnLFxuICBmb250RmFtaWx5OiAnTWVubG8sIENvbnNvbGFzLCBtb25vc3BhY2UnLFxuICBmb250U2l6ZTogJzEzcHgnLFxuICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgekluZGV4OiA5OTk5LFxuICBwYWRkaW5nOiAnMTBweCcsXG4gIGxlZnQ6IDAsXG4gIHJpZ2h0OiAwLFxuICB0b3A6IDAsXG4gIGJvdHRvbTogMCxcbiAgb3ZlcmZsb3c6ICdhdXRvJ1xufTtcbmZvciAodmFyIGtleSBpbiBzdHlsZXMpIHtcbiAgY2xpZW50T3ZlcmxheS5zdHlsZVtrZXldID0gc3R5bGVzW2tleV07XG59XG5cbmlmIChkb2N1bWVudC5ib2R5KSB7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2xpZW50T3ZlcmxheSk7XG59XG5cbnZhciBhbnNpSFRNTCA9IHJlcXVpcmUoJ2Fuc2ktaHRtbCcpO1xudmFyIGNvbG9ycyA9IHtcbiAgcmVzZXQ6IFsndHJhbnNwYXJlbnQnLCAndHJhbnNwYXJlbnQnXSxcbiAgYmxhY2s6ICcxODE4MTgnLFxuICByZWQ6ICdFMzYwNDknLFxuICBncmVlbjogJ0IzQ0I3NCcsXG4gIHllbGxvdzogJ0ZGRDA4MCcsXG4gIGJsdWU6ICc3Q0FGQzInLFxuICBtYWdlbnRhOiAnN0ZBQ0NBJyxcbiAgY3lhbjogJ0MzQzJFRicsXG4gIGxpZ2h0Z3JleTogJ0VCRTdFMycsXG4gIGRhcmtncmV5OiAnNkQ3ODkxJ1xufTtcbmFuc2lIVE1MLnNldENvbG9ycyhjb2xvcnMpO1xuXG52YXIgRW50aXRpZXMgPSByZXF1aXJlKCdodG1sLWVudGl0aWVzJykuQWxsSHRtbEVudGl0aWVzO1xudmFyIGVudGl0aWVzID0gbmV3IEVudGl0aWVzKCk7XG5cbmV4cG9ydHMuc2hvd1Byb2JsZW1zID1cbmZ1bmN0aW9uIHNob3dQcm9ibGVtcyh0eXBlLCBsaW5lcykge1xuICBjbGllbnRPdmVybGF5LmlubmVySFRNTCA9ICcnO1xuICBjbGllbnRPdmVybGF5LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKG1zZykge1xuICAgIG1zZyA9IGFuc2lIVE1MKGVudGl0aWVzLmVuY29kZShtc2cpKTtcbiAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcyNnB4JztcbiAgICBkaXYuaW5uZXJIVE1MID0gcHJvYmxlbVR5cGUodHlwZSkgKyAnIGluICcgKyBtc2c7XG4gICAgY2xpZW50T3ZlcmxheS5hcHBlbmRDaGlsZChkaXYpO1xuICB9KTtcbn07XG5cbmV4cG9ydHMuY2xlYXIgPVxuZnVuY3Rpb24gY2xlYXIoKSB7XG4gIGNsaWVudE92ZXJsYXkuaW5uZXJIVE1MID0gJyc7XG4gIGNsaWVudE92ZXJsYXkuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbn07XG5cbnZhciBwcm9ibGVtQ29sb3JzID0ge1xuICBlcnJvcnM6IGNvbG9ycy5yZWQsXG4gIHdhcm5pbmdzOiBjb2xvcnMueWVsbG93XG59O1xuXG5mdW5jdGlvbiBwcm9ibGVtVHlwZSAodHlwZSkge1xuICB2YXIgY29sb3IgPSBwcm9ibGVtQ29sb3JzW3R5cGVdIHx8IGNvbG9ycy5yZWQ7XG4gIHJldHVybiAoXG4gICAgJzxzcGFuIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjojJyArIGNvbG9yICsgJzsgY29sb3I6I2ZmZjsgcGFkZGluZzoycHggNHB4OyBib3JkZXItcmFkaXVzOiAycHhcIj4nICtcbiAgICAgIHR5cGUuc2xpY2UoMCwgLTEpLnRvVXBwZXJDYXNlKCkgK1xuICAgICc8L3NwYW4+J1xuICApO1xufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogKHdlYnBhY2spLWhvdC1taWRkbGV3YXJlL2NsaWVudC1vdmVybGF5LmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBhbnNpSFRNTDtcblxuLy8gUmVmZXJlbmNlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvYW5zaS1yZWdleFxudmFyIHJlX2Fuc2kgPSAvKD86KD86XFx1MDAxYlxcWyl8XFx1MDA5YikoPzooPzpbMC05XXsxLDN9KT8oPzooPzo7WzAtOV17MCwzfSkqKT9bQS1NfGYtbV0pfFxcdTAwMWJbQS1NXS87XG5cbnZhciBfZGVmQ29sb3JzID0ge1xuICByZXNldDogWydmZmYnLCAnMDAwJ10sIC8vIFtGT1JFR1JPVURfQ09MT1IsIEJBQ0tHUk9VTkRfQ09MT1JdXG4gIGJsYWNrOiAnMDAwJyxcbiAgcmVkOiAnZmYwMDAwJyxcbiAgZ3JlZW46ICcyMDk4MDUnLFxuICB5ZWxsb3c6ICdlOGJmMDMnLFxuICBibHVlOiAnMDAwMGZmJyxcbiAgbWFnZW50YTogJ2ZmMDBmZicsXG4gIGN5YW46ICcwMGZmZWUnLFxuICBsaWdodGdyZXk6ICdmMGYwZjAnLFxuICBkYXJrZ3JleTogJzg4OCdcbn07XG52YXIgX3N0eWxlcyA9IHtcbiAgMzA6ICdibGFjaycsXG4gIDMxOiAncmVkJyxcbiAgMzI6ICdncmVlbicsXG4gIDMzOiAneWVsbG93JyxcbiAgMzQ6ICdibHVlJyxcbiAgMzU6ICdtYWdlbnRhJyxcbiAgMzY6ICdjeWFuJyxcbiAgMzc6ICdsaWdodGdyZXknXG59O1xudmFyIF9vcGVuVGFncyA9IHtcbiAgJzEnOiAnZm9udC13ZWlnaHQ6Ym9sZCcsIC8vIGJvbGRcbiAgJzInOiAnb3BhY2l0eTowLjgnLCAvLyBkaW1cbiAgJzMnOiAnPGk+JywgLy8gaXRhbGljXG4gICc0JzogJzx1PicsIC8vIHVuZGVyc2NvcmVcbiAgJzgnOiAnZGlzcGxheTpub25lJywgLy8gaGlkZGVuXG4gICc5JzogJzxkZWw+JywgLy8gZGVsZXRlXG59O1xudmFyIF9jbG9zZVRhZ3MgPSB7XG4gICcyMyc6ICc8L2k+JywgLy8gcmVzZXQgaXRhbGljXG4gICcyNCc6ICc8L3U+JywgLy8gcmVzZXQgdW5kZXJzY29yZVxuICAnMjknOiAnPC9kZWw+JyAvLyByZXNldCBkZWxldGVcbn07XG5bMCwgMjEsIDIyLCAyNywgMjgsIDM5LCA0OV0uZm9yRWFjaChmdW5jdGlvbiAobikge1xuICBfY2xvc2VUYWdzW25dID0gJzwvc3Bhbj4nO1xufSk7XG5cbi8qKlxuICogQ29udmVydHMgdGV4dCB3aXRoIEFOU0kgY29sb3IgY29kZXMgdG8gSFRNTCBtYXJrdXAuXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICogQHJldHVybnMgeyp9XG4gKi9cbmZ1bmN0aW9uIGFuc2lIVE1MKHRleHQpIHtcbiAgLy8gUmV0dXJucyB0aGUgdGV4dCBpZiB0aGUgc3RyaW5nIGhhcyBubyBBTlNJIGVzY2FwZSBjb2RlLlxuICBpZiAoIXJlX2Fuc2kudGVzdCh0ZXh0KSkge1xuICAgIHJldHVybiB0ZXh0O1xuICB9XG5cbiAgLy8gQ2FjaGUgb3BlbmVkIHNlcXVlbmNlLlxuICB2YXIgYW5zaUNvZGVzID0gW107XG4gIC8vIFJlcGxhY2Ugd2l0aCBtYXJrdXAuXG4gIHZhciByZXQgPSB0ZXh0LnJlcGxhY2UoL1xcMDMzXFxbKFxcZCspKm0vZywgZnVuY3Rpb24gKG1hdGNoLCBzZXEpIHtcbiAgICB2YXIgb3QgPSBfb3BlblRhZ3Nbc2VxXTtcbiAgICBpZiAob3QpIHtcbiAgICAgIC8vIElmIGN1cnJlbnQgc2VxdWVuY2UgaGFzIGJlZW4gb3BlbmVkLCBjbG9zZSBpdC5cbiAgICAgIGlmICghIX5hbnNpQ29kZXMuaW5kZXhPZihzZXEpKSB7XG4gICAgICAgIGFuc2lDb2Rlcy5wb3AoKTtcbiAgICAgICAgcmV0dXJuICc8L3NwYW4+JztcbiAgICAgIH1cbiAgICAgIC8vIE9wZW4gdGFnLlxuICAgICAgYW5zaUNvZGVzLnB1c2goc2VxKTtcbiAgICAgIHJldHVybiBvdFswXSA9PSAnPCcgPyBvdCA6ICc8c3BhbiBzdHlsZT1cIicgKyBvdCArICc7XCI+JztcbiAgICB9XG5cbiAgICB2YXIgY3QgPSBfY2xvc2VUYWdzW3NlcV07XG4gICAgaWYgKGN0KSB7XG4gICAgICAvLyBQb3Agc2VxdWVuY2VcbiAgICAgIGFuc2lDb2Rlcy5wb3AoKTtcbiAgICAgIHJldHVybiBjdDtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xuICB9KTtcblxuICAvLyBNYWtlIHN1cmUgdGFncyBhcmUgY2xvc2VkLlxuICB2YXIgbCA9IGFuc2lDb2Rlcy5sZW5ndGg7XG4gIChsID4gMCkgJiYgKHJldCArPSBBcnJheShsICsgMSkuam9pbignPC9zcGFuPicpKTtcblxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEN1c3RvbWl6ZSBjb2xvcnMuXG4gKiBAcGFyYW0ge09iamVjdH0gY29sb3JzIHJlZmVyZW5jZSB0byBfZGVmQ29sb3JzXG4gKi9cbmFuc2lIVE1MLnNldENvbG9ycyA9IGZ1bmN0aW9uIChjb2xvcnMpIHtcbiAgaWYgKHR5cGVvZiBjb2xvcnMgIT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Bjb2xvcnNgIHBhcmFtZXRlciBtdXN0IGJlIGFuIE9iamVjdC4nKTtcbiAgfVxuXG4gIHZhciBfZmluYWxDb2xvcnMgPSB7fTtcbiAgZm9yICh2YXIga2V5IGluIF9kZWZDb2xvcnMpIHtcbiAgICB2YXIgaGV4ID0gY29sb3JzLmhhc093blByb3BlcnR5KGtleSkgPyBjb2xvcnNba2V5XSA6IG51bGw7XG4gICAgaWYgKCFoZXgpIHtcbiAgICAgIF9maW5hbENvbG9yc1trZXldID0gX2RlZkNvbG9yc1trZXldO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICgncmVzZXQnID09IGtleSkge1xuICAgIFx0aWYodHlwZW9mIGhleCA9PSAnc3RyaW5nJyl7XG4gICAgXHRcdGhleCA9IFtoZXhdO1xuICAgIFx0fVxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGhleCkgfHwgaGV4Lmxlbmd0aCA9PSAwIHx8IGhleC5zb21lKGZ1bmN0aW9uIChoKSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVvZiBoICE9ICdzdHJpbmcnO1xuICAgICAgICB9KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSB2YWx1ZSBvZiBgJyArIGtleSArICdgIHByb3BlcnR5IG11c3QgYmUgYW4gQXJyYXkgYW5kIGVhY2ggaXRlbSBjb3VsZCBvbmx5IGJlIGEgaGV4IHN0cmluZywgZS5nLjogRkYwMDAwJyk7XG4gICAgICB9XG4gICAgICB2YXIgZGVmSGV4Q29sb3IgPSBfZGVmQ29sb3JzW2tleV07XG4gICAgICBpZighaGV4WzBdKXtcbiAgICAgIFx0aGV4WzBdID0gZGVmSGV4Q29sb3JbMF07XG4gICAgICB9XG4gICAgICBpZiAoaGV4Lmxlbmd0aCA9PSAxIHx8ICFoZXhbMV0pIHtcbiAgICAgIFx0aGV4ID0gW2hleFswXV07XG4gICAgICAgIGhleC5wdXNoKGRlZkhleENvbG9yWzFdKTtcbiAgICAgIH1cblxuICAgICAgaGV4ID0gaGV4LnNsaWNlKDAsIDIpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGhleCAhPSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgdmFsdWUgb2YgYCcgKyBrZXkgKyAnYCBwcm9wZXJ0eSBtdXN0IGJlIGEgaGV4IHN0cmluZywgZS5nLjogRkYwMDAwJyk7XG4gICAgfVxuICAgIF9maW5hbENvbG9yc1trZXldID0gaGV4O1xuICB9XG4gIF9zZXRUYWdzKF9maW5hbENvbG9ycyk7XG59O1xuXG4vKipcbiAqIFJlc2V0IGNvbG9ycy5cbiAqL1xuYW5zaUhUTUwucmVzZXQgPSBmdW5jdGlvbigpe1xuXHRfc2V0VGFncyhfZGVmQ29sb3JzKTtcbn07XG5cbi8qKlxuICogRXhwb3NlIHRhZ3MsIGluY2x1ZGluZyBvcGVuIGFuZCBjbG9zZS5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmFuc2lIVE1MLnRhZ3MgPSB7XG4gIGdldCBvcGVuKCkge1xuICAgIHJldHVybiBfb3BlblRhZ3M7XG4gIH0sXG4gIGdldCBjbG9zZSgpIHtcbiAgICByZXR1cm4gX2Nsb3NlVGFncztcbiAgfVxufTtcblxuZnVuY3Rpb24gX3NldFRhZ3MoY29sb3JzKSB7XG4gIC8vIHJlc2V0IGFsbFxuICBfb3BlblRhZ3NbJzAnXSA9ICdmb250LXdlaWdodDpub3JtYWw7b3BhY2l0eToxO2NvbG9yOiMnICsgY29sb3JzLnJlc2V0WzBdICsgJztiYWNrZ3JvdW5kOiMnICsgY29sb3JzLnJlc2V0WzFdO1xuICAvLyBpbnZlcnNlXG4gIF9vcGVuVGFnc1snNyddID0gJ2NvbG9yOiMnICsgY29sb3JzLnJlc2V0WzFdICsgJztiYWNrZ3JvdW5kOiMnICsgY29sb3JzLnJlc2V0WzBdO1xuICAvLyBkYXJrIGdyZXlcbiAgX29wZW5UYWdzWyc5MCddID0gJ2NvbG9yOiMnICsgY29sb3JzLmRhcmtncmV5O1xuXG4gIGZvciAodmFyIGNvZGUgaW4gX3N0eWxlcykge1xuICAgIHZhciBjb2xvciA9IF9zdHlsZXNbY29kZV07XG4gICAgdmFyIG9yaUNvbG9yID0gY29sb3JzW2NvbG9yXSB8fCAnMDAwJztcbiAgICBfb3BlblRhZ3NbY29kZV0gPSAnY29sb3I6IycgKyBvcmlDb2xvcjtcbiAgICBjb2RlID0gcGFyc2VJbnQoY29kZSk7XG4gICAgX29wZW5UYWdzWyhjb2RlICsgMTApLnRvU3RyaW5nKCldID0gJ2JhY2tncm91bmQ6IycgKyBvcmlDb2xvcjtcbiAgfVxufVxuXG5hbnNpSFRNTC5yZXNldCgpO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2Fuc2ktaHRtbC9pbmRleC5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBYbWxFbnRpdGllczogcmVxdWlyZSgnLi9saWIveG1sLWVudGl0aWVzLmpzJyksXG4gIEh0bWw0RW50aXRpZXM6IHJlcXVpcmUoJy4vbGliL2h0bWw0LWVudGl0aWVzLmpzJyksXG4gIEh0bWw1RW50aXRpZXM6IHJlcXVpcmUoJy4vbGliL2h0bWw1LWVudGl0aWVzLmpzJyksXG4gIEFsbEh0bWxFbnRpdGllczogcmVxdWlyZSgnLi9saWIvaHRtbDUtZW50aXRpZXMuanMnKVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9odG1sLWVudGl0aWVzL2luZGV4LmpzXG4gKiovIiwiLyoqXG4gKiBCYXNlZCBoZWF2aWx5IG9uIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrL3dlYnBhY2svYmxvYi9cbiAqICBjMGFmZGY5YzZhYmMxZGQ3MDcwN2M1OTRlNDczODAyYTU2NmY3YjZlL2hvdC9vbmx5LWRldi1zZXJ2ZXIuanNcbiAqIE9yaWdpbmFsIGNvcHlyaWdodCBUb2JpYXMgS29wcGVycyBAc29rcmEgKE1JVCBsaWNlbnNlKVxuICovXG5cbi8qIGdsb2JhbCB3aW5kb3cgX193ZWJwYWNrX2hhc2hfXyAqL1xuXG5pZiAoIW1vZHVsZS5ob3QpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFwiW0hNUl0gSG90IE1vZHVsZSBSZXBsYWNlbWVudCBpcyBkaXNhYmxlZC5cIik7XG59XG5cbnZhciBobXJEb2NzVXJsID0gXCJodHRwOi8vd2VicGFjay5naXRodWIuaW8vZG9jcy9ob3QtbW9kdWxlLXJlcGxhY2VtZW50LXdpdGgtd2VicGFjay5odG1sXCI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxlblxuXG52YXIgbGFzdEhhc2g7XG52YXIgZmFpbHVyZVN0YXR1c2VzID0geyBhYm9ydDogMSwgZmFpbDogMSB9O1xudmFyIGFwcGx5T3B0aW9ucyA9IHsgaWdub3JlVW5hY2NlcHRlZDogdHJ1ZSB9O1xuXG5mdW5jdGlvbiB1cFRvRGF0ZShoYXNoKSB7XG4gIGlmIChoYXNoKSBsYXN0SGFzaCA9IGhhc2g7XG4gIHJldHVybiBsYXN0SGFzaCA9PSBfX3dlYnBhY2tfaGFzaF9fO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhhc2gsIG1vZHVsZU1hcCwgb3B0aW9ucykge1xuICB2YXIgcmVsb2FkID0gb3B0aW9ucy5yZWxvYWQ7XG4gIGlmICghdXBUb0RhdGUoaGFzaCkgJiYgbW9kdWxlLmhvdC5zdGF0dXMoKSA9PSBcImlkbGVcIikge1xuICAgIGlmIChvcHRpb25zLmxvZykgY29uc29sZS5sb2coXCJbSE1SXSBDaGVja2luZyBmb3IgdXBkYXRlcyBvbiB0aGUgc2VydmVyLi4uXCIpO1xuICAgIGNoZWNrKCk7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVjaygpIHtcbiAgICBtb2R1bGUuaG90LmNoZWNrKGZ1bmN0aW9uKGVyciwgdXBkYXRlZE1vZHVsZXMpIHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBoYW5kbGVFcnJvcihlcnIpO1xuXG4gICAgICBpZighdXBkYXRlZE1vZHVsZXMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMud2Fybikge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIltITVJdIENhbm5vdCBmaW5kIHVwZGF0ZSAoRnVsbCByZWxvYWQgbmVlZGVkKVwiKTtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJbSE1SXSAoUHJvYmFibHkgYmVjYXVzZSBvZiByZXN0YXJ0aW5nIHRoZSBzZXJ2ZXIpXCIpO1xuICAgICAgICB9XG4gICAgICAgIHBlcmZvcm1SZWxvYWQoKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIG1vZHVsZS5ob3QuYXBwbHkoYXBwbHlPcHRpb25zLCBmdW5jdGlvbihhcHBseUVyciwgcmVuZXdlZE1vZHVsZXMpIHtcbiAgICAgICAgaWYgKGFwcGx5RXJyKSByZXR1cm4gaGFuZGxlRXJyb3IoYXBwbHlFcnIpO1xuXG4gICAgICAgIGlmICghdXBUb0RhdGUoKSkgY2hlY2soKTtcblxuICAgICAgICBsb2dVcGRhdGVzKHVwZGF0ZWRNb2R1bGVzLCByZW5ld2VkTW9kdWxlcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvZ1VwZGF0ZXModXBkYXRlZE1vZHVsZXMsIHJlbmV3ZWRNb2R1bGVzKSB7XG4gICAgdmFyIHVuYWNjZXB0ZWRNb2R1bGVzID0gdXBkYXRlZE1vZHVsZXMuZmlsdGVyKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG4gICAgICByZXR1cm4gcmVuZXdlZE1vZHVsZXMgJiYgcmVuZXdlZE1vZHVsZXMuaW5kZXhPZihtb2R1bGVJZCkgPCAwO1xuICAgIH0pO1xuXG4gICAgaWYodW5hY2NlcHRlZE1vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKG9wdGlvbnMud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgXCJbSE1SXSBUaGUgZm9sbG93aW5nIG1vZHVsZXMgY291bGRuJ3QgYmUgaG90IHVwZGF0ZWQ6IFwiICtcbiAgICAgICAgICBcIihGdWxsIHJlbG9hZCBuZWVkZWQpXFxuXCIgK1xuICAgICAgICAgIFwiVGhpcyBpcyB1c3VhbGx5IGJlY2F1c2UgdGhlIG1vZHVsZXMgd2hpY2ggaGF2ZSBjaGFuZ2VkIFwiICtcbiAgICAgICAgICBcIihhbmQgdGhlaXIgcGFyZW50cykgZG8gbm90IGtub3cgaG93IHRvIGhvdCByZWxvYWQgdGhlbXNlbHZlcy4gXCIgK1xuICAgICAgICAgIFwiU2VlIFwiICsgaG1yRG9jc1VybCArIFwiIGZvciBtb3JlIGRldGFpbHMuXCJcbiAgICAgICAgKTtcbiAgICAgICAgdW5hY2NlcHRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIltITVJdICAtIFwiICsgbW9kdWxlTWFwW21vZHVsZUlkXSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcGVyZm9ybVJlbG9hZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmxvZykge1xuICAgICAgaWYoIXJlbmV3ZWRNb2R1bGVzIHx8IHJlbmV3ZWRNb2R1bGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltITVJdIE5vdGhpbmcgaG90IHVwZGF0ZWQuXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbSE1SXSBVcGRhdGVkIG1vZHVsZXM6XCIpO1xuICAgICAgICByZW5ld2VkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJbSE1SXSAgLSBcIiArIG1vZHVsZU1hcFttb2R1bGVJZF0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHVwVG9EYXRlKCkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbSE1SXSBBcHAgaXMgdXAgdG8gZGF0ZS5cIik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyKSB7XG4gICAgaWYgKG1vZHVsZS5ob3Quc3RhdHVzKCkgaW4gZmFpbHVyZVN0YXR1c2VzKSB7XG4gICAgICBpZiAob3B0aW9ucy53YXJuKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIltITVJdIENhbm5vdCBjaGVjayBmb3IgdXBkYXRlIChGdWxsIHJlbG9hZCBuZWVkZWQpXCIpO1xuICAgICAgICBjb25zb2xlLndhcm4oXCJbSE1SXSBcIiArIGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSk7XG4gICAgICB9XG4gICAgICBwZXJmb3JtUmVsb2FkKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvcHRpb25zLndhcm4pIHtcbiAgICAgIGNvbnNvbGUud2FybihcIltITVJdIFVwZGF0ZSBjaGVjayBmYWlsZWQ6IFwiICsgZXJyLnN0YWNrIHx8IGVyci5tZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwZXJmb3JtUmVsb2FkKCkge1xuICAgIGlmIChyZWxvYWQpIHtcbiAgICAgIGlmIChvcHRpb25zLndhcm4pIGNvbnNvbGUud2FybihcIltITVJdIFJlbG9hZGluZyBwYWdlXCIpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH1cbiAgfVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqICh3ZWJwYWNrKS1ob3QtbWlkZGxld2FyZS9wcm9jZXNzLXVwZGF0ZS5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=