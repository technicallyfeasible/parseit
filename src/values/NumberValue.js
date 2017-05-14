// @flow

/**
 * Number result wrapper
 */
export default class NumberValue {
  number: number;
  unit: ?string;
  decimals: ?number;

  constructor(number: number, unit: ?string, decimals: ?number) {
    this.number = number;
    this.unit = unit;
    this.decimals = decimals;
  }

  valueOf() {
    return this.number;
  }

  toString() {
    return `${this.number}${this.unit || ''}`;
  }

  equals(other: NumberValue) {
    return this.number === other.number && this.unit === other.unit && this.decimals === other.decimals;
  }
}
