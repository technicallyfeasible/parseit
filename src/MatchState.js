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

    if (context) {
      this.logReasons = !!context.reasons;
      this.reasons = [];
    }
  }

  /**
   * Add candidate tokens from the path
   * @param root
   */
  addCandidates(root) {
    root.children.forEach(({ token, path }) => {
      this.candidateNodes.push(new PathNode(token, path));
    });
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
}

export default MatchState;
