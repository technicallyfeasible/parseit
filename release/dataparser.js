(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dataparser"] = factory();
	else
		root["dataparser"] = factory();
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
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/release/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 109);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/babel-runtime/helpers/classCallCheck.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ },
/* 1 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************!*\
  !*** ../~/babel-runtime/helpers/createClass.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(/*! ../core-js/object/define-property */ 64);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ },
/* 2 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************!*\
  !*** ../~/core-js/library/modules/_core.js ***!
  \*********************************************/
/***/ function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 3 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************!*\
  !*** ../~/core-js/library/modules/_global.js ***!
  \***********************************************/
/***/ function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 4 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/core-js/library/modules/_descriptors.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(/*! ./_fails */ 12)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ },
/* 5 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../~/core-js/library/modules/_has.js ***!
  \********************************************/
/***/ function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ },
/* 6 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_object-dp.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(/*! ./_an-object */ 11)
  , IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ 45)
  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ 30)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(/*! ./_descriptors */ 4) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ },
/* 7 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_to-iobject.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(/*! ./_iobject */ 82)
  , defined = __webpack_require__(/*! ./_defined */ 19);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ },
/* 8 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************!*\
  !*** ../~/core-js/library/modules/_export.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

var global    = __webpack_require__(/*! ./_global */ 3)
  , core      = __webpack_require__(/*! ./_core */ 2)
  , ctx       = __webpack_require__(/*! ./_ctx */ 43)
  , hide      = __webpack_require__(/*! ./_hide */ 9)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ },
/* 9 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************!*\
  !*** ../~/core-js/library/modules/_hide.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(/*! ./_object-dp */ 6)
  , createDesc = __webpack_require__(/*! ./_property-desc */ 15);
module.exports = __webpack_require__(/*! ./_descriptors */ 4) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ },
/* 10 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../~/core-js/library/modules/_wks.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

var store      = __webpack_require__(/*! ./_shared */ 27)('wks')
  , uid        = __webpack_require__(/*! ./_uid */ 16)
  , Symbol     = __webpack_require__(/*! ./_global */ 3).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ },
/* 11 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_an-object.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ 13);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ },
/* 12 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************!*\
  !*** ../~/core-js/library/modules/_fails.js ***!
  \**********************************************/
/***/ function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ },
/* 13 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_is-object.js ***!
  \**************************************************/
/***/ function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ },
/* 14 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/core-js/library/modules/_object-keys.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(/*! ./_object-keys-internal */ 51)
  , enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ 20);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ },
/* 15 */
/* unknown exports provided */
/* all exports used */
/*!******************************************************!*\
  !*** ../~/core-js/library/modules/_property-desc.js ***!
  \******************************************************/
/***/ function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ },
/* 16 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../~/core-js/library/modules/_uid.js ***!
  \********************************************/
/***/ function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ },
/* 17 */
/* unknown exports provided */
/* all exports used */
/*!********************************!*\
  !*** ../src/PatternContext.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PatternContext =
/**
 * Context for pattern matching
 * Holds values which may influence parsing outcome like current date and time, location or language
 * @param options {{ [date]: ?Date, [reasons]: ?boolean }}
 */
function PatternContext(options) {
  (0, _classCallCheck3.default)(this, PatternContext);

  var opts = options || {};
  this.date = opts.date || new Date();
  this.reasons = opts.reasons === undefined ? true : opts.reasons;
};

PatternContext.displayName = "PatternContext";


module.exports = PatternContext;

/***/ },
/* 18 */
/* unknown exports provided */
/* all exports used */
/*!******************************************!*\
  !*** ../src/validators/ValidatorBase.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Validator base class to reduce some boilerplate
 */
var ValidatorBase = function () {
  function ValidatorBase(context) {
    (0, _classCallCheck3.default)(this, ValidatorBase);

    this.context = context;
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


  (0, _createClass3.default)(ValidatorBase, [{
    key: "validateToken",
    value: function validateToken(context, token, value, isFinal) {
      return false;
    }

    /**
     * Parses the TextValue of the node into the final value
     * @param context - The current parse context
     * @param token - The token to finalize
     * @param value - The text value to parse
     * @returns {*} - Returns the parsed result
     */

  }, {
    key: "finalizeValue",
    value: function finalizeValue(context, token, value) {
      return value;
    }

    /* eslint-disable class-methods-use-this */

  }]);
  return ValidatorBase;
}();

ValidatorBase.displayName = "ValidatorBase";
exports.default = ValidatorBase;

/***/ },
/* 19 */
/* unknown exports provided */
/* all exports used */
/*!************************************************!*\
  !*** ../~/core-js/library/modules/_defined.js ***!
  \************************************************/
/***/ function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ },
/* 20 */
/* unknown exports provided */
/* all exports used */
/*!******************************************************!*\
  !*** ../~/core-js/library/modules/_enum-bug-keys.js ***!
  \******************************************************/
/***/ function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ },
/* 21 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_iterators.js ***!
  \**************************************************/
/***/ function(module, exports) {

module.exports = {};

/***/ },
/* 22 */
/* unknown exports provided */
/* all exports used */
/*!************************************************!*\
  !*** ../~/core-js/library/modules/_library.js ***!
  \************************************************/
/***/ function(module, exports) {

module.exports = true;

/***/ },
/* 23 */
/* unknown exports provided */
/* all exports used */
/*!******************************************************!*\
  !*** ../~/core-js/library/modules/_object-create.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(/*! ./_an-object */ 11)
  , dPs         = __webpack_require__(/*! ./_object-dps */ 88)
  , enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ 20)
  , IE_PROTO    = __webpack_require__(/*! ./_shared-key */ 26)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(/*! ./_dom-create */ 44)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(/*! ./_html */ 81).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ },
/* 24 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_object-pie.js ***!
  \***************************************************/
/***/ function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ },
/* 25 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************************!*\
  !*** ../~/core-js/library/modules/_set-to-string-tag.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

var def = __webpack_require__(/*! ./_object-dp */ 6).f
  , has = __webpack_require__(/*! ./_has */ 5)
  , TAG = __webpack_require__(/*! ./_wks */ 10)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ },
/* 26 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_shared-key.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

var shared = __webpack_require__(/*! ./_shared */ 27)('keys')
  , uid    = __webpack_require__(/*! ./_uid */ 16);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ },
/* 27 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************!*\
  !*** ../~/core-js/library/modules/_shared.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ 3)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ },
/* 28 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_to-integer.js ***!
  \***************************************************/
/***/ function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ },
/* 29 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_to-object.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(/*! ./_defined */ 19);
module.exports = function(it){
  return Object(defined(it));
};

/***/ },
/* 30 */
/* unknown exports provided */
/* all exports used */
/*!*****************************************************!*\
  !*** ../~/core-js/library/modules/_to-primitive.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(/*! ./_is-object */ 13);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ },
/* 31 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_wks-define.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

var global         = __webpack_require__(/*! ./_global */ 3)
  , core           = __webpack_require__(/*! ./_core */ 2)
  , LIBRARY        = __webpack_require__(/*! ./_library */ 22)
  , wksExt         = __webpack_require__(/*! ./_wks-ext */ 32)
  , defineProperty = __webpack_require__(/*! ./_object-dp */ 6).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ },
/* 32 */
/* unknown exports provided */
/* all exports used */
/*!************************************************!*\
  !*** ../~/core-js/library/modules/_wks-ext.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(/*! ./_wks */ 10);

/***/ },
/* 33 */
/* unknown exports provided */
/* all exports used */
/*!********************************!*\
  !*** ../src/PatternMatcher.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 62);

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _arrayUtils = __webpack_require__(/*! ./utils/arrayUtils */ 36);

