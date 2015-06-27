/**
 * Pattern object
 */

'use strict';

var Pattern = function(match, parser) {
	this.match = match || '';
	this.parser = parser;
};

Pattern.prototype.toString = function() {
	return this.match;
};
Pattern.prototype.parse = function(context, values) {
	return this.parser(context, values);
};
Pattern.prototype.equals = function(other) {
	if (!other) return false;
	return this.match === other.match;
};

module.exports = Pattern;

/*
	public class Pattern
	{
		public String Match { get; private set; }
		public Func<PatternContext, Object[], Object> Parser { get; private set; }
		public Func<Object[], Object> ParserNoContext { get; private set; }

		public Pattern(String match, Func<Object[], Object> parser)
		{
			Match = match;
			ParserNoContext = parser;
		}
		public Pattern(String match, Func<PatternContext, Object[], Object> parser)
		{
			Match = match;
			Parser = parser;
		}

		public Object Parse(PatternContext context, Object[] values)
		{
			if (ParserNoContext != null)
				return ParserNoContext(values);
			return Parser(context, values);
		}

#if !SCRIPTSHARP
		public override Boolean Equals(Object obj)
		{
			if (ReferenceEquals(null, obj)) return false;
			if (ReferenceEquals(this, obj)) return true;
			if (obj.GetType() != GetType()) return false;
			return Equals((Pattern) obj);
		}

		protected Boolean Equals(Pattern other)
		{
			return String.Equals(Match, other.Match);
		}

		public override Int32 GetHashCode()
		{
			return (Match != null ? Match.GetHashCode() : 0);
		}

		public override String ToString()
		{
			return Match;
		}
#endif
*/
