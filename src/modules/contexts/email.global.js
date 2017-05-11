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
  const email = (!user && !host ? '' : `${user}@${host}`);
  return new EmailValue(email, displayName);
}

const mainPatterns = [
  // email@host.de
  new Pattern('{el:*}{mail:+}@{mailh:+}{el:*}', (c, v) => make(v[1], v[3], '')),
  // "Name Last" <email@host.de>
  new Pattern('{el:*}"{mailn:*}"{el:*}<{mail:+}@{mailh:+}>{el:*}', (c, v) => make(v[6], v[8], v[2])),
  // Name Last <email@host.de>
  new Pattern('{el:*}{mailn:*}{el:+}<{mail:+}@{mailh:+}>{el:*}', (c, v) => make(v[4], v[6], v[1])),
  // "Name Last" <>
  new Pattern('{el:*}"{mailn:*}"{el:*}<>{el:*}', (c, v) => make('\'', '', v[2])),
  // (comment)email@host.de
  new Pattern('{el:*}({mailc:*}){el:*}{mail:+}@{mailh:+}{el:*}', (c, v) => make(v[5], v[7], v[2])),
  // email(comment)@host.de
  new Pattern('{el:*}{mail:+}({mailc:*})@{mailh:+}{el:*}', (c, v) => make(v[1], v[5], v[3])),
  // email@host.de (comment)
  new Pattern('{el:*}{mail:+}@{mailh:+}{el:*}({mailc:*}){el:*}', (c, v) => make(v[1], v[3], v[6])),
  // Name (email@host.de), special format that is used in outlook as display sometimes
  new Pattern('{el:*}{mailn:+}{el:+}({mail:+}@{mailh:+}){el:*}', (c, v) => make(v[4], v[6], v[1])),
  // Name (email@host.de), special format that is used in outlook as display sometimes
  new Pattern('{el:*}"{mailn:+}"@{mailh:+}{el:*}', (c, v) => make(`"${v[2]}"`, v[4], '')),
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
