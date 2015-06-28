(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
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
  	DataParser: __webpack_require__(8)
  };


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Matches patterns according to registered rules
   */
  
  'use strict';
  
  var arrayUtils = __webpack_require__(3);
  var Token = __webpack_require__(4);
  var PatternPath = __webpack_require__(5);
  var MatchState = __webpack_require__(2);
  var PathNode = __webpack_require__(6);
  var PatternContext = __webpack_require__(7);
  
  ///** @const */ var LETTER_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  /**
   * Create a new pattern matcher with the given base patterns
   * @param patterns
   * @constructor
   */
  var PatternMatcher = function(patterns) {
  	// All currently active patterns
  	this.patterns = {};
  	// All active patterns compiled for use
  	this.compiledPatterns = {};
  	// All registered validators
  	this.validators = {};
  
  	if (patterns)
  		this.addPatterns('', patterns);
  };
  
  /**
   * Clear all compiled patterns
   */
  PatternMatcher.prototype.clearPatterns = function() {
  	this.patterns.length = 0;
  	this.compiledPatterns.length = 0;
  };
  
  /**
   * Add more patterns to the compiled ones
   * @param matchTag
   * @param newPatterns
   */
  PatternMatcher.prototype.addPatterns = function(matchTag, newPatterns) {
  	// if no patterns are in the list then there's nothing to do
  	if (!newPatterns || !newPatterns.length)
  		return;
  
  	var targetPatterns = this.patterns[matchTag];
  	if (!targetPatterns)
  		targetPatterns = this.patterns[matchTag] = [];
  
  	var pathRoot = this.compiledPatterns[matchTag];
  	if (!pathRoot)
  		pathRoot = this.compiledPatterns[matchTag] = {};
  
  	// parse each pattern into tokens and then parse the tokens
  	var tokens = [];
  	for (var patternIndex = 0; patternIndex < newPatterns.length; patternIndex++)
  	{
  		var p = newPatterns[patternIndex];
  
  		// if the pattern was added before then don't do it again
  		if (arrayUtils.contains(targetPatterns, p))
  			continue;
  
  		var targetIndex = targetPatterns.length;
  		targetPatterns.push(p);
  
  		var pattern = p.match;
  
  		//
  		// parse the pattern into tokens
  		//
  
  		tokens.length = 0;
  		var currentToken = '';
  		var i;
  		for (i = 0; i < pattern.length; i++)
  		{
  			switch (pattern[i])
  			{
  				case '{':
  					if (!currentToken.length)
  						break;
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
  
  		if (currentToken)
  			tokens.push(new Token(currentToken, true));
  
  		if (!tokens.length)
  			continue;
  
  		//
  		// Compile the tokens into the tree
  		//
  
  		var path = null;
  		var paths = pathRoot;
  		for (i = 0; i < tokens.length; i++)
  		{
  			var token = tokens[i];
  			var tokenKey = token.toString();
  			// check if the exact same node exists and take it if it does
  			var nextPath = paths[tokenKey];
  			if (!nextPath)
  				nextPath = paths[tokenKey] = new PatternPath();
  			path = nextPath;
  			paths = nextPath.paths;
  		}
  		if (path)
  		{
  			if (!path.matchedPatterns)
  				path.matchedPatterns = [];
  			if (path.matchedPatterns.indexOf(targetIndex) === -1)
  				path.matchedPatterns.push(targetIndex);
  		}
  	}
  };
  
  /**
   * Match the value against all patterns and return the ones that fit
   * @param context - The current context for matching
   * @param value
   * @returns {*}
   */
  PatternMatcher.prototype.match = function(context, value) {
  	var results = [];
  	if (!value)
  		return results;
  
  	var state = this.matchStart(context, '');
  	for (var i = 0; i < value.length; i++)
  	{
  		var c = value.charAt(i);
  		if (!this.matchNext(state, c))
  			return results;
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
  PatternMatcher.prototype.matchStart = function(context, matchTag) {
  	var roots = this.compiledPatterns[matchTag];
  	if (!roots)
  		return null;
  
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
   * Register a validation object for the tag
   * @param tag
   * @param validator
   */
  PatternMatcher.prototype.registerValidator = function(tag, validator) {
  	this.validators[tag] = validator;
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
/* 2 */
/***/ function(module, exports) {

  /**
   * Holds state for a matching session
   */
  
  'use strict';
  
  var MatchState = function() {
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
  	contains: function(ar, obj) {
  		if (!ar)
  			return false;
  		// check strict equality first, should be fastest
  		if (ar.indexOf(obj) !== -1)
  			return true;
  
  		var hasEquals = (!!obj && typeof obj.equals === 'function');
  
  		// check all elements
  		for (var i = 0; i < ar.length; i++) {
  			var other = ar[i];
  			var result;
  			if (hasEquals)
  				result = obj.equals(other);
  			else if (typeof other.equals === 'function')
  				result = other.equals(obj);
  			else
  				result = (obj === other);
  			if (result)
  				return true;
  		}
  		return false;
  	}
  };
  
  module.exports = arrayUtils;


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
  var Token = function(value, exactMatch) {
  	this.exactMatch = !!exactMatch;
  	if (this.exactMatch)
  	{
  		this.value = value;
  		this.minCount = this.maxCount = 1;
  		return;
  	}
  
  	var parts = (value || '').split(':');
  	this.value = (parts.length > 0 ? parts[0] : '');
  	if (parts.length === 1)
  		this.minCount = this.maxCount = 1;
  	else if (parts.length > 1)
  	{
  		switch (parts[1])
  		{
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
  				if (countParts.length === 1)
  					this.minCount = this.maxCount = parseInt(countParts[0]);
  				else if (countParts.length >= 2)
  				{
  					this.minCount = parseInt(countParts[0] || '0');
  					this.maxCount = parseInt(countParts[1] || '0');
  				}
  				break;
  		}
  	}
  	// don't allow max to be smaller than min
  	if (this.maxCount < this.minCount)
  		this.maxCount = this.minCount;
  };
  /**
   * Maximum times that a token without restriction can be repeated
   * @const
   */
  Token.prototype.MAX_VALUE = 1000;
  
  Token.prototype.equals = function(token) {
  	if (!token) return false;
  	return token.value === this.value &&
  			token.minCount === this.minCount &&
  			token.maxCount === this.maxCount &&
  			token.exactMatch === this.exactMatch;
  };
  Token.prototype.toString = function() {
  	if (this.exactMatch)
  		return this.value;
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
  var PatternPath = function() {
  	// Paths for all tokens
  	this.paths = {};
  	// Any patterns finishing at this path
  	this.matchedPatterns = [];
  
  };
  PatternPath.prototype.toString = function() {
  	var matches = (this.matchedPatterns || []).join(', ');
  	var children = (this.paths.map(function(token) {
  		return token.toString();
  	})).join(', ');
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
  var PathNode = function(token, path, textValue) {
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
  
  PathNode.prototype.toString = function() {
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
/* 7 */
/***/ function(module, exports) {

  /**
   * Context for pattern matching
   * Holds values which may influence parsing outcome like current date and time, location or language
   */
  
  'use strict';
  
  var PatternContext = function(currentDate) {
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
/* 8 */
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
  
  var moduleTypes = [
  	__webpack_require__(9)
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
  	if (!modules)
  		return matcher;
  
  	modules.forEach(function(Module) {
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
  	if (!defaultPatternMatcher)
  		defaultPatternMatcher = makePatternMatcher(moduleTypes);
  	return defaultPatternMatcher;
  }
  
  
  /**
   * Create a data parser with the specified name and modules. If name and modules is empty, matches all default patterns.
   * @param name
   * @param modules
   * @constructor
   */
  var DataParser = function(name, modules) {
  	if (!name || !modules) {
  		this.patternMatcher = getDefaultPatternMatcher();
  	} else {
  		if (namedPatternMatchers[name])
  			return;
  
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Validates booleans
   */
  
  'use strict';
  
  var Pattern = __webpack_require__(10);
  var BooleanValue = __webpack_require__(11);
  
  
  /**
   * Make the final output value
   * @param value
   * @returns {BooleanValue}
   */
  function make(value) {
  	var boolValue = false;
  	if (typeof value === 'boolean')
  		boolValue = value;
  	else if (value)
  	{
  		var lowerValue = value.toString().toLowerCase();
  		boolValue = (this.const.trueValues.indexOf(lowerValue) !== -1);
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
  
  var mainPatterns = [
  	new Pattern('{emptyline:*}{booleantrue}{emptyline:*}', parsePattern),
  	new Pattern('{emptyline:*}{booleanfalse}{emptyline:*}', parsePattern)
  ];
  
  
  /**
   * Singleton Module to parse boolean values
   * @constructor
   */
  var BooleanParserModule = function() {
  	this.const = {
  		trueValues: [ '1', 'true', 'wahr' ],
  		falseValues: [ '0', 'false', 'falsch' ]
  	};
  
  	this.patternTags = [''];
  	this.tokenTags = ['booleanfalse', 'booleantrue'];
  };
  /**
   * Return the patterns for the tag
   * @param tag {string}
   */
  BooleanParserModule.prototype.getPatterns = function(tag) {
  	if (tag === '')
  		return mainPatterns;
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
/* 10 */
/***/ function(module, exports) {

  /**
   * Pattern object
   */
  
  'use strict';
  
  var Pattern = function(match, parser) {
  	this.match = match || '';
  	this.parser = parser;
  };
  
  Pattern.prototype.toString = function() {
  	return this.match;
  };
  Pattern.prototype.parse = function(context, values) {
  	return this.parser(context, values);
  };
  Pattern.prototype.equals = function(other) {
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
/* 11 */
/***/ function(module, exports) {

  /**
   * Boolean result wrapper
   */
  
  'use strict';
  
  var BooleanValue = function(value) {
  	this.bool = !!value;
  };
  BooleanValue.prototype.valueOf = function() {
  	return this.bool;
  };
  BooleanValue.prototype.toString = function() {
  	return this.bool.toString();
  };
  BooleanValue.prototype.equals = function(other) {
  	if (!(other instanceof BooleanValue))
  		return false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA5YzRkNjdjMTBmM2VkZjUxZDRlMiIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUGF0dGVybk1hdGNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGNoU3RhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2FycmF5VXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hdGNoaW5nL1Rva2VuLmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRjaGluZy9QYXR0ZXJuUGF0aC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWF0Y2hpbmcvUGF0aE5vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhdHRlcm5Db250ZXh0LmpzIiwid2VicGFjazovLy8uL3NyYy9EYXRhUGFyc2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9tb2R1bGVzL0Jvb2xlYW5QYXJzZXJNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hdGNoaW5nL1BhdHRlcm4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZhbHVlcy9Cb29sZWFuVmFsdWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ1RBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkJBQTJCLG1DQUFtQztBQUM5RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFhLG9CQUFvQjtBQUNqQztBQUNBO0FBQ0E7QUFDQSxhQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWEsbUJBQW1CO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBZ0Isa0JBQWtCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrQkFBNkIsbUNBQW1DO0FBQ2hFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWEsb0JBQW9CO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLGFBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYSxrQkFBa0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWdCLGtCQUFrQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBa0IsMEJBQTBCO0FBQzVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFtQyxlQUFlLEVBQUU7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBb0IsMEJBQTBCO0FBQzlDO0FBQ0Esc0JBQW9CLGlDQUFpQztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFtQixXQUFXO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzFyQkE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1DQUFpQyxLQUFLLEtBQUs7QUFDM0M7QUFDQTs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBZ0IsaUJBQWlCO0FBQ2pDLG1CQUFpQjtBQUNqQixnQkFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsbUJBQWlCLGVBQWU7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3hDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLG1CQUFpQjtBQUNqQix3QkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOENBQTRDLE1BQU07QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw2QkFBMkIsRUFBRTtBQUM3Qiw0QkFBMEIsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDckxBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUU7QUFDRjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBMEIsRUFBRSxLQUFLLEVBQUU7QUFDbkM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUM5Q0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUEwQixFQUFFLElBQUksRUFBRTtBQUNsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtDQUFnQyxLQUFLLEtBQUs7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzVCQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVU7QUFDVixnQkFBYyxTQUFTO0FBQ3ZCLGdCQUFjLFNBQVM7QUFDdkIsZ0JBQWMsaUJBQWlCO0FBQy9COztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EscUJBQW1CLFNBQVM7QUFDNUIsZUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFhLCtCQUErQjtBQUM1QztBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFhLDZCQUE2QjtBQUMxQztBQUNBO0FBQ0E7QUFDQSxJQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnREFBOEMsS0FBSyxLQUFLOztBQUV4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQzVOQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsZUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWUsYUFBYSxhQUFhLFlBQVk7QUFDckQsaUJBQWUsYUFBYSxjQUFjLFlBQVk7QUFDdEQ7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsOEVBQTRFO0FBQzVFLCtFQUE2RTs7QUFFN0U7QUFDQTtBQUNBLDRCQUEwQixhQUFhLGFBQWEsWUFBWTtBQUNoRSw0QkFBMEIsYUFBYSxjQUFjLFlBQVk7QUFDakU7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFRLGVBQWUsTUFBTTtBQUM3Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFRLGVBQWUsaUNBQWlDO0FBQ3hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2xMQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUJBQXVCLEtBQUssYUFBYTtBQUN6QywwREFBd0QsS0FBSyxhQUFhO0FBQzFFLG1EQUFpRCxLQUFLLGFBQWE7O0FBRW5FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3pFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUSxhQUFhO0FBQ3JCLFVBQVEsdUJBQXVCO0FBQy9COzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0QkFBMEIsRUFBRTtBQUM1Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZGF0YXBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0YVBhcnNlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJEYXRhUGFyc2VyXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL3JlbGVhc2UvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA5YzRkNjdjMTBmM2VkZjUxZDRlMlxuICoqLyIsIi8qKlxyXG4gKiBFbnRyeSBwb2ludCBmb3IgdGhlIERhdGFQYXJzZXIgbGlicmFyeVxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFBhdHRlcm5NYXRjaGVyOiByZXF1aXJlKCcuL3NyYy9QYXR0ZXJuTWF0Y2hlcicpLFxyXG5cdERhdGFQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL0RhdGFQYXJzZXInKVxyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcclxuICogTWF0Y2hlcyBwYXR0ZXJucyBhY2NvcmRpbmcgdG8gcmVnaXN0ZXJlZCBydWxlc1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBhcnJheVV0aWxzID0gcmVxdWlyZSgnLi91dGlscy9hcnJheVV0aWxzJyk7XHJcbnZhciBUb2tlbiA9IHJlcXVpcmUoJy4vbWF0Y2hpbmcvVG9rZW4nKTtcclxudmFyIFBhdHRlcm5QYXRoID0gcmVxdWlyZSgnLi9tYXRjaGluZy9QYXR0ZXJuUGF0aCcpO1xyXG52YXIgTWF0Y2hTdGF0ZSA9IHJlcXVpcmUoJy4vTWF0Y2hTdGF0ZScpO1xyXG52YXIgUGF0aE5vZGUgPSByZXF1aXJlKCcuL21hdGNoaW5nL1BhdGhOb2RlJyk7XHJcbnZhciBQYXR0ZXJuQ29udGV4dCA9IHJlcXVpcmUoJy4vUGF0dGVybkNvbnRleHQnKTtcclxuXHJcbi8vLyoqIEBjb25zdCAqLyB2YXIgTEVUVEVSX0NIQVJBQ1RFUlMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWic7XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbmV3IHBhdHRlcm4gbWF0Y2hlciB3aXRoIHRoZSBnaXZlbiBiYXNlIHBhdHRlcm5zXHJcbiAqIEBwYXJhbSBwYXR0ZXJuc1xyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbnZhciBQYXR0ZXJuTWF0Y2hlciA9IGZ1bmN0aW9uKHBhdHRlcm5zKSB7XHJcblx0Ly8gQWxsIGN1cnJlbnRseSBhY3RpdmUgcGF0dGVybnNcclxuXHR0aGlzLnBhdHRlcm5zID0ge307XHJcblx0Ly8gQWxsIGFjdGl2ZSBwYXR0ZXJucyBjb21waWxlZCBmb3IgdXNlXHJcblx0dGhpcy5jb21waWxlZFBhdHRlcm5zID0ge307XHJcblx0Ly8gQWxsIHJlZ2lzdGVyZWQgdmFsaWRhdG9yc1xyXG5cdHRoaXMudmFsaWRhdG9ycyA9IHt9O1xyXG5cclxuXHRpZiAocGF0dGVybnMpXHJcblx0XHR0aGlzLmFkZFBhdHRlcm5zKCcnLCBwYXR0ZXJucyk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xlYXIgYWxsIGNvbXBpbGVkIHBhdHRlcm5zXHJcbiAqL1xyXG5QYXR0ZXJuTWF0Y2hlci5wcm90b3R5cGUuY2xlYXJQYXR0ZXJucyA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMucGF0dGVybnMubGVuZ3RoID0gMDtcclxuXHR0aGlzLmNvbXBpbGVkUGF0dGVybnMubGVuZ3RoID0gMDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgbW9yZSBwYXR0ZXJucyB0byB0aGUgY29tcGlsZWQgb25lc1xyXG4gKiBAcGFyYW0gbWF0Y2hUYWdcclxuICogQHBhcmFtIG5ld1BhdHRlcm5zXHJcbiAqL1xyXG5QYXR0ZXJuTWF0Y2hlci5wcm90b3R5cGUuYWRkUGF0dGVybnMgPSBmdW5jdGlvbihtYXRjaFRhZywgbmV3UGF0dGVybnMpIHtcclxuXHQvLyBpZiBubyBwYXR0ZXJucyBhcmUgaW4gdGhlIGxpc3QgdGhlbiB0aGVyZSdzIG5vdGhpbmcgdG8gZG9cclxuXHRpZiAoIW5ld1BhdHRlcm5zIHx8ICFuZXdQYXR0ZXJucy5sZW5ndGgpXHJcblx0XHRyZXR1cm47XHJcblxyXG5cdHZhciB0YXJnZXRQYXR0ZXJucyA9IHRoaXMucGF0dGVybnNbbWF0Y2hUYWddO1xyXG5cdGlmICghdGFyZ2V0UGF0dGVybnMpXHJcblx0XHR0YXJnZXRQYXR0ZXJucyA9IHRoaXMucGF0dGVybnNbbWF0Y2hUYWddID0gW107XHJcblxyXG5cdHZhciBwYXRoUm9vdCA9IHRoaXMuY29tcGlsZWRQYXR0ZXJuc1ttYXRjaFRhZ107XHJcblx0aWYgKCFwYXRoUm9vdClcclxuXHRcdHBhdGhSb290ID0gdGhpcy5jb21waWxlZFBhdHRlcm5zW21hdGNoVGFnXSA9IHt9O1xyXG5cclxuXHQvLyBwYXJzZSBlYWNoIHBhdHRlcm4gaW50byB0b2tlbnMgYW5kIHRoZW4gcGFyc2UgdGhlIHRva2Vuc1xyXG5cdHZhciB0b2tlbnMgPSBbXTtcclxuXHRmb3IgKHZhciBwYXR0ZXJuSW5kZXggPSAwOyBwYXR0ZXJuSW5kZXggPCBuZXdQYXR0ZXJucy5sZW5ndGg7IHBhdHRlcm5JbmRleCsrKVxyXG5cdHtcclxuXHRcdHZhciBwID0gbmV3UGF0dGVybnNbcGF0dGVybkluZGV4XTtcclxuXHJcblx0XHQvLyBpZiB0aGUgcGF0dGVybiB3YXMgYWRkZWQgYmVmb3JlIHRoZW4gZG9uJ3QgZG8gaXQgYWdhaW5cclxuXHRcdGlmIChhcnJheVV0aWxzLmNvbnRhaW5zKHRhcmdldFBhdHRlcm5zLCBwKSlcclxuXHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0dmFyIHRhcmdldEluZGV4ID0gdGFyZ2V0UGF0dGVybnMubGVuZ3RoO1xyXG5cdFx0dGFyZ2V0UGF0dGVybnMucHVzaChwKTtcclxuXHJcblx0XHR2YXIgcGF0dGVybiA9IHAubWF0Y2g7XHJcblxyXG5cdFx0Ly9cclxuXHRcdC8vIHBhcnNlIHRoZSBwYXR0ZXJuIGludG8gdG9rZW5zXHJcblx0XHQvL1xyXG5cclxuXHRcdHRva2Vucy5sZW5ndGggPSAwO1xyXG5cdFx0dmFyIGN1cnJlbnRUb2tlbiA9ICcnO1xyXG5cdFx0dmFyIGk7XHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgcGF0dGVybi5sZW5ndGg7IGkrKylcclxuXHRcdHtcclxuXHRcdFx0c3dpdGNoIChwYXR0ZXJuW2ldKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y2FzZSAneyc6XHJcblx0XHRcdFx0XHRpZiAoIWN1cnJlbnRUb2tlbi5sZW5ndGgpXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0dG9rZW5zLnB1c2gobmV3IFRva2VuKGN1cnJlbnRUb2tlbiwgdHJ1ZSkpO1xyXG5cdFx0XHRcdFx0Y3VycmVudFRva2VuID0gJyc7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICd9JzpcclxuXHRcdFx0XHRcdHRva2Vucy5wdXNoKG5ldyBUb2tlbihjdXJyZW50VG9rZW4sIGZhbHNlKSk7XHJcblx0XHRcdFx0XHRjdXJyZW50VG9rZW4gPSAnJztcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRjdXJyZW50VG9rZW4gKz0gcGF0dGVybltpXTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGN1cnJlbnRUb2tlbilcclxuXHRcdFx0dG9rZW5zLnB1c2gobmV3IFRva2VuKGN1cnJlbnRUb2tlbiwgdHJ1ZSkpO1xyXG5cclxuXHRcdGlmICghdG9rZW5zLmxlbmd0aClcclxuXHRcdFx0Y29udGludWU7XHJcblxyXG5cdFx0Ly9cclxuXHRcdC8vIENvbXBpbGUgdGhlIHRva2VucyBpbnRvIHRoZSB0cmVlXHJcblx0XHQvL1xyXG5cclxuXHRcdHZhciBwYXRoID0gbnVsbDtcclxuXHRcdHZhciBwYXRocyA9IHBhdGhSb290O1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKylcclxuXHRcdHtcclxuXHRcdFx0dmFyIHRva2VuID0gdG9rZW5zW2ldO1xyXG5cdFx0XHR2YXIgdG9rZW5LZXkgPSB0b2tlbi50b1N0cmluZygpO1xyXG5cdFx0XHQvLyBjaGVjayBpZiB0aGUgZXhhY3Qgc2FtZSBub2RlIGV4aXN0cyBhbmQgdGFrZSBpdCBpZiBpdCBkb2VzXHJcblx0XHRcdHZhciBuZXh0UGF0aCA9IHBhdGhzW3Rva2VuS2V5XTtcclxuXHRcdFx0aWYgKCFuZXh0UGF0aClcclxuXHRcdFx0XHRuZXh0UGF0aCA9IHBhdGhzW3Rva2VuS2V5XSA9IG5ldyBQYXR0ZXJuUGF0aCgpO1xyXG5cdFx0XHRwYXRoID0gbmV4dFBhdGg7XHJcblx0XHRcdHBhdGhzID0gbmV4dFBhdGgucGF0aHM7XHJcblx0XHR9XHJcblx0XHRpZiAocGF0aClcclxuXHRcdHtcclxuXHRcdFx0aWYgKCFwYXRoLm1hdGNoZWRQYXR0ZXJucylcclxuXHRcdFx0XHRwYXRoLm1hdGNoZWRQYXR0ZXJucyA9IFtdO1xyXG5cdFx0XHRpZiAocGF0aC5tYXRjaGVkUGF0dGVybnMuaW5kZXhPZih0YXJnZXRJbmRleCkgPT09IC0xKVxyXG5cdFx0XHRcdHBhdGgubWF0Y2hlZFBhdHRlcm5zLnB1c2godGFyZ2V0SW5kZXgpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBNYXRjaCB0aGUgdmFsdWUgYWdhaW5zdCBhbGwgcGF0dGVybnMgYW5kIHJldHVybiB0aGUgb25lcyB0aGF0IGZpdFxyXG4gKiBAcGFyYW0gY29udGV4dCAtIFRoZSBjdXJyZW50IGNvbnRleHQgZm9yIG1hdGNoaW5nXHJcbiAqIEBwYXJhbSB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcblBhdHRlcm5NYXRjaGVyLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uKGNvbnRleHQsIHZhbHVlKSB7XHJcblx0dmFyIHJlc3VsdHMgPSBbXTtcclxuXHRpZiAoIXZhbHVlKVxyXG5cdFx0cmV0dXJuIHJlc3VsdHM7XHJcblxyXG5cdHZhciBzdGF0ZSA9IHRoaXMubWF0Y2hTdGFydChjb250ZXh0LCAnJyk7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKylcclxuXHR7XHJcblx0XHR2YXIgYyA9IHZhbHVlLmNoYXJBdChpKTtcclxuXHRcdGlmICghdGhpcy5tYXRjaE5leHQoc3RhdGUsIGMpKVxyXG5cdFx0XHRyZXR1cm4gcmVzdWx0cztcclxuXHR9XHJcblxyXG5cdHJlc3VsdHMgPSB0aGlzLm1hdGNoUmVzdWx0cyhzdGF0ZSk7XHJcblx0Ly8gcmV2ZXJzZSByZXN1bHRzIHNpbmNlIHRoZSBsb25nZXN0IG1hdGNoZXMgd2lsbCBiZSBmb3VuZCBsYXN0IGJ1dCBhcmUgdGhlIG1vc3Qgc3BlY2lmaWNcclxuXHRyZXN1bHRzLnJldmVyc2UoKTtcclxuXHRyZXR1cm4gcmVzdWx0cztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBCZWdpbiBhIHBhcnNpbmcgc2Vzc2lvblxyXG4gKiBAcGFyYW0gY29udGV4dFxyXG4gKiBAcGFyYW0gbWF0Y2hUYWdcclxuICogQHJldHVybnMge01hdGNoU3RhdGV9XHJcbiAqL1xyXG5QYXR0ZXJuTWF0Y2hlci5wcm90b3R5cGUubWF0Y2hTdGFydCA9IGZ1bmN0aW9uKGNvbnRleHQsIG1hdGNoVGFnKSB7XHJcblx0dmFyIHJvb3RzID0gdGhpcy5jb21waWxlZFBhdHRlcm5zW21hdGNoVGFnXTtcclxuXHRpZiAoIXJvb3RzKVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblxyXG5cdHZhciBzdGF0ZSA9IG5ldyBNYXRjaFN0YXRlKCk7XHJcblx0c3RhdGUubWF0Y2hUYWcgPSBtYXRjaFRhZztcclxuXHRzdGF0ZS5jb250ZXh0ID0gY29udGV4dCB8fCBuZXcgUGF0dGVybkNvbnRleHQoKTtcclxuXHJcblx0dmFyIHJvb3QgPSBuZXcgUGF0dGVyblBhdGgoKTtcclxuXHRyb290LnBhdGhzID0gcm9vdHM7XHJcblx0dmFyIHN0YXJ0Tm9kZSA9IG5ldyBQYXRoTm9kZShudWxsLCByb290LCAnJyk7XHJcblx0c3RhdGUuY2FuZGlkYXRlUGF0aHMucHVzaChzdGFydE5vZGUpO1xyXG5cclxuXHRyZXR1cm4gc3RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVnaXN0ZXIgYSB2YWxpZGF0aW9uIG9iamVjdCBmb3IgdGhlIHRhZ1xyXG4gKiBAcGFyYW0gdGFnXHJcbiAqIEBwYXJhbSB2YWxpZGF0b3JcclxuICovXHJcblBhdHRlcm5NYXRjaGVyLnByb3RvdHlwZS5yZWdpc3RlclZhbGlkYXRvciA9IGZ1bmN0aW9uKHRhZywgdmFsaWRhdG9yKSB7XHJcblx0dGhpcy52YWxpZGF0b3JzW3RhZ10gPSB2YWxpZGF0b3I7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhdHRlcm5NYXRjaGVyO1xyXG5cclxuXHJcbi8qXHJcblxyXG4vLy8gPHN1bW1hcnk+XHJcbi8vLyBNYXRjaGVzIGRhdGEgYmFzZWQgb24gcGF0dGVybnNcclxuLy8vIDwvc3VtbWFyeT5cclxucHVibGljIGNsYXNzIFBhdHRlcm5NYXRjaGVyXHJcbntcclxuXHRwcml2YXRlIGNvbnN0IFN0cmluZyBMZXR0ZXJDaGFyYWN0ZXJzID0gXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCI7XHJcblxyXG5cdC8vLyA8c3VtbWFyeT5cclxuXHQvLy8gQWxsIGN1cnJlbnRseSBhY3RpdmUgcGF0dGVybnNcclxuXHQvLy8gPC9zdW1tYXJ5PlxyXG5cdHByaXZhdGUgcmVhZG9ubHkgRGljdGlvbmFyeTxTdHJpbmcsIExpc3Q8UGF0dGVybj4+IHBhdHRlcm5zID0gbmV3IERpY3Rpb25hcnk8U3RyaW5nLCBMaXN0PFBhdHRlcm4+PigpO1xyXG5cdC8vLyA8c3VtbWFyeT5cclxuXHQvLy8gQWxsIGFjdGl2ZSBwYXR0ZXJucyBjb21waWxlZCBmb3IgdXNlXHJcblx0Ly8vIDwvc3VtbWFyeT5cclxuXHRwcml2YXRlIHJlYWRvbmx5IERpY3Rpb25hcnk8U3RyaW5nLCBEaWN0aW9uYXJ5PFRva2VuLCBQYXR0ZXJuUGF0aD4+IGNvbXBpbGVkUGF0dGVybnMgPSBuZXcgRGljdGlvbmFyeTxTdHJpbmcsIERpY3Rpb25hcnk8VG9rZW4sIFBhdHRlcm5QYXRoPj4oKTtcclxuXHQvLy8gPHN1bW1hcnk+XHJcblx0Ly8vIEFsbCByZWdpc3RlcmVkIHZhbGlkYXRvcnNcclxuXHQvLy8gPC9zdW1tYXJ5PlxyXG5cdHByaXZhdGUgcmVhZG9ubHkgRGljdGlvbmFyeTxTdHJpbmcsIElUb2tlblZhbGlkYXRvcj4gdmFsaWRhdG9ycyA9IG5ldyBEaWN0aW9uYXJ5PFN0cmluZywgSVRva2VuVmFsaWRhdG9yPigpO1xyXG5cclxuXHQvLy8gPHN1bW1hcnk+XHJcblx0Ly8vIENvbnN0cnVjdG9yXHJcblx0Ly8vIDwvc3VtbWFyeT5cclxuXHRwdWJsaWMgUGF0dGVybk1hdGNoZXIoUGF0dGVybltdIHBhdHRlcm5zKVxyXG57XHJcblx0aWYgKHBhdHRlcm5zLkxlbmd0aCA+IDApXHJcblx0QWRkUGF0dGVybnMoXCJcIiwgcGF0dGVybnMpO1xyXG59XHJcblxyXG4vLy8gPHN1bW1hcnk+XHJcbi8vLyBDbGVhciBhbGwgY29tcGlsZWQgcGF0dGVybnNcclxuLy8vIDwvc3VtbWFyeT5cclxucHVibGljIHZvaWQgQ2xlYXJQYXR0ZXJucygpXHJcbntcclxuXHR0aGlzLnBhdHRlcm5zLkNsZWFyKCk7XHJcblx0dGhpcy5jb21waWxlZFBhdHRlcm5zLkNsZWFyKCk7XHJcbn1cclxuXHJcbi8vLyA8c3VtbWFyeT5cclxuLy8vIEFkZCBtb3JlIHBhdHRlcm5zIHRvIHRoZSBjb21waWxlZCBvbmVzXHJcbi8vLyA8L3N1bW1hcnk+XHJcbnB1YmxpYyB2b2lkIEFkZFBhdHRlcm5zKFN0cmluZyBtYXRjaFRhZywgUGF0dGVybltdIG5ld1BhdHRlcm5zKVxyXG57XHJcblx0TGlzdDxQYXR0ZXJuPiB0YXJnZXRQYXR0ZXJucztcclxuI2lmIFNDUklQVFNIQVJQXHJcblx0aWYgKCh0YXJnZXRQYXR0ZXJucyA9IERpY3Rpb25hcnlVdGlscy5UcnlHZXRQYXR0ZXJucyh0aGlzLnBhdHRlcm5zLCBtYXRjaFRhZykpID09IG51bGwpXHJcblx0XHQjZWxzZVxyXG5cdGlmICghdGhpcy5wYXR0ZXJucy5UcnlHZXRWYWx1ZShtYXRjaFRhZywgb3V0IHRhcmdldFBhdHRlcm5zKSlcclxuI2VuZGlmXHJcblx0dGhpcy5wYXR0ZXJuc1ttYXRjaFRhZ10gPSB0YXJnZXRQYXR0ZXJucyA9IG5ldyBMaXN0PFBhdHRlcm4+KG5ld1BhdHRlcm5zLkxlbmd0aCk7XHJcblxyXG5cdERpY3Rpb25hcnk8VG9rZW4sIFBhdHRlcm5QYXRoPiBwYXRoUm9vdDtcclxuI2lmIFNDUklQVFNIQVJQXHJcblx0aWYgKChwYXRoUm9vdCA9IERpY3Rpb25hcnlVdGlscy5UcnlHZXRQYXR0ZXJuUGF0aChjb21waWxlZFBhdHRlcm5zLCBtYXRjaFRhZykpID09IG51bGwpXHJcblx0XHRjb21waWxlZFBhdHRlcm5zW21hdGNoVGFnXSA9IHBhdGhSb290ID0gbmV3IERpY3Rpb25hcnk8VG9rZW4sIFBhdHRlcm5QYXRoPigpO1xyXG4jZWxzZVxyXG5cdGlmICghdGhpcy5jb21waWxlZFBhdHRlcm5zLlRyeUdldFZhbHVlKG1hdGNoVGFnLCBvdXQgcGF0aFJvb3QpKVxyXG5cdHRoaXMuY29tcGlsZWRQYXR0ZXJuc1ttYXRjaFRhZ10gPSBwYXRoUm9vdCA9IG5ldyBEaWN0aW9uYXJ5PFRva2VuLCBQYXR0ZXJuUGF0aD4oKTtcclxuI2VuZGlmXHJcblxyXG5cdC8vIHBhcnNlIGVhY2ggcGF0dGVybiBpbnRvIHRva2VucyBhbmQgdGhlbiBwYXJzZSB0aGUgdG9rZW5zXHJcblx0TGlzdDxUb2tlbj4gdG9rZW5zID0gbmV3IExpc3Q8VG9rZW4+KCk7XHJcblx0Zm9yIChJbnQzMiBwYXR0ZXJuSW5kZXggPSAwOyBwYXR0ZXJuSW5kZXggPCBuZXdQYXR0ZXJucy5MZW5ndGg7IHBhdHRlcm5JbmRleCsrKVxyXG5cdHtcclxuXHRcdFBhdHRlcm4gcCA9IG5ld1BhdHRlcm5zW3BhdHRlcm5JbmRleF07XHJcblxyXG5cdFx0Ly8gaWYgdGhlIHBhdHRlcm4gd2FzIGFkZGVkIGJlZm9yZSB0aGVuIGRvbid0IGRvIGl0IGFnYWluXHJcblx0XHRpZiAodGFyZ2V0UGF0dGVybnMuQ29udGFpbnMocCkpXHJcblx0XHRcdGNvbnRpbnVlO1xyXG5cclxuXHRcdEludDMyIHRhcmdldEluZGV4ID0gdGFyZ2V0UGF0dGVybnMuQ291bnQ7XHJcblx0XHR0YXJnZXRQYXR0ZXJucy5BZGQocCk7XHJcblxyXG5cdFx0U3RyaW5nIHBhdHRlcm4gPSBwLk1hdGNoO1xyXG5cclxuXHRcdC8vXHJcblx0XHQvLyBwYXJzZSB0aGUgcGF0dGVybiBpbnRvIHRva2Vuc1xyXG5cdFx0Ly9cclxuXHJcblx0XHR0b2tlbnMuQ2xlYXIoKTtcclxuXHRcdFN0cmluZyBjdXJyZW50VG9rZW4gPSBcIlwiO1xyXG5cdFx0SW50MzIgaTtcclxuXHRcdGZvciAoaSA9IDA7IGkgPCBwYXR0ZXJuLkxlbmd0aDsgaSsrKVxyXG5cdFx0e1xyXG5cdFx0XHRzd2l0Y2ggKHBhdHRlcm5baV0pXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjYXNlICd7JzpcclxuXHRcdFx0XHRcdGlmIChjdXJyZW50VG9rZW4uTGVuZ3RoID09IDApXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0dG9rZW5zLkFkZChuZXcgVG9rZW4oY3VycmVudFRva2VuLCB0cnVlKSk7XHJcblx0XHRcdFx0XHRjdXJyZW50VG9rZW4gPSBcIlwiO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnfSc6XHJcblx0XHRcdFx0XHR0b2tlbnMuQWRkKG5ldyBUb2tlbihjdXJyZW50VG9rZW4sIGZhbHNlKSk7XHJcblx0XHRcdFx0XHRjdXJyZW50VG9rZW4gPSBcIlwiO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdGN1cnJlbnRUb2tlbiArPSBwYXR0ZXJuW2ldO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZighU3RyaW5nLklzTnVsbE9yRW1wdHkoY3VycmVudFRva2VuKSlcclxuXHRcdFx0dG9rZW5zLkFkZChuZXcgVG9rZW4oY3VycmVudFRva2VuLCB0cnVlKSk7XHJcblxyXG5cdFx0aWYgKHRva2Vucy5Db3VudCA9PSAwKVxyXG5cdFx0XHRjb250aW51ZTtcclxuXHJcblx0XHQvL1xyXG5cdFx0Ly8gQ29tcGlsZSB0aGUgdG9rZW5zIGludG8gdGhlIHRyZWVcclxuXHRcdC8vXHJcblxyXG5cdFx0UGF0dGVyblBhdGggcGF0aCA9IG51bGw7XHJcblx0XHREaWN0aW9uYXJ5PFRva2VuLCBQYXR0ZXJuUGF0aD4gcGF0aHMgPSBwYXRoUm9vdDtcclxuXHRcdGZvciAoaSA9IDA7IGkgPCB0b2tlbnMuQ291bnQ7IGkrKylcclxuXHRcdHtcclxuXHRcdFx0VG9rZW4gdG9rZW4gPSB0b2tlbnNbaV07XHJcblx0XHRcdC8vIGNoZWNrIGlmIHRoZSBleGFjdCBzYW1lIG5vZGUgZXhpc3RzIGFuZCB0YWtlIGl0IGlmIGl0IGRvZXNcclxuXHRcdFx0UGF0dGVyblBhdGggbmV4dFBhdGg7XHJcbiNpZiBTQ1JJUFRTSEFSUFxyXG5cdFx0XHRpZiAoKG5leHRQYXRoID0gRGljdGlvbmFyeVV0aWxzLlRyeUdldFBhdGgocGF0aHMsIHRva2VuKSkgPT0gbnVsbClcclxuXHRcdFx0XHQjZWxzZVxyXG5cdFx0XHRpZiAoIXBhdGhzLlRyeUdldFZhbHVlKHRva2VuLCBvdXQgbmV4dFBhdGgpKVxyXG5cdFx0I2VuZGlmXHJcblx0XHRcdHtcclxuXHRcdFx0XHRuZXh0UGF0aCA9IG5ldyBQYXR0ZXJuUGF0aCgpO1xyXG5cdFx0XHRcdHBhdGhzW3Rva2VuXSA9IG5leHRQYXRoO1xyXG5cdFx0XHR9XHJcblx0XHRcdHBhdGggPSBuZXh0UGF0aDtcclxuXHRcdFx0cGF0aHMgPSBuZXh0UGF0aC5QYXRocztcclxuXHRcdH1cclxuXHRcdGlmIChwYXRoICE9IG51bGwpXHJcblx0XHR7XHJcblx0XHRcdGlmIChwYXRoLk1hdGNoZWRQYXR0ZXJucyA9PSBudWxsKVxyXG5cdFx0XHRcdHBhdGguTWF0Y2hlZFBhdHRlcm5zID0gbmV3IExpc3Q8SW50MzI+KCk7XHJcblx0XHRcdGlmICghcGF0aC5NYXRjaGVkUGF0dGVybnMuQ29udGFpbnModGFyZ2V0SW5kZXgpKVxyXG5cdFx0XHRcdHBhdGguTWF0Y2hlZFBhdHRlcm5zLkFkZCh0YXJnZXRJbmRleCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuLy8vIDxzdW1tYXJ5PlxyXG4vLy8gTWF0Y2ggdGhlIHZhbHVlIGFnYWluc3QgYWxsIHBhdHRlcm5zIGFuZCByZXR1cm4gdGhlIG9uZXMgdGhhdCBmaXRcclxuLy8vIDwvc3VtbWFyeT5cclxuLy8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj48L3BhcmFtPlxyXG4vLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG5wdWJsaWMgTGlzdDxPYmplY3Q+IE1hdGNoKFN0cmluZyB2YWx1ZSlcclxue1xyXG5cdHJldHVybiBNYXRjaChuZXcgUGF0dGVybkNvbnRleHQoKSwgdmFsdWUpO1xyXG59XHJcblxyXG4vLy8gPHN1bW1hcnk+XHJcbi8vLyBNYXRjaCB0aGUgdmFsdWUgYWdhaW5zdCBhbGwgcGF0dGVybnMgYW5kIHJldHVybiB0aGUgb25lcyB0aGF0IGZpdFxyXG4vLy8gPC9zdW1tYXJ5PlxyXG4vLy8gPHBhcmFtIG5hbWU9XCJjb250ZXh0XCI+VGhlIGN1cnJlbnQgY29udGV4dCBmb3IgbWF0Y2hpbmc8L3BhcmFtPlxyXG4vLy8gPHBhcmFtIG5hbWU9XCJ2YWx1ZVwiPjwvcGFyYW0+XHJcbi8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcbnB1YmxpYyBMaXN0PE9iamVjdD4gTWF0Y2goUGF0dGVybkNvbnRleHQgY29udGV4dCwgU3RyaW5nIHZhbHVlKVxyXG57XHJcblx0TGlzdDxPYmplY3Q+IHJlc3VsdHMgPSBuZXcgTGlzdDxPYmplY3Q+KCk7XHJcblx0aWYgKFN0cmluZy5Jc051bGxPckVtcHR5KHZhbHVlKSlcclxuXHRcdHJldHVybiByZXN1bHRzO1xyXG5cclxuXHRPYmplY3Qgc3RhdGUgPSBNYXRjaFN0YXJ0KGNvbnRleHQsIFwiXCIpO1xyXG5cdGZvciAoaW50IGkgPSAwOyBpIDwgdmFsdWUuTGVuZ3RoOyBpKyspXHJcblx0e1xyXG5cdFx0Y2hhciBjID0gdmFsdWVbaV07XHJcblx0XHRpZiAoIU1hdGNoTmV4dChzdGF0ZSwgYykpXHJcblx0XHRcdHJldHVybiByZXN1bHRzO1xyXG5cdH1cclxuXHJcblx0cmVzdWx0cyA9IE1hdGNoUmVzdWx0cyhzdGF0ZSk7XHJcblx0Ly8gcmV2ZXJzZSByZXN1bHRzIHNpbmNlIHRoZSBsb25nZXN0IG1hdGNoZXMgd2lsbCBiZSBmb3VuZCBsYXN0IGJ1dCBhcmUgdGhlIG1vc3Qgc3BlY2lmaWNcclxuXHRyZXN1bHRzLlJldmVyc2UoKTtcclxuXHRyZXR1cm4gcmVzdWx0cztcclxufVxyXG5cclxuXHJcbi8vLyA8c3VtbWFyeT5cclxuLy8vIEJlZ2luIGEgcGFyc2luZyBzZXNzaW9uXHJcbi8vLyA8L3N1bW1hcnk+XHJcbi8vLyA8cGFyYW0gbmFtZT1cImNvbnRleHRcIj48L3BhcmFtPlxyXG4vLy8gPHBhcmFtIG5hbWU9XCJtYXRjaFRhZ1wiPjwvcGFyYW0+XHJcbi8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcbnB1YmxpYyBPYmplY3QgTWF0Y2hTdGFydChQYXR0ZXJuQ29udGV4dCBjb250ZXh0LCBTdHJpbmcgbWF0Y2hUYWcpXHJcbntcclxuXHREaWN0aW9uYXJ5PFRva2VuLCBQYXR0ZXJuUGF0aD4gcm9vdHM7XHJcbiNpZiBTQ1JJUFRTSEFSUFxyXG5cdGlmICgocm9vdHMgPSBEaWN0aW9uYXJ5VXRpbHMuVHJ5R2V0UGF0dGVyblBhdGgoY29tcGlsZWRQYXR0ZXJucywgbWF0Y2hUYWcpKSA9PSBudWxsKVxyXG5cdFx0I2Vsc2VcclxuXHRpZiAoIXRoaXMuY29tcGlsZWRQYXR0ZXJucy5UcnlHZXRWYWx1ZShtYXRjaFRhZywgb3V0IHJvb3RzKSlcclxuI2VuZGlmXHJcblx0cmV0dXJuIG51bGw7XHJcblxyXG5cdE1hdGNoU3RhdGUgc3RhdGUgPSBuZXcgTWF0Y2hTdGF0ZSgpO1xyXG5cdHN0YXRlLk1hdGNoVGFnID0gbWF0Y2hUYWc7XHJcblx0c3RhdGUuQ29udGV4dCA9IGNvbnRleHQgPz8gbmV3IFBhdHRlcm5Db250ZXh0KCk7XHJcblxyXG5cdFBhdHRlcm5QYXRoIHJvb3QgPSBuZXcgUGF0dGVyblBhdGgoKTtcclxuXHRyb290LlBhdGhzID0gcm9vdHM7XHJcblx0UGF0aE5vZGUgc3RhcnROb2RlID0gbmV3IFBhdGhOb2RlKG51bGwsIHJvb3QsIFwiXCIpO1xyXG5cdHN0YXRlLkNhbmRpZGF0ZVBhdGhzLkFkZChzdGFydE5vZGUpO1xyXG5cclxuXHRyZXR1cm4gc3RhdGU7XHJcbn1cclxuXHJcbi8vLyA8c3VtbWFyeT5cclxuLy8vIE1hdGNoIHRoZSBuZXh0IGNoYXJhY3RlclxyXG4vLy8gPC9zdW1tYXJ5PlxyXG4vLy8gPHBhcmFtIG5hbWU9XCJjdXJyZW50U3RhdGVcIj5UaGUgY3VycmVudCBtYXRjaGluZyBzdGF0ZTwvcGFyYW0+XHJcbi8vLyA8cGFyYW0gbmFtZT1cImNcIj5UaGUgbmV4dCBjaGFyYWN0ZXI8L3BhcmFtPlxyXG4vLy8gPHJldHVybnM+UmV0dXJucyB0cnVlIGlmIHRoaXMgaXMgc3RpbGwgYSB2YWxpZCBtYXRjaCwgZmFsc2Ugb3RoZXJ3aXNlPC9yZXR1cm5zPlxyXG5wdWJsaWMgQm9vbGVhbiBNYXRjaE5leHQoT2JqZWN0IGN1cnJlbnRTdGF0ZSwgQ2hhciBjKVxyXG57XHJcblx0TWF0Y2hTdGF0ZSBzdGF0ZSA9IGN1cnJlbnRTdGF0ZSBhcyAgTWF0Y2hTdGF0ZTtcclxuXHRpZiAoc3RhdGUgPT0gbnVsbClcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0TGlzdDxQYXRoTm9kZT4gY2FuZGlkYXRlUGF0aHMgPSBzdGF0ZS5DYW5kaWRhdGVQYXRocztcclxuXHRMaXN0PFBhdGhOb2RlPiBuZXdDYW5kaWRhdGVzID0gc3RhdGUuTmV3Q2FuZGlkYXRlcztcclxuXHRmb3IgKEludDMyIGkgPSAwOyBpIDwgY2FuZGlkYXRlUGF0aHMuQ291bnQ7IGkrKylcclxuXHR7XHJcblx0XHRQYXRoTm9kZSBjYW5kaWRhdGUgPSBjYW5kaWRhdGVQYXRoc1tpXTtcclxuXHJcblx0XHQvLyBmaXJzdCBjaGVjayBpZiBhbnkgb2YgdGhlIGNoaWxkIG5vZGVzIHZhbGlkYXRlIHdpdGggdGhlIG5ldyBjaGFyYWN0ZXIgYW5kIHJlbWVtYmVyIHRoZW0gYXMgY2FuZGlkYXRlc1xyXG5cdFx0Ly8gYW55IGNoaWxkcmVuIGNhbiBvbmx5IGJlIGNhbmRpZGF0ZXMgaWYgdGhlIGZpbmFsIHZhbGlkYXRpb24gb2YgdGhlIGN1cnJlbnQgdmFsdWUgc3VjY2VlZHNcclxuXHRcdGlmIChjYW5kaWRhdGUuVG9rZW4gPT0gbnVsbCB8fCBWYWxpZGF0ZVRva2VuKHN0YXRlLkNvbnRleHQsIGNhbmRpZGF0ZSwgdHJ1ZSkpXHJcblx0XHRcdFZhbGlkYXRlQ2hpbGRyZW4oc3RhdGUuQ29udGV4dCwgY2FuZGlkYXRlLlBhdGguUGF0aHMsIGNhbmRpZGF0ZSwgYy5Ub1N0cmluZyhDdWx0dXJlSW5mby5JbnZhcmlhbnRDdWx0dXJlKSwgbmV3Q2FuZGlkYXRlcywgMCk7XHJcblxyXG5cdFx0Ly8gdG9rZW4gY2FuIGJlIG51bGwgZm9yIHRoZSByb290IG5vZGUgYnV0IG5vIHZhbGlkYXRpb24gbmVlZHMgdG8gYmUgZG9uZSBmb3IgdGhhdFxyXG5cdFx0aWYgKGNhbmRpZGF0ZS5Ub2tlbiAhPSBudWxsKVxyXG5cdFx0e1xyXG5cdFx0XHQvLyB2YWxpZGF0ZSB0aGlzIGNhbmRpZGF0ZSBhbmQgcmVtb3ZlIGl0IGlmIGl0IGRvZXNuJ3QgdmFsaWRhdGUgYW55bW9yZVxyXG5cdFx0XHRjYW5kaWRhdGUuSXNGaW5hbGl6ZWQgPSBmYWxzZTtcclxuXHRcdFx0Y2FuZGlkYXRlLlRleHRWYWx1ZSArPSBjO1xyXG5cdFx0XHRpZiAoVmFsaWRhdGVUb2tlbihzdGF0ZS5Db250ZXh0LCBjYW5kaWRhdGUsIGZhbHNlKSlcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdH1cclxuXHRcdGNhbmRpZGF0ZVBhdGhzLlJlbW92ZUF0KGktLSk7XHJcblx0fVxyXG5cdGNhbmRpZGF0ZVBhdGhzLkFkZFJhbmdlKG5ld0NhbmRpZGF0ZXMpO1xyXG5cdG5ld0NhbmRpZGF0ZXMuQ2xlYXIoKTtcclxuXHJcblx0cmV0dXJuIGNhbmRpZGF0ZVBhdGhzLkNvdW50ID4gMDtcclxufVxyXG5cclxuXHJcbi8vLyA8c3VtbWFyeT5cclxuLy8vIEFzc2VtYmxlIHRoZSByZXN1bHRzIGFmdGVyIHRoZSBsYXN0IGNoYXJhY3RlciBoYXMgYmVlbiBtYXRjaGVkXHJcbi8vLyA8L3N1bW1hcnk+XHJcbi8vLyA8cGFyYW0gbmFtZT1cImN1cnJlbnRTdGF0ZVwiPjwvcGFyYW0+XHJcbi8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcbnB1YmxpYyBCb29sZWFuIEhhc1Jlc3VsdHMoT2JqZWN0IGN1cnJlbnRTdGF0ZSlcclxue1xyXG5cdE1hdGNoU3RhdGUgc3RhdGUgPSBjdXJyZW50U3RhdGUgYXMgTWF0Y2hTdGF0ZTtcclxuXHRpZiAoc3RhdGUgPT0gbnVsbClcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0TGlzdDxQYXRoTm9kZT4gY2FuZGlkYXRlUGF0aHMgPSBzdGF0ZS5DYW5kaWRhdGVQYXRocztcclxuXHJcblx0aWYgKCF0aGlzLnBhdHRlcm5zLkNvbnRhaW5zS2V5KHN0YXRlLk1hdGNoVGFnKSlcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0Ly8gZmV0Y2ggcGF0dGVybnMgZm9yIGFsbCBtYXRjaGluZyBjYW5kaWRhdGVzXHJcblx0Zm9yZWFjaCAoUGF0aE5vZGUgcGF0aCBpbiBjYW5kaWRhdGVQYXRocylcclxuXHR7XHJcblx0XHQvLyBkbyBmaW5hbCB2YWxpZGF0aW9uXHJcblx0XHRpZiAoIVZhbGlkYXRlVG9rZW4oc3RhdGUuQ29udGV4dCwgcGF0aCwgdHJ1ZSkpXHJcblx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0Qm9vbGVhbiByZXN1bHQgPSBmYWxzZTtcclxuXHRcdE1hdGNoVG9MYXN0KHBhdGguUGF0aCwgZGVsZWdhdGUgeyByZXN1bHQgPSB0cnVlOyB9LCAwKTtcclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuXHJcbi8vLyA8c3VtbWFyeT5cclxuLy8vIEFzc2VtYmxlIHRoZSByZXN1bHRzIGFmdGVyIHRoZSBsYXN0IGNoYXJhY3RlciBoYXMgYmVlbiBtYXRjaGVkXHJcbi8vLyA8L3N1bW1hcnk+XHJcbi8vLyA8cGFyYW0gbmFtZT1cImN1cnJlbnRTdGF0ZVwiPjwvcGFyYW0+XHJcbi8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcbnB1YmxpYyBMaXN0PE9iamVjdD4gTWF0Y2hSZXN1bHRzKE9iamVjdCBjdXJyZW50U3RhdGUpXHJcbntcclxuXHRMaXN0PE9iamVjdD4gcmVzdWx0cyA9IG5ldyBMaXN0PE9iamVjdD4oKTtcclxuXHJcblx0TWF0Y2hTdGF0ZSBzdGF0ZSA9IGN1cnJlbnRTdGF0ZSBhcyBNYXRjaFN0YXRlO1xyXG5cdGlmIChzdGF0ZSA9PSBudWxsKVxyXG5cdFx0cmV0dXJuIHJlc3VsdHM7XHJcblxyXG5cdExpc3Q8UGF0aE5vZGU+IGNhbmRpZGF0ZVBhdGhzID0gc3RhdGUuQ2FuZGlkYXRlUGF0aHM7XHJcblxyXG5cdC8vIGdldCB0aGUgcGF0dGVybnMgZm9yIHRoaXMgdGFnXHJcblx0TGlzdDxQYXR0ZXJuPiB0YXJnZXRQYXR0ZXJucztcclxuI2lmIFNDUklQVFNIQVJQXHJcblx0aWYgKCh0YXJnZXRQYXR0ZXJucyA9IERpY3Rpb25hcnlVdGlscy5UcnlHZXRQYXR0ZXJucyhwYXR0ZXJucywgc3RhdGUuTWF0Y2hUYWcpKSA9PSBudWxsKVxyXG5cdFx0I2Vsc2VcclxuXHRpZiAoIXRoaXMucGF0dGVybnMuVHJ5R2V0VmFsdWUoc3RhdGUuTWF0Y2hUYWcsIG91dCB0YXJnZXRQYXR0ZXJucykpXHJcbiNlbmRpZlxyXG5cdHJldHVybiByZXN1bHRzO1xyXG5cclxuXHQvLyBmZXRjaCBwYXR0ZXJucyBmb3IgYWxsIG1hdGNoaW5nIGNhbmRpZGF0ZXNcclxuXHRmb3JlYWNoIChQYXRoTm9kZSBwYXRoIGluIGNhbmRpZGF0ZVBhdGhzKVxyXG5cdHtcclxuXHRcdC8vIGRvIGZpbmFsIHZhbGlkYXRpb25cclxuXHRcdGlmICghVmFsaWRhdGVUb2tlbihzdGF0ZS5Db250ZXh0LCBwYXRoLCB0cnVlKSlcclxuXHRcdFx0Y29udGludWU7XHJcblx0XHRGaW5hbGl6ZVZhbHVlKHBhdGgpO1xyXG5cdFx0TGlzdDxPYmplY3Q+IHByZXZpb3VzVmFsdWVzID0gbmV3IExpc3Q8T2JqZWN0PihwYXRoLlByZXZpb3VzVmFsdWVzKTtcclxuXHRcdHByZXZpb3VzVmFsdWVzLkFkZChwYXRoLlZhbHVlKTtcclxuXHRcdE1hdGNoVG9MYXN0KHBhdGguUGF0aCwgZGVsZWdhdGUoUGF0dGVyblBhdGggbWF0Y2gsIEludDMyIGRlcHRoKVxyXG5cdFx0e1xyXG5cdFx0XHQvLyBhZGQgZW1wdHkgdmFsdWVzIGZvciByZW1haW5pbmcgdG9rZW5zXHJcblx0XHRcdE9iamVjdFtdIHZhbHVlcyA9IG5ldyBPYmplY3RbcHJldmlvdXNWYWx1ZXMuQ291bnQgKyBkZXB0aF07XHJcblx0XHRcdGZvciAoSW50MzIgaSA9IDA7IGkgPCBwcmV2aW91c1ZhbHVlcy5Db3VudDsgaSsrKVxyXG5cdFx0XHR2YWx1ZXNbaV0gPSBwcmV2aW91c1ZhbHVlc1tpXTtcclxuXHRcdFx0Zm9yIChJbnQzMiBtID0gMDsgbSA8IG1hdGNoLk1hdGNoZWRQYXR0ZXJucy5Db3VudDsgbSsrKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0UGF0dGVybiBwYXR0ZXJuID0gdGFyZ2V0UGF0dGVybnNbbWF0Y2guTWF0Y2hlZFBhdHRlcm5zW21dXTtcclxuXHRcdFx0XHRPYmplY3QgcmVzdWx0ID0gcGF0dGVybi5QYXJzZShzdGF0ZS5Db250ZXh0LCB2YWx1ZXMpO1xyXG5cdFx0XHRcdC8vIG9ubHkgYWRkIGlmIGl0IGlzIG5vdCBpbiB0aGUgbGlzdCB5ZXRcclxuXHRcdFx0XHRpZiAoIXJlc3VsdHMuQ29udGFpbnMocmVzdWx0KSlcclxuXHRcdFx0XHRcdHJlc3VsdHMuQWRkKHJlc3VsdCk7XHJcblx0XHRcdH1cclxuXHRcdH0sIDApO1xyXG5cdH1cclxuXHRyZXR1cm4gcmVzdWx0cztcclxufVxyXG5cclxucHJpdmF0ZSB2b2lkIFZhbGlkYXRlQ2hpbGRyZW4oUGF0dGVybkNvbnRleHQgY29udGV4dCwgSUVudW1lcmFibGU8S2V5VmFsdWVQYWlyPFRva2VuLCBQYXR0ZXJuUGF0aD4+IHBhdGhzLCBQYXRoTm9kZSBub2RlLCBTdHJpbmcgdmFsLCBMaXN0PFBhdGhOb2RlPiBuZXdDYW5kaWRhdGVzLCBJbnQzMiBkZXB0aClcclxue1xyXG5cdC8vIGZpcnN0IGNoZWNrIGlmIGFueSBvZiB0aGUgY2hpbGQgbm9kZXMgdmFsaWRhdGUgd2l0aCB0aGUgbmV3IGNoYXJhY3RlciBhbmQgcmVtZW1iZXIgdGhlbSBhcyBjYW5kaWRhdGVzXHJcblx0Zm9yZWFjaCAoS2V5VmFsdWVQYWlyPFRva2VuLCBQYXR0ZXJuUGF0aD4gY2hpbGRQYXRoIGluIHBhdGhzKVxyXG5cdHtcclxuXHRcdFBhdGhOb2RlIGNoaWxkTm9kZSA9IG5ldyBQYXRoTm9kZShjaGlsZFBhdGguS2V5LCBjaGlsZFBhdGguVmFsdWUsIHZhbCk7XHJcblx0XHQvLyBpZiB6ZXJvIGNvdW50IGlzIGFsbG93ZWQgaXQgZG9lcyBub3QgbWF0dGVyIHdoZXRoZXIgdGhlIGNoaWxkIHZhbGlkYXRlcyBvciBub3QsIHdlIGFsd2F5cyB0cnkgY2hpbGRyZW4gYXMgd2VsbFxyXG5cdFx0aWYgKGNoaWxkUGF0aC5LZXkuTWluQ291bnQgPT0gMClcclxuXHRcdFx0VmFsaWRhdGVDaGlsZHJlbihjb250ZXh0LCBjaGlsZFBhdGguVmFsdWUuUGF0aHMsIG5vZGUsIHZhbCwgbmV3Q2FuZGlkYXRlcywgZGVwdGggKyAxKTtcclxuXHRcdGlmICghVmFsaWRhdGVUb2tlbihjb250ZXh0LCBjaGlsZE5vZGUsIGZhbHNlKSlcclxuXHRcdHtcclxuXHRcdFx0Ly8gdG9rZW4gZGlkIG5vdCB2YWxpZGF0ZSBidXQgMCBjb3VudCBpcyBhbGxvd2VkXHJcblx0XHRcdC8vaWYgKGNoaWxkUGF0aC5LZXkuTWluQ291bnQgPT0gMClcclxuXHRcdFx0Ly9cdFZhbGlkYXRlQ2hpbGRyZW4oY2hpbGRQYXRoLlZhbHVlLlBhdGhzLCBub2RlLCB2YWwsIG5ld0NhbmRpZGF0ZXMsIGRlcHRoICsgMSk7XHJcblx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHZhbGlkYXRlZCBzdWNjZXNzZnVsbHkgc28gYWRkIGEgbmV3IGNhbmRpZGF0ZVxyXG5cdFx0Ly8gYWRkIGVtcHR5IHZhbHVlcyBmb3IgYWxsIHNraXBwZWQgdG9rZW5zXHJcblx0XHRjaGlsZE5vZGUuUHJldmlvdXNWYWx1ZXMuQWRkUmFuZ2Uobm9kZS5QcmV2aW91c1ZhbHVlcyk7XHJcblx0XHRpZiAobm9kZS5Ub2tlbiAhPSBudWxsKVxyXG5cdFx0e1xyXG5cdFx0XHRGaW5hbGl6ZVZhbHVlKG5vZGUpO1xyXG5cdFx0XHRjaGlsZE5vZGUuUHJldmlvdXNWYWx1ZXMuQWRkKG5vZGUuVmFsdWUpO1xyXG5cdFx0fVxyXG5cdFx0Zm9yIChJbnQzMiBpID0gMDsgaSA8IGRlcHRoOyBpKyspXHJcblx0XHRjaGlsZE5vZGUuUHJldmlvdXNWYWx1ZXMuQWRkKG51bGwpO1xyXG5cdFx0bmV3Q2FuZGlkYXRlcy5BZGQoY2hpbGROb2RlKTtcclxuXHR9XHJcbn1cclxuXHJcbnByaXZhdGUgdm9pZCBNYXRjaFRvTGFzdChQYXR0ZXJuUGF0aCBwYXRoLCBBY3Rpb248UGF0dGVyblBhdGgsIEludDMyPiBhZGQsIEludDMyIGRlcHRoKVxyXG57XHJcblx0aWYgKHBhdGguTWF0Y2hlZFBhdHRlcm5zICE9IG51bGwpXHJcblx0XHRhZGQocGF0aCwgZGVwdGgpO1xyXG5cdC8vIGNoZWNrIGNoaWxkcmVuIGlmIHRoZXkgYWxsb3cgMCBsZW5ndGggYXMgd2VsbFxyXG5cdGZvcmVhY2ggKEtleVZhbHVlUGFpcjxUb2tlbiwgUGF0dGVyblBhdGg+IGNoaWxkUGF0aCBpbiBwYXRoLlBhdGhzKVxyXG5cdHtcclxuXHRcdGlmIChjaGlsZFBhdGguS2V5Lk1pbkNvdW50ID4gMClcclxuXHRcdFx0Y29udGludWU7XHJcblx0XHRNYXRjaFRvTGFzdChjaGlsZFBhdGguVmFsdWUsIGFkZCwgZGVwdGggKyAxKTtcclxuXHR9XHJcblxyXG59XHJcblxyXG5cclxuLy8vIDxzdW1tYXJ5PlxyXG4vLy8gUmVnaXN0ZXIgYSB2YWxpZGF0aW9uIG9iamVjdCBmb3IgdGhlIHRhZ1xyXG4vLy8gPC9zdW1tYXJ5PlxyXG4vLy8gPHBhcmFtIG5hbWU9XCJ0YWdcIj48L3BhcmFtPlxyXG4vLy8gPHBhcmFtIG5hbWU9XCJ2YWxpZGF0b3JcIj48L3BhcmFtPlxyXG5wdWJsaWMgdm9pZCBSZWdpc3RlclZhbGlkYXRvcihTdHJpbmcgdGFnLCBJVG9rZW5WYWxpZGF0b3IgdmFsaWRhdG9yKVxyXG57XHJcblx0dGhpcy52YWxpZGF0b3JzW3RhZ10gPSB2YWxpZGF0b3I7XHJcbn1cclxuXHJcblxyXG5cclxucHJpdmF0ZSBCb29sZWFuIFZhbGlkYXRlQ291bnQoVG9rZW4gdG9rZW4sIFN0cmluZyB2YWx1ZSwgQm9vbGVhbiBpc0ZpbmFsKVxyXG57XHJcblx0cmV0dXJuICghaXNGaW5hbCB8fCB2YWx1ZS5MZW5ndGggPj0gdG9rZW4uTWluQ291bnQpICYmIHZhbHVlLkxlbmd0aCA8PSB0b2tlbi5NYXhDb3VudDtcclxufVxyXG5cclxuLy8vIDxzdW1tYXJ5PlxyXG4vLy8gQWRkIHRoZSBuZXh0IGNoYXJhY3RlciB0byB0aGUgbWF0Y2hlZCBwYXRoXHJcbi8vLyA8L3N1bW1hcnk+XHJcbi8vLyA8cGFyYW0gbmFtZT1cImNvbnRleHRcIj5UaGUgY3VycmVudCBtYXRjaGluZyBjb250ZXh0PC9wYXJhbT5cclxuLy8vIDxwYXJhbSBuYW1lPVwibm9kZVwiPlRoZSBub2RlIHdlIGFyZSB2YWxpZGF0aW5nPC9wYXJhbT5cclxuLy8vIDxwYXJhbSBuYW1lPVwiaXNGaW5hbFwiPlRydWUgaWYgdGhpcyBpcyB0aGUgZmluYWwgbWF0Y2ggYW5kIG5vIGZ1cnRoZXIgdmFsdWVzIHdpbGwgYmUgYWRkZWQ8L3BhcmFtPlxyXG4vLy8gPHJldHVybnM+UmV0dXJucyB0cnVlIGlmIHRoZSB2YWx1ZSBjYW4gYmUgcGFyc2VkIHN1Y2Nlc3NmdWxseSB1c2luZyB0aGUgdG9rZW48L3JldHVybnM+XHJcbnByaXZhdGUgQm9vbGVhbiBWYWxpZGF0ZVRva2VuKFBhdHRlcm5Db250ZXh0IGNvbnRleHQsIFBhdGhOb2RlIG5vZGUsIEJvb2xlYW4gaXNGaW5hbClcclxue1xyXG5cdC8vIGlmIGl0IGlzIGZpbmFsemVkIHRoZW4gaXQgaXMgZGVmaW5pdGVseSBhbHNvIHZhbGlkXHJcblx0aWYgKG5vZGUuSXNGaW5hbGl6ZWQpXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHJcblx0VG9rZW4gdG9rZW4gPSBub2RlLlRva2VuO1xyXG5cdFN0cmluZyB0ZXh0VmFsdWUgPSBub2RlLlRleHRWYWx1ZTtcclxuXHJcblx0Ly8gbWF0Y2ggZXhhY3QgdmFsdWVzIGZpcnN0XHJcblx0aWYgKFN0cmluZy5Jc051bGxPckVtcHR5KHRleHRWYWx1ZSkpXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0aWYgKHRva2VuLkV4YWN0TWF0Y2gpXHJcblx0XHRyZXR1cm4gKChpc0ZpbmFsICYmIHRva2VuLlZhbHVlID09IHRleHRWYWx1ZSkgfHwgKCFpc0ZpbmFsICYmIHRva2VuLlZhbHVlLlN0YXJ0c1dpdGgodGV4dFZhbHVlKSkpO1xyXG5cclxuXHQvLyB0ZXN0IGluYnVpbHQgdG9rZW5zIGZpcnN0XHJcblx0c3dpdGNoICh0b2tlbi5WYWx1ZSlcclxuXHR7XHJcblx0XHQvLyB3aGl0ZXNwYWNlXHJcblx0XHRjYXNlIFwiIFwiOlxyXG5cdFx0XHRyZXR1cm4gVmFsaWRhdGVDb3VudCh0b2tlbiwgdGV4dFZhbHVlLCBpc0ZpbmFsKSAmJiBTdHJpbmdVdGlscy5NYXRjaEFsbCh0ZXh0VmFsdWUsIFwiIFxcdFwiKTtcclxuXHRcdGNhc2UgXCJuZXdsaW5lXCI6XHJcblx0XHRcdHJldHVybiBWYWxpZGF0ZUNvdW50KHRva2VuLCB0ZXh0VmFsdWUsIGlzRmluYWwpICYmIFN0cmluZ1V0aWxzLk1hdGNoQWxsKHRleHRWYWx1ZSwgXCJcXHJcXG5cIik7XHJcblx0XHRjYXNlIFwiZW1wdHlsaW5lXCI6XHJcblx0XHRcdHJldHVybiBWYWxpZGF0ZUNvdW50KHRva2VuLCB0ZXh0VmFsdWUsIGlzRmluYWwpICYmIFN0cmluZ1V0aWxzLk1hdGNoQWxsKHRleHRWYWx1ZSwgXCJcXHJcXG4gXFx0XCIpO1xyXG5cdFx0Y2FzZSBcImxldHRlclwiOlxyXG5cdFx0XHRyZXR1cm4gVmFsaWRhdGVDb3VudCh0b2tlbiwgdGV4dFZhbHVlLCBpc0ZpbmFsKSAmJiBTdHJpbmdVdGlscy5NYXRjaEFsbCh0ZXh0VmFsdWUsIExldHRlckNoYXJhY3RlcnMpO1xyXG5cdFx0Y2FzZSBcImFueVwiOlxyXG5cdFx0XHRyZXR1cm4gVmFsaWRhdGVDb3VudCh0b2tlbiwgdGV4dFZhbHVlLCBpc0ZpbmFsKTtcclxuXHR9XHJcblxyXG5cdC8vIGNoZWNrIHBhdHRlcm4gdGFncyBhbmQgZG8gYSBzdWIgbWF0Y2ggZm9yIGVhY2ggb2YgdGhlbVxyXG5cdGlmICh0aGlzLmNvbXBpbGVkUGF0dGVybnMuQ29udGFpbnNLZXkodG9rZW4uVmFsdWUpKVxyXG5cdHtcclxuXHRcdC8vIHN1YiBtYXRjaGluZyBpcyBwb3NzaWJsZSwgc28gc3RhcnQgYSBuZXcgb25lIG9yIGNvbnRpbnVlIHRoZSBwcmV2aW91cyBvbmVcclxuXHRcdGlmIChub2RlLk1hdGNoU3RhdGUgPT0gbnVsbClcclxuXHRcdFx0bm9kZS5NYXRjaFN0YXRlID0gTWF0Y2hTdGFydChjb250ZXh0LCB0b2tlbi5WYWx1ZSk7XHJcblx0XHQvLyBpZiB0aGlzIGlzIHRoZSBsYXN0IG1hdGNoIHRoZW4gYXNzZW1ibGUgdGhlIHJlc3VsdHNcclxuXHRcdGlmIChpc0ZpbmFsKVxyXG5cdFx0XHRyZXR1cm4gSGFzUmVzdWx0cyhub2RlLk1hdGNoU3RhdGUpO1xyXG5cdFx0cmV0dXJuIE1hdGNoTmV4dChub2RlLk1hdGNoU3RhdGUsIHRleHRWYWx1ZVt0ZXh0VmFsdWUuTGVuZ3RoIC0gMV0pO1xyXG5cdH1cclxuXHJcblx0Ly8gY2hlY2sgaWYgYSB2YWxpZGF0b3IgaXMgcmVnaXN0ZXJlZCBmb3IgdGhpcyB0b2tlblxyXG5cdElUb2tlblZhbGlkYXRvciB2YWxpZGF0b3I7XHJcbiNpZiBTQ1JJUFRTSEFSUFxyXG5cdGlmICgodmFsaWRhdG9yID0gRGljdGlvbmFyeVV0aWxzLlRyeUdldFZhbGlkYXRvcnModmFsaWRhdG9ycywgdG9rZW4uVmFsdWUpKSA9PSBudWxsKVxyXG5cdFx0I2Vsc2VcclxuXHRpZiAoIXRoaXMudmFsaWRhdG9ycy5UcnlHZXRWYWx1ZSh0b2tlbi5WYWx1ZSwgb3V0IHZhbGlkYXRvcikpXHJcbiNlbmRpZlxyXG5cdHJldHVybiBmYWxzZTtcclxuXHJcblx0cmV0dXJuIHZhbGlkYXRvci5WYWxpZGF0ZVRva2VuKHRva2VuLCB0ZXh0VmFsdWUsIGlzRmluYWwpO1xyXG59XHJcblxyXG5cclxuLy8vIDxzdW1tYXJ5PlxyXG4vLy8gUGFyc2VzIHRoZSBUZXh0VmFsdWUgb2YgdGhlIG5vZGUgaW50byB0aGUgZmluYWwgdmFsdWVcclxuLy8vIDwvc3VtbWFyeT5cclxuLy8vIDxwYXJhbSBuYW1lPVwibm9kZVwiPjwvcGFyYW0+XHJcbi8vLyA8cmV0dXJucz5SZXR1cm5zIHRydWUgaWYgc3VjY2Vzc2Z1bCwgZmFsc2UgaWYgdGhlIFRleHRWYWx1ZSBpcyBub3QgdmFsaWQ8L3JldHVybnM+XHJcbnByaXZhdGUgdm9pZCBGaW5hbGl6ZVZhbHVlKFBhdGhOb2RlIG5vZGUpXHJcbntcclxuXHQvLyBhbHJlYWR5IGZpbmFsaXplZFxyXG5cdGlmIChub2RlLklzRmluYWxpemVkKVxyXG5cdFx0cmV0dXJuO1xyXG5cclxuXHRUb2tlbiB0b2tlbiA9IG5vZGUuVG9rZW47XHJcblx0U3RyaW5nIHRleHRWYWx1ZSA9IG5vZGUuVGV4dFZhbHVlO1xyXG5cclxuXHRpZiAodG9rZW4uRXhhY3RNYXRjaCB8fCB0b2tlbi5WYWx1ZSA9PSBcIiBcIiB8fCB0b2tlbi5WYWx1ZSA9PSBcIm5ld2xpbmVcIiB8fCB0b2tlbi5WYWx1ZSA9PSBcImVtcHR5bGluZVwiIHx8IHRva2VuLlZhbHVlID09IFwibGV0dGVyXCIpXHJcblx0e1xyXG5cdFx0bm9kZS5WYWx1ZSA9IHRleHRWYWx1ZTtcclxuXHRcdG5vZGUuSXNGaW5hbGl6ZWQgPSB0cnVlO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0Ly8gY2hlY2sgcGF0dGVybiB0YWdzIGFuZCBkbyBhIHN1YiBtYXRjaCBmb3IgZWFjaCBvZiB0aGVtXHJcblx0aWYgKHRoaXMuY29tcGlsZWRQYXR0ZXJucy5Db250YWluc0tleSh0b2tlbi5WYWx1ZSkgJiYgbm9kZS5NYXRjaFN0YXRlICE9IG51bGwpXHJcblx0e1xyXG5cdFx0bm9kZS5WYWx1ZSA9IG51bGw7XHJcblx0XHRMaXN0PE9iamVjdD4gcmVzdWx0cyA9IE1hdGNoUmVzdWx0cyhub2RlLk1hdGNoU3RhdGUpO1xyXG5cdFx0aWYgKHJlc3VsdHMuQ291bnQgPT0gMClcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0Ly8gVE9ETzogY2FuIGJlIG11bHRpcGxlIHJlc3VsdHMsIGNob29zZSB0aGUgY29ycmVjdCBvbmUgZGVwZW5kaW5nIG9uIHVzZXIgY3VsdHVyZVxyXG5cdFx0bm9kZS5WYWx1ZSA9IHJlc3VsdHNbMF07XHJcblx0XHRub2RlLklzRmluYWxpemVkID0gdHJ1ZTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vIGNoZWNrIGlmIGEgdmFsaWRhdG9yIGlzIHJlZ2lzdGVyZWQgZm9yIHRoaXMgdG9rZW5cclxuXHRJVG9rZW5WYWxpZGF0b3IgdmFsaWRhdG9yO1xyXG4jaWYgU0NSSVBUU0hBUlBcclxuXHRpZiAoKHZhbGlkYXRvciA9IERpY3Rpb25hcnlVdGlscy5UcnlHZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRva2VuLlZhbHVlKSkgIT0gbnVsbClcclxuXHRcdCNlbHNlXHJcblx0aWYgKHRoaXMudmFsaWRhdG9ycy5UcnlHZXRWYWx1ZSh0b2tlbi5WYWx1ZSwgb3V0IHZhbGlkYXRvcikpXHJcbiNlbmRpZlxyXG5cdHtcclxuXHRcdG5vZGUuVmFsdWUgPSB2YWxpZGF0b3IuRmluYWxpemVWYWx1ZSh0b2tlbiwgdGV4dFZhbHVlKTtcclxuXHRcdG5vZGUuSXNGaW5hbGl6ZWQgPSB0cnVlO1xyXG5cdH1cclxufVxyXG59XHJcbiovXHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvUGF0dGVybk1hdGNoZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcclxuICogSG9sZHMgc3RhdGUgZm9yIGEgbWF0Y2hpbmcgc2Vzc2lvblxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBNYXRjaFN0YXRlID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5tYXRjaFRhZyA9IG51bGw7XHJcblx0dGhpcy5jYW5kaWRhdGVQYXRocyA9IFtdO1xyXG5cdHRoaXMubmV3Q2FuZGlkYXRlcyA9IFtdO1xyXG5cclxuXHR0aGlzLmNvbnRleHQgPSBudWxsO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaFN0YXRlO1xyXG5cclxuLypcclxuXHRpbnRlcm5hbCBjbGFzcyBNYXRjaFN0YXRlXHJcblx0e1xyXG5cdFx0cHVibGljIFN0cmluZyBNYXRjaFRhZztcclxuXHRcdHB1YmxpYyBMaXN0PFBhdGhOb2RlPiBDYW5kaWRhdGVQYXRocyA9IG5ldyBMaXN0PFBhdGhOb2RlPigpO1xyXG5cdFx0cHVibGljIExpc3Q8UGF0aE5vZGU+IE5ld0NhbmRpZGF0ZXMgPSBuZXcgTGlzdDxQYXRoTm9kZT4oKTtcclxuXHJcblx0XHRwdWJsaWMgUGF0dGVybkNvbnRleHQgQ29udGV4dCB7IGdldDsgc2V0OyB9XHJcblx0fVxyXG4qL1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL01hdGNoU3RhdGUuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcclxuICogQ3JlYXRlZCBieSBKZW5zIG9uIDI2LjA2LjIwMTUuXHJcbiAqIFByb3ZpZGVzIHV0aWxpdGllcyBmb3IgYXJyYXlzIHN1Y2ggYXMgY2hlY2tpbmcgd2hldGhlciBhbiBvYmplY3Qgc3VwcG9ydGluZyB0aGUgRXF1YWxzIGludGVyZmFjZSBpcyBjb250YWluZWRcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgYXJyYXlVdGlscyA9IHtcclxuXHQvKipcclxuXHQgKiBDaGVja3Mgd2hldGhlciB0aGUgYXJyYXkgY29udGFpbnMgb2JqIHVzaW5nIGEgY3VzdG9tIGNvbXBhcmVyIGlmIGF2YWlsYWJsZVxyXG5cdCAqIEBwYXJhbSBhciB7e2VxdWFsczogZnVuY3Rpb259W119XHJcblx0ICogQHBhcmFtIG9iaiB7e2VxdWFsczogZnVuY3Rpb259fVxyXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxyXG5cdCAqL1xyXG5cdGNvbnRhaW5zOiBmdW5jdGlvbihhciwgb2JqKSB7XHJcblx0XHRpZiAoIWFyKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHQvLyBjaGVjayBzdHJpY3QgZXF1YWxpdHkgZmlyc3QsIHNob3VsZCBiZSBmYXN0ZXN0XHJcblx0XHRpZiAoYXIuaW5kZXhPZihvYmopICE9PSAtMSlcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblxyXG5cdFx0dmFyIGhhc0VxdWFscyA9ICghIW9iaiAmJiB0eXBlb2Ygb2JqLmVxdWFscyA9PT0gJ2Z1bmN0aW9uJyk7XHJcblxyXG5cdFx0Ly8gY2hlY2sgYWxsIGVsZW1lbnRzXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBvdGhlciA9IGFyW2ldO1xyXG5cdFx0XHR2YXIgcmVzdWx0O1xyXG5cdFx0XHRpZiAoaGFzRXF1YWxzKVxyXG5cdFx0XHRcdHJlc3VsdCA9IG9iai5lcXVhbHMob3RoZXIpO1xyXG5cdFx0XHRlbHNlIGlmICh0eXBlb2Ygb3RoZXIuZXF1YWxzID09PSAnZnVuY3Rpb24nKVxyXG5cdFx0XHRcdHJlc3VsdCA9IG90aGVyLmVxdWFscyhvYmopO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmVzdWx0ID0gKG9iaiA9PT0gb3RoZXIpO1xyXG5cdFx0XHRpZiAocmVzdWx0KVxyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYXJyYXlVdGlscztcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlscy9hcnJheVV0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXHJcbiAqIFRva2VuIHZhbHVlIGZvciBwYXJzZWQgcGF0dGVybnNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhIG5ldyBUb2tlblxyXG4gKiBAcGFyYW0gdmFsdWUge3N0cmluZ31cclxuICogQHBhcmFtIGV4YWN0TWF0Y2gge2Jvb2xlYW59XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxudmFyIFRva2VuID0gZnVuY3Rpb24odmFsdWUsIGV4YWN0TWF0Y2gpIHtcclxuXHR0aGlzLmV4YWN0TWF0Y2ggPSAhIWV4YWN0TWF0Y2g7XHJcblx0aWYgKHRoaXMuZXhhY3RNYXRjaClcclxuXHR7XHJcblx0XHR0aGlzLnZhbHVlID0gdmFsdWU7XHJcblx0XHR0aGlzLm1pbkNvdW50ID0gdGhpcy5tYXhDb3VudCA9IDE7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHR2YXIgcGFydHMgPSAodmFsdWUgfHwgJycpLnNwbGl0KCc6Jyk7XHJcblx0dGhpcy52YWx1ZSA9IChwYXJ0cy5sZW5ndGggPiAwID8gcGFydHNbMF0gOiAnJyk7XHJcblx0aWYgKHBhcnRzLmxlbmd0aCA9PT0gMSlcclxuXHRcdHRoaXMubWluQ291bnQgPSB0aGlzLm1heENvdW50ID0gMTtcclxuXHRlbHNlIGlmIChwYXJ0cy5sZW5ndGggPiAxKVxyXG5cdHtcclxuXHRcdHN3aXRjaCAocGFydHNbMV0pXHJcblx0XHR7XHJcblx0XHRcdGNhc2UgJyc6XHJcblx0XHRcdFx0dGhpcy5taW5Db3VudCA9IDE7XHJcblx0XHRcdFx0dGhpcy5tYXhDb3VudCA9IDE7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJysnOlxyXG5cdFx0XHRcdHRoaXMubWluQ291bnQgPSAxO1xyXG5cdFx0XHRcdHRoaXMubWF4Q291bnQgPSB0aGlzLk1BWF9WQUxVRTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnKic6XHJcblx0XHRcdFx0dGhpcy5taW5Db3VudCA9IDA7XHJcblx0XHRcdFx0dGhpcy5tYXhDb3VudCA9IHRoaXMuTUFYX1ZBTFVFO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICc/JzpcclxuXHRcdFx0XHR0aGlzLm1pbkNvdW50ID0gMDtcclxuXHRcdFx0XHR0aGlzLm1heENvdW50ID0gMTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHR2YXIgY291bnRQYXJ0cyA9IHBhcnRzWzFdLnNwbGl0KCctJyk7XHJcblx0XHRcdFx0aWYgKGNvdW50UGFydHMubGVuZ3RoID09PSAxKVxyXG5cdFx0XHRcdFx0dGhpcy5taW5Db3VudCA9IHRoaXMubWF4Q291bnQgPSBwYXJzZUludChjb3VudFBhcnRzWzBdKTtcclxuXHRcdFx0XHRlbHNlIGlmIChjb3VudFBhcnRzLmxlbmd0aCA+PSAyKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHRoaXMubWluQ291bnQgPSBwYXJzZUludChjb3VudFBhcnRzWzBdIHx8ICcwJyk7XHJcblx0XHRcdFx0XHR0aGlzLm1heENvdW50ID0gcGFyc2VJbnQoY291bnRQYXJ0c1sxXSB8fCAnMCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblx0Ly8gZG9uJ3QgYWxsb3cgbWF4IHRvIGJlIHNtYWxsZXIgdGhhbiBtaW5cclxuXHRpZiAodGhpcy5tYXhDb3VudCA8IHRoaXMubWluQ291bnQpXHJcblx0XHR0aGlzLm1heENvdW50ID0gdGhpcy5taW5Db3VudDtcclxufTtcclxuLyoqXHJcbiAqIE1heGltdW0gdGltZXMgdGhhdCBhIHRva2VuIHdpdGhvdXQgcmVzdHJpY3Rpb24gY2FuIGJlIHJlcGVhdGVkXHJcbiAqIEBjb25zdFxyXG4gKi9cclxuVG9rZW4ucHJvdG90eXBlLk1BWF9WQUxVRSA9IDEwMDA7XHJcblxyXG5Ub2tlbi5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odG9rZW4pIHtcclxuXHRpZiAoIXRva2VuKSByZXR1cm4gZmFsc2U7XHJcblx0cmV0dXJuIHRva2VuLnZhbHVlID09PSB0aGlzLnZhbHVlICYmXHJcblx0XHRcdHRva2VuLm1pbkNvdW50ID09PSB0aGlzLm1pbkNvdW50ICYmXHJcblx0XHRcdHRva2VuLm1heENvdW50ID09PSB0aGlzLm1heENvdW50ICYmXHJcblx0XHRcdHRva2VuLmV4YWN0TWF0Y2ggPT09IHRoaXMuZXhhY3RNYXRjaDtcclxufTtcclxuVG9rZW4ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcblx0aWYgKHRoaXMuZXhhY3RNYXRjaClcclxuXHRcdHJldHVybiB0aGlzLnZhbHVlO1xyXG5cdHJldHVybiB0aGlzLnZhbHVlICsgJzonICsgdGhpcy5taW5Db3VudCArICctJyArIHRoaXMubWF4Q291bnQ7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRva2VuO1xyXG5cclxuLypcclxuXHRwdWJsaWMgY2xhc3MgVG9rZW5cclxuXHR7XHJcblx0XHRwdWJsaWMgU3RyaW5nIFZhbHVlO1xyXG5cdFx0cHVibGljIEludDMyIE1pbkNvdW50O1xyXG5cdFx0cHVibGljIEludDMyIE1heENvdW50O1xyXG5cdFx0cHVibGljIEJvb2xlYW4gRXhhY3RNYXRjaDtcclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gUGFyc2UgdGhlIHRva2VuXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0Ly8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj48L3BhcmFtPlxyXG5cdFx0Ly8vIDxwYXJhbSBuYW1lPVwiZXhhY3RNYXRjaFwiPjwvcGFyYW0+XHJcblx0XHRwdWJsaWMgVG9rZW4oU3RyaW5nIHZhbHVlLCBCb29sZWFuIGV4YWN0TWF0Y2gpXHJcblx0XHR7XHJcblx0XHRcdGlmIChleGFjdE1hdGNoKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGhpcy5WYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdHRoaXMuTWluQ291bnQgPSB0aGlzLk1heENvdW50ID0gMTtcclxuXHRcdFx0XHR0aGlzLkV4YWN0TWF0Y2ggPSB0cnVlO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuI2lmICFTQ1JJUFRTSEFSUFxyXG5cdFx0XHRTdHJpbmdbXSBwYXJ0cyA9IHZhbHVlLlNwbGl0KG5ldyBDaGFyW10geyAnOicgfSwgU3RyaW5nU3BsaXRPcHRpb25zLlJlbW92ZUVtcHR5RW50cmllcyk7XHJcbiNlbHNlXHJcblx0XHRcdFN0cmluZ1tdIHBhcnRzID0gU3RyaW5nVXRpbHMuU3BsaXQodmFsdWUsICc6Jyk7XHJcbiNlbmRpZlxyXG5cdFx0XHR0aGlzLlZhbHVlID0gcGFydHNbMF07XHJcblx0XHRcdGlmIChwYXJ0cy5MZW5ndGggPT0gMSlcclxuXHRcdFx0XHR0aGlzLk1pbkNvdW50ID0gdGhpcy5NYXhDb3VudCA9IDE7XHJcblx0XHRcdGVsc2UgaWYgKHBhcnRzLkxlbmd0aCA+IDEpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzd2l0Y2ggKHBhcnRzWzFdKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGNhc2UgXCJcIjpcclxuXHRcdFx0XHRcdFx0dGhpcy5NaW5Db3VudCA9IDE7XHJcblx0XHRcdFx0XHRcdHRoaXMuTWF4Q291bnQgPSAxO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgXCIrXCI6XHJcblx0XHRcdFx0XHRcdHRoaXMuTWluQ291bnQgPSAxO1xyXG5cdFx0XHRcdFx0XHR0aGlzLk1heENvdW50ID0gSW50MzIuTWF4VmFsdWU7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSBcIipcIjpcclxuXHRcdFx0XHRcdFx0dGhpcy5NaW5Db3VudCA9IDA7XHJcblx0XHRcdFx0XHRcdHRoaXMuTWF4Q291bnQgPSBJbnQzMi5NYXhWYWx1ZTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIFwiP1wiOlxyXG5cdFx0XHRcdFx0XHR0aGlzLk1pbkNvdW50ID0gMDtcclxuXHRcdFx0XHRcdFx0dGhpcy5NYXhDb3VudCA9IDE7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdFx0U3RyaW5nW10gY291bnRQYXJ0cyA9IHBhcnRzWzFdLlNwbGl0KCctJyk7XHJcblx0XHRcdFx0XHRcdGlmIChjb3VudFBhcnRzLkxlbmd0aCA9PSAxKVxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuTWluQ291bnQgPSB0aGlzLk1heENvdW50ID0gSW50MzIuUGFyc2UoY291bnRQYXJ0c1swXSk7XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGNvdW50UGFydHMuTGVuZ3RoID09IDIpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLk1pbkNvdW50ID0gSW50MzIuUGFyc2UoY291bnRQYXJ0c1swXSk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5NYXhDb3VudCA9IEludDMyLlBhcnNlKGNvdW50UGFydHNbMV0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuI2lmICFTQ1JJUFRTSEFSUFxyXG5cdFx0cHVibGljIG92ZXJyaWRlIEJvb2xlYW4gRXF1YWxzKG9iamVjdCBvYmopXHJcblx0XHR7XHJcblx0XHRcdGlmIChSZWZlcmVuY2VFcXVhbHMobnVsbCwgb2JqKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAoUmVmZXJlbmNlRXF1YWxzKHRoaXMsIG9iaikpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRpZiAob2JqLkdldFR5cGUoKSAhPSBHZXRUeXBlKCkpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIEVxdWFscygoVG9rZW4pb2JqKTtcclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgYm9vbCBFcXVhbHMoVG9rZW4gb3RoZXIpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiBzdHJpbmcuRXF1YWxzKHRoaXMuVmFsdWUsIG90aGVyLlZhbHVlKSAmJiB0aGlzLk1pbkNvdW50ID09IG90aGVyLk1pbkNvdW50ICYmIHRoaXMuTWF4Q291bnQgPT0gb3RoZXIuTWF4Q291bnQgJiYgdGhpcy5FeGFjdE1hdGNoLkVxdWFscyhvdGhlci5FeGFjdE1hdGNoKTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgaW50IEdldEhhc2hDb2RlKClcclxuXHRcdHtcclxuXHRcdFx0dW5jaGVja2VkXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpbnQgaGFzaENvZGUgPSAodGhpcy5WYWx1ZSAhPSBudWxsID8gdGhpcy5WYWx1ZS5HZXRIYXNoQ29kZSgpIDogMCk7XHJcblx0XHRcdFx0aGFzaENvZGUgPSAoaGFzaENvZGUgKiAzOTcpIF4gdGhpcy5NaW5Db3VudDtcclxuXHRcdFx0XHRoYXNoQ29kZSA9IChoYXNoQ29kZSAqIDM5NykgXiB0aGlzLk1heENvdW50O1xyXG5cdFx0XHRcdGhhc2hDb2RlID0gKGhhc2hDb2RlICogMzk3KSBeIHRoaXMuRXhhY3RNYXRjaC5HZXRIYXNoQ29kZSgpO1xyXG5cdFx0XHRcdHJldHVybiBoYXNoQ29kZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBvdmVycmlkZSBTdHJpbmcgVG9TdHJpbmcoKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAodGhpcy5FeGFjdE1hdGNoKVxyXG5cdFx0XHRcdHJldHVybiBTdHJpbmcuRm9ybWF0KFwiezB9XCIsIHRoaXMuVmFsdWUpO1xyXG5cdFx0XHRyZXR1cm4gU3RyaW5nLkZvcm1hdChcInswfTp7MX0tezJ9XCIsIHRoaXMuVmFsdWUsIHRoaXMuTWluQ291bnQsIHRoaXMuTWF4Q291bnQpO1xyXG5cdFx0fVxyXG4jZW5kaWZcclxuXHR9XHJcbiovXHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvbWF0Y2hpbmcvVG9rZW4uanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcclxuICogS2VlcHMgdHJlZSBpbmZvcm1hdGlvbiBmb3IgcGF0dGVybnNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbmV3IHBhdGNoXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxudmFyIFBhdHRlcm5QYXRoID0gZnVuY3Rpb24oKSB7XHJcblx0Ly8gUGF0aHMgZm9yIGFsbCB0b2tlbnNcclxuXHR0aGlzLnBhdGhzID0ge307XHJcblx0Ly8gQW55IHBhdHRlcm5zIGZpbmlzaGluZyBhdCB0aGlzIHBhdGhcclxuXHR0aGlzLm1hdGNoZWRQYXR0ZXJucyA9IFtdO1xyXG5cclxufTtcclxuUGF0dGVyblBhdGgucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIG1hdGNoZXMgPSAodGhpcy5tYXRjaGVkUGF0dGVybnMgfHwgW10pLmpvaW4oJywgJyk7XHJcblx0dmFyIGNoaWxkcmVuID0gKHRoaXMucGF0aHMubWFwKGZ1bmN0aW9uKHRva2VuKSB7XHJcblx0XHRyZXR1cm4gdG9rZW4udG9TdHJpbmcoKTtcclxuXHR9KSkuam9pbignLCAnKTtcclxuXHRyZXR1cm4gbWF0Y2hlcyArICcgOjogJyArIGNoaWxkcmVuO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuUGF0aDtcclxuXHJcbi8qXHJcblx0aW50ZXJuYWwgY2xhc3MgUGF0dGVyblBhdGhcclxuXHR7XHJcbiNpZiAhU0NSSVBUU0hBUlBcclxuXHRcdHB1YmxpYyBvdmVycmlkZSBTdHJpbmcgVG9TdHJpbmcoKVxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgbWF0Y2hlcyA9IFN0cmluZy5Kb2luKFwiLCBcIiwgdGhpcy5NYXRjaGVkUGF0dGVybnMgPz8gbmV3IExpc3Q8SW50MzI+KDApKTtcclxuXHRcdFx0dmFyIGNoaWxkcmVuID0gU3RyaW5nLkpvaW4oXCIsIFwiLCB0aGlzLlBhdGhzLktleXMuU2VsZWN0KHQgPT4gdC5Ub1N0cmluZygpKSk7XHJcblx0XHRcdHJldHVybiBTdHJpbmcuRm9ybWF0KFwiezB9IDo6IHsxfVwiLCBtYXRjaGVzLCBjaGlsZHJlbik7XHJcblx0XHR9XHJcbiNlbmRpZlxyXG5cclxuXHRcdHB1YmxpYyBEaWN0aW9uYXJ5PFRva2VuLCBQYXR0ZXJuUGF0aD4gUGF0aHMgPSBuZXcgRGljdGlvbmFyeTxUb2tlbiwgUGF0dGVyblBhdGg+KCk7XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIEFueSBwYXR0ZXJucyBmaW5pc2hpbmcgYXQgdGhpcyBwYXRoXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0cHVibGljIExpc3Q8SW50MzI+IE1hdGNoZWRQYXR0ZXJucztcclxuXHR9XHJcbiovXHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvbWF0Y2hpbmcvUGF0dGVyblBhdGguanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcclxuICogQSBub2RlIGluIHRoZSBjdXJyZW50IHBhcnNpbmcgc2Vzc2lvblxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBuZXcgbm9kZSB0byBob2xkIHBhcnNpbmcgc3RhdGVcclxuICogQHBhcmFtIHRva2VuXHJcbiAqIEBwYXJhbSBwYXRoXHJcbiAqIEBwYXJhbSB0ZXh0VmFsdWVcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG52YXIgUGF0aE5vZGUgPSBmdW5jdGlvbih0b2tlbiwgcGF0aCwgdGV4dFZhbHVlKSB7XHJcblx0Ly8gVGhlIHRva2VuIGZvciBjb21wYXJpc29uXHJcblx0dGhpcy50b2tlbiA9IHRva2VuO1xyXG5cclxuXHQvLyBUaGUgbWF0Y2hpbmcgcGF0aCBmb3IgZ29pbmcgZGVlcGVyXHJcblx0dGhpcy5wYXRoID0gcGF0aDtcclxuXHJcblx0Ly8gVGhlIHZhbHVlIHdoaWNoIHN0aWxsIG1hdGNoZXMgdGhpcyBwYXRoXHJcblx0dGhpcy50ZXh0VmFsdWUgPSB0ZXh0VmFsdWU7XHJcblxyXG5cdC8vIFRoZSBmaW5hbCBhc3NlbWJsZWQgdmFsdWVcclxuXHR0aGlzLnZhbHVlID0gbnVsbDtcclxuXHQvLyBBbGwgdmFsdWVzIG9mIGVhcmxpZXIgdG9rZW5zXHJcblx0dGhpcy5wcmV2aW91c1ZhbHVlcyA9IFtdO1xyXG5cclxuXHQvLyBUcnVlIGlmIHRoZSB2YWx1ZSBoYXMgYmVlbiBmaW5hbGl6ZWQgYW5kIGFzc2lnbmVkXHJcblx0dGhpcy5pc0ZpbmFsaXplZCA9IG51bGw7XHJcblxyXG5cdC8vIFJlbWVtYmVyIHRoZSBjdXJyZW50IHN0YXRlIG9mIGFueSBtYXRjaGluZyBhbGdvcml0aG1cclxuXHR0aGlzLm1hdGNoU3RhdGUgPSBudWxsO1xyXG59O1xyXG5cclxuUGF0aE5vZGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMudGV4dFZhbHVlICsgJyA9ICcgKyB0aGlzLnRva2VuO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXRoTm9kZTtcclxuXHJcbi8qXHJcblx0aW50ZXJuYWwgY2xhc3MgUGF0aE5vZGVcclxuXHR7XHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvU3RyaW5nKClcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIFN0cmluZy5Gb3JtYXQoXCJ7MH0gPSB7MX1cIiwgdGhpcy5UZXh0VmFsdWUsIHRoaXMuVG9rZW4pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBUaGUgdG9rZW4gZm9yIGNvbXBhcmlzb25cclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHRwdWJsaWMgVG9rZW4gVG9rZW47XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFRoZSBtYXRjaGluZyBwYXRoIGZvciBnb2luZyBkZWVwZXJcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHRwdWJsaWMgUGF0dGVyblBhdGggUGF0aDtcclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gVGhlIHZhbHVlIHdoaWNoIHN0aWxsIG1hdGNoZXMgdGhpcyBwYXRoXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0cHVibGljIFN0cmluZyBUZXh0VmFsdWU7XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFRoZSBmaW5hbCBhc3NlbWJsZWQgdmFsdWVcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHRwdWJsaWMgT2JqZWN0IFZhbHVlO1xyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIEFsbCB2YWx1ZXMgb2YgZWFybGllciB0b2tlbnNcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHRwdWJsaWMgTGlzdDxPYmplY3Q+IFByZXZpb3VzVmFsdWVzID0gbmV3IExpc3Q8T2JqZWN0PigpO1xyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBUcnVlIGlmIHRoZSB2YWx1ZSBoYXMgYmVlbiBmaW5hbGl6ZWQgYW5kIGFzc2lnbmVkXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0cHVibGljIEJvb2xlYW4gSXNGaW5hbGl6ZWQ7XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFJlbWVtYmVyIHRoZSBjdXJyZW50IHN0YXRlIG9mIGFueSBtYXRjaGluZyBhbGdvcml0aG1cclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHRwdWJsaWMgT2JqZWN0IE1hdGNoU3RhdGU7XHJcblxyXG5cdFx0cHVibGljIFBhdGhOb2RlKFRva2VuIHRva2VuLCBQYXR0ZXJuUGF0aCBwYXRoLCBTdHJpbmcgdGV4dFZhbHVlKVxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLlRva2VuID0gdG9rZW47XHJcblx0XHRcdHRoaXMuUGF0aCA9IHBhdGg7XHJcblx0XHRcdHRoaXMuVGV4dFZhbHVlID0gdGV4dFZhbHVlO1xyXG5cdFx0fVxyXG5cdH1cclxuKi9cclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9tYXRjaGluZy9QYXRoTm9kZS5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxyXG4gKiBDb250ZXh0IGZvciBwYXR0ZXJuIG1hdGNoaW5nXHJcbiAqIEhvbGRzIHZhbHVlcyB3aGljaCBtYXkgaW5mbHVlbmNlIHBhcnNpbmcgb3V0Y29tZSBsaWtlIGN1cnJlbnQgZGF0ZSBhbmQgdGltZSwgbG9jYXRpb24gb3IgbGFuZ3VhZ2VcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgUGF0dGVybkNvbnRleHQgPSBmdW5jdGlvbihjdXJyZW50RGF0ZSkge1xyXG5cdHRoaXMuY3VycmVudERhdGUgPSBjdXJyZW50RGF0ZSB8fCBuZXcgRGF0ZSgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuQ29udGV4dDtcclxuXHJcbi8qXHJcblx0cHVibGljIGNsYXNzIFBhdHRlcm5Db250ZXh0XHJcblx0e1xyXG5cdFx0cHVibGljIExvY2FsRGF0ZSBDdXJyZW50RGF0ZSB7IGdldDsgc2V0OyB9XHJcblxyXG5cdFx0cHVibGljIFBhdHRlcm5Db250ZXh0KClcclxuXHRcdHtcclxuXHRcdFx0Q3VycmVudERhdGUgPSBuZXcgTG9jYWxEYXRlKERhdGVUaW1lLlV0Y05vdyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIFBhdHRlcm5Db250ZXh0KExvY2FsRGF0ZSBjdXJyZW50RGF0ZSlcclxuXHRcdHtcclxuXHRcdFx0Q3VycmVudERhdGUgPSBjdXJyZW50RGF0ZTtcclxuXHRcdH1cclxuXHR9XHJcbiovXHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvUGF0dGVybkNvbnRleHQuanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcclxuICogUGFyc2VzIGRhdGEgdmFsdWVzIHRvIGZpZ3VyZSBvdXQgd2hhdCBhY3R1YWwgdHlwZSB0aGV5IGFyZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgTW9kdWxlXHJcbiAqIEB0eXBlIHtvYmplY3R9XHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nW119IHBhdHRlcm5UYWdzIC0gYXZhaWxhYmxlIHBhdHRlcm4gdGFnc1xyXG4gKiBAcHJvcGVydHkge3N0cmluZ1tdfSB0b2tlblRhZ3MgLSBhdmFpbGFibGUgdG9rZW4gdGFnc1xyXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uKHN0cmluZyl9IGdldFBhdHRlcm5zIC0gcmV0dXJucyBwYXR0ZXJucyBmb3IgYSB0YWdcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgUGF0dGVybk1hdGNoZXIgPSByZXF1aXJlKCcuL1BhdHRlcm5NYXRjaGVyJyk7XHJcblxyXG52YXIgbW9kdWxlVHlwZXMgPSBbXHJcblx0cmVxdWlyZSgnLi9tb2R1bGVzL0Jvb2xlYW5QYXJzZXJNb2R1bGUnKVxyXG5cdC8qcmVxdWlyZSgnLi9tb2R1bGVzL051bWJlclBhcnNlck1vZHVsZScpLFxyXG5cdHJlcXVpcmUoJy4vbW9kdWxlcy9EYXRlUGFyc2VyTW9kdWxlJyksXHJcblx0cmVxdWlyZSgnLi9tb2R1bGVzL0FkZHJlc3NQYXJzZXJNb2R1bGUnKSxcclxuXHRyZXF1aXJlKCcuL21vZHVsZXMvQ3VycmVuY3lQYXJzZXJNb2R1bGUnKSxcclxuXHRyZXF1aXJlKCcuL21vZHVsZXMvVXJsUGFyc2VyTW9kdWxlJyksXHJcblx0cmVxdWlyZSgnLi9tb2R1bGVzL0lwUGFyc2VyTW9kdWxlJyksXHJcblx0cmVxdWlyZSgnLi9tb2R1bGVzL0VtYWlsUGFyc2VyTW9kdWxlJykqL1xyXG5dO1xyXG4vL3ZhciBkYXRlTW9kdWxlVHlwZXMgPSBbXHJcblx0LypyZXF1aXJlKCcuL21vZHVsZXMvTnVtYmVyUGFyc2VyTW9kdWxlJyksXHJcblx0cmVxdWlyZSgnLi9tb2R1bGVzL0RhdGVQYXJzZXJNb2R1bGUnKSovXHJcbi8vXTtcclxuXHJcbnZhciBkZWZhdWx0UGF0dGVybk1hdGNoZXIgPSBudWxsO1xyXG4vL3ZhciBkYXRlUGF0dGVybk1hdGNoZXIgPSBudWxsO1xyXG52YXIgbmFtZWRQYXR0ZXJuTWF0Y2hlcnMgPSB7fTtcclxuXHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbmV3IFBhdHRlcm5NYXRjaGVyIG9iamVjdCBpbmNsdWRpbmcgdGhlIHNwZWNpZmllZCBtb2R1bGVzXHJcbiAqIEBwYXJhbSBtb2R1bGVzIHtNb2R1bGVbXX0gLSBMaXN0IG9mIG1vZHVsZXMgdG8gaW5jbHVkZVxyXG4gKiBAcmV0dXJucyB7UGF0dGVybk1hdGNoZXJ9XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gbWFrZVBhdHRlcm5NYXRjaGVyKG1vZHVsZXMpIHtcclxuXHR2YXIgbWF0Y2hlciA9IG5ldyBQYXR0ZXJuTWF0Y2hlcihbXSk7XHJcblx0aWYgKCFtb2R1bGVzKVxyXG5cdFx0cmV0dXJuIG1hdGNoZXI7XHJcblxyXG5cdG1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihNb2R1bGUpIHtcclxuXHRcdHZhciBtb2R1bGUgPSBuZXcgTW9kdWxlKCk7XHJcblx0XHR2YXIgaSwgdGFnO1xyXG5cclxuXHRcdC8vIGFkZCBwYXR0ZXJuc1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IG1vZHVsZS5wYXR0ZXJuVGFncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR0YWcgPSBtb2R1bGUucGF0dGVyblRhZ3NbaV07XHJcblx0XHRcdG1hdGNoZXIuYWRkUGF0dGVybnModGFnLCBtb2R1bGUuZ2V0UGF0dGVybnModGFnKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gcmVnaXN0ZXIgdmFsaWRhdG9yc1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IG1vZHVsZS50b2tlblRhZ3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dGFnID0gbW9kdWxlLnRva2VuVGFnc1tpXTtcclxuXHRcdFx0bWF0Y2hlci5yZWdpc3RlclZhbGlkYXRvcih0YWcsIG1vZHVsZSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0cmV0dXJuIG1hdGNoZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNYWtlIHN1cmUgdGhlIGRlZmF1bHQgcGF0dGVybiBtYXRjaGVyIGluY2x1ZGluZyBhbGwgcGF0dGVybnMgaXMgYXZhaWxhYmxlIGFuZCByZXR1cm4gaXRcclxuICogQHJldHVybnMge1BhdHRlcm5NYXRjaGVyfVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0RGVmYXVsdFBhdHRlcm5NYXRjaGVyKCkge1xyXG5cdGlmICghZGVmYXVsdFBhdHRlcm5NYXRjaGVyKVxyXG5cdFx0ZGVmYXVsdFBhdHRlcm5NYXRjaGVyID0gbWFrZVBhdHRlcm5NYXRjaGVyKG1vZHVsZVR5cGVzKTtcclxuXHRyZXR1cm4gZGVmYXVsdFBhdHRlcm5NYXRjaGVyO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIGRhdGEgcGFyc2VyIHdpdGggdGhlIHNwZWNpZmllZCBuYW1lIGFuZCBtb2R1bGVzLiBJZiBuYW1lIGFuZCBtb2R1bGVzIGlzIGVtcHR5LCBtYXRjaGVzIGFsbCBkZWZhdWx0IHBhdHRlcm5zLlxyXG4gKiBAcGFyYW0gbmFtZVxyXG4gKiBAcGFyYW0gbW9kdWxlc1xyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbnZhciBEYXRhUGFyc2VyID0gZnVuY3Rpb24obmFtZSwgbW9kdWxlcykge1xyXG5cdGlmICghbmFtZSB8fCAhbW9kdWxlcykge1xyXG5cdFx0dGhpcy5wYXR0ZXJuTWF0Y2hlciA9IGdldERlZmF1bHRQYXR0ZXJuTWF0Y2hlcigpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRpZiAobmFtZWRQYXR0ZXJuTWF0Y2hlcnNbbmFtZV0pXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHR0aGlzLnBhdHRlcm5NYXRjaGVyID0gbWFrZVBhdHRlcm5NYXRjaGVyKG1vZHVsZXMpO1xyXG5cdFx0bmFtZWRQYXR0ZXJuTWF0Y2hlcnNbbmFtZV0gPSB0aGlzLnBhdHRlcm5NYXRjaGVyO1xyXG5cdH1cclxufTtcclxuXHJcbi8qXHJcbntcclxuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBUeXBlW10gTW9kdWxlVHlwZXMgPVxyXG5cdHtcclxuXHRcdHR5cGVvZihOdW1iZXJQYXJzZXJNb2R1bGUpLCB0eXBlb2YoRGF0ZVBhcnNlck1vZHVsZSksIHR5cGVvZihBZGRyZXNzUGFyc2VyTW9kdWxlKSwgdHlwZW9mKEN1cnJlbmN5UGFyc2VyTW9kdWxlKSwgdHlwZW9mKEJvb2xlYW5QYXJzZXJNb2R1bGUpLFxyXG5cdFx0dHlwZW9mKFVybFBhcnNlck1vZHVsZSksIHR5cGVvZihJcFBhcnNlck1vZHVsZSksIHR5cGVvZihFbWFpbFBhcnNlck1vZHVsZSlcclxuXHR9O1xyXG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFR5cGVbXSBEYXRlTW9kdWxlVHlwZXMgPVxyXG5cdHtcclxuXHRcdHR5cGVvZihOdW1iZXJQYXJzZXJNb2R1bGUpLCB0eXBlb2YoRGF0ZVBhcnNlck1vZHVsZSlcclxuXHR9O1xyXG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBhdHRlcm5NYXRjaGVyIERlZmF1bHRQYXR0ZXJuTWF0Y2hlcjtcclxuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBQYXR0ZXJuTWF0Y2hlciBEYXRlUGF0dGVybk1hdGNoZXI7XHJcblx0cHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRGljdGlvbmFyeTxTdHJpbmcsIFBhdHRlcm5NYXRjaGVyPiBOYW1lZFBhdHRlcm5NYXRjaGVycyA9IG5ldyBEaWN0aW9uYXJ5PFN0cmluZywgUGF0dGVybk1hdGNoZXI+KCk7XHJcblxyXG5cdHByaXZhdGUgcmVhZG9ubHkgUGF0dGVybk1hdGNoZXIgcGF0dGVybk1hdGNoZXI7XHJcblxyXG5cdC8vLyA8c3VtbWFyeT5cclxuXHQvLy8gRGVmYXVsdCBjb250ZXh0IGZvciBwYXJzaW5nXHJcblx0Ly8vIDwvc3VtbWFyeT5cclxuXHRwdWJsaWMgUGF0dGVybkNvbnRleHQgRGVmYXVsdFBhdHRlcm5Db250ZXh0IHsgZ2V0OyBzZXQ7IH1cclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBMb2FkIGFsbCBwYXR0ZXJucyBmcm9tIHRoZSBkZWZpbmVkIG1vZHVsZXNcclxuXHQvLy8gPC9zdW1tYXJ5PlxyXG5cdHN0YXRpYyBEYXRhUGFyc2VyKClcclxuXHR7XHJcblx0XHREZWZhdWx0UGF0dGVybk1hdGNoZXIgPSBtYWtlUGF0dGVybk1hdGNoZXIoTW9kdWxlVHlwZXMpO1xyXG5cdFx0RGF0ZVBhdHRlcm5NYXRjaGVyID0gbWFrZVBhdHRlcm5NYXRjaGVyKERhdGVNb2R1bGVUeXBlcyk7XHJcblx0fVxyXG5cclxuXHQvLy8gPHN1bW1hcnk+XHJcblx0Ly8vIFVzZSB0aGUgZGVmYXVsdCBwYXR0ZXJuIG1hdGNoZXJcclxuXHQvLy8gPC9zdW1tYXJ5PlxyXG5cdHB1YmxpYyBEYXRhUGFyc2VyKClcclxuXHR7XHJcblx0XHR0aGlzLnBhdHRlcm5NYXRjaGVyID0gRGVmYXVsdFBhdHRlcm5NYXRjaGVyO1xyXG5cdH1cclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBMb2FkIGFsbCBwYXR0ZXJucyBmcm9tIHRoZSBkZWZpbmVkIG1vZHVsZXNcclxuXHQvLy8gPC9zdW1tYXJ5PlxyXG5cdHB1YmxpYyBEYXRhUGFyc2VyKFN0cmluZyBuYW1lLCBUeXBlW10gbW9kdWxlcylcclxuXHR7XHJcblx0XHRpZiAoU3RyaW5nLklzTnVsbE9yRW1wdHkobmFtZSkgfHwgbW9kdWxlcyA9PSBudWxsKVxyXG5cdFx0e1xyXG5cdFx0XHR0aGlzLnBhdHRlcm5NYXRjaGVyID0gRGVmYXVsdFBhdHRlcm5NYXRjaGVyO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKE5hbWVkUGF0dGVybk1hdGNoZXJzLlRyeUdldFZhbHVlKG5hbWUsIG91dCB0aGlzLnBhdHRlcm5NYXRjaGVyKSAmJiB0aGlzLnBhdHRlcm5NYXRjaGVyICE9IG51bGwpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHR0aGlzLnBhdHRlcm5NYXRjaGVyID0gbWFrZVBhdHRlcm5NYXRjaGVyKG1vZHVsZXMpO1xyXG5cdFx0TmFtZWRQYXR0ZXJuTWF0Y2hlcnNbbmFtZV0gPSB0aGlzLnBhdHRlcm5NYXRjaGVyO1xyXG5cdH1cclxuXHJcblxyXG5cdHByaXZhdGUgc3RhdGljIFBhdHRlcm5NYXRjaGVyIG1ha2VQYXR0ZXJuTWF0Y2hlcihUeXBlW10gbW9kdWxlcylcclxuXHR7XHJcblx0XHRQYXR0ZXJuTWF0Y2hlciBtYXRjaGVyID0gbmV3IFBhdHRlcm5NYXRjaGVyKG5ldyBQYXR0ZXJuWzBdKTtcclxuXHJcblx0XHRmb3JlYWNoIChUeXBlIG1vZHVsZVR5cGUgaW4gbW9kdWxlcylcclxuXHRcdHtcclxuXHRcdFx0SVBhcnNlck1vZHVsZSBtb2R1bGUgPSBBY3RpdmF0b3IuQ3JlYXRlSW5zdGFuY2UobW9kdWxlVHlwZSkgYXMgSVBhcnNlck1vZHVsZTtcclxuXHRcdFx0aWYgKG1vZHVsZSA9PSBudWxsKSBjb250aW51ZTtcclxuXHJcblx0XHRcdC8vIGFkZCBwYXR0ZXJuc1xyXG5cdFx0XHRmb3JlYWNoIChTdHJpbmcgdGFnIGluIG1vZHVsZS5QYXR0ZXJuVGFncylcclxuXHRcdFx0XHRtYXRjaGVyLkFkZFBhdHRlcm5zKHRhZywgbW9kdWxlLkdldFBhdHRlcm5zKHRhZykpO1xyXG5cclxuXHRcdFx0Ly8gcmVnaXN0ZXIgdmFsaWRhdG9yc1xyXG5cdFx0XHRmb3JlYWNoIChTdHJpbmcgdGFnIGluIG1vZHVsZS5Ub2tlblRhZ3MpXHJcblx0XHRcdFx0bWF0Y2hlci5SZWdpc3RlclZhbGlkYXRvcih0YWcsIG1vZHVsZSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbWF0Y2hlcjtcclxuXHR9XHJcblxyXG5cdC8vLyA8c3VtbWFyeT5cclxuXHQvLy8gUGFyc2UgYSB2YWx1ZSBpbnRvIGFsbCBwb3NzaWJsZSBuYXRpdmUgdHlwZXNcclxuXHQvLy8gPC9zdW1tYXJ5PlxyXG5cdC8vLyA8cGFyYW0gbmFtZT1cInZhbHVlXCI+PC9wYXJhbT5cclxuXHQvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG5cdHB1YmxpYyBMaXN0PElWYWx1ZT4gUGFyc2UoU3RyaW5nIHZhbHVlKVxyXG5cdHtcclxuXHRcdHJldHVybiBQYXJzZShEZWZhdWx0UGF0dGVybkNvbnRleHQgPz8gbmV3IFBhdHRlcm5Db250ZXh0KCksIHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdC8vLyA8c3VtbWFyeT5cclxuXHQvLy8gUGFyc2UgYSB2YWx1ZSBpbnRvIGFsbCBwb3NzaWJsZSBuYXRpdmUgdHlwZXNcclxuXHQvLy8gPC9zdW1tYXJ5PlxyXG5cdC8vLyA8cGFyYW0gbmFtZT1cImNvbnRleHRcIj48L3BhcmFtPlxyXG5cdC8vLyA8cGFyYW0gbmFtZT1cInZhbHVlXCI+PC9wYXJhbT5cclxuXHQvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG5cdHB1YmxpYyBMaXN0PElWYWx1ZT4gUGFyc2UoUGF0dGVybkNvbnRleHQgY29udGV4dCwgU3RyaW5nIHZhbHVlKVxyXG5cdHtcclxuXHRcdExpc3Q8T2JqZWN0PiBtYXRjaFJlc3VsdHMgPSB0aGlzLnBhdHRlcm5NYXRjaGVyLk1hdGNoKGNvbnRleHQsIHZhbHVlKTtcclxuXHRcdHJldHVybiAobWF0Y2hSZXN1bHRzID09IG51bGwgPyBuZXcgTGlzdDxJVmFsdWU+KCkgOiBtYXRjaFJlc3VsdHMuQ2FzdDxJVmFsdWU+KCkuVG9MaXN0KCkpO1xyXG5cdH1cclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBQYXJzZSBhIHZhbHVlIGFzIGEgTG9jYWxEYXRlXHJcblx0Ly8vIDwvc3VtbWFyeT5cclxuXHQvLy8gPHBhcmFtIG5hbWU9XCJ2YWx1ZVwiPjwvcGFyYW0+XHJcblx0Ly8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuXHRwdWJsaWMgTG9jYWxEYXRlIFBhcnNlRGF0ZShTdHJpbmcgdmFsdWUpXHJcblx0e1xyXG5cdFx0cmV0dXJuIFBhcnNlRGF0ZShEZWZhdWx0UGF0dGVybkNvbnRleHQgPz8gbmV3IFBhdHRlcm5Db250ZXh0KCksIHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdC8vLyA8c3VtbWFyeT5cclxuXHQvLy8gUGFyc2UgYSB2YWx1ZSBhcyBhIExvY2FsRGF0ZVxyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0Ly8vIDxwYXJhbSBuYW1lPVwiY29udGV4dFwiPjwvcGFyYW0+XHJcblx0Ly8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj48L3BhcmFtPlxyXG5cdC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcblx0cHVibGljIExvY2FsRGF0ZSBQYXJzZURhdGUoUGF0dGVybkNvbnRleHQgY29udGV4dCwgU3RyaW5nIHZhbHVlKVxyXG5cdHtcclxuXHRcdExpc3Q8T2JqZWN0PiByZXN1bHRzID0gRGF0ZVBhdHRlcm5NYXRjaGVyLk1hdGNoKGNvbnRleHQsIHZhbHVlKTtcclxuXHRcdExvY2FsRGF0ZSBkYXRlUmVzdWx0ID0gcmVzdWx0cy5PZlR5cGU8TG9jYWxEYXRlPigpLkZpcnN0T3JEZWZhdWx0KCk7XHJcblx0XHRyZXR1cm4gZGF0ZVJlc3VsdDtcclxuXHR9XHJcbn1cclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGF0YVBhcnNlcjtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9EYXRhUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXHJcbiAqIFZhbGlkYXRlcyBib29sZWFuc1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBQYXR0ZXJuID0gcmVxdWlyZSgnLi4vbWF0Y2hpbmcvUGF0dGVybicpO1xyXG52YXIgQm9vbGVhblZhbHVlID0gcmVxdWlyZSgnLi4vdmFsdWVzL0Jvb2xlYW5WYWx1ZScpO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBNYWtlIHRoZSBmaW5hbCBvdXRwdXQgdmFsdWVcclxuICogQHBhcmFtIHZhbHVlXHJcbiAqIEByZXR1cm5zIHtCb29sZWFuVmFsdWV9XHJcbiAqL1xyXG5mdW5jdGlvbiBtYWtlKHZhbHVlKSB7XHJcblx0dmFyIGJvb2xWYWx1ZSA9IGZhbHNlO1xyXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJylcclxuXHRcdGJvb2xWYWx1ZSA9IHZhbHVlO1xyXG5cdGVsc2UgaWYgKHZhbHVlKVxyXG5cdHtcclxuXHRcdHZhciBsb3dlclZhbHVlID0gdmFsdWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0Ym9vbFZhbHVlID0gKHRoaXMuY29uc3QudHJ1ZVZhbHVlcy5pbmRleE9mKGxvd2VyVmFsdWUpICE9PSAtMSk7XHJcblx0fVxyXG5cdHJldHVybiBuZXcgQm9vbGVhblZhbHVlKGJvb2xWYWx1ZSk7XHJcbn1cclxuLyoqXHJcbiAqIFJldXNhYmxlIHdyYXBwZXIgZm9yIHRoZSB0d28gcGF0dGVybnNcclxuICogQHBhcmFtIHZcclxuICovXHJcbmZ1bmN0aW9uIHBhcnNlUGF0dGVybih2KSB7XHJcblx0bWFrZSh2WzFdKTtcclxufVxyXG5cclxudmFyIG1haW5QYXR0ZXJucyA9IFtcclxuXHRuZXcgUGF0dGVybigne2VtcHR5bGluZToqfXtib29sZWFudHJ1ZX17ZW1wdHlsaW5lOip9JywgcGFyc2VQYXR0ZXJuKSxcclxuXHRuZXcgUGF0dGVybigne2VtcHR5bGluZToqfXtib29sZWFuZmFsc2V9e2VtcHR5bGluZToqfScsIHBhcnNlUGF0dGVybilcclxuXTtcclxuXHJcblxyXG4vKipcclxuICogU2luZ2xldG9uIE1vZHVsZSB0byBwYXJzZSBib29sZWFuIHZhbHVlc1xyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbnZhciBCb29sZWFuUGFyc2VyTW9kdWxlID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5jb25zdCA9IHtcclxuXHRcdHRydWVWYWx1ZXM6IFsgJzEnLCAndHJ1ZScsICd3YWhyJyBdLFxyXG5cdFx0ZmFsc2VWYWx1ZXM6IFsgJzAnLCAnZmFsc2UnLCAnZmFsc2NoJyBdXHJcblx0fTtcclxuXHJcblx0dGhpcy5wYXR0ZXJuVGFncyA9IFsnJ107XHJcblx0dGhpcy50b2tlblRhZ3MgPSBbJ2Jvb2xlYW5mYWxzZScsICdib29sZWFudHJ1ZSddO1xyXG59O1xyXG4vKipcclxuICogUmV0dXJuIHRoZSBwYXR0ZXJucyBmb3IgdGhlIHRhZ1xyXG4gKiBAcGFyYW0gdGFnIHtzdHJpbmd9XHJcbiAqL1xyXG5Cb29sZWFuUGFyc2VyTW9kdWxlLnByb3RvdHlwZS5nZXRQYXR0ZXJucyA9IGZ1bmN0aW9uKHRhZykge1xyXG5cdGlmICh0YWcgPT09ICcnKVxyXG5cdFx0cmV0dXJuIG1haW5QYXR0ZXJucztcclxuXHRyZXR1cm4gW107XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJvb2xlYW5QYXJzZXJNb2R1bGU7XHJcblxyXG4vKlxyXG5cdHB1YmxpYyBjbGFzcyBCb29sZWFuUGFyc2VyTW9kdWxlIDogSVBhcnNlck1vZHVsZVxyXG5cdHtcclxuXHRcdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEhhc2hTZXQ8U3RyaW5nPiBUcnVlVmFsdWVzID0gbmV3IEhhc2hTZXQ8U3RyaW5nPiB7IFwidHJ1ZVwiLCBcIndhaHJcIiB9O1xyXG5cdFx0cHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgSGFzaFNldDxTdHJpbmc+IEZhbHNlVmFsdWVzID0gbmV3IEhhc2hTZXQ8U3RyaW5nPiB7IFwiZmFsc2VcIiwgXCJmYWxzY2hcIiB9O1xyXG5cclxuXHRcdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBhdHRlcm5bXSBNYWluUGF0dGVybnMgPVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmV3IFBhdHRlcm4oXCJ7ZW1wdHlsaW5lOip9e2Jvb2xlYW50cnVlfXtlbXB0eWxpbmU6Kn1cIiwgdiA9PiBNYWtlKHZbMV0pKSxcclxuICAgICAgICAgICAgbmV3IFBhdHRlcm4oXCJ7ZW1wdHlsaW5lOip9e2Jvb2xlYW5mYWxzZX17ZW1wdHlsaW5lOip9XCIsIHYgPT4gTWFrZSh2WzFdKSlcclxuICAgICAgICB9O1xyXG5cclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gTWFrZSB0aGUgZmluYWwgb3V0cHV0IHZhbHVlXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0Ly8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj48L3BhcmFtPlxyXG5cdFx0Ly8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuXHRcdHByaXZhdGUgc3RhdGljIEJvb2xlYW5WYWx1ZSBNYWtlKE9iamVjdCB2YWx1ZSlcclxuXHRcdHtcclxuXHRcdFx0dmFyIGJvb2xWYWx1ZSA9IGZhbHNlO1xyXG5cdFx0XHRpZiAodmFsdWUgaXMgQm9vbGVhbilcclxuXHRcdFx0XHRib29sVmFsdWUgPSAoQm9vbGVhbikgdmFsdWU7XHJcblx0XHRcdGlmICh2YWx1ZSAhPSBudWxsKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0U3RyaW5nIGxvd2VyVmFsdWUgPSB2YWx1ZS5Ub1N0cmluZygpLlRvTG93ZXIoKTtcclxuXHRcdFx0XHRib29sVmFsdWUgPSBUcnVlVmFsdWVzLkNvbnRhaW5zKGxvd2VyVmFsdWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBuZXcgQm9vbGVhblZhbHVlKGJvb2xWYWx1ZSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBSZXR1cm5zIHRoZSBkZWZpbmVkIHRhZ3MgZm9yIHdoaWNoIHBhdHRlcm5zIGV4aXN0XHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0cHVibGljIFN0cmluZ1tdIFBhdHRlcm5UYWdzXHJcblx0XHR7XHJcblx0XHRcdGdldCB7IHJldHVybiBuZXdbXSB7IFwiXCIgfTsgfVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBHZXQgdGhlIHBhdHRlcm5zIGZvciBhIHNwZWNpZmljIHRhZ1xyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdC8vLyA8cGFyYW0gbmFtZT1cInBhdHRlcm5UYWdcIj48L3BhcmFtPlxyXG5cdFx0Ly8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuXHRcdHB1YmxpYyBQYXR0ZXJuW10gR2V0UGF0dGVybnMoU3RyaW5nIHBhdHRlcm5UYWcpXHJcblx0XHR7XHJcblx0XHRcdHN3aXRjaCAocGF0dGVyblRhZylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGNhc2UgXCJcIjpcclxuXHRcdFx0XHRcdHJldHVybiBNYWluUGF0dGVybnM7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG5ldyBQYXR0ZXJuWzBdO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBSZXR1cm5zIHRoZSBkZWZpbmVkIHRhZ3Mgd2hpY2ggY2FuIGJlIHBhcnNlZCBhcyB0b2tlbnNcclxuXHRcdC8vLyA8L3N1bW1hcnk+XHJcblx0XHRwdWJsaWMgU3RyaW5nW10gVG9rZW5UYWdzXHJcblx0XHR7XHJcblx0XHRcdGdldCB7IHJldHVybiBuZXdbXSB7IFwiYm9vbGVhbmZhbHNlXCIsIFwiYm9vbGVhbnRydWVcIiB9OyB9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIENhbGxiYWNrIGhhbmRsZXIgd2hlbiBhIHZhbHVlIGhhcyB0byBiZSB2YWxpZGF0ZWQgYWdhaW5zdCBhIHRva2VuXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0Ly8vIDxwYXJhbSBuYW1lPVwidG9rZW5cIj5UaGUgdG9rZW4gdG8gdmFsaWRhdGUgYWdhaW5zdDwvcGFyYW0+XHJcblx0XHQvLy8gPHBhcmFtIG5hbWU9XCJ2YWx1ZVwiPlRoZSB2YWx1ZSB0byB2YWxpZGF0ZTwvcGFyYW0+XHJcblx0XHQvLy8gPHBhcmFtIG5hbWU9XCJpc0ZpbmFsXCI+VHJ1ZSBpZiB0aGlzIGlzIHRoZSBmaW5hbCB2YWxpZGF0aW9uIGFuZCBubyBtb3JlIGNoYXJhY3RlcnMgYXJlIGV4cGVjdGVkIGZvciB0aGUgdmFsdWU8L3BhcmFtPlxyXG5cdFx0Ly8vIDxyZXR1cm5zPlJldHVybnMgdHJ1ZSBpZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGUgdG9rZW4sIGZhbHNlIGlmIGl0IGRvZXNuJ3QgbWF0Y2ggb3IgdGhlIHRva2VuIGlzIHVua25vd248L3JldHVybnM+XHJcblx0XHRwdWJsaWMgQm9vbGVhbiBWYWxpZGF0ZVRva2VuKFRva2VuIHRva2VuLCBTdHJpbmcgdmFsdWUsIEJvb2xlYW4gaXNGaW5hbClcclxuXHRcdHtcclxuXHRcdFx0U3RyaW5nIGxvd2VyVmFsdWUgPSB2YWx1ZS5Ub0xvd2VyKCk7XHJcblx0XHRcdHN3aXRjaCAodG9rZW4uVmFsdWUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjYXNlIFwiYm9vbGVhbnRydWVcIjpcclxuXHRcdFx0XHRcdHJldHVybiAoaXNGaW5hbCAmJiBUcnVlVmFsdWVzLkNvbnRhaW5zKGxvd2VyVmFsdWUpKSB8fCAoIWlzRmluYWwgJiYgU3RhcnRzV2l0aChUcnVlVmFsdWVzLCBsb3dlclZhbHVlKSk7XHJcblx0XHRcdFx0Y2FzZSBcImJvb2xlYW5mYWxzZVwiOlxyXG5cdFx0XHRcdFx0cmV0dXJuIChpc0ZpbmFsICYmIEZhbHNlVmFsdWVzLkNvbnRhaW5zKGxvd2VyVmFsdWUpKSB8fCAoIWlzRmluYWwgJiYgU3RhcnRzV2l0aChGYWxzZVZhbHVlcywgbG93ZXJWYWx1ZSkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFBhcnNlcyB0aGUgVGV4dFZhbHVlIG9mIHRoZSBub2RlIGludG8gdGhlIGZpbmFsIHZhbHVlXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0Ly8vIDxwYXJhbSBuYW1lPVwidG9rZW5cIj5UaGUgdG9rZW4gdG8gZmluYWxpemU8L3BhcmFtPlxyXG5cdFx0Ly8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj5UaGUgdGV4dCB2YWx1ZSB0byBwYXJzZTwvcGFyYW0+XHJcblx0XHQvLy8gPHJldHVybnM+UmV0dXJucyB0aGUgcGFyc2VkIHJlc3VsdDwvcmV0dXJucz5cclxuXHRcdHB1YmxpYyBPYmplY3QgRmluYWxpemVWYWx1ZShUb2tlbiB0b2tlbiwgU3RyaW5nIHZhbHVlKVxyXG5cdFx0e1xyXG5cdFx0XHRzd2l0Y2ggKHRva2VuLlZhbHVlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y2FzZSBcImJvb2xlYW50cnVlXCI6XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRjYXNlIFwiYm9vbGVhbmZhbHNlXCI6XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgQm9vbGVhbiBTdGFydHNXaXRoKElFbnVtZXJhYmxlPFN0cmluZz4gYWxsb3dlZFZhbHVlcywgU3RyaW5nIHZhbHVlKVxyXG5cdFx0e1xyXG5cdFx0XHRmb3JlYWNoIChTdHJpbmcgYWxsb3dlZFZhbHVlIGluIGFsbG93ZWRWYWx1ZXMpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoYWxsb3dlZFZhbHVlLlN0YXJ0c1dpdGgodmFsdWUpKVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4qL1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL21vZHVsZXMvQm9vbGVhblBhcnNlck1vZHVsZS5qc1xuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxyXG4gKiBQYXR0ZXJuIG9iamVjdFxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBQYXR0ZXJuID0gZnVuY3Rpb24obWF0Y2gsIHBhcnNlcikge1xyXG5cdHRoaXMubWF0Y2ggPSBtYXRjaCB8fCAnJztcclxuXHR0aGlzLnBhcnNlciA9IHBhcnNlcjtcclxufTtcclxuXHJcblBhdHRlcm4ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMubWF0Y2g7XHJcbn07XHJcblBhdHRlcm4ucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oY29udGV4dCwgdmFsdWVzKSB7XHJcblx0cmV0dXJuIHRoaXMucGFyc2VyKGNvbnRleHQsIHZhbHVlcyk7XHJcbn07XHJcblBhdHRlcm4ucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKG90aGVyKSB7XHJcblx0aWYgKCFvdGhlcikgcmV0dXJuIGZhbHNlO1xyXG5cdHJldHVybiB0aGlzLm1hdGNoID09PSBvdGhlci5tYXRjaDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGF0dGVybjtcclxuXHJcbi8qXHJcblx0cHVibGljIGNsYXNzIFBhdHRlcm5cclxuXHR7XHJcblx0XHRwdWJsaWMgU3RyaW5nIE1hdGNoIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5cdFx0cHVibGljIEZ1bmM8UGF0dGVybkNvbnRleHQsIE9iamVjdFtdLCBPYmplY3Q+IFBhcnNlciB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuXHRcdHB1YmxpYyBGdW5jPE9iamVjdFtdLCBPYmplY3Q+IFBhcnNlck5vQ29udGV4dCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuXHJcblx0XHRwdWJsaWMgUGF0dGVybihTdHJpbmcgbWF0Y2gsIEZ1bmM8T2JqZWN0W10sIE9iamVjdD4gcGFyc2VyKVxyXG5cdFx0e1xyXG5cdFx0XHRNYXRjaCA9IG1hdGNoO1xyXG5cdFx0XHRQYXJzZXJOb0NvbnRleHQgPSBwYXJzZXI7XHJcblx0XHR9XHJcblx0XHRwdWJsaWMgUGF0dGVybihTdHJpbmcgbWF0Y2gsIEZ1bmM8UGF0dGVybkNvbnRleHQsIE9iamVjdFtdLCBPYmplY3Q+IHBhcnNlcilcclxuXHRcdHtcclxuXHRcdFx0TWF0Y2ggPSBtYXRjaDtcclxuXHRcdFx0UGFyc2VyID0gcGFyc2VyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBPYmplY3QgUGFyc2UoUGF0dGVybkNvbnRleHQgY29udGV4dCwgT2JqZWN0W10gdmFsdWVzKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoUGFyc2VyTm9Db250ZXh0ICE9IG51bGwpXHJcblx0XHRcdFx0cmV0dXJuIFBhcnNlck5vQ29udGV4dCh2YWx1ZXMpO1xyXG5cdFx0XHRyZXR1cm4gUGFyc2VyKGNvbnRleHQsIHZhbHVlcyk7XHJcblx0XHR9XHJcblxyXG4jaWYgIVNDUklQVFNIQVJQXHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgQm9vbGVhbiBFcXVhbHMoT2JqZWN0IG9iailcclxuXHRcdHtcclxuXHRcdFx0aWYgKFJlZmVyZW5jZUVxdWFscyhudWxsLCBvYmopKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmIChSZWZlcmVuY2VFcXVhbHModGhpcywgb2JqKSkgcmV0dXJuIHRydWU7XHJcblx0XHRcdGlmIChvYmouR2V0VHlwZSgpICE9IEdldFR5cGUoKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRyZXR1cm4gRXF1YWxzKChQYXR0ZXJuKSBvYmopO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByb3RlY3RlZCBCb29sZWFuIEVxdWFscyhQYXR0ZXJuIG90aGVyKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gU3RyaW5nLkVxdWFscyhNYXRjaCwgb3RoZXIuTWF0Y2gpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBvdmVycmlkZSBJbnQzMiBHZXRIYXNoQ29kZSgpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiAoTWF0Y2ggIT0gbnVsbCA/IE1hdGNoLkdldEhhc2hDb2RlKCkgOiAwKTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgU3RyaW5nIFRvU3RyaW5nKClcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIE1hdGNoO1xyXG5cdFx0fVxyXG4jZW5kaWZcclxuKi9cclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9tYXRjaGluZy9QYXR0ZXJuLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxyXG4gKiBCb29sZWFuIHJlc3VsdCB3cmFwcGVyXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEJvb2xlYW5WYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0dGhpcy5ib29sID0gISF2YWx1ZTtcclxufTtcclxuQm9vbGVhblZhbHVlLnByb3RvdHlwZS52YWx1ZU9mID0gZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXMuYm9vbDtcclxufTtcclxuQm9vbGVhblZhbHVlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzLmJvb2wudG9TdHJpbmcoKTtcclxufTtcclxuQm9vbGVhblZhbHVlLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbihvdGhlcikge1xyXG5cdGlmICghKG90aGVyIGluc3RhbmNlb2YgQm9vbGVhblZhbHVlKSlcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHRyZXR1cm4gdGhpcy5ib29sID09PSBvdGhlci5ib29sO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCb29sZWFuVmFsdWU7XHJcblxyXG4vKlxyXG5cdHB1YmxpYyBzdHJ1Y3QgQm9vbGVhblZhbHVlIDogSVZhbHVlXHJcblx0e1xyXG5cdFx0Ly8vIDxzdW1tYXJ5PlxyXG5cdFx0Ly8vIFRoZSBib29sZWFuIHZhbHVlXHJcblx0XHQvLy8gPC9zdW1tYXJ5PlxyXG5cdFx0W0pzb25Qcm9wZXJ0eShcInZcIildXHJcblx0XHRwdWJsaWMgQm9vbGVhbiBCb29sO1xyXG5cclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gR2VuZXJpYyBhY2Nlc3MgdG8gdGhlIG1vc3QgcHJvbWluZW50IHZhbHVlIC5uZXQgdHlwZVxyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdHB1YmxpYyBPYmplY3QgVmFsdWVcclxuXHRcdHtcclxuXHRcdFx0Z2V0IHsgcmV0dXJuIEJvb2w7IH1cclxuXHRcdFx0c2V0IHsgQm9vbCA9IChCb29sZWFuKXZhbHVlOyB9XHJcblx0XHR9XHJcblxyXG5cclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gU2VyaWFsaXplIHRoZSB2YWx1ZSB0byBiaW5hcnkgZGF0YVxyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcblx0XHRwdWJsaWMgQnl0ZVtdIFRvQmluYXJ5KClcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIEJpdENvbnZlcnRlci5HZXRCeXRlcyhCb29sKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcblx0XHQvLy8gUmVhZCB0aGUgdmFsdWUgZGF0YSBmcm9tIGJpbmFyeVxyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdC8vLyA8cGFyYW0gbmFtZT1cImRhdGFcIj48L3BhcmFtPlxyXG5cdFx0cHVibGljIHZvaWQgRnJvbUJpbmFyeShCeXRlW10gZGF0YSlcclxuXHRcdHtcclxuXHRcdFx0Qm9vbCA9IEJpdENvbnZlcnRlci5Ub0Jvb2xlYW4oZGF0YSwgMCk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuXHRcdC8vLyBDb25zdHJ1Y3RvclxyXG5cdFx0Ly8vIDwvc3VtbWFyeT5cclxuXHRcdC8vLyA8cGFyYW0gbmFtZT1cInZhbHVlXCI+PC9wYXJhbT5cclxuXHRcdHB1YmxpYyBCb29sZWFuVmFsdWUoQm9vbGVhbiB2YWx1ZSlcclxuXHRcdHtcclxuXHRcdFx0dGhpcy5Cb29sID0gdmFsdWU7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG92ZXJyaWRlIFN0cmluZyBUb1N0cmluZygpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiBTdHJpbmcuRm9ybWF0KFwiezB9XCIsIHRoaXMuQm9vbCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIG92ZXJyaWRlIEJvb2xlYW4gRXF1YWxzKG9iamVjdCBvYmopXHJcblx0XHR7XHJcblx0XHRcdGlmICghKG9iaiBpcyBCb29sZWFuVmFsdWUpKVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0Qm9vbGVhblZhbHVlIG90aGVyID0gKEJvb2xlYW5WYWx1ZSlvYmo7XHJcblx0XHRcdHJldHVybiB0aGlzLkJvb2wuRXF1YWxzKG90aGVyLkJvb2wpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBvdmVycmlkZSBpbnQgR2V0SGFzaENvZGUoKVxyXG5cdFx0e1xyXG5cdFx0XHR1bmNoZWNrZWRcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLkJvb2wuR2V0SGFzaENvZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBzdGF0aWMgYm9vbCBvcGVyYXRvciA9PShCb29sZWFuVmFsdWUgYSwgQm9vbGVhblZhbHVlIGIpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiBhLkJvb2wuRXF1YWxzKGIuQm9vbCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHN0YXRpYyBib29sIG9wZXJhdG9yICE9KEJvb2xlYW5WYWx1ZSBhLCBCb29sZWFuVmFsdWUgYilcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuICFhLkJvb2wuRXF1YWxzKGIuQm9vbCk7XHJcblx0XHR9XHJcblx0fVxyXG4qL1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3ZhbHVlcy9Cb29sZWFuVmFsdWUuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==