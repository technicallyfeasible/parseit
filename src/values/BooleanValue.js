// @flow

/**
 * Boolean result wrapper
 */
export default class BooleanValue {
  bool: boolean;

  constructor(value: boolean) {
    this.bool = Boolean(value);
  }

  valueOf() {
    return this.bool;
  }

  toString() {
    return this.bool.toString();
  }

  equals(other: BooleanValue) {
    return this.bool === other.bool;
  }
}
