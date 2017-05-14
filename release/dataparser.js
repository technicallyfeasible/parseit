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
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 325);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/babel-runtime/helpers/classCallCheck.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 1 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************!*\
  !*** ../~/babel-runtime/helpers/createClass.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(/*! ../core-js/object/define-property */ 83);

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

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************!*\
  !*** ../~/core-js/library/modules/_core.js ***!
  \*********************************************/
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 5 */,
/* 6 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************!*\
  !*** ../~/core-js/library/modules/_global.js ***!
  \***********************************************/
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 7 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/core-js/library/modules/_descriptors.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(/*! ./_fails */ 13)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 8 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************!*\
  !*** ../~/core-js/library/modules/_export.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(/*! ./_global */ 6)
  , core      = __webpack_require__(/*! ./_core */ 4)
  , ctx       = __webpack_require__(/*! ./_ctx */ 62)
  , hide      = __webpack_require__(/*! ./_hide */ 14)
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

/***/ }),
/* 9 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../~/core-js/library/modules/_has.js ***!
  \********************************************/
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 10 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_object-dp.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(/*! ./_an-object */ 23)
  , IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ 64)
  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ 48)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(/*! ./_descriptors */ 7) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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

/***/ }),
/* 11 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_to-iobject.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(/*! ./_iobject */ 65)
  , defined = __webpack_require__(/*! ./_defined */ 38);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 12 */,
/* 13 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************!*\
  !*** ../~/core-js/library/modules/_fails.js ***!
  \**********************************************/
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 14 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************!*\
  !*** ../~/core-js/library/modules/_hide.js ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(/*! ./_object-dp */ 10)
  , createDesc = __webpack_require__(/*! ./_property-desc */ 29);
module.exports = __webpack_require__(/*! ./_descriptors */ 7) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 15 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/core-js/library/modules/_object-keys.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(/*! ./_object-keys-internal */ 70)
  , enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ 39);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 16 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../~/core-js/library/modules/_wks.js ***!
  \********************************************/
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(/*! ./_shared */ 46)('wks')
  , uid        = __webpack_require__(/*! ./_uid */ 31)
  , Symbol     = __webpack_require__(/*! ./_global */ 6).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 17 */,
/* 18 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************************!*\
  !*** ../~/babel-runtime/core-js/object/get-prototype-of.js ***!
  \*************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/get-prototype-of */ 102), __esModule: true };

/***/ }),
/* 19 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************!*\
  !*** ../~/babel-runtime/helpers/inherits.js ***!
  \**********************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(/*! ../core-js/object/set-prototype-of */ 96);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(/*! ../core-js/object/create */ 95);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ 60);

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

/***/ }),
/* 20 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************************!*\
  !*** ../~/babel-runtime/helpers/possibleConstructorReturn.js ***!
  \***************************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ 60);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),
/* 21 */
/* unknown exports provided */
/* all exports used */
/*!**********************************!*\
  !*** ../src/matching/Pattern.js ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _Token = __webpack_require__(/*! ./Token */ 89);

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

      var pushToken = function pushToken(value, exactMatch, index) {
        var token = new _Token2.default(value, exactMatch);
        token.pos = index - value.length - 1;
        tokens.push(token);
      };

      var currentToken = '';
      var i = void 0;
      for (i = 0; i < pattern.length; i++) {
        switch (pattern[i]) {
          case '{':
            if (!currentToken.length) {
              break;
            }
            pushToken(currentToken, true, i);
            currentToken = '';
            break;
          case '}':
            pushToken(currentToken, false, i);
            currentToken = '';
            break;
          default:
            currentToken += pattern[i];
            break;
        }
      }

      if (currentToken) {
        pushToken(currentToken, true, pattern.length);
      }
      return tokens;
    }
  }]);
  return Pattern;
}();

Pattern.displayName = 'Pattern';
exports.default = Pattern;

/***/ }),
/* 22 */
/* unknown exports provided */
/* all exports used */
/*!******************************************!*\
  !*** ../src/validators/ValidatorBase.js ***!
  \******************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = __webpack_require__(/*! babel-runtime/core-js/object/keys */ 26);

var _keys2 = _interopRequireDefault(_keys);

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

  /**
   * Get cache key from context
   * @param context
   * @param keyProps
   * @returns {string}
   */


  (0, _createClass3.default)(ValidatorBase, [{
    key: 'validateToken',


    /* eslint-disable class-methods-use-this, no-unused-vars */

    /**
     * Callback handler when a value has to be validated against a token
     * @param context - The current parse context
     * @param token - The token to validate against
     * @param value - The value to validate
     * @param isFinal - True if this is the final validation and no more characters are expected for the value
     * @returns {*} - Returns true if the value matches the token, false if it doesn't match or the token is unknown
     */
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
    key: 'finalizeValue',
    value: function finalizeValue(context, token, value) {
      return value;
    }

    /* eslint-disable class-methods-use-this */

  }], [{
    key: 'getKey',
    value: function getKey() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var keyProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      return keyProps.map(function (prop) {
        return context[prop] || '';
      }).join('_');
    }

    /**
     * Store options for the given context. Used to set different values by country or language
     * @param cache
     * @param context
     * @param options
     */

  }, {
    key: 'defineContext',
    value: function defineContext(cache, context, options) {
      /* eslint-disable no-param-reassign */
      // automatically determine which context properties to use for the key
      if (!cache.keys) {
        cache.keys = (0, _keys2.default)(context);
      }
      cache[ValidatorBase.getKey(context, cache.keys)] = options;
      /* eslint-enable */
    }

    /**
     * Retrieve options matching the given context
     * @param cache
     * @param context
     */

  }, {
    key: 'getOptions',
    value: function getOptions(cache, context) {
      return cache[ValidatorBase.getKey(context, cache.keys)];
    }
  }]);
  return ValidatorBase;
}();

ValidatorBase.displayName = 'ValidatorBase';
exports.default = ValidatorBase;

/***/ }),
/* 23 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_an-object.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ 24);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 24 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_is-object.js ***!
  \**************************************************/
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 25 */,
/* 26 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************!*\
  !*** ../~/babel-runtime/core-js/object/keys.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/keys */ 103), __esModule: true };

/***/ }),
/* 27 */
/* unknown exports provided */
/* all exports used */
/*!**************************************!*\
  !*** ../src/utils/validatorUtils.js ***!
  \**************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateCount = validateCount;
/* eslint-disable import/prefer-default-export */
/**
 * Created by Jens on 26.06.2015.
 * Provides utilities for validators such as checking whether a value is within the token character limit
 */

/**
 * Checks whether the value is within the required length for token
 * @param token
 * @param value
 * @param isFinal
 * @returns {boolean}
 */
function validateCount(token, value, isFinal) {
  return (!isFinal || value.length >= token.minCount) && value.length <= token.maxCount;
}

/***/ }),
/* 28 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_object-pie.js ***!
  \***************************************************/
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 29 */
/* unknown exports provided */
/* all exports used */
/*!******************************************************!*\
  !*** ../~/core-js/library/modules/_property-desc.js ***!
  \******************************************************/
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 30 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_to-object.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(/*! ./_defined */ 38);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 31 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../~/core-js/library/modules/_uid.js ***!
  \********************************************/
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 32 */,
/* 33 */
/* unknown exports provided */
/* all exports used */
/*!********************************!*\
  !*** ../src/PatternContext.js ***!
  \********************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class PatternContext - Holds values which may influence parsing outcome like current date and time, location or language
 * @type {object}
 * @property language {string} - A language code
 * @property country {string} - A country code
 * @property date {Date} - The current date
 * @property reasons {boolean} - True if reasons for dismissing tokens should be logged during parsing
 */
var PatternContext =
/**
 * Create a new context
 * @param options {{ [date]: ?Date, [reasons]: ?boolean }}
 * @constructor
 */
function PatternContext(options) {
  (0, _classCallCheck3.default)(this, PatternContext);

  var opts = options || {};
  this.date = opts.date || new Date();
  this.reasons = opts.reasons === undefined ? true : opts.reasons;
  this.language = 'en';
  this.country = 'us';
};

PatternContext.displayName = 'PatternContext';


module.exports = PatternContext;

/***/ }),
/* 34 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************!*\
  !*** ../~/babel-runtime/helpers/extends.js ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(/*! ../core-js/object/assign */ 94);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),
/* 35 */,
/* 36 */
/* unknown exports provided */
/* all exports used */
/*!**********************************!*\
  !*** ../src/utils/arrayUtils.js ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 37 */
/* unknown exports provided */
/* all exports used */
/*!***********************************!*\
  !*** ../src/utils/stringUtils.js ***!
  \***********************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startsWith = startsWith;
exports.matchAll = matchAll;
exports.countNumbers = countNumbers;
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

/**
 * Count occurrences of numbers
 * @param value
 * @return {number}
 * @constructor
 */
function countNumbers(value) {
  var count = 0;
  for (var i = 0; i < value.length; i++) {
    var c = value.charAt(i);
    if (c >= '0' && c <= '9') count++;
  }
  return count;
}