var arrayUtils = _interopRequireWildcard(_arrayUtils);

var _stringUtils = __webpack_require__(/*! ./utils/stringUtils */ 37);

var stringUtils = _interopRequireWildcard(_stringUtils);

var _PatternPath = __webpack_require__(/*! ./matching/PatternPath */ 58);

var _PatternPath2 = _interopRequireDefault(_PatternPath);

var _MatchState = __webpack_require__(/*! ./MatchState */ 56);

var _MatchState2 = _interopRequireDefault(_MatchState);

var _PatternContext = __webpack_require__(/*! ./PatternContext */ 17);

var _PatternContext2 = _interopRequireDefault(_PatternContext);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Matches patterns according to registered rules
 */
var PatternMatcher = function () {
  /**
   * Create a new pattern matcher with the given base patterns
   * @param patterns
   * @constructor
   */
  function PatternMatcher(patterns) {
    (0, _classCallCheck3.default)(this, PatternMatcher);

    // All currently active patterns
    this.patterns = {};
    // All active patterns compiled for use
    this.compiledPatterns = {};
    // All registered validators
    this.validators = {};

    if (patterns) {
      this.addPatterns('', patterns);
    }
  }

  /**
   * Register a validator type for the tag
   * @param tag
   * @param validator
   */


  (0, _createClass3.default)(PatternMatcher, [{
    key: 'registerValidator',
    value: function registerValidator(tag, validator) {
      this.validators[tag] = validator;
    }

    /**
     * Clear all compiled patterns
     */

  }, {
    key: 'clearPatterns',
    value: function clearPatterns() {
      this.patterns = {};
      this.compiledPatterns = {};
    }

    /**
     * Add more patterns to the compiled ones
     * @param matchTag
     * @param newPatterns
     */

  }, {
    key: 'addPatterns',
    value: function addPatterns(matchTag, newPatterns) {
      // if no patterns are in the list then there's nothing to do
      if (!newPatterns || !newPatterns.length) {
        return;
      }

      var targetPatterns = this.patterns[matchTag];
      if (!targetPatterns) {
        targetPatterns = [];
        this.patterns[matchTag] = targetPatterns;
      }

      var pathRoot = this.compiledPatterns[matchTag];
      if (!pathRoot) {
        pathRoot = new _PatternPath2.default();
        this.compiledPatterns[matchTag] = pathRoot;
      }

      //
      // parse each pattern into tokens and then parse the tokens
      //

      for (var index = 0; index < newPatterns.length; index++) {
        var pattern = newPatterns[index];

        // if the pattern was added before then don't do it again
        if (arrayUtils.contains(targetPatterns, pattern)) {
          continue;
        }

        targetPatterns.push(pattern);
        pathRoot.addPattern(pattern);
      }
    }

    /**
     * Match the value against all patterns and return the ones that fit
     * @param context - The current context for matching
     * @param value
     * @returns {*}
     */

  }, {
    key: 'match',
    value: function match(context, value) {
      if (!value) {
        return [];
      }

      var state = this.matchStart(context, '');
      if (!state) {
        return [];
      }

      var len = value.length;
      var finalIndex = len - 1;
      for (var i = 0; i < len; i++) {
        var c = value.charAt(i);
        if (!this.matchNext(state, c, i === finalIndex)) {
          PatternMatcher.logReasons(state);
          return [];
        }
      }

      var results = this.matchResults(state);
      // reverse results since the longest matches will be found last but are the most specific
      results.reverse();
      return results;
    }

    /**
     * Begin a parsing session
     * @param context
     * @param matchTag
     * @returns {MatchState}
     */

  }, {
    key: 'matchStart',
    value: function matchStart(context, matchTag) {
      var root = this.compiledPatterns[matchTag];
      if (!root) {
        return null;
      }

      var state = new _MatchState2.default(matchTag, context || new _PatternContext2.default());
      state.addCandidates(root);

      return state;
    }

    /**
     * Match the next character
     * @param state {MatchState} - The current matching state
     * @param c {String} - The next character
     * @param isFinal
     * @returns {boolean} - true if this is still a valid match, false otherwise
     */

  }, {
    key: 'matchNext',
    value: function matchNext(state, c, isFinal) {
      var candidateNodes = state.getCandidateNodes();
      for (var i = 0; i < candidateNodes.length; i++) {
        var candidate = candidateNodes[i];

        // first check if any of the child nodes validate with the new character and remember them as candidates
        // any children can only be candidates if the final validation of the current value succeeds
        if (this.validateToken(state, candidate, true)) {
          state.addCandidates(candidate.path, candidate.previousValues.concat(candidate.textValue));
        }

        // validate this candidate and remove it if it doesn't validate anymore
        candidate.isFinalized = false;
        candidate.textValue += c;
        if (!this.validateToken(state, candidate, isFinal)) {
          state.removeCandidate(i--);
        }
      }

      return candidateNodes.length > 0;
    }
  }, {
    key: 'hasResults',


    /**
     * Assemble the results after the last character has been matched
     * @param state
     * @returns {boolean}
     */
    value: function hasResults(state) {
      var candidateNodes = state.getCandidateNodes();

      if (!this.patterns[state.matchTag]) {
        return false;
      }

      // fetch patterns for all matching candidates
      for (var index = 0; index < candidateNodes.length; index++) {
        var path = candidateNodes[index];
        var result = false;
        PatternMatcher.matchToLast(path.path, function () {
          result = true;
        });
        if (result) {
          return result;
        }
      }
      return false;
    }

    /**
       * Assemble the results after the last character has been matched
       * @param state {MatchState} - The current matching state
       * @returns {Object[]} - The list of matches
       */

  }, {
    key: 'matchResults',
    value: function matchResults(state) {
      var _this = this;

      var results = [];

      var context = state.context,
          candidateNodes = state.candidateNodes;

      // fetch patterns for all matching candidates

      var _loop = function _loop(i) {
        var node = candidateNodes[i];

        _this.finalizeValue(state, node);

        var previousValues = node.previousValues.concat(node.value);
        var previousValuesCount = previousValues.length - 1;
        // traverse the tree to the leaf nodes with empty values added so we find all valid patterns
        PatternMatcher.matchToLast(node.path, function (path, depth) {
          if (depth > 0) {
            previousValues[previousValuesCount + depth] = '';
          }
          for (var m = 0; m < path.matchedPatterns.length; m++) {
            var pattern = path.matchedPatterns[m];
            var result = pattern.parse(context, previousValues);
            if (context.reasons) {
              node.logReason('Parse "' + pattern + '"', {
                values: previousValues
              }, result);
            }
            // only add if it is not in the list yet
            if (!arrayUtils.contains(results, result)) {
              results.push(result);
            }
          }
        });
      };

      for (var i = 0; i < candidateNodes.length; i++) {
        _loop(i);
      }
      PatternMatcher.logReasons(state);
      return results;
    }

    /**
     * Recursively traverse all children of the path and call the "add" function
     * @param path - path to traverse
     * @param add - callback function
     * @param depth
     */

  }, {
    key: 'validateToken',


    /**
     * Add the next character to the matched path
     * @param state {MatchState} - The current matching state
     * @param node {PathNode} - The node we are validating
     * @param isFinal {boolean} - True if this is the final match and no further values will be added
     * @returns {boolean} - true if the value can be parsed successfully using the token
     */
    value: function validateToken(state, node, isFinal) {
      // if it is finalized then it is definitely also valid
      if (node.isFinalized) {
        return true;
      }

      var args = { isFinal: isFinal };
      var context = state.context;
      var token = node.token,
          textValue = node.textValue;

      // match exact values first

      if (textValue === '') {
        var result = token.minCount === 0;
        if (context.reasons) node.logReason('Exact match', args, result);
        return result;
      }
      if (token.exactMatch) {
        var _result = isFinal && token.value === textValue || !isFinal && stringUtils.startsWith(token.value, textValue);
        if (context.reasons) node.logReason('Exact match', args, _result);
        return _result;
      }

      // check pattern tags and do a sub match for each of them
      if (this.compiledPatterns[token.value]) {
        // sub matching is possible, so start a new one or continue the previous one
        if (!node.matchState) {
          node.matchState = this.matchStart(context, token.value); // eslint-disable-line no-param-reassign
        }
        // if this is the last match then assemble the results
        if (isFinal) {
          return this.hasResults(node.matchState);
        }
        return this.matchNext(node.matchState, textValue[textValue.length - 1]);
      }

      // check if a validator is registered for this token
      var validator = this.validators[token.value];
      if (!validator) {
        if (context.reasons) node.logReason('No validator', args, false);
        return false;
      }

      var validatorResult = validator.validateToken(context, token, textValue, isFinal);
      if (context.reasons) node.logReason('Validator[' + (validator.constructor && validator.constructor.displayName) + ']', args, validatorResult);
      return validatorResult;
    }

    /**
     * Parses the TextValue of the node into the final value
     * @param state
     * @param node
     */

  }, {
    key: 'finalizeValue',
    value: function finalizeValue(state, node) {
      /* eslint-disable no-param-reassign */
      // already finalized
      if (node.isFinalized) {
        return;
      }

      var context = state.context;
      var token = node.token,
          textValue = node.textValue;


      if (token.exactMatch) {
        node.value = textValue || '';
        node.isFinalized = true;
        if (context.reasons) node.logReason('Finalize exact', null, true);
        return;
      }

      // check pattern tags and do a sub match for each of them
      if (this.compiledPatterns[token.value] && node.matchState) {
        node.value = null;
        var results = this.matchResults(node.matchState);
        if (results.length === 0) {
          if (context.reasons) node.logReason('Finalize pattern[' + token.value + '] failed', null, false);
          return;
        }
        // TODO: can be multiple results, choose the correct one depending on user culture
        node.value = results[0];
        node.isFinalized = true;
        if (context.reasons) node.logReason('Finalize pattern[' + token.value + ']', null, node.value);
        return;
      }

      // check if a validator is registered for this token
      var validator = this.validators[token.value];
      if (validator) {
        node.value = validator.finalizeValue(context, token, textValue);
        node.isFinalized = true;
        if (context.reasons) node.logReason('Finalize validator[' + (validator.constructor && validator.constructor.displayName) + ']', null, node.value);
        return;
      }
      if (context.reasons) node.logReason('Finalize failed', null, false);
      /* eslint-enable */
    }
  }], [{
    key: 'logReasons',
    value: function logReasons(state) {
      if (state.context.reasons) {
        state.reasons.concat(state.getCandidateNodes()).forEach(function (node) {
          console.log('\n', node.token.toString());
          node.reasons.forEach(function (reason) {
            console.log('  ', reason.test, (0, _stringify2.default)(reason.args), '"' + reason.textValue + '"', '=>', reason.result);
          });
        });
      }
    }
  }, {
    key: 'matchToLast',
    value: function matchToLast(path, add) {
      var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      if (path.matchedPatterns && path.matchedPatterns.length > 0) {
        add(path, depth);
      }
      // check children if they allow 0 length as well
      path.children.forEach(function (child) {
        if (child.token.minCount > 0) {
          return;
        }
        PatternMatcher.matchToLast(child.path, add, depth + 1);
      });
    }
  }]);
  return PatternMatcher;
}();

