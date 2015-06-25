(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["DataParser"] = factory();
	else
		root["DataParser"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/release/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

  /*
   * Entry point for the DataParser library
   */
  
  module.exports = {
  	DataParser: __webpack_require__(1)
  };


/***/ },
/* 1 */
/***/ function(module, exports) {

  /*
   * Parses data values to figure out what actual type they are
   */
  
  'use strict';
  
  var moduleTypes = [
  	typeof(NumberParserModule),
  	typeof(DateParserModule),
  	typeof(AddressParserModule),
  	typeof(CurrencyParserModule),
  	typeof(BooleanParserModule),
  	typeof(UrlParserModule),
  	typeof(IpParserModule),
  	typeof(EmailParserModule)
  ];
  var dateModuleTypes = [
  	typeof(NumberParserModule),
  	typeof(DateParserModule)
  ];
  
  var defaultPatternMatcher = MakePatternMatcher(moduleTypes);
  var datePatternMatcher = MakePatternMatcher(dateModuleTypes);
  var namedPatternMatchers = {};
  
  /**
   * Create a data parser with the specified name and modules. If name and modules is empty, matches all default patterns.
   * @param name
   * @param modules
   * @constructor
   */
  var DataParser = function(name, modules) {
  	if (!name || !modules) {
  		this.patternMatcher = defaultPatternMatcher;
  	} else {
  		if (namedPatternMatchers[name])
  			return;
  
  		this.patternMatcher = MakePatternMatcher(modules);
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
  		DefaultPatternMatcher = MakePatternMatcher(ModuleTypes);
  		DatePatternMatcher = MakePatternMatcher(DateModuleTypes);
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
  
  		this.patternMatcher = MakePatternMatcher(modules);
  		NamedPatternMatchers[name] = this.patternMatcher;
  	}
  
  
  	private static PatternMatcher MakePatternMatcher(Type[] modules)
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


/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBmZmQxMTRmOWMzMzBiZTJjODc5YSIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvRGF0YVBhcnNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQ05BO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdEQUE4QyxLQUFLLEtBQUs7O0FBRXhEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6ImRhdGFwYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkRhdGFQYXJzZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiRGF0YVBhcnNlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvblxuICoqLyIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9yZWxlYXNlL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgZmZkMTE0ZjljMzMwYmUyYzg3OWFcbiAqKi8iLCIvKlxyXG4gKiBFbnRyeSBwb2ludCBmb3IgdGhlIERhdGFQYXJzZXIgbGlicmFyeVxyXG4gKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdERhdGFQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL0RhdGFQYXJzZXIuanMnKVxyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vaW5kZXguanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxyXG4gKiBQYXJzZXMgZGF0YSB2YWx1ZXMgdG8gZmlndXJlIG91dCB3aGF0IGFjdHVhbCB0eXBlIHRoZXkgYXJlXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIG1vZHVsZVR5cGVzID0gW1xyXG5cdHR5cGVvZihOdW1iZXJQYXJzZXJNb2R1bGUpLFxyXG5cdHR5cGVvZihEYXRlUGFyc2VyTW9kdWxlKSxcclxuXHR0eXBlb2YoQWRkcmVzc1BhcnNlck1vZHVsZSksXHJcblx0dHlwZW9mKEN1cnJlbmN5UGFyc2VyTW9kdWxlKSxcclxuXHR0eXBlb2YoQm9vbGVhblBhcnNlck1vZHVsZSksXHJcblx0dHlwZW9mKFVybFBhcnNlck1vZHVsZSksXHJcblx0dHlwZW9mKElwUGFyc2VyTW9kdWxlKSxcclxuXHR0eXBlb2YoRW1haWxQYXJzZXJNb2R1bGUpXHJcbl07XHJcbnZhciBkYXRlTW9kdWxlVHlwZXMgPSBbXHJcblx0dHlwZW9mKE51bWJlclBhcnNlck1vZHVsZSksXHJcblx0dHlwZW9mKERhdGVQYXJzZXJNb2R1bGUpXHJcbl07XHJcblxyXG52YXIgZGVmYXVsdFBhdHRlcm5NYXRjaGVyID0gTWFrZVBhdHRlcm5NYXRjaGVyKG1vZHVsZVR5cGVzKTtcclxudmFyIGRhdGVQYXR0ZXJuTWF0Y2hlciA9IE1ha2VQYXR0ZXJuTWF0Y2hlcihkYXRlTW9kdWxlVHlwZXMpO1xyXG52YXIgbmFtZWRQYXR0ZXJuTWF0Y2hlcnMgPSB7fTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBkYXRhIHBhcnNlciB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSBhbmQgbW9kdWxlcy4gSWYgbmFtZSBhbmQgbW9kdWxlcyBpcyBlbXB0eSwgbWF0Y2hlcyBhbGwgZGVmYXVsdCBwYXR0ZXJucy5cclxuICogQHBhcmFtIG5hbWVcclxuICogQHBhcmFtIG1vZHVsZXNcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG52YXIgRGF0YVBhcnNlciA9IGZ1bmN0aW9uKG5hbWUsIG1vZHVsZXMpIHtcclxuXHRpZiAoIW5hbWUgfHwgIW1vZHVsZXMpIHtcclxuXHRcdHRoaXMucGF0dGVybk1hdGNoZXIgPSBkZWZhdWx0UGF0dGVybk1hdGNoZXI7XHJcblx0fSBlbHNlIHtcclxuXHRcdGlmIChuYW1lZFBhdHRlcm5NYXRjaGVyc1tuYW1lXSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMucGF0dGVybk1hdGNoZXIgPSBNYWtlUGF0dGVybk1hdGNoZXIobW9kdWxlcyk7XHJcblx0XHRuYW1lZFBhdHRlcm5NYXRjaGVyc1tuYW1lXSA9IHRoaXMucGF0dGVybk1hdGNoZXI7XHJcblx0fVxyXG59O1xyXG5cclxuLypcclxue1xyXG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFR5cGVbXSBNb2R1bGVUeXBlcyA9XHJcblx0e1xyXG5cdFx0dHlwZW9mKE51bWJlclBhcnNlck1vZHVsZSksIHR5cGVvZihEYXRlUGFyc2VyTW9kdWxlKSwgdHlwZW9mKEFkZHJlc3NQYXJzZXJNb2R1bGUpLCB0eXBlb2YoQ3VycmVuY3lQYXJzZXJNb2R1bGUpLCB0eXBlb2YoQm9vbGVhblBhcnNlck1vZHVsZSksXHJcblx0XHR0eXBlb2YoVXJsUGFyc2VyTW9kdWxlKSwgdHlwZW9mKElwUGFyc2VyTW9kdWxlKSwgdHlwZW9mKEVtYWlsUGFyc2VyTW9kdWxlKVxyXG5cdH07XHJcblx0cHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgVHlwZVtdIERhdGVNb2R1bGVUeXBlcyA9XHJcblx0e1xyXG5cdFx0dHlwZW9mKE51bWJlclBhcnNlck1vZHVsZSksIHR5cGVvZihEYXRlUGFyc2VyTW9kdWxlKVxyXG5cdH07XHJcblx0cHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUGF0dGVybk1hdGNoZXIgRGVmYXVsdFBhdHRlcm5NYXRjaGVyO1xyXG5cdHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBhdHRlcm5NYXRjaGVyIERhdGVQYXR0ZXJuTWF0Y2hlcjtcclxuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBEaWN0aW9uYXJ5PFN0cmluZywgUGF0dGVybk1hdGNoZXI+IE5hbWVkUGF0dGVybk1hdGNoZXJzID0gbmV3IERpY3Rpb25hcnk8U3RyaW5nLCBQYXR0ZXJuTWF0Y2hlcj4oKTtcclxuXHJcblx0cHJpdmF0ZSByZWFkb25seSBQYXR0ZXJuTWF0Y2hlciBwYXR0ZXJuTWF0Y2hlcjtcclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBEZWZhdWx0IGNvbnRleHQgZm9yIHBhcnNpbmdcclxuXHQvLy8gPC9zdW1tYXJ5PlxyXG5cdHB1YmxpYyBQYXR0ZXJuQ29udGV4dCBEZWZhdWx0UGF0dGVybkNvbnRleHQgeyBnZXQ7IHNldDsgfVxyXG5cclxuXHQvLy8gPHN1bW1hcnk+XHJcblx0Ly8vIExvYWQgYWxsIHBhdHRlcm5zIGZyb20gdGhlIGRlZmluZWQgbW9kdWxlc1xyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0c3RhdGljIERhdGFQYXJzZXIoKVxyXG5cdHtcclxuXHRcdERlZmF1bHRQYXR0ZXJuTWF0Y2hlciA9IE1ha2VQYXR0ZXJuTWF0Y2hlcihNb2R1bGVUeXBlcyk7XHJcblx0XHREYXRlUGF0dGVybk1hdGNoZXIgPSBNYWtlUGF0dGVybk1hdGNoZXIoRGF0ZU1vZHVsZVR5cGVzKTtcclxuXHR9XHJcblxyXG5cdC8vLyA8c3VtbWFyeT5cclxuXHQvLy8gVXNlIHRoZSBkZWZhdWx0IHBhdHRlcm4gbWF0Y2hlclxyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0cHVibGljIERhdGFQYXJzZXIoKVxyXG5cdHtcclxuXHRcdHRoaXMucGF0dGVybk1hdGNoZXIgPSBEZWZhdWx0UGF0dGVybk1hdGNoZXI7XHJcblx0fVxyXG5cclxuXHQvLy8gPHN1bW1hcnk+XHJcblx0Ly8vIExvYWQgYWxsIHBhdHRlcm5zIGZyb20gdGhlIGRlZmluZWQgbW9kdWxlc1xyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0cHVibGljIERhdGFQYXJzZXIoU3RyaW5nIG5hbWUsIFR5cGVbXSBtb2R1bGVzKVxyXG5cdHtcclxuXHRcdGlmIChTdHJpbmcuSXNOdWxsT3JFbXB0eShuYW1lKSB8fCBtb2R1bGVzID09IG51bGwpXHJcblx0XHR7XHJcblx0XHRcdHRoaXMucGF0dGVybk1hdGNoZXIgPSBEZWZhdWx0UGF0dGVybk1hdGNoZXI7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoTmFtZWRQYXR0ZXJuTWF0Y2hlcnMuVHJ5R2V0VmFsdWUobmFtZSwgb3V0IHRoaXMucGF0dGVybk1hdGNoZXIpICYmIHRoaXMucGF0dGVybk1hdGNoZXIgIT0gbnVsbClcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMucGF0dGVybk1hdGNoZXIgPSBNYWtlUGF0dGVybk1hdGNoZXIobW9kdWxlcyk7XHJcblx0XHROYW1lZFBhdHRlcm5NYXRjaGVyc1tuYW1lXSA9IHRoaXMucGF0dGVybk1hdGNoZXI7XHJcblx0fVxyXG5cclxuXHJcblx0cHJpdmF0ZSBzdGF0aWMgUGF0dGVybk1hdGNoZXIgTWFrZVBhdHRlcm5NYXRjaGVyKFR5cGVbXSBtb2R1bGVzKVxyXG5cdHtcclxuXHRcdFBhdHRlcm5NYXRjaGVyIG1hdGNoZXIgPSBuZXcgUGF0dGVybk1hdGNoZXIobmV3IFBhdHRlcm5bMF0pO1xyXG5cclxuXHRcdGZvcmVhY2ggKFR5cGUgbW9kdWxlVHlwZSBpbiBtb2R1bGVzKVxyXG5cdFx0e1xyXG5cdFx0XHRJUGFyc2VyTW9kdWxlIG1vZHVsZSA9IEFjdGl2YXRvci5DcmVhdGVJbnN0YW5jZShtb2R1bGVUeXBlKSBhcyBJUGFyc2VyTW9kdWxlO1xyXG5cdFx0XHRpZiAobW9kdWxlID09IG51bGwpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0Ly8gYWRkIHBhdHRlcm5zXHJcblx0XHRcdGZvcmVhY2ggKFN0cmluZyB0YWcgaW4gbW9kdWxlLlBhdHRlcm5UYWdzKVxyXG5cdFx0XHRcdG1hdGNoZXIuQWRkUGF0dGVybnModGFnLCBtb2R1bGUuR2V0UGF0dGVybnModGFnKSk7XHJcblxyXG5cdFx0XHQvLyByZWdpc3RlciB2YWxpZGF0b3JzXHJcblx0XHRcdGZvcmVhY2ggKFN0cmluZyB0YWcgaW4gbW9kdWxlLlRva2VuVGFncylcclxuXHRcdFx0XHRtYXRjaGVyLlJlZ2lzdGVyVmFsaWRhdG9yKHRhZywgbW9kdWxlKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBtYXRjaGVyO1xyXG5cdH1cclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBQYXJzZSBhIHZhbHVlIGludG8gYWxsIHBvc3NpYmxlIG5hdGl2ZSB0eXBlc1xyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0Ly8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj48L3BhcmFtPlxyXG5cdC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcblx0cHVibGljIExpc3Q8SVZhbHVlPiBQYXJzZShTdHJpbmcgdmFsdWUpXHJcblx0e1xyXG5cdFx0cmV0dXJuIFBhcnNlKERlZmF1bHRQYXR0ZXJuQ29udGV4dCA/PyBuZXcgUGF0dGVybkNvbnRleHQoKSwgdmFsdWUpO1xyXG5cdH1cclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBQYXJzZSBhIHZhbHVlIGludG8gYWxsIHBvc3NpYmxlIG5hdGl2ZSB0eXBlc1xyXG5cdC8vLyA8L3N1bW1hcnk+XHJcblx0Ly8vIDxwYXJhbSBuYW1lPVwiY29udGV4dFwiPjwvcGFyYW0+XHJcblx0Ly8vIDxwYXJhbSBuYW1lPVwidmFsdWVcIj48L3BhcmFtPlxyXG5cdC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcblx0cHVibGljIExpc3Q8SVZhbHVlPiBQYXJzZShQYXR0ZXJuQ29udGV4dCBjb250ZXh0LCBTdHJpbmcgdmFsdWUpXHJcblx0e1xyXG5cdFx0TGlzdDxPYmplY3Q+IG1hdGNoUmVzdWx0cyA9IHRoaXMucGF0dGVybk1hdGNoZXIuTWF0Y2goY29udGV4dCwgdmFsdWUpO1xyXG5cdFx0cmV0dXJuIChtYXRjaFJlc3VsdHMgPT0gbnVsbCA/IG5ldyBMaXN0PElWYWx1ZT4oKSA6IG1hdGNoUmVzdWx0cy5DYXN0PElWYWx1ZT4oKS5Ub0xpc3QoKSk7XHJcblx0fVxyXG5cclxuXHQvLy8gPHN1bW1hcnk+XHJcblx0Ly8vIFBhcnNlIGEgdmFsdWUgYXMgYSBMb2NhbERhdGVcclxuXHQvLy8gPC9zdW1tYXJ5PlxyXG5cdC8vLyA8cGFyYW0gbmFtZT1cInZhbHVlXCI+PC9wYXJhbT5cclxuXHQvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG5cdHB1YmxpYyBMb2NhbERhdGUgUGFyc2VEYXRlKFN0cmluZyB2YWx1ZSlcclxuXHR7XHJcblx0XHRyZXR1cm4gUGFyc2VEYXRlKERlZmF1bHRQYXR0ZXJuQ29udGV4dCA/PyBuZXcgUGF0dGVybkNvbnRleHQoKSwgdmFsdWUpO1xyXG5cdH1cclxuXHJcblx0Ly8vIDxzdW1tYXJ5PlxyXG5cdC8vLyBQYXJzZSBhIHZhbHVlIGFzIGEgTG9jYWxEYXRlXHJcblx0Ly8vIDwvc3VtbWFyeT5cclxuXHQvLy8gPHBhcmFtIG5hbWU9XCJjb250ZXh0XCI+PC9wYXJhbT5cclxuXHQvLy8gPHBhcmFtIG5hbWU9XCJ2YWx1ZVwiPjwvcGFyYW0+XHJcblx0Ly8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuXHRwdWJsaWMgTG9jYWxEYXRlIFBhcnNlRGF0ZShQYXR0ZXJuQ29udGV4dCBjb250ZXh0LCBTdHJpbmcgdmFsdWUpXHJcblx0e1xyXG5cdFx0TGlzdDxPYmplY3Q+IHJlc3VsdHMgPSBEYXRlUGF0dGVybk1hdGNoZXIuTWF0Y2goY29udGV4dCwgdmFsdWUpO1xyXG5cdFx0TG9jYWxEYXRlIGRhdGVSZXN1bHQgPSByZXN1bHRzLk9mVHlwZTxMb2NhbERhdGU+KCkuRmlyc3RPckRlZmF1bHQoKTtcclxuXHRcdHJldHVybiBkYXRlUmVzdWx0O1xyXG5cdH1cclxufVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEYXRhUGFyc2VyO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0RhdGFQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9