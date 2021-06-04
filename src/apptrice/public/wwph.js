/******/ (function(modules) { // webpackBootstrap
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/screens/botEditor/botWorker/botWorkerSource.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../lambdas/_common/utils/botUtils.ts":
/*!********************************************!*\
  !*** ../lambdas/_common/utils/botUtils.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var candles_1 = __webpack_require__(/*! ./candles */ "../lambdas/_common/utils/candles.ts");
var symbols_1 = __webpack_require__(/*! ./symbols */ "../lambdas/_common/utils/symbols.ts");
exports.default = { candles: candles_1.default, symbols: symbols_1.default };


/***/ }),

/***/ "../lambdas/_common/utils/candles.ts":
/*!*******************************************!*\
  !*** ../lambdas/_common/utils/candles.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getLast(candles) {
    return candles[candles.length - 1];
}
function getTime(candle) {
    return candle[0];
}
function getOpen(candle) {
    return candle[1];
}
function getClose(candle) {
    return candle[2];
}
function getHigh(candle) {
    return candle[3];
}
function getLow(candle) {
    return candle[4];
}
function getVolume(candle) {
    return candle[5];
}
function getMiddle(candle) {
    return (getHigh(candle) + getLow(candle)) / 2;
}
function getAmplitude(candle) {
    return (getHigh(candle) - getLow(candle)) / getLow(candle);
}
exports.default = {
    getLast: getLast, getTime: getTime, getOpen: getOpen, getClose: getClose,
    getHigh: getHigh, getLow: getLow, getVolume: getVolume, getMiddle: getMiddle,
    getAmplitude: getAmplitude
};


/***/ }),

/***/ "../lambdas/_common/utils/symbols.ts":
/*!*******************************************!*\
  !*** ../lambdas/_common/utils/symbols.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getBase(symbol) {
    return symbol.split('/')[0];
}
function getQuoted(symbol) {
    return symbol.split('/')[1];
}
exports.default = { getBase: getBase, getQuoted: getQuoted };


/***/ }),

/***/ "../lambdas/executor/Consoler.ts":
/*!***************************************!*\
  !*** ../lambdas/executor/Consoler.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var entries = [];
var ori = console;
var cons = {
    log: function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        addEntry('log', messages);
        ori.log.apply(ori, messages);
    },
    warn: function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        addEntry('warn', messages);
        ori.warn.apply(ori, messages);
    },
    error: function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        addEntry('error', messages);
        ori.error.apply(ori, messages);
    },
    getEntries: function () {
        return __spreadArray([], entries);
    },
    clear: function () {
        entries = [];
    }
};
exports.default = cons;
function addEntry(type, messages) {
    var date = Date.now();
    entries.push({
        id: Math.round(Math.random() * 1000) + date,
        date: date,
        type: 'log',
        message: messages.map(function (m) { return stringify(m); }).join(' ')
    });
}
function stringify(m) {
    return typeof m === 'string' ?
        m :
        JSON.stringify(m, null, 2);
}


/***/ }),

/***/ "../lambdas/executor/Trader.ts":
/*!*************************************!*\
  !*** ../lambdas/executor/Trader.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var candles_1 = __webpack_require__(/*! ../_common/utils/candles */ "../lambdas/_common/utils/candles.ts");
var symbols_1 = __webpack_require__(/*! ../_common/utils/symbols */ "../lambdas/_common/utils/symbols.ts");
// @ts-ignore (needed for compile the bot worker)
var uuid = __webpack_require__(/*! uuid/dist/v4 */ "../lambdas/node_modules/uuid/dist/v4.js").default;
var Trader = /** @class */ (function () {
    function Trader(portfolio, orders, candles) {
        this.portfolio = portfolio;
        this.orders = orders.items;
        this.ordersToPlace = [];
        this.ordersToCancel = [];
        this.openOrderIds = orders.openOrderIds;
        this.prices = getPrices(candles);
    }
    Trader.prototype.getPortfolio = function () {
        return this.portfolio;
    };
    Trader.prototype.getBalance = function (asset) {
        var balance = this.portfolio[asset];
        return balance ? __assign({}, balance) :
            { asset: asset, total: 0, free: 0 };
    };
    Trader.prototype.getOrder = function (id) {
        return this.orders[id];
    };
    Trader.prototype.getOpenOrders = function () {
        var _this = this;
        return this.openOrderIds
            .map(function (id) { return (__assign({}, _this.orders[id])); })
            .concat(this.ordersToPlace.map(function (order) { return (__assign({}, order)); }));
    };
    Trader.prototype.placeOrder = function (orderInput) {
        var _a;
        var order = __assign(__assign({ price: null }, orderInput), { id: uuid(), status: 'pending', foreignId: null, errorReason: null, executedPrice: null, createdAt: Date.now(), placedAt: null, closedAt: null, marketPrice: this.prices[orderInput.symbol] });
        this.ordersToPlace.push(order);
        this.orders = __assign(__assign({}, this.orders), (_a = {}, _a[order.id] = order, _a));
        return __assign({}, order);
    };
    Trader.prototype.cancelOrder = function (orderId) {
        this.ordersToCancel.push(orderId);
    };
    Trader.prototype.getPortfolioValue = function () {
        var _this = this;
        var quotedAsset = symbols_1.default.getQuoted(Object.keys(this.prices)[0]);
        var quotedBalance = this.getBalance(quotedAsset);
        var total = quotedBalance.total;
        Object.keys(this.prices).forEach(function (symbol) {
            var asset = symbols_1.default.getBase(symbol);
            var balance = _this.getBalance(asset);
            if (asset === quotedAsset) {
                total += balance.total;
            }
            else {
                total += balance.total * _this.prices[symbol];
            }
        });
        return total;
    };
    Trader.prototype.getPrice = function (symbol) {
        return this.prices[symbol];
    };
    return Trader;
}());
exports.default = Trader;
function getPrices(symbolCandles) {
    var prices = {};
    Object.keys(symbolCandles).forEach(function (symbol) {
        prices[symbol] = candles_1.default.getClose(candles_1.default.getLast(symbolCandles[symbol]));
    });
    return prices;
}


