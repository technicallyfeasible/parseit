import Pattern from '../../matching/Pattern';
import NumberValue from '../../values/NumberValue';

function makeScientific(sign, integral, exponent, fractional, groupSeparator, unit)
{
  const decimals = (fractional ? fractional.length : 0);

  if (!integral) {
    integral = '0';
  } else if(groupSeparator.length > 0) {
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
    if (exp >= 0)
      val *= Math.pow(10, exp);
    else
      val /= Math.pow(10, -exp);
  }
  return new NumberValue(val, (unit || ''), decimals);
}

function make(sign, integral, fractional, groupSeparator, unit) {
  return makeScientific(sign, integral, '', fractional, groupSeparator, unit);
}

//
// Patterns for languages with group separator "," and decimal separator "."
//

const floatPatternsDot = [
  new Pattern('{-+:?}{#,:+}.{#:*}', v => make(v[0], v[1], v[3], ',', '')),
  new Pattern('{-+:?}{#:*}.{#:+}', v => make(v[0], v[1], v[3], '', '')),
  new Pattern('{-+:?}{#,:+}.{#:*}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[5] + v[6], v[3], ',', '')),
  new Pattern('{-+:?}{#:+}.{#:*}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[5] + v[6], v[3], '', '')),
];

const integerPatternsDot = [
  new Pattern('{-+:?}{#:+}', v => make(v[0], v[1], '', '', '')),
  new Pattern('{-+:?}{#,:+}', v => make(v[0], v[1], '', ',', '')),
  new Pattern('{-+:?}{#:+}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[3] + v[4], '', '', '')),
  new Pattern('{-+:?}{#,:+}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[3] + v[4], '', ',', '')),
];

//
// Patterns for languages with group separator "." and decimal separator ","
//

const floatPatternsComma = [
  new Pattern('{-+:?}{#.:+},{#:*}', v => make(v[0], v[1], v[3], '.', '')),
  new Pattern('{-+:?}{#:*},{#:+}', v => make(v[0], v[1], v[3], '', '')),
  new Pattern('{-+:?}{#.:+},{#:*}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[5] + v[6], v[3], '.', '')),
  new Pattern('{-+:?}{#:+},{#:*}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[5] + v[6], v[3], '', '')),
];

const integerPatternsComma = [
  new Pattern('{-+:?}{#:+}', v => make(v[0], v[1], '', '', '')),
  new Pattern('{-+:?}{#.:+}', v => make(v[0], v[1], '', '.', '')),
  new Pattern('{-+:?}{#:+}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[3] + v[4], '', '', '')),
  new Pattern('{-+:?}{#.:+}e{-+:?}{#:+}', v => makeScientific(v[0], v[1], v[3] + v[4], '', '.', '')),
];


/**
 * Create the options based on constants
 * @param constants
 */
function makeOptions(constants) {
  /**
   * Make the final output value
   * @param [context] - parser context
   * @param [v]
   * @returns {NumberValue}
   */
  function make(context, v) {
    const value = v && v[1];
    let boolValue = false;
    if (typeof value === 'boolean') {
      boolValue = value;
    } else if (value) {
      const lowerValue = value.toString().toLowerCase();
      boolValue = !!trueLookup[lowerValue];
    }
    return new NumberValue(boolValue);
  }

  return {
    ...constants,
    trueLookup,
    falseLookup,
    patterns: {
      '': [
        new Pattern('{emptyline:*}{booleantrue}{emptyline:*}', make),
        new Pattern('{emptyline:*}{booleanfalse}{emptyline:*}', make),
      ],
    },
    make,
  };
}

export default makeOptions;
