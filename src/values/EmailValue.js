// @flow

const displayRegex = /"/g;

/**
 * Email result wrapper
 */
export default class EmailValue {
  name: string;
  host: string;
  displayName: ?string;

  constructor(name: string, host: string, displayName: ?string) {
    this.name = name;
    this.host = host;
    this.displayName = displayName;
  }

  valueOf() {
    return `${this.name}@${this.host}`;
  }

  toString() {
    if (!this.displayName) {
      return this.valueOf();
    }
    return `"${this.displayName.replace(displayRegex, '\\"')}" <${this.valueOf()}>`;
  }

  equals(other: EmailValue) {
    return this.displayName === other.displayName && this.name === other.name && this.host === other.host;
  }
}
