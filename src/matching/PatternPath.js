/**
 * Keeps tree information for patterns
 */


/**
 * Create a new patch
 * @constructor
 */
const PatternPath = function PatternPath() {
  // Paths for all tokens
  this.paths = {};
  // Any patterns finishing at this path
  this.matchedPatterns = [];
};
PatternPath.prototype.toString = function toString() {
  const matches = (this.matchedPatterns || []).join(', ');
  const children = (this.paths.map(token => token.toString())).join(', ');
  return `${matches} :: ${children}`;
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