/***/ }),
/* 38 */
/* unknown exports provided */
/* all exports used */
/*!************************************************!*\
  !*** ../~/core-js/library/modules/_defined.js ***!
  \************************************************/
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 39 */
/* unknown exports provided */
/* all exports used */
/*!******************************************************!*\
  !*** ../~/core-js/library/modules/_enum-bug-keys.js ***!
  \******************************************************/
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 40 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_iterators.js ***!
  \**************************************************/
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 41 */
/* unknown exports provided */
/* all exports used */
/*!************************************************!*\
  !*** ../~/core-js/library/modules/_library.js ***!
  \************************************************/
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 42 */
/* unknown exports provided */
/* all exports used */
/*!******************************************************!*\
  !*** ../~/core-js/library/modules/_object-create.js ***!
  \******************************************************/
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(/*! ./_an-object */ 23)
  , dPs         = __webpack_require__(/*! ./_object-dps */ 118)
  , enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ 39)
  , IE_PROTO    = __webpack_require__(/*! ./_shared-key */ 45)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(/*! ./_dom-create */ 63)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(/*! ./_html */ 111).appendChild(iframe);
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


/***/ }),
/* 43 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/core-js/library/modules/_object-gops.js ***!
  \****************************************************/
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 44 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************************!*\
  !*** ../~/core-js/library/modules/_set-to-string-tag.js ***!
  \**********************************************************/
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(/*! ./_object-dp */ 10).f
  , has = __webpack_require__(/*! ./_has */ 9)
  , TAG = __webpack_require__(/*! ./_wks */ 16)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 45 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_shared-key.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(/*! ./_shared */ 46)('keys')
  , uid    = __webpack_require__(/*! ./_uid */ 31);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 46 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************!*\
  !*** ../~/core-js/library/modules/_shared.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ 6)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 47 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_to-integer.js ***!
  \***************************************************/
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 48 */
/* unknown exports provided */
/* all exports used */
/*!*****************************************************!*\
  !*** ../~/core-js/library/modules/_to-primitive.js ***!
  \*****************************************************/
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(/*! ./_is-object */ 24);
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

/***/ }),
/* 49 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_wks-define.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(/*! ./_global */ 6)
  , core           = __webpack_require__(/*! ./_core */ 4)
  , LIBRARY        = __webpack_require__(/*! ./_library */ 41)
  , wksExt         = __webpack_require__(/*! ./_wks-ext */ 50)
  , defineProperty = __webpack_require__(/*! ./_object-dp */ 10).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 50 */
/* unknown exports provided */
/* all exports used */
/*!************************************************!*\
  !*** ../~/core-js/library/modules/_wks-ext.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(/*! ./_wks */ 16);

/***/ }),
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************!*\
  !*** ../src/modules/BooleanParserModule.js ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionsCache = undefined;

var _getPrototypeOf = __webpack_require__(/*! babel-runtime/core-js/object/get-prototype-of */ 18);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ 20);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ 19);

var _inherits3 = _interopRequireDefault(_inherits2);

var _ValidatorBase2 = __webpack_require__(/*! ../validators/ValidatorBase */ 22);

var _ValidatorBase3 = _interopRequireDefault(_ValidatorBase2);

var _arrayUtils = __webpack_require__(/*! ../utils/arrayUtils */ 36);

var _boolean = __webpack_require__(/*! ./contexts/boolean.global */ 81);

var _boolean2 = _interopRequireDefault(_boolean);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var optionsCache = exports.optionsCache = {};

/**
 * Parses booleans
 */

var BooleanParserModule = function (_ValidatorBase) {
  (0, _inherits3.default)(BooleanParserModule, _ValidatorBase);

  /**
   * Create a boolean parser
   * @param context
   */
  function BooleanParserModule(context) {
    (0, _classCallCheck3.default)(this, BooleanParserModule);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BooleanParserModule.__proto__ || (0, _getPrototypeOf2.default)(BooleanParserModule)).call(this, context));

    _this.options = _ValidatorBase3.default.getOptions(optionsCache, context);
    return _this;
  }

  (0, _createClass3.default)(BooleanParserModule, [{
    key: 'getPatterns',


    /* eslint-disable class-methods-use-this, no-unused-vars */

    /**
     * Get all the patterns
     */
    value: function getPatterns() {
      return this.options && this.options.patterns || {};
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
      var options = this.options;
      if (!options) return false;
      switch (token.value) {
        case 'booleantrue':
          return isFinal && options.trueLookup[lowerValue] || !isFinal && (0, _arrayUtils.startsWith)(options.trueValues, lowerValue);
        case 'booleanfalse':
          return isFinal && options.falseLookup[lowerValue] || !isFinal && (0, _arrayUtils.startsWith)(options.falseValues, lowerValue);
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
    value: function defineContext(context, options) {
      _ValidatorBase3.default.defineContext(optionsCache, context, options);
    }
  }]);
  return BooleanParserModule;
}(_ValidatorBase3.default);

/**
 * Define english language context
 */


BooleanParserModule.tokenTags = ['booleanfalse', 'booleantrue'];
BooleanParserModule.displayName = 'BooleanParserModule';
BooleanParserModule.defineContext({
  language: 'en'
}, (0, _boolean2.default)({
  trueValues: ['1', 'true', 'yes'],
  falseValues: ['0', 'false', 'no']
}));

exports.default = BooleanParserModule;

/***/ }),
/* 55 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../src/modules/NumberParserModule.js ***!
  \********************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionsCache = undefined;

var _getPrototypeOf = __webpack_require__(/*! babel-runtime/core-js/object/get-prototype-of */ 18);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ 20);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ 19);

var _inherits3 = _interopRequireDefault(_inherits2);

var _ValidatorBase2 = __webpack_require__(/*! ../validators/ValidatorBase */ 22);

var _ValidatorBase3 = _interopRequireDefault(_ValidatorBase2);

var _stringUtils = __webpack_require__(/*! ../utils/stringUtils */ 37);

var _number = __webpack_require__(/*! ./contexts/number.global */ 82);

var _number2 = _interopRequireDefault(_number);

var _validatorUtils = __webpack_require__(/*! ../utils/validatorUtils */ 27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var optionsCache = exports.optionsCache = {};

var SIGN_CHARS = '-+'.split('');
var SEPARATOR_CHARS = '.,'.split('');
var UNIT_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!%?°^\'"/0123456789'.split('');
var INVALID_BEGIN_UNIT_CHARS = '0123456789?^/'.split('');
var NUMBER_CHARS = '0123456789'.split('');
var HEX_CHARS = '0123456789abcdefABCDEF'.split('');

/**
 * Parses booleans
 */

var NumberParserModule = function (_ValidatorBase) {
  (0, _inherits3.default)(NumberParserModule, _ValidatorBase);

  /**
   * Create a number parser
   * @param context
   */
  function NumberParserModule(context) {
    (0, _classCallCheck3.default)(this, NumberParserModule);

    var _this = (0, _possibleConstructorReturn3.default)(this, (NumberParserModule.__proto__ || (0, _getPrototypeOf2.default)(NumberParserModule)).call(this, context));

    _this.options = _ValidatorBase3.default.getOptions(optionsCache, context);
    return _this;
  }

  (0, _createClass3.default)(NumberParserModule, [{
    key: 'getPatterns',


    /* eslint-disable class-methods-use-this, no-unused-vars */

    /**
     * Get all the patterns
     */
    value: function getPatterns() {
      return this.options && this.options.patterns || {};
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
      if (!(0, _validatorUtils.validateCount)(token, value, isFinal)) {
        return false;
      }

      var c = value.charAt(value.length - 1);
      switch (token.value) {
        case '-+':
          return SIGN_CHARS.indexOf(c) !== -1;
        case '.,':
          return SEPARATOR_CHARS.indexOf(c) !== -1;
        case '#':
          return NUMBER_CHARS.indexOf(c) !== -1;
        case '#.':
          return NumberParserModule.validateGroupedNumbers(value, '.', isFinal);
        case '#,':
          return NumberParserModule.validateGroupedNumbers(value, ',', isFinal);
        case 'unit':
          {
            // unit can contain numbers but not only consist of numbers
            var isValid = UNIT_CHARS.indexOf(c) !== -1 && INVALID_BEGIN_UNIT_CHARS.indexOf(value[0]) === -1;
            // check the ratio of numbers to other characters and reject unit if too many numbers
            if (isFinal && isValid) {
              var numCount = (0, _stringUtils.countNumbers)(value);
              if (numCount > 0 && numCount >= value.length - numCount) {
                isValid = false;
              }
            }
            return isValid;
          }
        case 'X':
          return HEX_CHARS.indexOf(c) !== -1;
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
      return value;
    }

    /**
     * Validates a number with thousands separators included
     * @param value
     * @param separator
     * @param isFinal
     * @return {boolean}
     */

  }], [{
    key: 'defineContext',
    value: function defineContext(context, options) {
      _ValidatorBase3.default.defineContext(optionsCache, context, options);
    }
  }, {
    key: 'validateGroupedNumbers',
    value: function validateGroupedNumbers(value, separator, isFinal) {
      var first = true;
      var groupLength = 0;
      for (var i = 0; i < value.length && groupLength <= 3; i++) {
        var c = value.charAt(i);
        if (c === separator) {
          if (groupLength === 0 || first && groupLength > 3 || !first && groupLength !== 3) {
            return false;
          }
          first = false;
          groupLength = 0;
          continue;
        }
        if (c < '0' || c > '9') {
          return false;
        }
        groupLength++;
      }
      if (isFinal && !first) {
        return groupLength === 3;
      }
      return groupLength <= 3;
    }

    /* eslint-enable */

  }]);
  return NumberParserModule;
}(_ValidatorBase3.default);

/**
 * Define english language context
 */


NumberParserModule.tokenTags = ['-+', '#', '#.', '#,', 'unit', 'X'];
NumberParserModule.displayName = 'NumberParserModule';
NumberParserModule.defineContext({
  language: 'en'
}, (0, _number2.default)({
  commaDecimal: false
}));

exports.default = NumberParserModule;

/***/ }),
/* 56 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************!*\
  !*** ../src/validators/DefaultValidator.js ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(/*! babel-runtime/core-js/object/get-prototype-of */ 18);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ 20);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ 19);

