/**
 * Keeps tree information for patterns
 */
class PatternPath {
  /**
   * Create a new patch
   * @constructor
   */
  constructor() {
    // Paths by token key
    this.paths = {};
    // child paths with token
    this.children = [];
    // Any patterns finishing at this path
    this.matchedPatterns = [];
  }

  /**
   * Add more tokens to the path and create sub-paths as necessary
   * @param pattern - the pattern to add
   * @param start - index of first token to add to this path
   */
  addPattern(pattern, start = 0) {
    const tokens = pattern.tokens;
    if (tokens.length <= start) return;

    const token = tokens[start];
    const tokenKey = token.toString();
    // check if the exact same node exists and take it if it does
    let path = this.paths[tokenKey];
    if (!path) {
      path = new PatternPath();
      this.paths[tokenKey] = path;
      this.children.push({
        token,
        path,
      });
    }

    // add remaining tokens to sub path
    if (tokens.length > (start + 1)) {
      path.addPattern(pattern, start + 1);
    } else if (path.matchedPatterns.indexOf(pattern) === -1) {
      // remember the matched pattern if this was the last token
      path.matchedPatterns.push(pattern);
    }
  }

  toString() {
    const matches = (this.matchedPatterns || []).join(', ');
    const children = Object.keys(this.paths).join(', ');
    return `${matches} :: ${children}`;
  }
}

module.exports = PatternPath;
