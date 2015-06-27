/**
 * Matches patterns according to registered rules
 */

'use strict';

var arrayUtils = require('./utils/arrayUtils');
var Token = require('./matching/Token');
var PatternPath = require('./matching/PatternPath');

/** @const */ var LETTER_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

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

PatternMatcher.prototype.registerValidator = function(tag, module) {

};

module.exports = PatternMatcher;



/*

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

*/