var _inherits3 = _interopRequireDefault(_inherits2);

var _ValidatorBase2 = __webpack_require__(/*! ./ValidatorBase */ 22);

var _ValidatorBase3 = _interopRequireDefault(_ValidatorBase2);

var _validatorUtils = __webpack_require__(/*! ../utils/validatorUtils */ 27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @const */
var LETTER_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
var SPACE_CHARS = [' ', '\t'];
var NEWLINE_CHARS = ['\r', '\n'];
var EMPTYLINE_CHARS = ['\r', '\n', ' ', '\t'];

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
      if (!(0, _validatorUtils.validateCount)(token, value, isFinal)) {
        return false;
      }

      var c = value.charAt(value.length - 1);
      var result = void 0;
      switch (token.value) {
        // whitespace
        case ' ':
          result = SPACE_CHARS.indexOf(c) !== -1;
          break;
        case 'nl':
          result = NEWLINE_CHARS.indexOf(c) !== -1;
          break;
        case 'el':
          result = EMPTYLINE_CHARS.indexOf(c) !== -1;
          break;
        case 'w':
          result = LETTER_CHARACTERS.indexOf(c) !== -1;
          break;
        case '.':
          result = true;
          break;
        default:
          result = false;
      }
      return result;
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
      if (DefaultValidator.tokenTags.indexOf(token.value) !== -1) {
        return value;
      }
      // TODO: return something else if unknown?
      return value;
    }

    /* eslint-enable */

  }]);
  return DefaultValidator;
}(_ValidatorBase3.default);

DefaultValidator.tokenTags = [' ', 'nl', 'el', 'w', '.'];
DefaultValidator.displayName = 'DefaultValidator';
exports.default = DefaultValidator;

/***/ }),
/* 57 */,
/* 58 */
/* unknown exports provided */
/* all exports used */
/*!********************************!*\
  !*** ../src/PatternMatcher.js ***!
  \********************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = __webpack_require__(/*! babel-runtime/core-js/object/keys */ 26);

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _arrayUtils = __webpack_require__(/*! ./utils/arrayUtils */ 36);

var arrayUtils = _interopRequireWildcard(_arrayUtils);

var _stringUtils = __webpack_require__(/*! ./utils/stringUtils */ 37);

var stringUtils = _interopRequireWildcard(_stringUtils);

var _Pattern = __webpack_require__(/*! ./matching/Pattern */ 21);

var _Pattern2 = _interopRequireDefault(_Pattern);

var _PathNode = __webpack_require__(/*! ./matching/PathNode */ 59);

var _PathNode2 = _interopRequireDefault(_PathNode);

var _PatternPath = __webpack_require__(/*! ./matching/PatternPath */ 88);

var _PatternPath2 = _interopRequireDefault(_PatternPath);

var _MatchState = __webpack_require__(/*! ./MatchState */ 87);

var _MatchState2 = _interopRequireDefault(_MatchState);

var _PatternContext = __webpack_require__(/*! ./PatternContext */ 33);

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
      var _this = this;

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

      // update sub-match flag for all patterns
      // TODO: this may be too slow to do each time when adding patterns?
      (0, _keys2.default)(this.patterns).forEach(function (key) {
        _this.patterns[key].forEach(function (pattern) {
          pattern.tokens.forEach(function (token) {
            if (!token.exactMatch && Object.prototype.hasOwnProperty.call(_this.compiledPatterns, token.value)) {
              // eslint-disable-next-line no-param-reassign
              token.isSubMatch = true;
            }
          });
        });
      });
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
          PatternMatcher.finalizeReasons(state);
          return {
            values: [],
            reasons: state.reasons
          };
        }
      }

      var results = this.matchResults(state);
      // reverse results since the longest matches will be found last but are the most specific
      results.reverse();
      return {
        values: results,
        reasons: state.reasons
      };
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
      state.addCandidates(root, [], null);

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
        var node = candidateNodes[i];

        // initialize a sub-match
        var token = node.token;
        if (token.isSubMatch && !node.matchState) {
          // sub matching is possible, so start a new one or continue the previous one
          // eslint-disable-next-line no-param-reassign
          node.matchState = this.matchStart(state.context, token.value);
        }

        // first check if any of the child nodes validate with the new character and remember them as candidates
        // any children can only be candidates if the final validation of the current value succeeds
        if (this.validateToken(state, node, true)) {
          // TODO: not efficient
          var clone = node.clone();
          if (node.matchState) {
            clone.matchState = node.matchState.clone();
          }
          state.addCandidates(node.path, node.previousValues.concat(node.textValue), clone);
        }

        // validate this candidate and remove it if it doesn't validate anymore
        node.isFinalized = false;
        node.textValue += c;
        var subResult = true;
        if (token.isSubMatch) {
          // if it's a sub-match then check separately
          subResult = this.matchNext(node.matchState, c, isFinal);
        }
        if (!subResult || !this.validateToken(state, node, isFinal)) {
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
        }, 0);
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
      var _this2 = this;

      var results = [];

      var context = state.context,
          candidateNodes = state.candidateNodes;

      // fetch patterns for all matching candidates

      var _loop = function _loop(i) {
        var node = candidateNodes[i];

        // finalize last node first
        var previousValues = node.previousValues.concat(node.textValue);
        var valueIndex = previousValues.length - 1;
        var cur = node;
        while (cur) {
          cur.textValue = previousValues[valueIndex];
          _this2.finalizeValue(state, cur);
          previousValues[valueIndex--] = cur.value;
          cur = cur.parent;
        }
        // // finalize all previous values
        // let previousValues = node.previousNodes.map((previousNode, index) => {
        //   // eslint-disable-next-line no-param-reassign
        //   previousNode.textValue = node.previousValues[index];
        //   this.finalizeValue(state, previousNode);
        //   return previousNode.value;
        // });
        // this.finalizeValue(state, node);
        // previousValues = previousValues.concat(node.value);

        var previousValuesCount = previousValues.length - 1;
        var lastDepth = 1;
        // traverse the tree to the leaf nodes with empty values added so we find all valid patterns
        PatternMatcher.matchToLast(node.path, function (path, depth) {
          while (lastDepth <= depth) {
            previousValues[previousValuesCount + lastDepth] = '';
            lastDepth++;
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
        }, 0);
      };

      for (var i = 0; i < candidateNodes.length; i++) {
        _loop(i);
      }
      PatternMatcher.finalizeReasons(state);
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
      if (token.isSubMatch) {
        // if this is the last match then assemble the results
        if (isFinal) {
          return this.hasResults(node.matchState);
        }
        return true;
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
    key: 'finalizeReasons',
    value: function finalizeReasons(state) {
      if (state.context.reasons) {
        var candidates = state.getCandidateNodes();
        if (state.reasons && candidates) {
          state.reasons = state.reasons.concat(state.getCandidateNodes()); // eslint-disable-line no-param-reassign
        }
        // state.reasons.forEach(node => {
        //   console.log('\n', node.token.toString());
        //   node.reasons.forEach(reason => {
        //     console.log('  ', reason.test, JSON.stringify(reason.args), `"${reason.textValue}"`, '=>', reason.result);
        //   });
        // });
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
      for (var i = 0; i < path.children.length; i++) {
        var child = path.children[i];
        if (child.token.minCount > 0) {
          continue;
        }
        PatternMatcher.matchToLast(child.path, add, depth + 1);
      }
    }
  }]);
  return PatternMatcher;
}();

PatternMatcher.displayName = 'PatternMatcher';
exports.default = PatternMatcher;

/***/ }),
/* 59 */
/* unknown exports provided */
/* all exports used */
/*!***********************************!*\
  !*** ../src/matching/PathNode.js ***!
  \***********************************/
