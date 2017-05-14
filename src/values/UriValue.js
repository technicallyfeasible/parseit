// @flow

/**
 * Uri result wrapper
 */
export default class UriValue {
  scheme: ?string;
  user: ?string;
  password: ?string;
  host: ?string;
  port: ?string;
  path: ?string;
  query: ?string;
  fragment: ?string;

  // calculated member with the string representation of the URI
  value: string;

  constructor({ scheme, user, password, host, port, path, query, fragment }: Object) {
    this.scheme = scheme;
    this.user = user;
    this.password = password;
    this.host = host;
    this.port = port;
    this.path = path;
    this.query = query;
    this.fragment = fragment;

    // construct a string out of these parameters
    this.value = '';
    if (scheme) this.value += `${scheme}:`;
    if (user || password) this.value += `${this.user || ''}:${this.password || ''}@`;
    if (host) this.value += `//${host}`;
    if (port) this.value += `:${port}`;
    if (path) this.value += path;
    if (query) this.value += query;
    if (fragment) this.value += fragment;
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.value;
  }

  equals(other: UriValue) {
    return (
      this.scheme === other.scheme &&
      this.user === other.user &&
      this.password === other.password &&
      this.host === other.host &&
      this.port === other.port &&
      this.path === other.path &&
      this.query === other.query &&
      this.fragment === other.fragment
    );
  }
}
