/**
 * @class PatternContext - Holds values which may influence parsing outcome like current date and time, location or language
 * @type {object}
 * @property language {string} - A language code
 * @property country {string} - A country code
 * @property date {Date} - The current date
 * @property reasons {boolean} - True if reasons for dismissing tokens should be logged during parsing
 */
class PatternContext {
  /**
   * Create a new context
   * @param options {{ [date]: ?Date, [reasons]: ?boolean }}
   * @constructor
   */
  constructor(options) {
    const opts = options || {};
    this.date = opts.date || new Date();
    this.reasons = opts.reasons === undefined ? true : opts.reasons;
    this.language = 'en';
    this.country = 'us';
  }
}

module.exports = PatternContext;
