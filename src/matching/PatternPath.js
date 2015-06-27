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
