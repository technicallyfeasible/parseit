/**
 * Holds state for a matching session
 */


const MatchState = function MatchState() {
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
