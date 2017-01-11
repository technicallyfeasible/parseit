
/**
 * Validator base class to reduce some boilerplate
 */
class ValidatorBase {
  constructor(context) {
    this.context = context;
  }

  /**
   * Get cache key from context
   * @param context
   * @param keyProps
   * @returns {string}
   */
  static getKey(context = {}, keyProps = []) {
    return keyProps.map(prop => context[prop] || '').join('_');
  }

  /**
   * Store options for the given context. Used to set different values by country or language
   * @param cache
   * @param context
   * @param options
   */
  static defineContext(cache, context, options) {
    /* eslint-disable no-param-reassign */
    // automatically determine which context properties to use for the key
    if (!cache.keys) {
      cache.keys = Object.keys(context);
    }
    cache[ValidatorBase.getKey(context, cache.keys)] = options;
    /* eslint-enable */
  }

  /**
   * Retrieve options matching the given context
   * @param cache
   * @param context
   */
  static getOptions(cache, context) {
    return cache[ValidatorBase.getKey(context, cache.keys)];
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */

  /**
   * Callback handler when a value has to be validated against a token
   * @param context - The current parse context
   * @param token - The token to validate against
   * @param value - The value to validate
   * @param isFinal - True if this is the final validation and no more characters are expected for the value
   * @returns {*} - Returns true if the value matches the token, false if it doesn't match or the token is unknown
   */
  validateToken(context, token, value, isFinal) {
    return false;
  }

  /**
   * Parses the TextValue of the node into the final value
   * @param context - The current parse context
   * @param token - The token to finalize
   * @param value - The text value to parse
   * @returns {*} - Returns the parsed result
   */
  finalizeValue(context, token, value) {
    return value;
  }

  /* eslint-disable class-methods-use-this */
}

export default ValidatorBase;
