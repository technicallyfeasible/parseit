import PathNode from './matching/PathNode';

class MatchState {
  /**
   * Holds state for a matching session
   */
  constructor(matchTag, context) {
    this.matchTag = matchTag;
    this.context = context;

    this.candidateNodes = [];
    this.newCandidates = [];

    // dictionary of validator instances for the context
    this.validators = null;

    if (context) {
      this.logReasons = !!context.reasons;
      this.reasons = [];
    }
  }

  /**
   * Add candidate tokens from the path
   * @param root
   */
  addCandidates(root, previousValues = []) {
    root.children.forEach(({ token, path }) => {
      const node = new PathNode(token, path);
      node.previousValues = previousValues;
      this.candidateNodes.push(node);
    });
  }

  /**
   * Get the current candidate nodes
   * @returns {Array}
   */
  getCandidateNodes() {
    return this.candidateNodes;
  }

  /**
   * Remove a candidate
   * @param index
   */
  removeCandidate(index) {
    if (this.logReasons) {
      const node = this.candidateNodes[index];
      this.reasons.push(node);
    }
    this.candidateNodes.splice(index, 1);
  }

  /**
   * @preserve Create instances of the validators for use during matching
   * @param validators
   */
  setValidators(validators) {
    this.validators = Object.keys(validators).reduce((r, key) => {
      const Validator = validators[key];
      r[key] = new Validator(this.context);   // eslint-disable-line no-param-reassign
      return r;
    }, {});
  }

  /**
   * Get the validator instances
   * @returns {object}
   */
  getValidator(tag) {
    if (!this.validators) return null;
    return this.validators[tag];
  }
}

export default MatchState;
