// @flow
import Pattern from '../../matching/Pattern';
import NumberValue from '../../values/NumberValue';

const groupRegex = {
  '.': /\./g,
  ',': /,/g,
};

function makeScientific(sign: string, integral: string, exponent: string, fractional: string, groupSeparator: string, unit: string) {
  /* eslint-disable no-param-reassign */
  const decimals = (fractional ? fractional.length : 0);

  if (!integral) {
    integral = '0';
  } else if (groupSeparator.length > 0) {
    integral = integral.replace(groupRegex[groupSeparator], '');
  }
  if (!fractional) {
    fractional = '0';
  }
  let val = parseFloat(`${integral}.${fractional}`);
  if (sign === '-') {
    val = -val;
  }
  if (exponent) {
    const exp = parseFloat(exponent);
    if (exp >= 0) {
      val *= (10 ** exp);
    } else {
      val /= (10 ** (-exp));
    }
  }
  return new NumberValue(val, (unit || ''), decimals);
  /* eslint-enable */
}

function make(sign: string, integral: string, fractional: string, groupSeparator: string, unit: string) {
  return makeScientific(sign, integral, '', fractional, groupSeparator, unit);
}

function getFloatPatterns(commaDecimal) {
  const decimal = commaDecimal ? ',' : '.';
  const groupSep = commaDecimal ? '.' : ',';
  const group = commaDecimal ? '{#.:+}' : '{#,:+}';
  return [
    new Pattern(`{-+:?}${group}${decimal}{#:*}`, (c, v) => make(v[0], v[1], v[3], groupSep, '')),
    new Pattern(`{-+:?}{#:*}${decimal}{#:+}`, (c, v) => make(v[0], v[1], v[3], '', '')),
    new Pattern(`{-+:?}${group}${decimal}{#:*}e{-+:?}{#:+}`, (c, v) => makeScientific(v[0], v[1], v[5] + v[6], v[3], groupSep, '')),
    new Pattern(`{-+:?}{#:+}${decimal}{#:*}e{-+:?}{#:+}`, (c, v) => makeScientific(v[0], v[1], v[5] + v[6], v[3], '', '')),
  ];
}

function getIntegerPatterns(commaDecimal) {
  const groupSep = commaDecimal ? '.' : ',';
  const group = commaDecimal ? '{#.:+}' : '{#,:+}';
  return [
    new Pattern('{-+:?}{#:+}', (c, v) => make(v[0], v[1], '', '', '')),
    new Pattern(`{-+:?}${group}`, (c, v) => make(v[0], v[1], '', groupSep, '')),
    new Pattern('{-+:?}{#:+}e{-+:?}{#:+}', (c, v) => makeScientific(v[0], v[1], v[3] + v[4], '', '', '')),
    new Pattern(`{-+:?}${group}e{-+:?}{#:+}`, (c, v) => makeScientific(v[0], v[1], v[3] + v[4], '', groupSep, '')),
  ];
}

function getMainPatterns(commaDecimal) {
  const decimal = commaDecimal ? ',' : '.';
  const groupSep = commaDecimal ? '.' : ',';
  const group = commaDecimal ? '{#.:+}' : '{#,:+}';
  const pre = '{ :*}';
  const post = '{ :*}{unit:*}{ :*}';
  return [
    // float
    new Pattern(`${pre}{-+:?}${group}${decimal}{#:*}${post}`, (c, v) => make(v[1], v[2], v[4], groupSep, v[6])),
    new Pattern(`${pre}{-+:?}{#:*}${decimal}{#:+}${post}`, (c, v) => make(v[1], v[2], v[4], '', v[6])),
    new Pattern(`${pre}{-+:?}${group}${decimal}{#:*}e{-+:?}{#:+}${post}`, (c, v) => makeScientific(v[1], v[2], v[6] + v[7], v[4], groupSep, v[9])),
    new Pattern(`${pre}{-+:?}{#:+}${decimal}{#:*}e{-+:?}{#:+}${post}`, (c, v) => makeScientific(v[1], v[2], v[6] + v[7], v[4], '', v[9])),
    // integer
    new Pattern(`${pre}{-+:?}{#:+}${post}`, (c, v) => make(v[1], v[2], '', '', v[4])),
    new Pattern(`${pre}{-+:?}${group}${post}`, (c, v) => make(v[1], v[2], '', groupSep, v[4])),
    new Pattern(`${pre}{-+:?}{#:+}e{-+:?}{#:+}${post}`, (c, v) => makeScientific(v[1], v[2], v[4] + v[5], '', '', v[7])),
    new Pattern(`${pre}{-+:?}${group}e{-+:?}{#:+}${post}`, (c, v) => makeScientific(v[1], v[2], v[4] + v[5], '', groupSep, v[7])),
  ];
}

/**
 * Pattern cache so we don't use so much memory
 */
const dotPatterns = {
  '': getMainPatterns(false),
  int: getIntegerPatterns(false),
  float: getFloatPatterns(false),
};
const commaPatterns = {
  '': getMainPatterns(true),
  int: getIntegerPatterns(true),
  float: getFloatPatterns(true),
};

/**
 * Create the options based on constants
 * @param constants
 */
function makeOptions(constants : Object) {
  const { commaDecimal } = constants;

  return {
    ...constants,
    patterns: commaDecimal ? commaPatterns : dotPatterns,
    make,
  };
}

export default makeOptions;
