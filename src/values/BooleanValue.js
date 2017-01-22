/**
 * Boolean result wrapper
 */
class BooleanValue {
  constructor(value) {
    this.bool = Boolean(value);
  }

  valueOf() {
    return this.bool;
  }

  toString() {
    return this.bool.toString();
  }

  equals(other) {
    if (!(other instanceof BooleanValue)) {
      return false;
    }
    return this.bool === other.bool;
  }
}

export default BooleanValue;
