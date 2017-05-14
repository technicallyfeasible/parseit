import PatternMatcher from './PatternMatcher';
import PatternContext from './PatternContext';

import DefaultValidator from './validators/DefaultValidator';
import BooleanParserModule from './modules/BooleanParserModule';
import NumberParserModule from './modules/NumberParserModule';
import EmailParserModule from './modules/EmailParserModule';
import UriParserModule from './modules/UriParserModule';

/**
 * @function getPatterns
 * @param {Context} context - The context for which to get the patterns
 */

/**
 * @class Module
 * @type {object}
 * @property {string[]} tokenTags - available token tags
 * @function getPatterns - returns patterns for a tag
 */

const moduleTypes = [
  DefaultValidator,
  BooleanParserModule,
  NumberParserModule,
  EmailParserModule,
  UriParserModule,
];

const namedPatternMatchers = {};


/**
 * Create a new PatternMatcher object including the specified modules
 * @param modules {Module[]} - List of modules to include
 * @param context - A parser context that will be used across all parse calls
 * @returns {PatternMatcher}
 * @constructor
 */
function makePatternMatcher(modules, context) {
  const matcher = new PatternMatcher([]);
  if (!modules) {
    return matcher;
  }

  modules.forEach(Module => {
    const module = new Module(context);

    // add patterns
    if (module.getPatterns) {
      const patterns = module.getPatterns();
      Object.keys(patterns).forEach(tag => matcher.addPatterns(tag, patterns[tag]));
    }

    // register validators
    if (Module.tokenTags) {
      Module.tokenTags.forEach(tag => matcher.registerValidator(tag, module));
    }
  });
  return matcher;
}


class DataParser {
  /**
   * Create a data parser with the specified name and modules. If name and modules is empty, matches all default patterns.
   * Features:
   * - initialize PatternMatcher with a list of modules
   * - patterns depend on context
   * - can initialize patterns based on multiple contexts
   * @param [name] {string} - if a name is specified, remembers the created matcher for quicker reuse
   * @param [modules] {Module[]} - A list of modules to use for matching
   * @param [context] - A parser context that will be used across all parse calls
   * @constructor
   */
  constructor(name, modules, context) {
    if (name && namedPatternMatchers[name] && !modules && !context) {
      this.patternMatcher = namedPatternMatchers[name];
      return;
    }

    this.context = context || new PatternContext();

    this.patternMatcher = makePatternMatcher(modules || moduleTypes, this.context);

    if (name) {
      namedPatternMatchers[name] = this.patternMatcher;
    }
  }

  /**
   * Parse a value into all possible native types
   * @param value
   * @param context - A context for this particular parse
   * @returns {Array}
   */
  parse(value, context) {
    const matchResults = this.patternMatcher.match(context || this.context, value);
    return matchResults || [];
  }
}

export default DataParser;
