/**
 * Context for pattern matching
 * Holds values which may influence parsing outcome like current date and time, location or language
 */

'use strict';

var PatternContext = function(currentDate) {
	this.currentDate = currentDate || new Date();
};

module.exports = PatternContext;

/*
	public class PatternContext
	{
		public LocalDate CurrentDate { get; set; }

		public PatternContext()
		{
			CurrentDate = new LocalDate(DateTime.UtcNow);
		}

		public PatternContext(LocalDate currentDate)
		{
			CurrentDate = currentDate;
		}
	}
*/