PatternMatcher.displayName = 'PatternMatcher';
exports.default = PatternMatcher;

/***/ },
/* 34 */
/* unknown exports provided */
/* all exports used */
/*!**********************************!*\
  !*** ../src/matching/Pattern.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _Token = __webpack_require__(/*! ./Token */ 59);

var _Token2 = _interopRequireDefault(_Token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pattern = function () {
  /**
   * Pattern object
   */
  function Pattern(match, parser) {
    (0, _classCallCheck3.default)(this, Pattern);

    this.match = match || '';
    this.parser = parser;
    this.tokens = Pattern.tokenize(this);
  }

  (0, _createClass3.default)(Pattern, [{
    key: 'toString',
    value: function toString() {
      return this.match;
    }
  }, {
    key: 'parse',
    value: function parse(context, values) {
      return this.parser(context, values);
    }
  }, {
    key: 'equals',
    value: function equals(other) {
      if (!other) return false;
      return this.match === other.match;
    }

    /**
     * Parse the pattern into tokens
     * @param p
     * @returns {Token[]}
     */

  }], [{
    key: 'tokenize',
    value: function tokenize(p) {
      var pattern = p.match;
      var tokens = [];

      var currentToken = '';
      var i = void 0;
      for (i = 0; i < pattern.length; i++) {
        switch (pattern[i]) {
          case '{':
            if (!currentToken.length) {
              break;
            }
            tokens.push(new _Token2.default(currentToken, true));
            currentToken = '';
            break;
          case '}':
            tokens.push(new _Token2.default(currentToken, false));
            currentToken = '';
            break;
          default:
            currentToken += pattern[i];
            break;
        }
      }

      if (currentToken) {
        tokens.push(new _Token2.default(currentToken, true));
      }
      return tokens;
    }
  }]);
  return Pattern;
}();

Pattern.displayName = 'Pattern';
exports.default = Pattern;

/***/ },
/* 35 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************!*\
  !*** ../src/modules/BooleanParserModule.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constants = undefined;

var _getPrototypeOf = __webpack_require__(/*! babel-runtime/core-js/object/get-prototype-of */ 38);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ 40);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ 39);

var _inherits3 = _interopRequireDefault(_inherits2);

var _ValidatorBase2 = __webpack_require__(/*! ../validators/ValidatorBase */ 18);

var _ValidatorBase3 = _interopRequireDefault(_ValidatorBase2);

var _Pattern = __webpack_require__(/*! ../matching/Pattern */ 34);

var _Pattern2 = _interopRequireDefault(_Pattern);

var _BooleanValue = __webpack_require__(/*! ../values/BooleanValue */ 61);

var _BooleanValue2 = _interopRequireDefault(_BooleanValue);

var _arrayUtils = __webpack_require__(/*! ../utils/arrayUtils */ 36);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var constants = exports.constants = {
  trueValues: ['1', 'true', 'wahr'],
  falseValues: ['0', 'false', 'falsch']
};
constants.trueLookup = constants.trueValues.reduce(function (r, text) {
  return (r[text] = true) && r;
}, {}); // eslint-disable-line no-param-reassign
constants.falseLookup = constants.falseValues.reduce(function (r, text) {
  return (r[text] = true) && r;
}, {}); // eslint-disable-line no-param-reassign

/**
 * Make the final output value
 * @param value
 * @returns {BooleanValue}
 */
function make(value) {
  var boolValue = false;
  if (typeof value === 'boolean') {
    boolValue = value;
  } else if (value) {
    var lowerValue = value.toString().toLowerCase();
    boolValue = !!constants.trueLookup[lowerValue];
  }
  return new _BooleanValue2.default(boolValue);
}
/**
 * Reusable wrapper for the two patterns
 * @param context
 * @param v
 */
function parsePattern(context, v) {
  return make(v[1]);
}

var mainPatterns = [new _Pattern2.default('{emptyline:*}{booleantrue}{emptyline:*}', parsePattern), new _Pattern2.default('{emptyline:*}{booleanfalse}{emptyline:*}', parsePattern)];

