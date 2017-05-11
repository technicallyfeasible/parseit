// @flow
import Pattern from '../../matching/Pattern';
import NumberValue from '../../values/NumberValue';

const groupRegex = {
  '.': /\./g,
  ',': /,/g,
};

/**
 * Make a number out of string parts
 * @param sign
 * @param integral
 * @param exponent
 * @param fractional
 * @param groupSeparator
 * @param unit
 * @return {NumberValue}
 */
function make(sign: string, integral: string, exponent: ?string, fractional: ?string, groupSeparator: ?string, unit: ?string) {
  /* eslint-disable no-param-reassign */
  let decimals = (fractional ? fractional.length : 0);

  if (!integral) {
    integral = '0';
  } else if (groupSeparator) {
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
    // with an exponent we also need to adjust the number of decimals
    decimals = Math.round(decimals - exp);
    if (decimals < 0) decimals = 0;
  }
  return new NumberValue(val, (unit || ''), decimals);
  /* eslint-enable */
}

function getTokens(commaDecimal) {
  return {
    decimal: commaDecimal ? ',' : '.',
    groupSep: commaDecimal ? '.' : ',',
    group: commaDecimal ? '{#.:+}' : '{#,:+}',
  };
}

function getFloatPatterns(commaDecimal) {
  const { decimal, groupSep, group } = getTokens(commaDecimal);
  return [
    new Pattern(`{-+:?}${group}${decimal}{#:*}`, (c, v) => make(v[0], v[1], null, v[3], groupSep, null)),
    new Pattern(`{-+:?}{#:*}${decimal}{#:+}`, (c, v) => make(v[0], v[1], null, v[3], null, null)),
    new Pattern(`{-+:?}${group}${decimal}{#:*}e{-+:?}{#:+}`, (c, v) => make(v[0], v[1], v[5] + v[6], v[3], groupSep, null)),
    new Pattern(`{-+:?}${group}${decimal}{#:*}e{-+:?}{#:+}${decimal}{#:+}`, (c, v) => make(v[0], v[1], `${v[5]}${v[6]}.${v[8]}`, v[3], groupSep, null)),
    new Pattern(`{-+:?}{#:+}${decimal}{#:*}e{-+:?}{#:+}`, (c, v) => make(v[0], v[1], v[5] + v[6], v[3], null, null)),
    new Pattern(`{-+:?}{#:+}${decimal}{#:*}e{-+:?}{#:+}${decimal}{#:+}`, (c, v) => make(v[0], v[1], `${v[5]}${v[6]}.${v[8]}`, v[3], null, null)),
  ];
}

function getIntegerPatterns(commaDecimal) {
  const { decimal, groupSep, group } = getTokens(commaDecimal);
  return [
    new Pattern('{-+:?}{#:+}', (c, v) => make(v[0], v[1], null, '', null, null)),
    new Pattern(`{-+:?}${group}`, (c, v) => make(v[0], v[1], null, '', groupSep, null)),
    new Pattern('{-+:?}{#:+}e{-+:?}{#:+}', (c, v) => make(v[0], v[1], v[3] + v[4], '', null, null)),
    new Pattern(`{-+:?}{#:+}e{-+:?}{#:+}${decimal}{#:+}`, (c, v) => make(v[0], v[1], `${v[3]}${v[4]}.${v[6]}`, '', null, null)),
    new Pattern(`{-+:?}${group}e{-+:?}{#:+}`, (c, v) => make(v[0], v[1], v[3] + v[4], '', groupSep, null)),
    new Pattern(`{-+:?}${group}e{-+:?}{#:+}${decimal}{#:+}`, (c, v) => make(v[0], v[1], `${v[3]}${v[4]}.${v[6]}`, '', groupSep, null)),
  ];
}

function getMainPatterns(commaDecimal) {
  const { decimal, groupSep, group } = getTokens(commaDecimal);
  const pre = '{ :*}';
  const post = '{ :*}{unit:*}{ :*}';
  return [
    // float
    new Pattern(`${pre}{-+:?}${group}${decimal}{#:*}${post}`, (c, v) => make(v[1], v[2], null, v[4], groupSep, v[6])),
    new Pattern(`${pre}{-+:?}{#:*}${decimal}{#:+}${post}`, (c, v) => make(v[1], v[2], null, v[4], null, v[6])),
    new Pattern(`${pre}{-+:?}${group}${decimal}{#:*}e{-+:?}{#:+}${post}`, (c, v) => make(v[1], v[2], v[6] + v[7], v[4], groupSep, v[9])),
    new Pattern(`${pre}{-+:?}${group}${decimal}{#:*}e{-+:?}{#:+}${decimal}{#:+}${post}`, (c, v) => make(v[1], v[2], `${v[6]}${v[7]}.${v[9]}`, v[4], groupSep, v[11])),
    new Pattern(`${pre}{-+:?}{#:+}${decimal}{#:*}e{-+:?}{#:+}${post}`, (c, v) => make(v[1], v[2], v[6] + v[7], v[4], null, v[9])),
    new Pattern(`${pre}{-+:?}{#:+}${decimal}{#:*}e{-+:?}{#:+}${decimal}{#:+}${post}`, (c, v) => make(v[1], v[2], `${v[6]}${v[7]}.${v[9]}`, v[4], null, v[11])),
    // integer
    new Pattern(`${pre}{-+:?}{#:+}${post}`, (c, v) => make(v[1], v[2], null, '', null, v[4])),
    new Pattern(`${pre}{-+:?}${group}${post}`, (c, v) => make(v[1], v[2], null, '', groupSep, v[4])),
    new Pattern(`${pre}{-+:?}{#:+}e{-+:?}{#:+}${post}`, (c, v) => make(v[1], v[2], v[4] + v[5], '', null, v[7])),
    new Pattern(`${pre}{-+:?}{#:+}e{-+:?}{#:+}${decimal}{#:+}${post}`, (c, v) => make(v[1], v[2], `${v[4]}${v[5]}.${v[7]}`, '', null, v[9])),
    new Pattern(`${pre}{-+:?}${group}e{-+:?}{#:+}${post}`, (c, v) => make(v[1], v[2], v[4] + v[5], '', groupSep, v[7])),
    new Pattern(`${pre}{-+:?}${group}e{-+:?}{#:+}${decimal}{#:+}${post}`, (c, v) => make(v[1], v[2], `${v[4]}${v[5]}.${v[7]}`, '', groupSep, v[9])),
    // // eslint-disable-next-line no-param-reassign
    // new Pattern(`${pre}{float:+}${post}`, (c, v) => { v[1].unit = v[3] || ''; return v[1]; }),
    // // eslint-disable-next-line no-param-reassign
    // new Pattern(`${pre}{int:+}${post}`, (c, v) => { v[1].unit = v[3] || ''; return v[1]; }),
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