/***/ (function(module, exports, __webpack_require__) {

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

  (0, _createClass3.default)(PathNode, [{
    key: 'clone',
    value: function clone() {
      var clone = new PathNode(this.token, this.path, this.textValue);
      clone.previousValues = this.previousValues.slice();
      clone.parent = this.parent;
      return clone;
    }

    /**
     * Log a validation reason with result
     * @param test
     * @param args
     * @param result
     */

  }, {
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

/***/ }),
/* 60 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../~/babel-runtime/helpers/typeof.js ***!
  \********************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(/*! ../core-js/symbol/iterator */ 98);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(/*! ../core-js/symbol */ 97);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 61 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../~/core-js/library/modules/_cof.js ***!
  \********************************************/
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 62 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../~/core-js/library/modules/_ctx.js ***!
  \********************************************/
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(/*! ./_a-function */ 107);
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

/***/ }),
/* 63 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_dom-create.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ 24)
  , document = __webpack_require__(/*! ./_global */ 6).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 64 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************************!*\
  !*** ../~/core-js/library/modules/_ie8-dom-define.js ***!
  \*******************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(/*! ./_descriptors */ 7) && !__webpack_require__(/*! ./_fails */ 13)(function(){
  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ 63)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 65 */
/* unknown exports provided */
/* all exports used */
/*!************************************************!*\
  !*** ../~/core-js/library/modules/_iobject.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(/*! ./_cof */ 61);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 66 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/core-js/library/modules/_iter-define.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(/*! ./_library */ 41)
  , $export        = __webpack_require__(/*! ./_export */ 8)
  , redefine       = __webpack_require__(/*! ./_redefine */ 72)
  , hide           = __webpack_require__(/*! ./_hide */ 14)
  , has            = __webpack_require__(/*! ./_has */ 9)
  , Iterators      = __webpack_require__(/*! ./_iterators */ 40)
  , $iterCreate    = __webpack_require__(/*! ./_iter-create */ 113)
  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 44)
  , getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ 69)
  , ITERATOR       = __webpack_require__(/*! ./_wks */ 16)('iterator')
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

/***/ }),
/* 67 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/core-js/library/modules/_object-gopd.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(/*! ./_object-pie */ 28)
  , createDesc     = __webpack_require__(/*! ./_property-desc */ 29)
  , toIObject      = __webpack_require__(/*! ./_to-iobject */ 11)
  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ 48)
  , has            = __webpack_require__(/*! ./_has */ 9)
  , IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ 64)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(/*! ./_descriptors */ 7) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 68 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/core-js/library/modules/_object-gopn.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(/*! ./_object-keys-internal */ 70)
  , hiddenKeys = __webpack_require__(/*! ./_enum-bug-keys */ 39).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 69 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_object-gpo.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(/*! ./_has */ 9)
  , toObject    = __webpack_require__(/*! ./_to-object */ 30)
  , IE_PROTO    = __webpack_require__(/*! ./_shared-key */ 45)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 70 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************************!*\
  !*** ../~/core-js/library/modules/_object-keys-internal.js ***!
  \*************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(/*! ./_has */ 9)
  , toIObject    = __webpack_require__(/*! ./_to-iobject */ 11)
  , arrayIndexOf = __webpack_require__(/*! ./_array-includes */ 109)(false)
  , IE_PROTO     = __webpack_require__(/*! ./_shared-key */ 45)('IE_PROTO');

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

/***/ }),
/* 71 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_object-sap.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(/*! ./_export */ 8)
  , core    = __webpack_require__(/*! ./_core */ 4)
  , fails   = __webpack_require__(/*! ./_fails */ 13);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 72 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************!*\
  !*** ../~/core-js/library/modules/_redefine.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./_hide */ 14);

/***/ }),
/* 73 */,
/* 74 */,
/* 75 */
/* unknown exports provided */
/* all exports used */
/*!****************************!*\
  !*** ../src/DataParser.js ***!
  \****************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _keys = __webpack_require__(/*! babel-runtime/core-js/object/keys */ 26);

var _keys2 = _interopRequireDefault(_keys);

var _PatternMatcher = __webpack_require__(/*! ./PatternMatcher */ 58);

var _PatternMatcher2 = _interopRequireDefault(_PatternMatcher);

var _PatternContext = __webpack_require__(/*! ./PatternContext */ 33);

var _PatternContext2 = _interopRequireDefault(_PatternContext);

var _DefaultValidator = __webpack_require__(/*! ./validators/DefaultValidator */ 56);

var _DefaultValidator2 = _interopRequireDefault(_DefaultValidator);

var _BooleanParserModule = __webpack_require__(/*! ./modules/BooleanParserModule */ 54);

var _BooleanParserModule2 = _interopRequireDefault(_BooleanParserModule);

var _NumberParserModule = __webpack_require__(/*! ./modules/NumberParserModule */ 55);

var _NumberParserModule2 = _interopRequireDefault(_NumberParserModule);

var _EmailParserModule = __webpack_require__(/*! ./modules/EmailParserModule */ 80);

var _EmailParserModule2 = _interopRequireDefault(_EmailParserModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var moduleTypes = [_DefaultValidator2.default, _BooleanParserModule2.default, _NumberParserModule2.default, _EmailParserModule2.default];

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
    if (module.getPatterns) {
      var patterns = module.getPatterns();
      (0, _keys2.default)(patterns).forEach(function (tag) {
        return matcher.addPatterns(tag, patterns[tag]);
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
   * Features:
   * - initialize PatternMatcher with a list of modules
   * - patterns depend on context
   * - can initialize patterns based on multiple contexts
   * @param [name] {string} - if a name is specified, remembers the created matcher for quicker reuse
   * @param [modules] {Module[]} - A list of modules to use for matching
   * @param [context] - A parser context that will be used across all parse calls
   * @constructor
   */
  function DataParser(name, modules, context) {
    (0, _classCallCheck3.default)(this, DataParser);

    if (name && namedPatternMatchers[name] && !modules && !context) {
      this.patternMatcher = namedPatternMatchers[name];
      return;
    }

    this.context = context || new _PatternContext2.default();

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


  (0, _createClass3.default)(DataParser, [{
    key: 'parse',
    value: function parse(value, context) {
      var matchResults = this.patternMatcher.match(context || this.context, value);
      return matchResults || [];
    }
  }]);
  return DataParser;
}();

DataParser.displayName = 'DataParser';
exports.default = DataParser;

/***/ }),
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */
/* unknown exports provided */
/* all exports used */
/*!***********************!*\
  !*** ../src/index.js ***!
  \***********************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _PatternMatcher = __webpack_require__(/*! ./PatternMatcher */ 58);

var _PatternMatcher2 = _interopRequireDefault(_PatternMatcher);

var _DataParser = __webpack_require__(/*! ./DataParser */ 75);

var _DataParser2 = _interopRequireDefault(_DataParser);

var _Pattern = __webpack_require__(/*! ./matching/Pattern */ 21);

var _Pattern2 = _interopRequireDefault(_Pattern);

var _PatternContext = __webpack_require__(/*! ./PatternContext */ 33);

var _PatternContext2 = _interopRequireDefault(_PatternContext);

var _ValidatorBase = __webpack_require__(/*! ./validators/ValidatorBase */ 22);

var _ValidatorBase2 = _interopRequireDefault(_ValidatorBase);

var _arrayUtils = __webpack_require__(/*! ./utils/arrayUtils */ 36);

var _arrayUtils2 = _interopRequireDefault(_arrayUtils);

var _stringUtils = __webpack_require__(/*! ./utils/stringUtils */ 37);

var _stringUtils2 = _interopRequireDefault(_stringUtils);

var _validatorUtils = __webpack_require__(/*! ./utils/validatorUtils */ 27);

var _validatorUtils2 = _interopRequireDefault(_validatorUtils);

var _DefaultValidator = __webpack_require__(/*! ./validators/DefaultValidator */ 56);

var _DefaultValidator2 = _interopRequireDefault(_DefaultValidator);

var _BooleanParserModule = __webpack_require__(/*! ./modules/BooleanParserModule */ 54);

var _BooleanParserModule2 = _interopRequireDefault(_BooleanParserModule);

var _NumberParserModule = __webpack_require__(/*! ./modules/NumberParserModule */ 55);

var _NumberParserModule2 = _interopRequireDefault(_NumberParserModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Entry point for the DataParser library
 */
module.exports = {
  PatternMatcher: _PatternMatcher2.default,
  DataParser: _DataParser2.default,
  PatternContext: _PatternContext2.default,
  matching: {
    Pattern: _Pattern2.default
  },
  validators: {
    ValidatorBase: _ValidatorBase2.default
  },
  utils: {
    array: _arrayUtils2.default,
    string: _stringUtils2.default,
    validator: _validatorUtils2.default
  },
  modules: {
    DefaultValidator: _DefaultValidator2.default,
    BooleanParserModule: _BooleanParserModule2.default,
    NumberParserModule: _NumberParserModule2.default
  }
};

/***/ }),
/* 80 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************!*\
  !*** ../src/modules/EmailParserModule.js ***!
  \*******************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionsCache = undefined;

var _getPrototypeOf = __webpack_require__(/*! babel-runtime/core-js/object/get-prototype-of */ 18);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ 20);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ 19);

var _inherits3 = _interopRequireDefault(_inherits2);

var _ValidatorBase2 = __webpack_require__(/*! ../validators/ValidatorBase */ 22);

var _ValidatorBase3 = _interopRequireDefault(_ValidatorBase2);

var _email = __webpack_require__(/*! ./contexts/email.global */ 90);

var _email2 = _interopRequireDefault(_email);