var BooleanParserModule = function (_ValidatorBase) {
  (0, _inherits3.default)(BooleanParserModule, _ValidatorBase);

  function BooleanParserModule() {
    (0, _classCallCheck3.default)(this, BooleanParserModule);
    return (0, _possibleConstructorReturn3.default)(this, (BooleanParserModule.__proto__ || (0, _getPrototypeOf2.default)(BooleanParserModule)).apply(this, arguments));
  }

  (0, _createClass3.default)(BooleanParserModule, [{
    key: 'getPatterns',


    /* eslint-disable class-methods-use-this, no-unused-vars */

    /**
     * Return the patterns for the tag
     * @param tag {string}
     */
    value: function getPatterns(tag) {
      if (tag === '') {
        return mainPatterns;
      }
      return [];
    }

    /**
     * Callback handler when a value has to be validated against a token
     * @param context - The current parse context
     * @param token - The token to validate against
     * @param value - The value to validate
     * @param isFinal - True if this is the final validation and no more characters are expected for the value
     * @returns {*} - Returns true if the value matches the token, false if it doesn't match or the token is unknown
     */

  }, {
    key: 'validateToken',
    value: function validateToken(context, token, value, isFinal) {
      var lowerValue = value.toLowerCase();
      switch (token.value) {
        case 'booleantrue':
          return isFinal && constants.trueLookup[lowerValue] || !isFinal && (0, _arrayUtils.startsWith)(constants.trueValues, lowerValue);
        case 'booleanfalse':
          return isFinal && constants.falseLookup[lowerValue] || !isFinal && (0, _arrayUtils.startsWith)(constants.falseValues, lowerValue);
        default:
          return false;
      }
    }

    /**
     * Parses the TextValue of the node into the final value
     * @param context - The current parse context
     * @param token - The token to finalize
     * @param value - The text value to parse
     * @returns {*} - Returns the parsed result
     */

  }, {
    key: 'finalizeValue',
    value: function finalizeValue(context, token, value) {
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

  }], [{
    key: 'defineContext',
    value: function defineContext() {}
  }]);
  return BooleanParserModule;
}(_ValidatorBase3.default);

BooleanParserModule.tokenTags = ['booleanfalse', 'booleantrue'];
BooleanParserModule.patternTags = [''];
BooleanParserModule.displayName = 'BooleanParserModule';
exports.default = BooleanParserModule;

/***/ },
/* 36 */
/* unknown exports provided */
/* all exports used */
/*!**********************************!*\
  !*** ../src/utils/arrayUtils.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contains = contains;
exports.startsWith = startsWith;
/**
 * Created by Jens on 26.06.2015.
 * Provides utilities for arrays such as checking whether an object supporting the Equals interface is contained
 */

/**
 * Checks whether the array contains obj using a custom comparer if available
 * @param ar {{equals: function}[]}
 * @param obj {{equals: function}}
 * @returns {boolean}
 */
function contains(ar, obj) {
  if (!ar) {
    return false;
  }
  // check strict equality first, should be fastest
  if (ar.indexOf(obj) !== -1) {
    return true;
  }

  var hasEquals = !!obj && typeof obj.equals === 'function';

  // check all elements
  for (var i = 0; i < ar.length; i++) {
    var other = ar[i];
    var result = void 0;
    if (hasEquals) {
      result = obj.equals(other);
    } else if (typeof other.equals === 'function') {
      result = other.equals(obj);
    } else {
      result = obj === other;
    }
    if (result) {
      return true;
    }
  }
  return false;
}

/**
 * Checks whether any of the values in the array start with the string
 * @param strings {string[]} - Array of strings to test against value. Cannot contain null or undefined values.
 * @param value {string}
 */
function startsWith(strings, value) {
  if (value === null || value === undefined) return false;
  // according to jsperf, using substr and === is slightly faster than indexOf
  return strings.some(function (string) {
    return string.length >= value.length && string.substr(0, value.length) === value;
  });
}

/***/ },
/* 37 */
/* unknown exports provided */
/* all exports used */
/*!***********************************!*\
  !*** ../src/utils/stringUtils.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startsWith = startsWith;
exports.matchAll = matchAll;
/**
 * Created by Jens on 26.06.2015.
 * Provides utilities for strings
 */

/**
 * Checks whether str starts with val
 * @param str {string}
 * @param val {string}
 * @returns {boolean}
 */
function startsWith(str, val) {
  return !!str && !!val && str.length >= val.length && str.indexOf(val) === 0;
}

/**
 * Match all characters in the string against all characters in the given array or string
 * @param str {string} - The string to test
 * @param chars {string|string[]} - The characters to test for
 * @param startIndex {number=} - Index of the first character to test
 * @returns {boolean} - true if all characters in the string are contained in chars
 */
function matchAll(str, chars, startIndex) {
  if (!str || !chars) {
    return false;
  }
  for (var i = startIndex || 0; i < str.length; i++) {
    var c = str.charAt(i);
    if (chars.indexOf(c) === -1) {
      return false;
    }
  }
  return true;
}

/***/ },
/* 38 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************************!*\
  !*** ../~/babel-runtime/core-js/object/get-prototype-of.js ***!
  \*************************************************************/
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/get-prototype-of */ 72), __esModule: true };

/***/ },
/* 39 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************!*\
  !*** ../~/babel-runtime/helpers/inherits.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(/*! ../core-js/object/set-prototype-of */ 66);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(/*! ../core-js/object/create */ 63);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ 41);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ },
/* 40 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************************!*\
  !*** ../~/babel-runtime/helpers/possibleConstructorReturn.js ***!
  \***************************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ 41);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ },
/* 41 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../~/babel-runtime/helpers/typeof.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(/*! ../core-js/symbol/iterator */ 68);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(/*! ../core-js/symbol */ 67);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ },
/* 42 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../~/core-js/library/modules/_cof.js ***!
  \********************************************/
/***/ function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ },
/* 43 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../~/core-js/library/modules/_ctx.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(/*! ./_a-function */ 77);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ },
/* 44 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_dom-create.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ 13)
  , document = __webpack_require__(/*! ./_global */ 3).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ },
/* 45 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************************!*\
  !*** ../~/core-js/library/modules/_ie8-dom-define.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(/*! ./_descriptors */ 4) && !__webpack_require__(/*! ./_fails */ 12)(function(){
  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ 44)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ },
/* 46 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/core-js/library/modules/_iter-define.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(/*! ./_library */ 22)
  , $export        = __webpack_require__(/*! ./_export */ 8)
  , redefine       = __webpack_require__(/*! ./_redefine */ 53)
  , hide           = __webpack_require__(/*! ./_hide */ 9)
  , has            = __webpack_require__(/*! ./_has */ 5)
  , Iterators      = __webpack_require__(/*! ./_iterators */ 21)
  , $iterCreate    = __webpack_require__(/*! ./_iter-create */ 84)
  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 25)
  , getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ 50)
  , ITERATOR       = __webpack_require__(/*! ./_wks */ 10)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ },
/* 47 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/core-js/library/modules/_object-gopd.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(/*! ./_object-pie */ 24)
  , createDesc     = __webpack_require__(/*! ./_property-desc */ 15)
  , toIObject      = __webpack_require__(/*! ./_to-iobject */ 7)
  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ 30)
  , has            = __webpack_require__(/*! ./_has */ 5)
  , IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ 45)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(/*! ./_descriptors */ 4) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ },
/* 48 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/core-js/library/modules/_object-gopn.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(/*! ./_object-keys-internal */ 51)
  , hiddenKeys = __webpack_require__(/*! ./_enum-bug-keys */ 20).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ },
