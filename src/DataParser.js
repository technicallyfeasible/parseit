/**
 * Parses data values to figure out what actual type they are
 */

/**
 * @class Module
 * @type {object}
 * @property {string[]} patternTags - available pattern tags
 * @property {string[]} tokenTags - available token tags
 * @property {function(string)} getPatterns - returns patterns for a tag
 */

'use strict';

var PatternMatcher = require('./PatternMatcher');

var moduleTypes = [
	require('./modules/BooleanParserModule')
	/*require('./modules/NumberParserModule'),
	require('./modules/DateParserModule'),
	require('./modules/AddressParserModule'),
	require('./modules/CurrencyParserModule'),
	require('./modules/UrlParserModule'),
	require('./modules/IpParserModule'),
	require('./modules/EmailParserModule')*/
];
//var dateModuleTypes = [
	/*require('./modules/NumberParserModule'),
	require('./modules/DateParserModule')*/
//];

var defaultPatternMatcher = null;
//var datePatternMatcher = null;
var namedPatternMatchers = {};


/**
 * Create a new PatternMatcher object including the specified modules
 * @param modules {Module[]} - List of modules to include
 * @returns {PatternMatcher}
 * @constructor
 */
function makePatternMatcher(modules) {
	var matcher = new PatternMatcher([]);
	if (!modules)
		return matcher;

	modules.forEach(function(Module) {
		var module = new Module();
		var i, tag;

		// add patterns
		for (i = 0; i < module.patternTags.length; i++) {
			tag = module.patternTags[i];
			matcher.addPatterns(tag, module.getPatterns(tag));
		}

		// register validators
		for (i = 0; i < module.tokenTags.length; i++) {
			tag = module.tokenTags[i];
			matcher.registerValidator(tag, module);
		}
	});
	return matcher;
}

/**
 * Make sure the default pattern matcher including all patterns is available and return it
 * @returns {PatternMatcher}
 */
function getDefaultPatternMatcher() {
	if (!defaultPatternMatcher)
		defaultPatternMatcher = makePatternMatcher(moduleTypes);
	return defaultPatternMatcher;
}


/**
 * Create a data parser with the specified name and modules. If name and modules is empty, matches all default patterns.
 * @param name
 * @param modules
 * @constructor
 */
var DataParser = function(name, modules) {
	if (!name || !modules) {
		this.patternMatcher = getDefaultPatternMatcher();
	} else {
		if (namedPatternMatchers[name])
			return;

		this.patternMatcher = makePatternMatcher(modules);
		namedPatternMatchers[name] = this.patternMatcher;
	}
};

/*
{
	private static readonly Type[] ModuleTypes =
	{
		typeof(NumberParserModule), typeof(DateParserModule), typeof(AddressParserModule), typeof(CurrencyParserModule), typeof(BooleanParserModule),
		typeof(UrlParserModule), typeof(IpParserModule), typeof(EmailParserModule)
	};
	private static readonly Type[] DateModuleTypes =
	{
		typeof(NumberParserModule), typeof(DateParserModule)
	};
	private static readonly PatternMatcher DefaultPatternMatcher;
	private static readonly PatternMatcher DatePatternMatcher;
	private static readonly Dictionary<String, PatternMatcher> NamedPatternMatchers = new Dictionary<String, PatternMatcher>();

	private readonly PatternMatcher patternMatcher;

	/// <summary>
	/// Default context for parsing
	/// </summary>
	public PatternContext DefaultPatternContext { get; set; }

	/// <summary>
	/// Load all patterns from the defined modules
	/// </summary>
	static DataParser()
	{
		DefaultPatternMatcher = makePatternMatcher(ModuleTypes);
		DatePatternMatcher = makePatternMatcher(DateModuleTypes);
	}

	/// <summary>
	/// Use the default pattern matcher
	/// </summary>
	public DataParser()
	{
		this.patternMatcher = DefaultPatternMatcher;
	}

	/// <summary>
	/// Load all patterns from the defined modules
	/// </summary>
	public DataParser(String name, Type[] modules)
	{
		if (String.IsNullOrEmpty(name) || modules == null)
		{
			this.patternMatcher = DefaultPatternMatcher;
			return;
		}

		if (NamedPatternMatchers.TryGetValue(name, out this.patternMatcher) && this.patternMatcher != null)
			return;

		this.patternMatcher = makePatternMatcher(modules);
		NamedPatternMatchers[name] = this.patternMatcher;
	}


	private static PatternMatcher makePatternMatcher(Type[] modules)
	{
		PatternMatcher matcher = new PatternMatcher(new Pattern[0]);

		foreach (Type moduleType in modules)
		{
			IParserModule module = Activator.CreateInstance(moduleType) as IParserModule;
			if (module == null) continue;

			// add patterns
			foreach (String tag in module.PatternTags)
				matcher.AddPatterns(tag, module.GetPatterns(tag));

			// register validators
			foreach (String tag in module.TokenTags)
				matcher.RegisterValidator(tag, module);
		}
		return matcher;
	}

	/// <summary>
	/// Parse a value into all possible native types
	/// </summary>
	/// <param name="value"></param>
	/// <returns></returns>
	public List<IValue> Parse(String value)
	{
		return Parse(DefaultPatternContext ?? new PatternContext(), value);
	}

	/// <summary>
	/// Parse a value into all possible native types
	/// </summary>
	/// <param name="context"></param>
	/// <param name="value"></param>
	/// <returns></returns>
	public List<IValue> Parse(PatternContext context, String value)
	{
		List<Object> matchResults = this.patternMatcher.Match(context, value);
		return (matchResults == null ? new List<IValue>() : matchResults.Cast<IValue>().ToList());
	}

	/// <summary>
	/// Parse a value as a LocalDate
	/// </summary>
	/// <param name="value"></param>
	/// <returns></returns>
	public LocalDate ParseDate(String value)
	{
		return ParseDate(DefaultPatternContext ?? new PatternContext(), value);
	}

	/// <summary>
	/// Parse a value as a LocalDate
	/// </summary>
	/// <param name="context"></param>
	/// <param name="value"></param>
	/// <returns></returns>
	public LocalDate ParseDate(PatternContext context, String value)
	{
		List<Object> results = DatePatternMatcher.Match(context, value);
		LocalDate dateResult = results.OfType<LocalDate>().FirstOrDefault();
		return dateResult;
	}
}
*/

module.exports = DataParser;