var _validatorUtils = __webpack_require__(/*! ../utils/validatorUtils */ 27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var optionsCache = exports.optionsCache = {};


var MAIL_CHARS = 'abcdefghijklmnopqrstuvwxyzäöüßABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789!#$%&\'*+-/=?^_`{|}~.'.split('');
var MAIL_HOST_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_'.split('');
var SPECIAL_COMMENT_CHARS = '\\"()'.split('');
var SPECIAL_DISPLAY_CHARS = '\\"'.split('');

/**
 * Parses booleans
 */

var EmailParserModule = function (_ValidatorBase) {
  (0, _inherits3.default)(EmailParserModule, _ValidatorBase);

  /**
   * Create a number parser
   * @param context
   */
  function EmailParserModule(context) {
    (0, _classCallCheck3.default)(this, EmailParserModule);

    var _this = (0, _possibleConstructorReturn3.default)(this, (EmailParserModule.__proto__ || (0, _getPrototypeOf2.default)(EmailParserModule)).call(this, context));

    _this.options = _ValidatorBase3.default.getOptions(optionsCache, context);
    return _this;
  }

  (0, _createClass3.default)(EmailParserModule, [{
    key: 'getPatterns',


    /* eslint-disable class-methods-use-this, no-unused-vars */

    /**
     * Get all the patterns
     */
    value: function getPatterns() {
      return this.options && this.options.patterns || {};
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
      if (!(0, _validatorUtils.validateCount)(token, value, isFinal)) {
        return false;
      }

      var c = value.charAt(value.length - 1);
      switch (token.value) {
        case 'mail':
          // mail user characters
          if (isFinal && (value.charAt(0) === '.' || c === '.')) {
            return false;
          }
          // be a bit more forgiving: && !value.Contains("..");
          return MAIL_CHARS.indexOf(c) !== -1;
        case 'mailh':
          // mail host characters
          if (isFinal && (value.charAt(0) === '.' || c === '.')) {
            return false;
          }
          // be a bit more forgiving: && !value.Contains("..");
          return MAIL_HOST_CHARS.indexOf(c) !== -1;
        case 'mailc':
          // comment characters
          // if it's a special character then make sure the escaping backslash is before it
          if (SPECIAL_COMMENT_CHARS.indexOf(c) !== -1 && (value.length <= 1 || value.charAt(value.length - 2) !== '\\')) {
            return false;
          }
          /*
           * allow any comment character except " and \
           else if (CommentCharacters.IndexOf(c) == -1)
           return false;
           */
          return true;
        case 'mailn':
          // display name characters
          // if it's a special character then make sure the escaping backslash is before it
          if (SPECIAL_DISPLAY_CHARS.indexOf(c) !== -1 && (value.length <= 1 || value.charAt(value.length - 2) !== '\\')) {
            return false;
          }
          /*
           * allow any display character except " and \
           else if (DisplayCharacters.IndexOf(c) == -1)
           return false;
           */
          return true;
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
      return value;
    }

    /**
     * Validates a number with thousands separators included
     * @param value
     * @param separator
     * @param isFinal
     * @return {boolean}
     */

  }], [{
    key: 'defineContext',
    value: function defineContext(context, options) {
      _ValidatorBase3.default.defineContext(optionsCache, context, options);
    }
  }, {
    key: 'validateGroupedNumbers',
    value: function validateGroupedNumbers(value, separator, isFinal) {
      var first = true;
      var groupLength = 0;
      for (var i = 0; i < value.length && groupLength <= 3; i++) {
        var c = value.charAt(i);
        if (c === separator) {
          if (groupLength === 0 || first && groupLength > 3 || !first && groupLength !== 3) {
            return false;
          }
          first = false;
          groupLength = 0;
          continue;
        }
        if (c < '0' || c > '9') {
          return false;
        }
        groupLength++;
      }
      if (isFinal && !first) {
        return groupLength === 3;
      }
      return groupLength <= 3;
    }

    /* eslint-enable */

  }]);
  return EmailParserModule;
}(_ValidatorBase3.default);

/**
 * Define english language context
 */


EmailParserModule.tokenTags = ['mail', 'mailh', 'mailc', 'mailn'];
EmailParserModule.displayName = 'EmailParserModule';
exports.default = EmailParserModule;
EmailParserModule.defineContext({
  language: 'en'
}, (0, _email2.default)({}));

/***/ }),
/* 81 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************!*\
  !*** ../src/modules/contexts/boolean.global.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(/*! babel-runtime/helpers/extends */ 34);

var _extends3 = _interopRequireDefault(_extends2);

var _Pattern = __webpack_require__(/*! ../../matching/Pattern */ 21);

var _Pattern2 = _interopRequireDefault(_Pattern);

var _BooleanValue = __webpack_require__(/*! ../../values/BooleanValue */ 91);

var _BooleanValue2 = _interopRequireDefault(_BooleanValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeLookup(values) {
  return values.reduce(function (r, text) {
    return (r[text] = true) && r;
  }, {}); // eslint-disable-line no-param-reassign
}

/**
 * Create the options based on constants
 * @param constants
 */
function makeOptions(constants) {
  var trueLookup = makeLookup(constants.trueValues);
  var falseLookup = makeLookup(constants.falseValues);

  /**
   * Make the final output value
   * @param [context] - parser context
   * @param [v]
   * @returns {BooleanValue}
   */
  function make(context, v) {
    var value = v && v[1];
    var boolValue = false;
    if (typeof value === 'boolean') {
      boolValue = value;
    } else if (value) {
      var lowerValue = value.toString().toLowerCase();
      boolValue = !!trueLookup[lowerValue];
    }
    return new _BooleanValue2.default(boolValue);
  }

  return (0, _extends3.default)({}, constants, {
    trueLookup: trueLookup,
    falseLookup: falseLookup,
    patterns: {
      '': [new _Pattern2.default('{el:*}{booleantrue}{el:*}', make), new _Pattern2.default('{el:*}{booleanfalse}{el:*}', make)]
    },
    make: make
  });
}

exports.default = makeOptions;

/***/ }),
/* 82 */
/* unknown exports provided */
/* all exports used */
/*!************************************************!*\
  !*** ../src/modules/contexts/number.global.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(/*! babel-runtime/helpers/extends */ 34);

var _extends3 = _interopRequireDefault(_extends2);

var _Pattern = __webpack_require__(/*! ../../matching/Pattern */ 21);

var _Pattern2 = _interopRequireDefault(_Pattern);

var _NumberValue = __webpack_require__(/*! ../../values/NumberValue */ 93);