/* 49 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/core-js/library/modules/_object-gops.js ***!
  \****************************************************/
/***/ function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 50 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_object-gpo.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(/*! ./_has */ 5)
  , toObject    = __webpack_require__(/*! ./_to-object */ 29)
  , IE_PROTO    = __webpack_require__(/*! ./_shared-key */ 26)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ },
/* 51 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************************!*\
  !*** ../~/core-js/library/modules/_object-keys-internal.js ***!
  \*************************************************************/
/***/ function(module, exports, __webpack_require__) {

var has          = __webpack_require__(/*! ./_has */ 5)
  , toIObject    = __webpack_require__(/*! ./_to-iobject */ 7)
  , arrayIndexOf = __webpack_require__(/*! ./_array-includes */ 79)(false)
  , IE_PROTO     = __webpack_require__(/*! ./_shared-key */ 26)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ },
/* 52 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_object-sap.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(/*! ./_export */ 8)
  , core    = __webpack_require__(/*! ./_core */ 2)
  , fails   = __webpack_require__(/*! ./_fails */ 12);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ },
/* 53 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************!*\
  !*** ../~/core-js/library/modules/_redefine.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./_hide */ 9);

/***/ },
/* 54 */
/* unknown exports provided */
/* all exports used */
/*!*******************!*\
  !*** ../index.js ***!
  \*******************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


var PatternMatcher = __webpack_require__(/*! ./src/PatternMatcher */ 33);
var DataParser = __webpack_require__(/*! ./src/DataParser */ 55);

var Pattern = __webpack_require__(/*! ./src/matching/Pattern */ 34);
var PatternContext = __webpack_require__(/*! ./src/PatternContext */ 17);

var ValidatorBase = __webpack_require__(/*! ./src/validators/ValidatorBase */ 18);

var BooleanParserModule = __webpack_require__(/*! ./src/modules/BooleanParserModule */ 35);

/**
 * Entry point for the DataParser library
 */
module.exports = {
  PatternMatcher: PatternMatcher,
  DataParser: DataParser,
  PatternContext: PatternContext,
  matching: {
    Pattern: Pattern
  },
  validators: {
    ValidatorBase: ValidatorBase
  },
  modules: {
    BooleanParserModule: BooleanParserModule
  }
};

/***/ },
/* 55 */
/* unknown exports provided */
/* all exports used */
/*!****************************!*\
  !*** ../src/DataParser.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _DefaultValidator = __webpack_require__(/*! ./validators/DefaultValidator */ 60);

var _DefaultValidator2 = _interopRequireDefault(_DefaultValidator);

var _BooleanParserModule = __webpack_require__(/*! ./modules/BooleanParserModule */ 35);

var _BooleanParserModule2 = _interopRequireDefault(_BooleanParserModule);

var _PatternMatcher = __webpack_require__(/*! ./PatternMatcher */ 33);

var _PatternMatcher2 = _interopRequireDefault(_PatternMatcher);

var _PatternContext = __webpack_require__(/*! ./PatternContext */ 17);

var _PatternContext2 = _interopRequireDefault(_PatternContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Module
 * @type {object}
 * @property {string[]} patternTags - available pattern tags
 * @property {string[]} tokenTags - available token tags
 * @property {function(string)} getPatterns - returns patterns for a tag
 */

var moduleTypes = [_DefaultValidator2.default, _BooleanParserModule2.default];

// var datePatternMatcher = null;
var namedPatternMatchers = {};

/**
 * Create a new PatternMatcher object including the specified modules
 * @param modules {Module[]} - List of modules to include
 * @param context - A parser context that will be used across all parse calls
 * @returns {PatternMatcher}
 * @constructor
 */
function makePatternMatcher(modules, context) {
  var matcher = new _PatternMatcher2.default([]);
  if (!modules) {
    return matcher;
  }

  modules.forEach(function (Module) {
    var module = new Module(context);

    // add patterns
    if (Module.patternTags) {
      Module.patternTags.forEach(function (tag) {
        return matcher.addPatterns(tag, module.getPatterns(tag));
      });
    }

    // register validators
    if (Module.tokenTags) {
      Module.tokenTags.forEach(function (tag) {
        return matcher.registerValidator(tag, module);
      });
    }
  });
  return matcher;
}

var DataParser = function () {
  /**
   * Create a data parser with the specified name and modules. If name and modules is empty, matches all default patterns.
   * @param [name] {string} - if a name is specified, remembers the created matcher for quicker reuse
   * @param [modules]
   * @param [context] - A parser context that will be used across all parse calls
   * @constructor
   */
  function DataParser(name, modules, context) {
    (0, _classCallCheck3.default)(this, DataParser);

    if (name && namedPatternMatchers[name] && !modules && !context) {
      this.patternMatcher = namedPatternMatchers[name];
      return;
    }

    this.patternMatcher = makePatternMatcher(modules || moduleTypes, context);

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


  (0, _createClass3.default)(DataParser, [{
    key: 'parse',
    value: function parse(value, context) {
      var matchResults = this.patternMatcher.match(context || new _PatternContext2.default(), value);
      return matchResults || [];
    }
  }]);
  return DataParser;
}();

DataParser.displayName = 'DataParser';
exports.default = DataParser;

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

/***/ },
/* 56 */
/* unknown exports provided */
/* all exports used */
/*!****************************!*\
  !*** ../src/MatchState.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _PathNode = __webpack_require__(/*! ./matching/PathNode */ 57);

var _PathNode2 = _interopRequireDefault(_PathNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MatchState = function () {
  /**
   * Holds state for a matching session
   */
  function MatchState(matchTag, context) {
    (0, _classCallCheck3.default)(this, MatchState);

    this.matchTag = matchTag;
    this.context = context;

    this.candidateNodes = [];
    this.newCandidates = [];

    // dictionary of validator instances for the context
    this.validators = null;

    if (context) {
      this.logReasons = !!context.reasons;
      this.reasons = [];
    }
  }

  /**
   * Add candidate tokens from the path
   * @param root
   */


  (0, _createClass3.default)(MatchState, [{
    key: 'addCandidates',
    value: function addCandidates(root) {
      var _this = this;

      var previousValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      root.children.forEach(function (_ref) {
        var token = _ref.token,
            path = _ref.path;

        var node = new _PathNode2.default(token, path);
        node.previousValues = previousValues;
        _this.candidateNodes.push(node);
      });
    }

    /**
     * Get the current candidate nodes
     * @returns {Array}
     */

  }, {
    key: 'getCandidateNodes',
    value: function getCandidateNodes() {
      return this.candidateNodes;
    }

    /**
     * Remove a candidate
     * @param index
     */

  }, {
    key: 'removeCandidate',
    value: function removeCandidate(index) {
      if (this.logReasons) {
        var node = this.candidateNodes[index];
        this.reasons.push(node);
      }
      this.candidateNodes.splice(index, 1);
    }
  }]);
  return MatchState;
}();

MatchState.displayName = 'MatchState';
exports.default = MatchState;

/***/ },
/* 57 */
/* unknown exports provided */
/* all exports used */
/*!***********************************!*\
  !*** ../src/matching/PathNode.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A node in the current parsing session
 */
