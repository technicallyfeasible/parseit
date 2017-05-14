// @flow
import Pattern from '../../matching/Pattern';
import EmailValue from '../../values/EmailValue';

/**
 * Create an EmailValue object
 * @param user
 * @param host
 * @param displayName
 * @return {EmailValue}
 */
function make(user: string, host: string, displayName: string) {
  return new EmailValue(user, host, displayName);
}

const mainPatterns = [
  // email@host.de
  new Pattern('{mail:+}@{mailh:+}', (c, v) => make(v[0], v[2], '')),
  // "Name Last" <email@host.de>
  new Pattern('"{mailn:*}"{el:*}<{mail:+}@{mailh:+}>', (c, v) => make(v[5], v[7], v[1])),
  // Name Last <email@host.de>
  new Pattern('{mailn:+}{el:+}<{mail:+}@{mailh:+}>', (c, v) => make(v[3], v[5], v[0])),
  // "Name Last" <>
  new Pattern('"{mailn:*}"{el:*}<>', (c, v) => make('\'', '', v[1])),
  // (comment)email@host.de
  new Pattern('({mailc:*}){el:*}{mail:+}@{mailh:+}', (c, v) => make(v[4], v[6], v[1])),
  // email(comment)@host.de
  new Pattern('{mail:+}({mailc:*})@{mailh:+}', (c, v) => make(v[0], v[4], v[2])),
  // email@host.de (comment)
  new Pattern('{mail:+}@{mailh:+}{el:*}({mailc:*})', (c, v) => make(v[0], v[2], v[5])),
  // Name (email@host.de), special format that is used in outlook as display sometimes
  new Pattern('{mailn:+}{el:+}({mail:+}@{mailh:+})', (c, v) => make(v[3], v[5], v[0])),
  // Name (email@host.de), special format that is used in outlook as display sometimes
  new Pattern('"{mailn:+}"@{mailh:+}', (c, v) => make(`"${v[1]}"`, v[3], '')),
];

// patterns to find only an email address in any text
const findPatterns = [
  // email@host.de
  new Pattern('{.:*}{mail:+}@{mail:+}{.:*}', (c, v) => make(v[1], v[3], '')),
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
      findmail: findPatterns,
    },
    make,
  };
}
