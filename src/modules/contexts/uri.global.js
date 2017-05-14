// @flow
import Pattern from '../../matching/Pattern';
import UriValue from '../../values/UriValue';

/**
 * Create an UriValue object
 * @param scheme
 * @param host
 * @param port
 * @param path
 * @param query
 * @param fragment
 * @param user
 * @param password
 * @return {UriValue}
 */
function make(scheme: ?string, host: ?string, port: ?string, path: ?string, query: ?string, fragment: ?string, user: ?string, password: ?string) {
  return new UriValue({
    scheme,
    host,
    port,
    path,
    query,
    fragment,
    user,
    password,
  });
}

const mainPatterns = [
  new Pattern('{urischeme:+}://{urihost:+}{uripath:*}{uridelim:?}{uriquery:*}{urifragment:*}', (c, v) => make(v[0], v[2], null, v[3] + v[4], v[5], v[6], null, null)),
  // // https://www.keepzer.com/explore?debug=1#abc
  // new Pattern('{urischeme:+}://{urihost:+}{uripath:*}{uridelim:?}{uriquery:*}{urifragment:*}', (c, v) => make(v[0], v[2], null, v[3] + v[4], v[5], v[6], null, null)),
  // // https://www.keepzer.com:8080/explore/?debug=1#xyz
  // new Pattern('{urischeme:+}://{urihost:+}:{#:1-5}{uripath:*}{uridelim:?}{uriquery:*}{urifragment:*}', (c, v) => make(v[0], v[2], v[4], v[5] + v[6], v[7], v[8], null, null)),
  // // https://192.168.0.1/explore?debug=1#abc
  // new Pattern('{urischeme:+}://{ipv4:+}{uripath:*}{uridelim:?}{uriquery:*}{urifragment:*}', (c, v) => make(v[0], v[2], null, v[3] + v[4], v[5], v[6], null, null)),
  // // https://192.168.0.1:8080/explore/?debug=1#xyz
  // new Pattern('{urischeme:+}://{ipv4:+}:{#:1-5}{uripath:*}{uridelim:?}{uriquery:*}{urifragment:*}', (c, v) => make(v[0], v[2], v[4], v[5] + v[6], v[7], v[8], null, null)),
  // // https://[2001:db8:85a3:0:0:8a2e:370:7334]/explore?debug=1#abc
  // new Pattern('{urischeme:+}://[{ipv6:+}]{uripath:*}{uridelim:?}{uriquery:*}{urifragment:*}', (c, v) => make(v[0], `[${v[2]}]`, null, v[4] + v[5], v[6], v[7], null, null)),
  // // https://[2001:db8:85a3:0:0:8a2e:370:7334]:8080/explore/?debug=1#xyz
  // new Pattern('{urischeme:+}://[{ipv6:+}]:{#:1-5}{uripath:*}{uridelim:?}{uriquery:*}{urifragment:*}', (c, v) => make(v[0], `[${v[2]}]`, v[4], v[5] + v[6], v[7], v[8], null, null)),
  // // /explore?debug=1#abc
  // new Pattern('{uripath:+}{uridelim:?}{uriquery:*}{urifragment:*}', (c, v) => make(null, null, null, v[0] + v[1], v[2], v[3], null, null)),
  // // ftp://jens:test@testme.com/public
  // new Pattern('{urischeme:+}://{w:+}:{w:+}@{urihost:+}{uripath:*}{uridelim:?}{uriquery:*}{urifragment:*}', (c, v) => make(v[0], v[6], null, v[7] + v[8], v[10], v[11], v[2], v[4])),
  // // ftp://jens@testme.com/public
  // new Pattern('{urischeme:+}://{w:+}@{urihost:+}{uripath:*}{uridelim:?}{uriquery:*}{urifragment:*}', (c, v) => make(v[0], v[4], null, v[5] + v[6], v[7], v[8], v[2], null)),
];


/**
 * Create the options based on constants
 * @param constants
 */
export default function makeOptions(constants : Object) {
  return {
    ...constants,
    patterns: {
      '': mainPatterns,
    },
    make,
  };
}
