import Pattern from '../matching/Pattern';
import BooleanValue from '../values/BooleanValue';

import { startsWith } from '../utils/arrayUtils';

export const constants = {
  trueValues: ['1', 'true', 'wahr'],
  falseValues: ['0', 'false', 'falsch'],
};
constants.trueLookup = constants.trueValues.reduce((r, text) => (r[text] = true) && r, {});   // eslint-disable-line no-param-reassign
constants.falseLookup = constants.falseValues.reduce((r, text) => (r[text] = true) && r, {}); // eslint-disable-line no-param-reassign

/**
 * Make the final output value
 * @param value
 * @returns {BooleanValue}
 */
function make(value) {
  let boolValue = false;
  if (typeof value === 'boolean') {
    boolValue = value;
  } else if (value) {
    const lowerValue = value.toString().toLowerCase();
    boolValue = !constants.falseLookup[lowerValue];
  }
  return new BooleanValue(boolValue);
}
/**
 * Reusable wrapper for the two patterns
 * @param context
 * @param v
 */
function parsePattern(context, v) {
  return make(v[1]);
}

const mainPatterns = [
  new Pattern('{emptyline:*}{booleantrue}{emptyline:*}', parsePattern),
  new Pattern('{emptyline:*}{booleanfalse}{emptyline:*}', parsePattern),
];


class BooleanParserModule {
  patternTags = [''];
  tokenTags = ['booleanfalse', 'booleantrue'];

  /* eslint-disable class-methods-use-this, no-unused-vars */

  /**
   * Return the patterns for the tag
   * @param tag {string}
   */
  getPatterns(tag) {
    if (tag === '') {
      return mainPatterns;
    }
    return [];
  }

  /**
   * Callback handler when a value has to be validated against a token
   * @param token - The token to validate against
   * @param value - The value to validate
   * @param isFinal - True if this is the final validation and no more characters are expected for the value
   * @returns {*} - Returns true if the value matches the token, false if it doesn't match or the token is unknown
   */
  validateToken(token, value, isFinal) {
    const lowerValue = value.toLowerCase();
    switch (token.value) {
      case 'booleantrue':
        return (isFinal && constants.trueLookup[lowerValue]) || (!isFinal && startsWith(constants.trueValues, lowerValue));
      case 'booleanfalse':
        return (isFinal && constants.falseLookup[lowerValue]) || (!isFinal && startsWith(constants.falseValues, lowerValue));
      default:
        return false;
    }
  }

  /**
   * Parses the TextValue of the node into the final value
   * @param token - The token to finalize
   * @param value - The text value to parse
   * @returns {*} - Returns the parsed result
   */
  finalizeValue(token, value) {
    switch (token.value) {
      case 'booleantrue':
        return true;
      case 'booleanfalse':
        return false;
      default:
        return value;
    }
  }

  /* eslint-enable */
}

export default BooleanParserModule;

/*
  public class BooleanParserModule : IParserModule
  {
    private static readonly HashSet<String> TrueValues = new HashSet<String> { "true", "wahr" };
    private static readonly HashSet<String> FalseValues = new HashSet<String> { "false", "falsch" };

    private static readonly Pattern[] MainPatterns =
        {
            new Pattern("{emptyline:*}{booleantrue}{emptyline:*}", v => Make(v[1])),
            new Pattern("{emptyline:*}{booleanfalse}{emptyline:*}", v => Make(v[1]))
        };


    /// <summary>
    /// Make the final output value
    /// </summary>
    /// <param name="value"></param>
    /// <returns></returns>
    private static BooleanValue Make(Object value)
    {
      var boolValue = false;
      if (value is Boolean)
        boolValue = (Boolean) value;
      if (value != null)
      {
        String lowerValue = value.ToString().ToLower();
        boolValue = TrueValues.Contains(lowerValue);
      }
      return new BooleanValue(boolValue);
    }


    /// <summary>
    /// Returns the defined tags for which patterns exist
    /// </summary>
    public String[] PatternTags
    {
      get { return new[] { "" }; }
    }

    /// <summary>
    /// Get the patterns for a specific tag
    /// </summary>
    /// <param name="patternTag"></param>
    /// <returns></returns>
    public Pattern[] GetPatterns(String patternTag)
    {
      switch (patternTag)
      {
        case "":
          return MainPatterns;
      }
      return new Pattern[0];
    }

    /// <summary>
    /// Returns the defined tags which can be parsed as tokens
    /// </summary>
    public String[] TokenTags
    {
      get { return new[] { "booleanfalse", "booleantrue" }; }
    }

    /// <summary>
    /// Callback handler when a value has to be validated against a token
    /// </summary>
    /// <param name="token">The token to validate against</param>
    /// <param name="value">The value to validate</param>
    /// <param name="isFinal">True if this is the final validation and no more characters are expected for the value</param>
    /// <returns>Returns true if the value matches the token, false if it doesn't match or the token is unknown</returns>
    public Boolean ValidateToken(Token token, String value, Boolean isFinal)
    {
      String lowerValue = value.ToLower();
      switch (token.Value)
      {
        case "booleantrue":
          return (isFinal && TrueValues.Contains(lowerValue)) || (!isFinal && StartsWith(TrueValues, lowerValue));
        case "booleanfalse":
          return (isFinal && FalseValues.Contains(lowerValue)) || (!isFinal && StartsWith(FalseValues, lowerValue));
      }

      return false;
    }

    /// <summary>
    /// Parses the TextValue of the node into the final value
    /// </summary>
    /// <param name="token">The token to finalize</param>
    /// <param name="value">The text value to parse</param>
    /// <returns>Returns the parsed result</returns>
    public Object FinalizeValue(Token token, String value)
    {
      switch (token.Value)
      {
        case "booleantrue":
          return true;
        case "booleanfalse":
          return false;
      }
      return value;
    }

    private Boolean StartsWith(IEnumerable<String> allowedValues, String value)
    {
      foreach (String allowedValue in allowedValues)
      {
        if (allowedValue.StartsWith(value))
          return true;
      }
      return false;
    }
  }
}
*/
