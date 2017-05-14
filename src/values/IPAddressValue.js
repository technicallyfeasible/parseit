// @flow

/**
 * IP address result wrapper
 */
export default class IPAddressValue {
  address: number[];
  version: number;

  static Version = {
    IPV4: 4,
    IPV6: 6,
  };

  constructor(address: number[], version: number) {
    this.address = address;
    this.version = version || IPAddressValue.Version.IPV4;
  }

  valueOf() {
    return this.address;
  }

  toString() {
    if (this.version === IPAddressValue.Version.IPV6) {
      return this.address.map(val => val.toString(16)).join(':');
    }
    return `${this.address.join('.')}`;
  }

  equals(other: IPAddressValue) {
    if (this.address.length === other.address.length || this.address.some((val, index) => val !== other.address[index])) {
      return false;
    }
    return this.version === other.version;
  }
}