var _NumberValue2 = _interopRequireDefault(_NumberValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var groupRegex = {
  '.': /\./g,
  ',': /,/g
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
function make(sign, integral, exponent, fractional, groupSeparator, unit) {
  /* eslint-disable no-param-reassign */
  var decimals = fractional ? fractional.length : 0;

  if (!integral) {
    integral = '0';
  } else if (groupSeparator) {
    integral = integral.replace(groupRegex[groupSeparator], '');
  }
  if (!fractional) {
    fractional = '0';
  }
  var val = parseFloat(integral + '.' + fractional);
  if (sign === '-') {
    val = -val;
  }
  if (exponent) {
    var exp = parseFloat(exponent);
    if (exp >= 0) {
      val *= Math.pow(10, exp);
    } else {
      val /= Math.pow(10, -exp);
    }
    // with an exponent we also need to adjust the number of decimals
    decimals = Math.round(decimals - exp);
    if (decimals < 0) decimals = 0;
  }
  return new _NumberValue2.default(val, unit || '', decimals);
  /* eslint-enable */
}

function getTokens(commaDecimal) {
  return {
    decimal: commaDecimal ? ',' : '.',
    groupSep: commaDecimal ? '.' : ',',
    group: commaDecimal ? '{#.:+}' : '{#,:+}'
  };
}

function getFloatPatterns(commaDecimal) {
  var _getTokens = getTokens(commaDecimal),
      decimal = _getTokens.decimal,
      groupSep = _getTokens.groupSep,
      group = _getTokens.group;

  return [new _Pattern2.default('{-+:?}' + group + decimal + '{#:*}', function (c, v) {
    return make(v[0], v[1], null, v[3], groupSep, null);
  }), new _Pattern2.default('{-+:?}{#:*}' + decimal + '{#:+}', function (c, v) {
    return make(v[0], v[1], null, v[3], null, null);
  }), new _Pattern2.default('{-+:?}' + group + decimal + '{#:*}e{-+:?}{#:+}', function (c, v) {
    return make(v[0], v[1], v[5] + v[6], v[3], groupSep, null);
  }), new _Pattern2.default('{-+:?}' + group + decimal + '{#:*}e{-+:?}{#:+}' + decimal + '{#:+}', function (c, v) {
    return make(v[0], v[1], '' + v[5] + v[6] + '.' + v[8], v[3], groupSep, null);
  }), new _Pattern2.default('{-+:?}{#:+}' + decimal + '{#:*}e{-+:?}{#:+}', function (c, v) {
    return make(v[0], v[1], v[5] + v[6], v[3], null, null);
  }), new _Pattern2.default('{-+:?}{#:+}' + decimal + '{#:*}e{-+:?}{#:+}' + decimal + '{#:+}', function (c, v) {
    return make(v[0], v[1], '' + v[5] + v[6] + '.' + v[8], v[3], null, null);
  })];
}

function getIntegerPatterns(commaDecimal) {
  var _getTokens2 = getTokens(commaDecimal),
      decimal = _getTokens2.decimal,
      groupSep = _getTokens2.groupSep,
      group = _getTokens2.group;

  return [new _Pattern2.default('{-+:?}{#:+}', function (c, v) {
    return make(v[0], v[1], null, '', null, null);
  }), new _Pattern2.default('{-+:?}' + group, function (c, v) {
    return make(v[0], v[1], null, '', groupSep, null);
  }), new _Pattern2.default('{-+:?}{#:+}e{-+:?}{#:+}', function (c, v) {
    return make(v[0], v[1], v[3] + v[4], '', null, null);
  }), new _Pattern2.default('{-+:?}{#:+}e{-+:?}{#:+}' + decimal + '{#:+}', function (c, v) {
    return make(v[0], v[1], '' + v[3] + v[4] + '.' + v[6], '', null, null);
  }), new _Pattern2.default('{-+:?}' + group + 'e{-+:?}{#:+}', function (c, v) {
    return make(v[0], v[1], v[3] + v[4], '', groupSep, null);
  }), new _Pattern2.default('{-+:?}' + group + 'e{-+:?}{#:+}' + decimal + '{#:+}', function (c, v) {
    return make(v[0], v[1], '' + v[3] + v[4] + '.' + v[6], '', groupSep, null);
  })];
}

function getMainPatterns(commaDecimal) {
  var _getTokens3 = getTokens(commaDecimal),
      decimal = _getTokens3.decimal,
      groupSep = _getTokens3.groupSep,
      group = _getTokens3.group;

  var pre = '{ :*}';
  var post = '{ :*}{unit:*}{ :*}';
  return [
  // float
  new _Pattern2.default(pre + '{-+:?}' + group + decimal + '{#:*}' + post, function (c, v) {
    return make(v[1], v[2], null, v[4], groupSep, v[6]);
  }), new _Pattern2.default(pre + '{-+:?}{#:*}' + decimal + '{#:+}' + post, function (c, v) {
    return make(v[1], v[2], null, v[4], null, v[6]);
  }), new _Pattern2.default(pre + '{-+:?}' + group + decimal + '{#:*}e{-+:?}{#:+}' + post, function (c, v) {
    return make(v[1], v[2], v[6] + v[7], v[4], groupSep, v[9]);
  }), new _Pattern2.default(pre + '{-+:?}' + group + decimal + '{#:*}e{-+:?}{#:+}' + decimal + '{#:+}' + post, function (c, v) {
    return make(v[1], v[2], '' + v[6] + v[7] + '.' + v[9], v[4], groupSep, v[11]);
  }), new _Pattern2.default(pre + '{-+:?}{#:+}' + decimal + '{#:*}e{-+:?}{#:+}' + post, function (c, v) {
    return make(v[1], v[2], v[6] + v[7], v[4], null, v[9]);
  }), new _Pattern2.default(pre + '{-+:?}{#:+}' + decimal + '{#:*}e{-+:?}{#:+}' + decimal + '{#:+}' + post, function (c, v) {
    return make(v[1], v[2], '' + v[6] + v[7] + '.' + v[9], v[4], null, v[11]);
  }),
  // integer
  new _Pattern2.default(pre + '{-+:?}{#:+}' + post, function (c, v) {
    return make(v[1], v[2], null, '', null, v[4]);
  }), new _Pattern2.default(pre + '{-+:?}' + group + post, function (c, v) {
    return make(v[1], v[2], null, '', groupSep, v[4]);
  }), new _Pattern2.default(pre + '{-+:?}{#:+}e{-+:?}{#:+}' + post, function (c, v) {
    return make(v[1], v[2], v[4] + v[5], '', null, v[7]);
  }), new _Pattern2.default(pre + '{-+:?}{#:+}e{-+:?}{#:+}' + decimal + '{#:+}' + post, function (c, v) {
    return make(v[1], v[2], '' + v[4] + v[5] + '.' + v[7], '', null, v[9]);
  }), new _Pattern2.default(pre + '{-+:?}' + group + 'e{-+:?}{#:+}' + post, function (c, v) {
    return make(v[1], v[2], v[4] + v[5], '', groupSep, v[7]);
  }), new _Pattern2.default(pre + '{-+:?}' + group + 'e{-+:?}{#:+}' + decimal + '{#:+}' + post, function (c, v) {
    return make(v[1], v[2], '' + v[4] + v[5] + '.' + v[7], '', groupSep, v[9]);
  })];
}

/**
 * Pattern cache so we don't use so much memory
 */
var dotPatterns = {
  '': getMainPatterns(false),
  int: getIntegerPatterns(false),
  float: getFloatPatterns(false)
};
var commaPatterns = {
  '': getMainPatterns(true),
  int: getIntegerPatterns(true),
  float: getFloatPatterns(true)
};

/**
 * Create the options based on constants
 * @param constants
 */
function makeOptions(constants) {
  var commaDecimal = constants.commaDecimal;


  return (0, _extends3.default)({}, constants, {
    patterns: commaDecimal ? commaPatterns : dotPatterns,
    make: make
  });
}

exports.default = makeOptions;

/***/ }),
/* 83 */
/* unknown exports provided */
/* all exports used */
/*!************************************************************!*\
  !*** ../~/babel-runtime/core-js/object/define-property.js ***!
  \************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/define-property */ 101), __esModule: true };

/***/ }),
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */
/* unknown exports provided */
/* all exports used */
/*!****************************!*\
  !*** ../src/MatchState.js ***!
  \****************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _PathNode = __webpack_require__(/*! ./matching/PathNode */ 59);

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
      this.logReasons = Boolean(context.reasons);
      this.reasons = [];
    }
  }

  (0, _createClass3.default)(MatchState, [{
    key: 'clone',
    value: function clone() {
      var cloned = new MatchState(this.matchTag, this.context);
      cloned.candidateNodes = this.candidateNodes.map(function (node) {
        return node.clone();
      });
      return cloned;
    }

    /**
     * Add candidate tokens from the path
     * @param root
     * @param previousValues
     * @param parent
     */

  }, {
    key: 'addCandidates',
    value: function addCandidates(root, previousValues, parent) {
      for (var i = 0; i < root.children.length; i++) {
        var _root$children$i = root.children[i],
            token = _root$children$i.token,
            path = _root$children$i.path;

        var node = new _PathNode2.default(token, path);
        node.previousValues = previousValues;
        node.parent = parent;
        this.candidateNodes.push(node);
      }
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
      // faster than splice
      // this.candidateNodes.splice(index, 1);
      var len = this.candidateNodes.length - 1;
      this.candidateNodes[index] = this.candidateNodes[len];
      this.candidateNodes.length--;
    }
  }]);
  return MatchState;
}();

MatchState.displayName = 'MatchState';
exports.default = MatchState;

/***/ }),
/* 88 */
/* unknown exports provided */
/* all exports used */
/*!**************************************!*\
  !*** ../src/matching/PatternPath.js ***!
  \**************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _keys = __webpack_require__(/*! babel-runtime/core-js/object/keys */ 26);

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

/***/ }),
/* 89 */
/* unknown exports provided */
/* all exports used */
/*!********************************!*\
  !*** ../src/matching/Token.js ***!
  \********************************/
/***/ (function(module, exports, __webpack_require__) {

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
      this.minCount = 1;
      this.maxCount = this.minCount;
      return;
    }

    var parts = (value || '').split(':');
    this.value = parts.length > 0 ? parts[0] : '';
    if (parts.length === 1) {
      this.minCount = 1;
      this.maxCount = this.minCount;
    } else if (parts.length > 1) {
      switch (parts[1]) {
        case '':
          this.minCount = 1;
          this.maxCount = this.minCount;
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
              this.minCount = parseInt(countParts[0], 10);
              this.maxCount = this.minCount;
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

/***/ }),
/* 90 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************!*\
  !*** ../src/modules/contexts/email.global.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(/*! babel-runtime/helpers/extends */ 34);

var _extends3 = _interopRequireDefault(_extends2);

exports.default = makeOptions;

var _Pattern = __webpack_require__(/*! ../../matching/Pattern */ 21);

var _Pattern2 = _interopRequireDefault(_Pattern);

var _EmailValue = __webpack_require__(/*! ../../values/EmailValue */ 92);