/***/ }),

/***/ "../lambdas/node_modules/uuid/dist/regex.js":
/*!**************************************************!*\
  !*** ../lambdas/node_modules/uuid/dist/regex.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports.default = _default;

/***/ }),

/***/ "../lambdas/node_modules/uuid/dist/rng-browser.js":
/*!********************************************************!*\
  !*** ../lambdas/node_modules/uuid/dist/rng-browser.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rng;
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);

function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "../lambdas/node_modules/uuid/dist/stringify.js":
/*!******************************************************!*\
  !*** ../lambdas/node_modules/uuid/dist/stringify.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(__webpack_require__(/*! ./validate.js */ "../lambdas/node_modules/uuid/dist/validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports.default = _default;

/***/ }),

/***/ "../lambdas/node_modules/uuid/dist/v4.js":
/*!***********************************************!*\
  !*** ../lambdas/node_modules/uuid/dist/v4.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(__webpack_require__(/*! ./rng.js */ "../lambdas/node_modules/uuid/dist/rng-browser.js"));

var _stringify = _interopRequireDefault(__webpack_require__(/*! ./stringify.js */ "../lambdas/node_modules/uuid/dist/stringify.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports.default = _default;

/***/ }),

/***/ "../lambdas/node_modules/uuid/dist/validate.js":
/*!*****************************************************!*\
  !*** ../lambdas/node_modules/uuid/dist/validate.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regex = _interopRequireDefault(__webpack_require__(/*! ./regex.js */ "../lambdas/node_modules/uuid/dist/regex.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports.default = _default;

/***/ }),

/***/ "./src/screens/botEditor/botWorker/botWorkerSource.ts":
/*!************************************************************!*\
  !*** ./src/screens/botEditor/botWorker/botWorkerSource.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-restricted-globals */
var Trader_1 = __webpack_require__(/*! ../../../../../lambdas/executor/Trader */ "../lambdas/executor/Trader.ts");
var Consoler_1 = __webpack_require__(/*! ../../../../../lambdas/executor/Consoler */ "../lambdas/executor/Consoler.ts");
var botUtils_1 = __webpack_require__(/*! ../../../../../lambdas/_common/utils/botUtils */ "../lambdas/_common/utils/botUtils.ts");
// WARNING: This line will be replaced by the bot source code. DO NOT UPDATE
console.log("#BOT");
self.onmessage = function (msg) {
    var _a = msg.data, action = _a.action, input = _a.input;
    if (action === 'init') {
        var state = {};
        var originalConsole = console;
        // @ts-ignore
        console = Consoler_1.default;
        // @ts-ignore
        initializeState(input, state);
        // @ts-ignore
        self.postMessage({
            state: state || {},
            logs: Consoler_1.default.getEntries()
        });
        Consoler_1.default.clear();
        console = originalConsole;
    }
    else {
        var trader = new Trader_1.default(input.portfolio, input.orders, input.candles);
        trader.openOrderIds = input.openOrders;
        var originalConsole = console;
        // @ts-ignore
        console = Consoler_1.default;
        var state = __assign({}, input.state);
        // @ts-ignore
        onData({
            candles: input.candles,
            config: input.config,
            trader: trader,
            state: state,
            utils: botUtils_1.default
        });
        // @ts-ignore
        self.postMessage({
            ordersToCancel: trader.ordersToCancel,
            ordersToPlace: trader.ordersToPlace,
            state: state,
            logs: Consoler_1.default.getEntries()
        });
        Consoler_1.default.clear();
        console = originalConsole;
    }
};
function mock() {
    // This is needed just to not have rogue files
}
exports.default = mock;


/***/ })

/******/ });