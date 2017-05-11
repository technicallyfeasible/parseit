const displayRegex = /"/g;

/**
 * Email result wrapper
 */
class EmailValue {
  constructor(email, displayName) {
    this.email = email;
    this.displayName = displayName;
  }

  valueOf() {
    return this.email;
  }

  toString() {
    return `"${this.displayName.replace(displayRegex, '\\"')}" <${this.email}>`;
  }

  equals(other) {
    if (!(other instanceof EmailValue)) {
      return false;
    }
    return this.displayName === other.displayName && this.email === other.email;
  }
}

export default EmailValue;