var PathNode = function () {
  /**
   * Create a new node to hold parsing state
   * @param token
   * @param path
   * @param textValue
   * @constructor
   */
  function PathNode(token, path, textValue) {
    (0, _classCallCheck3.default)(this, PathNode);

    // The token for comparison
    this.token = token;

    // The matching path for going deeper
    this.path = path;

    // The value which still matches this path
    this.textValue = textValue || '';

    // The final assembled value
    this.value = null;
    // All values of earlier tokens
    this.previousValues = null;

    // True if the value has been finalized and assigned
    this.isFinalized = null;

    // Remember the current state of any matching algorithm
    this.matchState = null;
  }

  /**
   * Log a validation reason with result
   * @param test
   * @param result
   */


  (0, _createClass3.default)(PathNode, [{
    key: 'logReason',
    value: function logReason(test, args, result) {
      if (!this.reasons) this.reasons = [];
      this.reasons.push({
        test: test,
        args: args,
        token: this.token.toString(),
        textValue: this.textValue,
        result: result
      });
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.token + ' ~ "' + this.textValue + '"';
    }
  }]);
  return PathNode;
}();

PathNode.displayName = 'PathNode';


module.exports = PathNode;

/***/ },
/* 58 */
/* unknown exports provided */
/* all exports used */
/*!**************************************!*\
  !*** ../src/matching/PatternPath.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _keys = __webpack_require__(/*! babel-runtime/core-js/object/keys */ 65);

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Keeps tree information for patterns
 */
var PatternPath = function () {
  /**
   * Create a new patch
   * @constructor
   */
  function PatternPath() {
    (0, _classCallCheck3.default)(this, PatternPath);

    // Paths by token key
    this.paths = {};
    // child paths with token
    this.children = [];
    // Any patterns finishing at this path
    this.matchedPatterns = [];
  }

  /**
   * Add more tokens to the path and create sub-paths as necessary
   * @param pattern - the pattern to add
   * @param start - index of first token to add to this path
   */


  (0, _createClass3.default)(PatternPath, [{
    key: 'addPattern',
    value: function addPattern(pattern) {
      var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var tokens = pattern.tokens;
      if (tokens.length <= start) return;

      var token = tokens[start];
      var tokenKey = token.toString();
      // check if the exact same node exists and take it if it does
      var path = this.paths[tokenKey];
      if (!path) {
        path = new PatternPath();
        this.paths[tokenKey] = path;
        this.children.push({
          token: token,
          path: path
        });
      }

      // add remaining tokens to sub path
      if (tokens.length > start + 1) {
        path.addPattern(pattern, start + 1);
      } else if (path.matchedPatterns.indexOf(pattern) === -1) {
        // remember the matched pattern if this was the last token
        path.matchedPatterns.push(pattern);
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      var matches = (this.matchedPatterns || []).join(', ');
      var children = (0, _keys2.default)(this.paths).join(', ');
      return matches + ' :: ' + children;
    }
  }]);
  return PatternPath;
}();

PatternPath.displayName = 'PatternPath';


module.exports = PatternPath;

/***/ },
/* 59 */
/* unknown exports provided */
/* all exports used */
/*!********************************!*\
  !*** ../src/matching/Token.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Token value for parsed patterns
 */
var Token = function () {

  /**
   * Creates a new Token
   * @param value {string}
   * @param [exactMatch] {boolean}
   * @constructor
   */
  function Token(value, exactMatch) {
    (0, _classCallCheck3.default)(this, Token);

    this.exactMatch = Boolean(exactMatch);
    if (this.exactMatch) {
      this.value = value;
      this.minCount = this.maxCount = 1;
      return;
    }

    var parts = (value || '').split(':');
    this.value = parts.length > 0 ? parts[0] : '';
    if (parts.length === 1) {
      this.minCount = this.maxCount = 1;
    } else if (parts.length > 1) {
      switch (parts[1]) {
        case '':
          this.minCount = 1;
          this.maxCount = 1;
          break;
        case '+':
          this.minCount = 1;
          this.maxCount = Token.MAX_VALUE;
          break;
        case '*':
          this.minCount = 0;
          this.maxCount = Token.MAX_VALUE;
          break;
        case '?':
          this.minCount = 0;
          this.maxCount = 1;
          break;
        default:
          {
            var countParts = parts[1].split('-');
            if (countParts.length === 1) {
              this.minCount = this.maxCount = parseInt(countParts[0], 10);
            } else if (countParts.length >= 2) {
              this.minCount = parseInt(countParts[0] || '0', 10);
              this.maxCount = parseInt(countParts[1] || '0', 10);
            }
            break;
          }
      }
    }
    // don't allow max to be smaller than min
    if (this.maxCount < this.minCount) {
      this.maxCount = this.minCount;
    }
  }
  /**
   * Maximum times that a token without restriction can be repeated
   * @const
   */


  (0, _createClass3.default)(Token, [{
    key: 'equals',
    value: function equals(token) {
      if (!token) return false;
      return token.value === this.value && token.minCount === this.minCount && token.maxCount === this.maxCount && token.exactMatch === this.exactMatch;
    }
  }, {
    key: 'toString',
    value: function toString() {
      if (this.exactMatch) {
        return this.value;
      }
      return this.value + ':' + this.minCount + '-' + this.maxCount;
    }
  }]);
  return Token;
}();

Token.MAX_VALUE = 1000;
Token.displayName = 'Token';
exports.default = Token;

/***/ },
/* 60 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************!*\
  !*** ../src/validators/DefaultValidator.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(/*! babel-runtime/core-js/object/get-prototype-of */ 38);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ 40);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ 39);

var _inherits3 = _interopRequireDefault(_inherits2);

var _ValidatorBase2 = __webpack_require__(/*! ./ValidatorBase */ 18);

var _ValidatorBase3 = _interopRequireDefault(_ValidatorBase2);

var _stringUtils = __webpack_require__(/*! ../utils/stringUtils */ 37);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @const */
var LETTER_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Matches some basic patterns like whitespace, letters and numbers
 */

var DefaultValidator = function (_ValidatorBase) {
  (0, _inherits3.default)(DefaultValidator, _ValidatorBase);

  function DefaultValidator() {
    (0, _classCallCheck3.default)(this, DefaultValidator);
    return (0, _possibleConstructorReturn3.default)(this, (DefaultValidator.__proto__ || (0, _getPrototypeOf2.default)(DefaultValidator)).apply(this, arguments));
  }

  (0, _createClass3.default)(DefaultValidator, [{
    key: 'validateToken',


    /* eslint-disable class-methods-use-this */

    /**
     * Callback handler when a value has to be validated against a token
     * @param context - The current parse context
     * @param token - The token to validate against
     * @param value - The value to validate
     * @param isFinal - True if this is the final validation and no more characters are expected for the value
     * @returns {*} - Returns true if the value matches the token, false if it doesn't match or the token is unknown
     */
    value: function validateToken(context, token, value, isFinal) {
      var result = void 0;
      switch (token.value) {
        // whitespace
        case ' ':
          result = DefaultValidator.validateCount(token, value, isFinal) && (0, _stringUtils.matchAll)(value, ' \t');
          break;
        case 'newline':
          result = DefaultValidator.validateCount(token, value, isFinal) && (0, _stringUtils.matchAll)(value, '\r\n');
          break;
        case 'emptyline':
          result = DefaultValidator.validateCount(token, value, isFinal) && (0, _stringUtils.matchAll)(value, '\r\n \t');
          break;
        case 'letter':
          result = DefaultValidator.validateCount(token, value, isFinal) && (0, _stringUtils.matchAll)(value, LETTER_CHARACTERS);
          break;
        case 'any':
          result = DefaultValidator.validateCount(token, value, isFinal);
          break;
        default:
          result = false;
      }
      return result;
    }

    /**
     * Checks whether the value is within the required length for token
     * @param token
     * @param value
     * @param isFinal
     * @returns {boolean}
     */

  }, {
    key: 'finalizeValue',


    /**
     * Parses the TextValue of the node into the final value
     * @param context - The current parse context
     * @param token - The token to finalize
     * @param value - The text value to parse
     * @returns {*} - Returns the parsed result
     */
    value: function finalizeValue(context, token, value) {
      if (DefaultValidator.tokenTags.indexOf(token.value) !== -1) {
        return value;
      }
      // TODO: return something else if unknown?
      return value;
    }

    /* eslint-enable */

  }], [{
    key: 'validateCount',
    value: function validateCount(token, value, isFinal) {
      return (!isFinal || value.length >= token.minCount) && value.length <= token.maxCount;
    }
  }]);
  return DefaultValidator;
}(_ValidatorBase3.default);

