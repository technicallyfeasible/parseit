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
