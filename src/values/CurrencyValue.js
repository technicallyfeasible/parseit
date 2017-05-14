// @flow

/**
 * Currency result wrapper
 */
export default class CurrencyValue {
  number: number;
  symbol: ?string;

  constructor(number: number, symbol: ?string) {
    this.number = number;
    this.symbol = symbol;
  }

  valueOf() {
    return this.number;
  }

  toString() {
    return `${this.number}${this.symbol || ''}`;
  }

  equals(other: CurrencyValue) {
    return this.number === other.number && this.symbol === other.symbol;
  }
}
