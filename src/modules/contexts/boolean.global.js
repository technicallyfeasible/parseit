import Pattern from '../../matching/Pattern';
import BooleanValue from '../../values/BooleanValue';

function makeLookup(values) {
  return values.reduce((r, text) => (r[text] = true) && r, {});   // eslint-disable-line no-param-reassign
}

/**
 * Create the options based on constants
 * @param constants
 */
function makeOptions(constants) {
  const trueLookup = makeLookup(constants.trueValues);
  const falseLookup = makeLookup(constants.falseValues);

  /**
   * Make the final output value
   * @param [context] - parser context
   * @param [v]
   * @returns {BooleanValue}
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
    return new BooleanValue(boolValue);
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
