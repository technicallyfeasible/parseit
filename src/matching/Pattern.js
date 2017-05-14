// @flow
import Token from './Token';

class Pattern {
  match: string;
  parser: Function;
  tokens: Array<Token>;

  /**
   * Pattern object
   */
  constructor(match: string, parser: Function) {
    this.match = match || '';
    this.parser = parser;
    this.tokens = Pattern.tokenize(this);
  }

  toString() {
    return this.match;
  }

  parse(context: Object, values: Array<string>) {
    return this.parser(context, values);
  }

  equals(other: Pattern) {
    if (!other) return false;
    return this.match === other.match;
  }

  /**
   * Parse the pattern into tokens
   * @param p
   * @returns {Token[]}
   */
  static tokenize(p: Pattern): Array<Token> {
    const pattern = p.match;
    const tokens = [];

    const pushToken = (value, exactMatch, index) => {
      const token = new Token(value, exactMatch);
      token.pos = index - value.length - (exactMatch ? 0 : 1);
      tokens.push(token);
    };

    let currentToken = '';
    let i;
    for (i = 0; i < pattern.length; i++) {
      switch (pattern[i]) {
        case '{':
          if (!currentToken.length) {
            break;
          }
          pushToken(currentToken, true, i);
          currentToken = '';
          break;
        case '}':
          pushToken(currentToken, false, i);
          currentToken = '';
          break;
        default:
          currentToken += pattern[i];
          break;
      }
    }

    if (currentToken) {
      pushToken(currentToken, true, pattern.length);
    }
    return tokens;
  }
}

export default Pattern;