var _EmailValue2 = _interopRequireDefault(_EmailValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create an EmailValue object
 * @param user
 * @param host
 * @param displayName
 * @return {EmailValue}
 */
function make(user, host, displayName) {
  var email = !user && !host ? '' : user + '@' + host;
  return new _EmailValue2.default(email, displayName);
}

var mainPatterns = [
// email@host.de
new _Pattern2.default('{el:*}{mail:+}@{mailh:+}{el:*}', function (c, v) {
  return make(v[1], v[3], '');
}),
// "Name Last" <email@host.de>
new _Pattern2.default('{el:*}"{mailn:*}"{el:*}<{mail:+}@{mailh:+}>{el:*}', function (c, v) {
  return make(v[6], v[8], v[2]);
}),
// Name Last <email@host.de>
new _Pattern2.default('{el:*}{mailn:*}{el:+}<{mail:+}@{mailh:+}>{el:*}', function (c, v) {
  return make(v[4], v[6], v[1]);
}),
// "Name Last" <>
new _Pattern2.default('{el:*}"{mailn:*}"{el:*}<>{el:*}', function (c, v) {
  return make('\'', '', v[2]);
}),
// (comment)email@host.de
new _Pattern2.default('{el:*}({mailc:*}){el:*}{mail:+}@{mailh:+}{el:*}', function (c, v) {
  return make(v[5], v[7], v[2]);
}),
// email(comment)@host.de
new _Pattern2.default('{el:*}{mail:+}({mailc:*})@{mailh:+}{el:*}', function (c, v) {
  return make(v[1], v[5], v[3]);
}),
// email@host.de (comment)
new _Pattern2.default('{el:*}{mail:+}@{mailh:+}{el:*}({mailc:*}){el:*}', function (c, v) {
  return make(v[1], v[3], v[6]);
}),
// Name (email@host.de), special format that is used in outlook as display sometimes
new _Pattern2.default('{el:*}{mailn:+}{el:+}({mail:+}@{mailh:+}){el:*}', function (c, v) {
  return make(v[4], v[6], v[1]);
}),
// Name (email@host.de), special format that is used in outlook as display sometimes
new _Pattern2.default('{el:*}"{mailn:+}"@{mailh:+}{el:*}', function (c, v) {
  return make('"' + v[2] + '"', v[4], '');
})];

// patterns to find only an email address in any text
var findPatterns = [
// email@host.de
new _Pattern2.default('{.:*}{mail:+}@{mail:+}{.:*}', function (c, v) {
  return make(v[1], v[3], '');
})];

/**
 * Create the options based on constants
 * @param constants
 */
function makeOptions(constants) {
  return (0, _extends3.default)({}, constants, {
    patterns: {
      '': mainPatterns,
      findmail: findPatterns
    },
    make: make
  });
}

/***/ }),
/* 91 */
/* unknown exports provided */
/* all exports used */
/*!*************************************!*\
  !*** ../src/values/BooleanValue.js ***!
  \*************************************/
/***/ (function(module, exports, __webpack_require__) {

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
 * Boolean result wrapper
 */
var BooleanValue = function () {
  function BooleanValue(value) {
    (0, _classCallCheck3.default)(this, BooleanValue);

    this.bool = Boolean(value);
  }

  (0, _createClass3.default)(BooleanValue, [{
    key: "valueOf",
    value: function valueOf() {
      return this.bool;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.bool.toString();
    }
  }, {
    key: "equals",
    value: function equals(other) {
      if (!(other instanceof BooleanValue)) {
        return false;
      }
      return this.bool === other.bool;
    }
  }]);
  return BooleanValue;
}();

BooleanValue.displayName = "BooleanValue";
exports.default = BooleanValue;

/***/ }),
/* 92 */
/* unknown exports provided */
/* all exports used */
/*!***********************************!*\
  !*** ../src/values/EmailValue.js ***!
  \***********************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ 0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ 1);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var displayRegex = /"/g;

/**
 * Email result wrapper
 */

var EmailValue = function () {
  function EmailValue(email, displayName) {
    (0, _classCallCheck3.default)(this, EmailValue);

    this.email = email;
    this.displayName = displayName;
  }

  (0, _createClass3.default)(EmailValue, [{
    key: 'valueOf',
    value: function valueOf() {
      return this.email;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '"' + this.displayName.replace(displayRegex, '\\"') + '" <' + this.email + '>';
    }
  }, {
    key: 'equals',
    value: function equals(other) {
      if (!(other instanceof EmailValue)) {
        return false;
      }
      return this.displayName === other.displayName && this.email === other.email;
    }
  }]);
  return EmailValue;
}();

EmailValue.displayName = 'EmailValue';
exports.default = EmailValue;

/***/ }),
/* 93 */
/* unknown exports provided */
/* all exports used */
/*!************************************!*\
  !*** ../src/values/NumberValue.js ***!
  \************************************/
/***/ (function(module, exports, __webpack_require__) {

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
 * Number result wrapper
 */
var NumberValue = function () {
  function NumberValue(number, unit, decimals) {
    (0, _classCallCheck3.default)(this, NumberValue);

    this.number = number;
    this.unit = unit;
    this.decimals = decimals;
  }

  (0, _createClass3.default)(NumberValue, [{
    key: "valueOf",
    value: function valueOf() {
      return this.number;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "" + this.number + this.unit;
    }
  }, {
    key: "equals",
    value: function equals(other) {
      if (!(other instanceof NumberValue)) {
        return false;
      }
      return this.number === other.number && this.unit === other.unit && this.decimals === other.decimals;
    }
  }]);
  return NumberValue;
}();

NumberValue.displayName = "NumberValue";
exports.default = NumberValue;

/***/ }),
/* 94 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/babel-runtime/core-js/object/assign.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/assign */ 99), __esModule: true };

/***/ }),
/* 95 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/babel-runtime/core-js/object/create.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/create */ 100), __esModule: true };

/***/ }),
/* 96 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************************!*\
  !*** ../~/babel-runtime/core-js/object/set-prototype-of.js ***!
  \*************************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/set-prototype-of */ 104), __esModule: true };

/***/ }),
/* 97 */
/* unknown exports provided */
/* all exports used */
/*!********************************************!*\
  !*** ../~/babel-runtime/core-js/symbol.js ***!
  \********************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol */ 105), __esModule: true };

/***/ }),
/* 98 */
/* unknown exports provided */
/* all exports used */
/*!*****************************************************!*\
  !*** ../~/babel-runtime/core-js/symbol/iterator.js ***!
  \*****************************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol/iterator */ 106), __esModule: true };

/***/ }),
/* 99 */
/* unknown exports provided */
/* all exports used */
/*!************************************************!*\
  !*** ../~/core-js/library/fn/object/assign.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.assign */ 125);
module.exports = __webpack_require__(/*! ../../modules/_core */ 4).Object.assign;

/***/ }),
/* 100 */
/* unknown exports provided */
/* all exports used */
/*!************************************************!*\
  !*** ../~/core-js/library/fn/object/create.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.create */ 126);
var $Object = __webpack_require__(/*! ../../modules/_core */ 4).Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};

/***/ }),
/* 101 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************************!*\
  !*** ../~/core-js/library/fn/object/define-property.js ***!
  \*********************************************************/
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.define-property */ 127);
var $Object = __webpack_require__(/*! ../../modules/_core */ 4).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),
/* 102 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************************!*\
  !*** ../~/core-js/library/fn/object/get-prototype-of.js ***!
  \**********************************************************/
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.get-prototype-of */ 128);
module.exports = __webpack_require__(/*! ../../modules/_core */ 4).Object.getPrototypeOf;

/***/ }),
/* 103 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************!*\
  !*** ../~/core-js/library/fn/object/keys.js ***!
  \**********************************************/
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.keys */ 129);
module.exports = __webpack_require__(/*! ../../modules/_core */ 4).Object.keys;

/***/ }),
/* 104 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************************!*\
  !*** ../~/core-js/library/fn/object/set-prototype-of.js ***!
  \**********************************************************/
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.set-prototype-of */ 130);
module.exports = __webpack_require__(/*! ../../modules/_core */ 4).Object.setPrototypeOf;

/***/ }),
/* 105 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************!*\
  !*** ../~/core-js/library/fn/symbol/index.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.symbol */ 133);
__webpack_require__(/*! ../../modules/es6.object.to-string */ 131);
__webpack_require__(/*! ../../modules/es7.symbol.async-iterator */ 134);
__webpack_require__(/*! ../../modules/es7.symbol.observable */ 135);
module.exports = __webpack_require__(/*! ../../modules/_core */ 4).Symbol;

/***/ }),
/* 106 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/fn/symbol/iterator.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.string.iterator */ 132);
__webpack_require__(/*! ../../modules/web.dom.iterable */ 136);
module.exports = __webpack_require__(/*! ../../modules/_wks-ext */ 50).f('iterator');

/***/ }),
/* 107 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_a-function.js ***!
  \***************************************************/
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 108 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************************!*\
  !*** ../~/core-js/library/modules/_add-to-unscopables.js ***!
  \***********************************************************/
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 109 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************************!*\
  !*** ../~/core-js/library/modules/_array-includes.js ***!
  \*******************************************************/
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(/*! ./_to-iobject */ 11)
  , toLength  = __webpack_require__(/*! ./_to-length */ 123)
  , toIndex   = __webpack_require__(/*! ./_to-index */ 122);
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

/***/ }),
/* 110 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_enum-keys.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(/*! ./_object-keys */ 15)
  , gOPS    = __webpack_require__(/*! ./_object-gops */ 43)
  , pIE     = __webpack_require__(/*! ./_object-pie */ 28);
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

/***/ }),
/* 111 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************!*\
  !*** ../~/core-js/library/modules/_html.js ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./_global */ 6).document && document.documentElement;

/***/ }),
/* 112 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************!*\
  !*** ../~/core-js/library/modules/_is-array.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(/*! ./_cof */ 61);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 113 */
