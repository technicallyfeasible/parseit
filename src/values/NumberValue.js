/**
 * Number result wrapper
 */
class NumberValue {
  constructor(number, unit, decimals) {
    this.number = number;
    this.unit = unit;
    this.decimals = decimals;
  }

  valueOf() {
    return this.number;
  }

  toString() {
    return `${this.number}${this.unit}`;
  }

  equals(other) {
    if (!(other instanceof NumberValue)) {
      return false;
    }
    return this.number === other.number && this.unit === other.unit && this.decimals === other.decimals;
  }
}

export default NumberValue;
