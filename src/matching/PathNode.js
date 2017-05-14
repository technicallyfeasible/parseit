/**
 * A node in the current parsing session
 */
class PathNode {
  /**
   * Create a new node to hold parsing state
   * @param token
   * @param path
   * @param textValue
   * @constructor
   */
  constructor(token, path, textValue) {
    // The token for comparison
    this.token = token;

    // The matching path for going deeper
    this.path = path;

    // The value which still matches this path
    this.textValue = textValue || '';

    // The final assembled value
    this.value = null;
    // All values of earlier tokens
    this.previousValues = null;

    // True if the value has been finalized and assigned
    this.isFinalized = null;

    // Remember the current state of any matching algorithm
    this.matchState = null;
  }

  clone() {
    const clone = new PathNode(this.token, this.path, this.textValue);
    clone.previousValues = this.previousValues.slice();
    clone.parent = this.parent;
    return clone;
  }

  /**
   * Log a validation reason with result
   * @param test
   * @param args
   * @param result
   */
  logReason(test, args, result) {
    if (!this.reasons) this.reasons = [];
    this.reasons.push({
      test,
      args,
      token: this.token.toString(),
      textValue: this.textValue,
      result,
    });
  }

  findPossiblePatterns(path, isReachable, patterns = []) {
    if (path.matchedPatterns && path.matchedPatterns.length > 0) {
      path.matchedPatterns.forEach(pattern => patterns.push({
        pattern: pattern.match,
        isReachable,
      }));
    }
    if (path.children) {
      for (let i = 0; i < path.children.length; i++) {
        const child = path.children[i];
        const token = child.token;
        this.findPossiblePatterns(child.path, isReachable && token.minCount === 0, patterns);
      }
    }
    return patterns;
  }

  finalizeReasons() {
    // if the result of the last reason check is not false then this node was successfully matched to a pattern
    const result = this.reasons[this.reasons.length - 1].result !== false;
    // traverse node path to the matched patterns and output the failed patterns together with the text that did not match and position
    const patterns = this.findPossiblePatterns(this.path, result);
    return {
      token: this.token,
      textValue: this.textValue,
      patterns,
      reasons: this.reasons,
      result,
    };
  }

  toString() {
    return `${this.token} ~ "${this.textValue}"`;
  }
}

module.exports = PathNode;
