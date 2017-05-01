// @flow
import Pattern from '../../matching/Pattern';
import NumberValue from '../../values/NumberValue';

function makeScientific(sign: string, integral: string, exponent: string, fractional: string, groupSeparator: string, unit: string) {
  /* eslint-disable no-param-reassign */
  const decimals = (fractional ? fractional.length : 0);

  if (!integral) {
    integral = '0';
  } else if (groupSeparator.length > 0) {
    integral = integral.replace(groupSeparator, '');
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

//
// Patterns for languages with group separator "," and decimal separator "."
//

export const floatPatternsDot = [
  new Pattern('{-+:?}{#,:+}.{#:*}', v => make(v[0], v[1], v[3], ',', '')),
  new Pattern('{-+:?}{#:*}.{#:+}', v => make(v[0], v[1], v[3], '', '')),
  new Pattern('{-+:?}{#,:+}.{#:*}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[5] + v[6], v[3], ',', '')),
  new Pattern('{-+:?}{#:+}.{#:*}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[5] + v[6], v[3], '', '')),
];

export const integerPatternsGroupComma = [
  new Pattern('{-+:?}{#:+}', v => make(v[0], v[1], '', '', '')),
  new Pattern('{-+:?}{#,:+}', v => make(v[0], v[1], '', ',', '')),
  new Pattern('{-+:?}{#:+}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[3] + v[4], '', '', '')),
  new Pattern('{-+:?}{#,:+}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[3] + v[4], '', ',', '')),
];

//
// Patterns for languages with group separator "." and decimal separator ","
//

export const floatPatternsComma = [
  new Pattern('{-+:?}{#.:+},{#:*}', v => make(v[0], v[1], v[3], '.', '')),
  new Pattern('{-+:?}{#:*},{#:+}', v => make(v[0], v[1], v[3], '', '')),
  new Pattern('{-+:?}{#.:+},{#:*}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[5] + v[6], v[3], '.', '')),
  new Pattern('{-+:?}{#:+},{#:*}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[5] + v[6], v[3], '', '')),
];

export const integerPatternsGroupDot = [
  new Pattern('{-+:?}{#:+}', v => make(v[0], v[1], '', '', '')),
  new Pattern('{-+:?}{#.:+}', v => make(v[0], v[1], '', '.', '')),
  new Pattern('{-+:?}{#:+}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[3] + v[4], '', '', '')),
  new Pattern('{-+:?}{#.:+}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[3] + v[4], '', '.', '')),
];


/**
 * Create the options based on constants
 * @param constants
 */
function makeOptions(constants : Object) {
  const { commaDecimal } = constants;

  return {
    ...constants,
    patterns: {
      '': [
        ...(commaDecimal ? floatPatternsComma : floatPatternsDot),
        ...(commaDecimal ? integerPatternsGroupDot : integerPatternsGroupComma),
      ],
    },
    make,
  };
}

export default makeOptions;