/* unknown exports provided */
/* all exports used */
/*!****************************************************!*\
  !*** ../~/core-js/library/modules/_iter-create.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(/*! ./_object-create */ 42)
  , descriptor     = __webpack_require__(/*! ./_property-desc */ 29)
  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 44)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(/*! ./_hide */ 14)(IteratorPrototype, __webpack_require__(/*! ./_wks */ 16)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 114 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_iter-step.js ***!
  \**************************************************/
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 115 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************!*\
  !*** ../~/core-js/library/modules/_keyof.js ***!
  \**********************************************/
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(/*! ./_object-keys */ 15)
  , toIObject = __webpack_require__(/*! ./_to-iobject */ 11);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 116 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************!*\
  !*** ../~/core-js/library/modules/_meta.js ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(/*! ./_uid */ 31)('meta')
  , isObject = __webpack_require__(/*! ./_is-object */ 24)
  , has      = __webpack_require__(/*! ./_has */ 9)
  , setDesc  = __webpack_require__(/*! ./_object-dp */ 10).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(/*! ./_fails */ 13)(function(){
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

/***/ }),
/* 117 */
/* unknown exports provided */
/* all exports used */
/*!******************************************************!*\
  !*** ../~/core-js/library/modules/_object-assign.js ***!
  \******************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = __webpack_require__(/*! ./_object-keys */ 15)
  , gOPS     = __webpack_require__(/*! ./_object-gops */ 43)
  , pIE      = __webpack_require__(/*! ./_object-pie */ 28)
  , toObject = __webpack_require__(/*! ./_to-object */ 30)
  , IObject  = __webpack_require__(/*! ./_iobject */ 65)
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(/*! ./_fails */ 13)(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

/***/ }),
/* 118 */
/* unknown exports provided */
/* all exports used */
/*!***************************************************!*\
  !*** ../~/core-js/library/modules/_object-dps.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(/*! ./_object-dp */ 10)
  , anObject = __webpack_require__(/*! ./_an-object */ 23)
  , getKeys  = __webpack_require__(/*! ./_object-keys */ 15);

module.exports = __webpack_require__(/*! ./_descriptors */ 7) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 119 */
/* unknown exports provided */
/* all exports used */
/*!********************************************************!*\
  !*** ../~/core-js/library/modules/_object-gopn-ext.js ***!
  \********************************************************/
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(/*! ./_to-iobject */ 11)
  , gOPN      = __webpack_require__(/*! ./_object-gopn */ 68).f
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


/***/ }),
/* 120 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_set-proto.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(/*! ./_is-object */ 24)
  , anObject = __webpack_require__(/*! ./_an-object */ 23);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(/*! ./_ctx */ 62)(Function.call, __webpack_require__(/*! ./_object-gopd */ 67).f(Object.prototype, '__proto__').set, 2);
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

/***/ }),
/* 121 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_string-at.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ 47)
  , defined   = __webpack_require__(/*! ./_defined */ 38);
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

/***/ }),
/* 122 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************!*\
  !*** ../~/core-js/library/modules/_to-index.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ 47)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 123 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/_to-length.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(/*! ./_to-integer */ 47)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 124 */
/* unknown exports provided */
/* all exports used */
/*!**********************************************************!*\
  !*** ../~/core-js/library/modules/es6.array.iterator.js ***!
  \**********************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(/*! ./_add-to-unscopables */ 108)
  , step             = __webpack_require__(/*! ./_iter-step */ 114)
  , Iterators        = __webpack_require__(/*! ./_iterators */ 40)
  , toIObject        = __webpack_require__(/*! ./_to-iobject */ 11);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(/*! ./_iter-define */ 66)(Array, 'Array', function(iterated, kind){
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

/***/ }),
/* 125 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************************!*\
  !*** ../~/core-js/library/modules/es6.object.assign.js ***!
  \*********************************************************/
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(/*! ./_export */ 8);

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(/*! ./_object-assign */ 117)});

/***/ }),
/* 126 */
/* unknown exports provided */
/* all exports used */
/*!*********************************************************!*\
  !*** ../~/core-js/library/modules/es6.object.create.js ***!
  \*********************************************************/
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ 8)
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(/*! ./_object-create */ 42)});

/***/ }),
/* 127 */
/* unknown exports provided */
/* all exports used */
/*!******************************************************************!*\
  !*** ../~/core-js/library/modules/es6.object.define-property.js ***!
  \******************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ 8);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(/*! ./_descriptors */ 7), 'Object', {defineProperty: __webpack_require__(/*! ./_object-dp */ 10).f});

/***/ }),
/* 128 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************************************!*\
  !*** ../~/core-js/library/modules/es6.object.get-prototype-of.js ***!
  \*******************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = __webpack_require__(/*! ./_to-object */ 30)
  , $getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ 69);

__webpack_require__(/*! ./_object-sap */ 71)('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 129 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************************!*\
  !*** ../~/core-js/library/modules/es6.object.keys.js ***!
  \*******************************************************/
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(/*! ./_to-object */ 30)
  , $keys    = __webpack_require__(/*! ./_object-keys */ 15);

__webpack_require__(/*! ./_object-sap */ 71)('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ }),
/* 130 */
/* unknown exports provided */
/* all exports used */
/*!*******************************************************************!*\
  !*** ../~/core-js/library/modules/es6.object.set-prototype-of.js ***!
  \*******************************************************************/
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(/*! ./_export */ 8);
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(/*! ./_set-proto */ 120).set});

/***/ }),
/* 131 */
/* unknown exports provided */
/* all exports used */
/*!************************************************************!*\
  !*** ../~/core-js/library/modules/es6.object.to-string.js ***!
  \************************************************************/
/***/ (function(module, exports) {



/***/ }),
/* 132 */
/* unknown exports provided */
/* all exports used */
/*!***********************************************************!*\
  !*** ../~/core-js/library/modules/es6.string.iterator.js ***!
  \***********************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(/*! ./_string-at */ 121)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(/*! ./_iter-define */ 66)(String, 'String', function(iterated){
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

/***/ }),
/* 133 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ../~/core-js/library/modules/es6.symbol.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(/*! ./_global */ 6)
  , has            = __webpack_require__(/*! ./_has */ 9)
  , DESCRIPTORS    = __webpack_require__(/*! ./_descriptors */ 7)
  , $export        = __webpack_require__(/*! ./_export */ 8)
  , redefine       = __webpack_require__(/*! ./_redefine */ 72)
  , META           = __webpack_require__(/*! ./_meta */ 116).KEY
  , $fails         = __webpack_require__(/*! ./_fails */ 13)
  , shared         = __webpack_require__(/*! ./_shared */ 46)
  , setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 44)
  , uid            = __webpack_require__(/*! ./_uid */ 31)
  , wks            = __webpack_require__(/*! ./_wks */ 16)
  , wksExt         = __webpack_require__(/*! ./_wks-ext */ 50)
  , wksDefine      = __webpack_require__(/*! ./_wks-define */ 49)
  , keyOf          = __webpack_require__(/*! ./_keyof */ 115)
  , enumKeys       = __webpack_require__(/*! ./_enum-keys */ 110)
  , isArray        = __webpack_require__(/*! ./_is-array */ 112)
  , anObject       = __webpack_require__(/*! ./_an-object */ 23)
  , toIObject      = __webpack_require__(/*! ./_to-iobject */ 11)
  , toPrimitive    = __webpack_require__(/*! ./_to-primitive */ 48)
  , createDesc     = __webpack_require__(/*! ./_property-desc */ 29)
  , _create        = __webpack_require__(/*! ./_object-create */ 42)
  , gOPNExt        = __webpack_require__(/*! ./_object-gopn-ext */ 119)
  , $GOPD          = __webpack_require__(/*! ./_object-gopd */ 67)
  , $DP            = __webpack_require__(/*! ./_object-dp */ 10)
  , $keys          = __webpack_require__(/*! ./_object-keys */ 15)
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
  __webpack_require__(/*! ./_object-gopn */ 68).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(/*! ./_object-pie */ 28).f  = $propertyIsEnumerable;
  __webpack_require__(/*! ./_object-gops */ 43).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(/*! ./_library */ 41)){
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
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(/*! ./_hide */ 14)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 134 */
/* unknown exports provided */
/* all exports used */
/*!*****************************************************************!*\
  !*** ../~/core-js/library/modules/es7.symbol.async-iterator.js ***!
  \*****************************************************************/
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./_wks-define */ 49)('asyncIterator');

/***/ }),
/* 135 */
/* unknown exports provided */
/* all exports used */
/*!*************************************************************!*\
  !*** ../~/core-js/library/modules/es7.symbol.observable.js ***!
  \*************************************************************/
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./_wks-define */ 49)('observable');

/***/ }),
/* 136 */
/* unknown exports provided */
/* all exports used */
/*!********************************************************!*\
  !*** ../~/core-js/library/modules/web.dom.iterable.js ***!
  \********************************************************/
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./es6.array.iterator */ 124);
var global        = __webpack_require__(/*! ./_global */ 6)
  , hide          = __webpack_require__(/*! ./_hide */ 14)
  , Iterators     = __webpack_require__(/*! ./_iterators */ 40)
  , TO_STRING_TAG = __webpack_require__(/*! ./_wks */ 16)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */,
/* 324 */,
/* 325 */
/* unknown exports provided */
/* all exports used */
/*!*****************************!*\
  !*** multi ../src/index.js ***!
  \*****************************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ../src/index.js */79);


/***/ })
/******/ ]);
});
//# sourceMappingURL=dataparser.js.map