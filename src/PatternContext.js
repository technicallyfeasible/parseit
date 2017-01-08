class PatternContext {
  /**
   * Context for pattern matching
   * Holds values which may influence parsing outcome like current date and time, location or language
   * @param options {{ [date]: ?Date, [reasons]: ?boolean }}
   */
  constructor(options) {
    const opts = options || {};
    this.date = opts.date || new Date();
    this.reasons = opts.reasons === undefined ? true : opts.reasons;
  }
}

module.exports = PatternContext;
