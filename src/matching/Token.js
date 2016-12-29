/**
 * Token value for parsed patterns
 */
class Token {
  /**
   * Maximum times that a token without restriction can be repeated
   * @const
   */
  static MAX_VALUE = 1000;

  /**
   * Creates a new Token
   * @param value {string}
   * @param [exactMatch] {boolean}
   * @constructor
   */
  constructor(value, exactMatch) {
    this.exactMatch = Boolean(exactMatch);
    if (this.exactMatch) {
      this.value = value;
      this.minCount = this.maxCount = 1;
      return;
    }

    const parts = (value || '').split(':');
    this.value = (parts.length > 0 ? parts[0] : '');
    if (parts.length === 1) {
      this.minCount = this.maxCount = 1;
    } else if (parts.length > 1) {
      switch (parts[1]) {
        case '':
          this.minCount = 1;
          this.maxCount = 1;
          break;
        case '+':
          this.minCount = 1;
          this.maxCount = Token.MAX_VALUE;
          break;
        case '*':
          this.minCount = 0;
          this.maxCount = Token.MAX_VALUE;
          break;
        case '?':
          this.minCount = 0;
          this.maxCount = 1;
          break;
        default: {
          const countParts = parts[1].split('-');
          if (countParts.length === 1) {
            this.minCount = this.maxCount = parseInt(countParts[0], 10);
          } else if (countParts.length >= 2) {
            this.minCount = parseInt(countParts[0] || '0', 10);
            this.maxCount = parseInt(countParts[1] || '0', 10);
          }
          break;
        }
      }
    }
    // don't allow max to be smaller than min
    if (this.maxCount < this.minCount) {
      this.maxCount = this.minCount;
    }
  }

  equals(token) {
    if (!token) return false;
    return token.value === this.value &&
      token.minCount === this.minCount &&
      token.maxCount === this.maxCount &&
      token.exactMatch === this.exactMatch;
  }

  toString() {
    if (this.exactMatch) {
      return this.value;
    }
    return `${this.value}:${this.minCount}-${this.maxCount}`;
  }
}

export default Token;