DefaultValidator.tokenTags = [' ', 'newline', 'emptyline', 'letter', 'any'];
DefaultValidator.displayName = 'DefaultValidator';
exports.default = DefaultValidator;

/***/ },
/* 61 */
/* unknown exports provided */
/* all exports used */
/*!*************************************!*\
  !*** ../src/values/BooleanValue.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";


/**
 * Boolean result wrapper
 */

var BooleanValue = function BooleanValue(value) {
  this.bool = !!value;
};
BooleanValue.prototype.valueOf = function valueOf() {
  return this.bool;
};
BooleanValue.prototype.toString = function toString() {
  return this.bool.toString();
};
BooleanValue.prototype.equals = function equals(other) {
  if (!(other instanceof BooleanValue)) {
    return false;
  }
  return this.bool === other.bool;
};

module.exports = BooleanValue;

/*
  public struct BooleanValue : IValue
  {
    /// <summary>
    /// The boolean value
    /// </summary>
    [JsonProperty("v")]
    public Boolean Bool;


    /// <summary>
    /// Generic access to the most prominent value .net type
    /// </summary>
    public Object Value
    {
      get { return Bool; }
      set { Bool = (Boolean)value; }
    }


    /// <summary>
    /// Serialize the value to binary data
    /// </summary>
    /// <returns></returns>
    public Byte[] ToBinary()
    {
      return BitConverter.GetBytes(Bool);
    }

    /// <summary>
    /// Read the value data from binary
    /// </summary>
    /// <param name="data"></param>
    public void FromBinary(Byte[] data)
    {
      Bool = BitConverter.ToBoolean(data, 0);
    }


    /// <summary>
    /// Constructor
    /// </summary>
    /// <param name="value"></param>
    public BooleanValue(Boolean value)
    {
      this.Bool = value;
    }

    public override String ToString()
    {
      return String.Format("{0}", this.Bool);
    }

    public override Boolean Equals(object obj)
    {
      if (!(obj is BooleanValue))
        return false;
      BooleanValue other = (BooleanValue)obj;
      return this.Bool.Equals(other.Bool);
    }

    public override int GetHashCode()
    {
      unchecked
      {
        return this.Bool.GetHashCode();
      }
    }

    public static bool operator ==(BooleanValue a, BooleanValue b)
    {
      return a.Bool.Equals(b.Bool);
    }

    public static bool operator !=(BooleanValue a, BooleanValue b)
    {
      return !a.Bool.Equals(b.Bool);
    }
  }
*/

/***/ },
/* 62 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/babel-runtime/core-js/json/stringify.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/json/stringify */ 69), __esModule: true };

/***/ },
/* 63 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/babel-runtime/core-js/object/create.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/create */ 70), __esModule: true };

/***/ },
/* 64 */
/* unknown exports provided */
/* all exports used */
/*!************************************************************!*\
  !*** ../~/babel-runtime/core-js/object/define-property.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/define-property */ 71), __esModule: true };

/***/ },
/* 65 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************!*\
  !*** ../~/babel-runtime/core-js/object/keys.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/keys */ 73), __esModule: true };

/***/ },
/* 66 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************************!*\
  !*** ../~/babel-runtime/core-js/object/set-prototype-of.js ***!
  \*************************************************************/
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/set-prototype-of */ 74), __esModule: true };

/***/ },
/* 67 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../~/babel-runtime/core-js/symbol.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol */ 75), __esModule: true };

/***/ },
/* 68 */
/* unknown exports provided */
/* all exports used */
/*!*****************************************************!*\
  !*** ../~/babel-runtime/core-js/symbol/iterator.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol/iterator */ 76), __esModule: true };

/***/ },
/* 69 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************!*\
  !*** ../~/core-js/library/fn/json/stringify.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

var core  = __webpack_require__(/*! ../../modules/_core */ 2)
  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};

/***/ },
/* 70 */
/* unknown exports provided */
/* all exports used */
/*!************************************************!*\
  !*** ../~/core-js/library/fn/object/create.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.create */ 95);
var $Object = __webpack_require__(/*! ../../modules/_core */ 2).Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};

/***/ },
/* 71 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************************!*\
  !*** ../~/core-js/library/fn/object/define-property.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.define-property */ 96);
var $Object = __webpack_require__(/*! ../../modules/_core */ 2).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ },
/* 72 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************************!*\
  !*** ../~/core-js/library/fn/object/get-prototype-of.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.get-prototype-of */ 97);
module.exports = __webpack_require__(/*! ../../modules/_core */ 2).Object.getPrototypeOf;

/***/ },
/* 73 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************!*\
  !*** ../~/core-js/library/fn/object/keys.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.keys */ 98);
module.exports = __webpack_require__(/*! ../../modules/_core */ 2).Object.keys;

/***/ },
/* 74 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************************!*\
  !*** ../~/core-js/library/fn/object/set-prototype-of.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.set-prototype-of */ 99);
module.exports = __webpack_require__(/*! ../../modules/_core */ 2).Object.setPrototypeOf;

/***/ },
/* 75 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************!*\
  !*** ../~/core-js/library/fn/symbol/index.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.symbol */ 102);
__webpack_require__(/*! ../../modules/es6.object.to-string */ 100);
__webpack_require__(/*! ../../modules/es7.symbol.async-iterator */ 103);
__webpack_require__(/*! ../../modules/es7.symbol.observable */ 104);
module.exports = __webpack_require__(/*! ../../modules/_core */ 2).Symbol;

/***/ },
/* 76 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/fn/symbol/iterator.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.string.iterator */ 101);
__webpack_require__(/*! ../../modules/web.dom.iterable */ 105);
module.exports = __webpack_require__(/*! ../../modules/_wks-ext */ 32).f('iterator');

/***/ },
/* 77 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_a-function.js ***!
  \***************************************************/
/***/ function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ },
/* 78 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************************!*\
  !*** ../~/core-js/library/modules/_add-to-unscopables.js ***!
  \***********************************************************/
/***/ function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ },
/* 79 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************************!*\
  !*** ../~/core-js/library/modules/_array-includes.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(/*! ./_to-iobject */ 7)
  , toLength  = __webpack_require__(/*! ./_to-length */ 93)
  , toIndex   = __webpack_require__(/*! ./_to-index */ 92);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ },
/* 80 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_enum-keys.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(/*! ./_object-keys */ 14)
  , gOPS    = __webpack_require__(/*! ./_object-gops */ 49)
  , pIE     = __webpack_require__(/*! ./_object-pie */ 24);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ },
/* 81 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************!*\
  !*** ../~/core-js/library/modules/_html.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./_global */ 3).document && document.documentElement;

/***/ },
/* 82 */
/* unknown exports provided */
/* all exports used */
/*!************************************************!*\
  !*** ../~/core-js/library/modules/_iobject.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(/*! ./_cof */ 42);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ },
/* 83 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************!*\
  !*** ../~/core-js/library/modules/_is-array.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(/*! ./_cof */ 42);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ },
/* 84 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/core-js/library/modules/_iter-create.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(/*! ./_object-create */ 23)
  , descriptor     = __webpack_require__(/*! ./_property-desc */ 15)
  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 25)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(/*! ./_hide */ 9)(IteratorPrototype, __webpack_require__(/*! ./_wks */ 10)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ },
/* 85 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_iter-step.js ***!
  \**************************************************/
/***/ function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ },
/* 86 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************!*\
  !*** ../~/core-js/library/modules/_keyof.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(/*! ./_object-keys */ 14)
  , toIObject = __webpack_require__(/*! ./_to-iobject */ 7);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ },
/* 87 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************!*\
  !*** ../~/core-js/library/modules/_meta.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

var META     = __webpack_require__(/*! ./_uid */ 16)('meta')
  , isObject = __webpack_require__(/*! ./_is-object */ 13)
  , has      = __webpack_require__(/*! ./_has */ 5)
  , setDesc  = __webpack_require__(/*! ./_object-dp */ 6).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(/*! ./_fails */ 12)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ },
/* 88 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_object-dps.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(/*! ./_object-dp */ 6)
  , anObject = __webpack_require__(/*! ./_an-object */ 11)
  , getKeys  = __webpack_require__(/*! ./_object-keys */ 14);

module.exports = __webpack_require__(/*! ./_descriptors */ 4) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ },
/* 89 */
/* unknown exports provided */
/* all exports used */
/*!********************************************************!*\
  !*** ../~/core-js/library/modules/_object-gopn-ext.js ***!
  \********************************************************/
/***/ function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(/*! ./_to-iobject */ 7)
  , gOPN      = __webpack_require__(/*! ./_object-gopn */ 48).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ },
/* 90 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_set-proto.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(/*! ./_is-object */ 13)
  , anObject = __webpack_require__(/*! ./_an-object */ 11);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(/*! ./_ctx */ 43)(Function.call, __webpack_require__(/*! ./_object-gopd */ 47).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ },
/* 91 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_string-at.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ 28)
  , defined   = __webpack_require__(/*! ./_defined */ 19);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ },
/* 92 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************!*\
  !*** ../~/core-js/library/modules/_to-index.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ 28)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ },
/* 93 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_to-length.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(/*! ./_to-integer */ 28)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ },
/* 94 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************************!*\
  !*** ../~/core-js/library/modules/es6.array.iterator.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(/*! ./_add-to-unscopables */ 78)
  , step             = __webpack_require__(/*! ./_iter-step */ 85)
  , Iterators        = __webpack_require__(/*! ./_iterators */ 21)
  , toIObject        = __webpack_require__(/*! ./_to-iobject */ 7);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(/*! ./_iter-define */ 46)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ },
/* 95 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************************!*\
  !*** ../~/core-js/library/modules/es6.object.create.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ 8)
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(/*! ./_object-create */ 23)});

/***/ },
/* 96 */
/* unknown exports provided */
/* all exports used */
/*!******************************************************************!*\
  !*** ../~/core-js/library/modules/es6.object.define-property.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ 8);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(/*! ./_descriptors */ 4), 'Object', {defineProperty: __webpack_require__(/*! ./_object-dp */ 6).f});

/***/ },
/* 97 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************************************!*\
  !*** ../~/core-js/library/modules/es6.object.get-prototype-of.js ***!
  \*******************************************************************/
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = __webpack_require__(/*! ./_to-object */ 29)
  , $getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ 50);

__webpack_require__(/*! ./_object-sap */ 52)('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ },
/* 98 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************************!*\
  !*** ../~/core-js/library/modules/es6.object.keys.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(/*! ./_to-object */ 29)
  , $keys    = __webpack_require__(/*! ./_object-keys */ 14);

__webpack_require__(/*! ./_object-sap */ 52)('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ },
/* 99 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************************************!*\
  !*** ../~/core-js/library/modules/es6.object.set-prototype-of.js ***!
  \*******************************************************************/
/***/ function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(/*! ./_export */ 8);
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(/*! ./_set-proto */ 90).set});

/***/ },
/* 100 */
/* unknown exports provided */
/* all exports used */
/*!************************************************************!*\
  !*** ../~/core-js/library/modules/es6.object.to-string.js ***!
  \************************************************************/
/***/ function(module, exports) {



/***/ },
/* 101 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************************!*\
  !*** ../~/core-js/library/modules/es6.string.iterator.js ***!
  \***********************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(/*! ./_string-at */ 91)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(/*! ./_iter-define */ 46)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ },
/* 102 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/es6.symbol.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(/*! ./_global */ 3)
  , has            = __webpack_require__(/*! ./_has */ 5)
  , DESCRIPTORS    = __webpack_require__(/*! ./_descriptors */ 4)
  , $export        = __webpack_require__(/*! ./_export */ 8)
  , redefine       = __webpack_require__(/*! ./_redefine */ 53)
  , META           = __webpack_require__(/*! ./_meta */ 87).KEY
  , $fails         = __webpack_require__(/*! ./_fails */ 12)
  , shared         = __webpack_require__(/*! ./_shared */ 27)
  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 25)
  , uid            = __webpack_require__(/*! ./_uid */ 16)
  , wks            = __webpack_require__(/*! ./_wks */ 10)
  , wksExt         = __webpack_require__(/*! ./_wks-ext */ 32)
  , wksDefine      = __webpack_require__(/*! ./_wks-define */ 31)
  , keyOf          = __webpack_require__(/*! ./_keyof */ 86)
  , enumKeys       = __webpack_require__(/*! ./_enum-keys */ 80)
  , isArray        = __webpack_require__(/*! ./_is-array */ 83)
  , anObject       = __webpack_require__(/*! ./_an-object */ 11)
  , toIObject      = __webpack_require__(/*! ./_to-iobject */ 7)
  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ 30)
  , createDesc     = __webpack_require__(/*! ./_property-desc */ 15)
  , _create        = __webpack_require__(/*! ./_object-create */ 23)
  , gOPNExt        = __webpack_require__(/*! ./_object-gopn-ext */ 89)
  , $GOPD          = __webpack_require__(/*! ./_object-gopd */ 47)
  , $DP            = __webpack_require__(/*! ./_object-dp */ 6)
  , $keys          = __webpack_require__(/*! ./_object-keys */ 14)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(/*! ./_object-gopn */ 48).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(/*! ./_object-pie */ 24).f  = $propertyIsEnumerable;
  __webpack_require__(/*! ./_object-gops */ 49).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(/*! ./_library */ 22)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(/*! ./_hide */ 9)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 103 */
/* unknown exports provided */
/* all exports used */
/*!*****************************************************************!*\
  !*** ../~/core-js/library/modules/es7.symbol.async-iterator.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./_wks-define */ 31)('asyncIterator');

/***/ },
/* 104 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************************!*\
  !*** ../~/core-js/library/modules/es7.symbol.observable.js ***!
  \*************************************************************/
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./_wks-define */ 31)('observable');

/***/ },
/* 105 */
/* unknown exports provided */
/* all exports used */
/*!********************************************************!*\
  !*** ../~/core-js/library/modules/web.dom.iterable.js ***!
  \********************************************************/
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./es6.array.iterator */ 94);
var global        = __webpack_require__(/*! ./_global */ 3)
  , hide          = __webpack_require__(/*! ./_hide */ 9)
  , Iterators     = __webpack_require__(/*! ./_iterators */ 21)
  , TO_STRING_TAG = __webpack_require__(/*! ./_wks */ 10)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ },
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */
/* unknown exports provided */
/* all exports used */
/*!************************!*\
  !*** multi dataparser ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ../index.js */54);


/***/ }
/******/ ]);
});
//# sourceMappingURL=dataparser.js.map