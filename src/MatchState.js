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
      this.logReasons = Boolean(context.reasons);
      this.reasons = [];
    }
  }

  clone() {
    const cloned = new MatchState(this.matchTag, this.context);
    cloned.candidateNodes = this.candidateNodes.map(node => node.clone());
    return cloned;
  }

  /**
   * Add candidate tokens from the path
   * @param root
   * @param previousValues
   * @param parent
   */
  addCandidates(root, previousValues, parent) {
    for (let i = 0; i < root.children.length; i++) {
      const { token, path } = root.children[i];
      const node = new PathNode(token, path);
      node.previousValues = previousValues;
      node.parent = parent;
      this.candidateNodes.push(node);
    }
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
      this.reasons.push(node.finalizeReasons());
    }
    // faster than splice
    // this.candidateNodes.splice(index, 1);
    const len = this.candidateNodes.length - 1;
    this.candidateNodes[index] = this.candidateNodes[len];
    this.candidateNodes.length--;
  }
}

export default MatchState;
