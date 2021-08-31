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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/utils/backtest/worker/botWorkerSource.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../lambdas/_common/botRunner/botRunIndicators.ts":
/*!********************************************************!*\
  !*** ../lambdas/_common/botRunner/botRunIndicators.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BotRunIndicators = void 0;
var sma_1 = __webpack_require__(/*! ../indicators/sma */ "../lambdas/_common/indicators/sma.ts");
var BotRunIndicators = /** @class */ (function () {
    function BotRunIndicators(indicators) {
        if (indicators === void 0) { indicators = []; }
        var used = {};
        indicators.forEach(function (indicator) { return used[indicator] = true; });
        this.indicatorsUsed = used;
    }
    BotRunIndicators.prototype.sma = function (candleData, period, attr) {
        if (attr === void 0) { attr = 'close'; }
        this.indicatorsUsed["sma|" + period + "|" + attr] = true;
        return sma_1.sma(candleData, period, attr);
    };
    BotRunIndicators.prototype.smaArray = function (candleData, period) {
        // This indicator can't be displayed in the charts, don't store in the used ones
        return sma_1.smaArray(candleData, period);
    };
    return BotRunIndicators;
}());
exports.BotRunIndicators = BotRunIndicators;


/***/ }),

/***/ "../lambdas/_common/botRunner/botRunPatterns.ts":
/*!******************************************************!*\
  !*** ../lambdas/_common/botRunner/botRunPatterns.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BotRunPatterns = void 0;
var hammer_1 = __webpack_require__(/*! ../patterns/hammer */ "../lambdas/_common/patterns/hammer.ts");
var hangingMan_1 = __webpack_require__(/*! ../patterns/hangingMan */ "../lambdas/_common/patterns/hangingMan.ts");
var inverseHammer_1 = __webpack_require__(/*! ../patterns/inverseHammer */ "../lambdas/_common/patterns/inverseHammer.ts");
var shootingStar_1 = __webpack_require__(/*! ../patterns/shootingStar */ "../lambdas/_common/patterns/shootingStar.ts");
var BotRunPatterns = /** @class */ (function () {
    function BotRunPatterns(patterns) {
        if (patterns === void 0) { patterns = []; }
        var used = {};
        patterns.forEach(function (pattern) { return used[pattern] = true; });
        this.patternsUsed = used;
    }
    BotRunPatterns.prototype.hammer = function (candles, isConfirmed) {
        if (isConfirmed === void 0) { isConfirmed = false; }
        this.patternsUsed["hammer|" + isConfirmed] = true;
        return hammer_1.hammer(candles, isConfirmed);
    };
    BotRunPatterns.prototype.hangingMan = function (candles, isConfirmed) {
        if (isConfirmed === void 0) { isConfirmed = false; }
        this.patternsUsed["hangingMan|" + isConfirmed] = true;
        return hangingMan_1.hangingMan(candles, isConfirmed);
    };
    BotRunPatterns.prototype.inverseHammer = function (candles, isConfirmed) {
        if (isConfirmed === void 0) { isConfirmed = false; }
        this.patternsUsed["inverseHammer|" + isConfirmed] = true;
        return inverseHammer_1.inverseHammer(candles, isConfirmed);
    };
    BotRunPatterns.prototype.shootingStar = function (candles, isConfirmed) {
        if (isConfirmed === void 0) { isConfirmed = false; }
        this.patternsUsed["shootingStar|" + isConfirmed] = true;
        return shootingStar_1.shootingStar(candles, isConfirmed);
    };
    return BotRunPatterns;
}());
exports.BotRunPatterns = BotRunPatterns;


/***/ }),

/***/ "../lambdas/_common/botRunner/botRunPlotter.ts":
/*!*****************************************************!*\
  !*** ../lambdas/_common/botRunner/botRunPlotter.ts ***!
  \*****************************************************/
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
exports.BotRunPlotter = void 0;
var BotRunPlotter = /** @class */ (function () {
    function BotRunPlotter(_a) {
        var series = _a.series, points = _a.points, timestamp = _a.timestamp;
        this.series = series;
        this.points = points;
        this.timestamp = timestamp;
    }
    BotRunPlotter.prototype.plotPoint = function (collectionName, value, pair, chart) {
        return plot(this.points, collectionName, value, pair || 'all', chart || 'main');
    };
    BotRunPlotter.prototype.plotSeries = function (seriesName, value, pair, chart) {
        return plot(this.series, seriesName, value, pair || 'all', chart || 'secondary');
    };
    BotRunPlotter.prototype.getChartPoints = function (pair) {
        getPairPoints(this.points, pair);
    };
    BotRunPlotter.prototype.getChartSeries = function (pair) {
        getPairPoints(this.series, pair);
    };
    return BotRunPlotter;
}());
exports.BotRunPlotter = BotRunPlotter;
function plot(collection, name, value, pair, chart) {
    var pairSeries = collection[pair];
    if (!pairSeries) {
        pairSeries = collection[pair] = {};
    }
    var chartSeries = pairSeries[chart] || {};
    if (!chartSeries) {
        chartSeries = pairSeries[chart] || {};
    }
    var points = chartSeries[name] || [];
    if (!points) {
        points = chartSeries[name] = [];
    }
    points.push({ x: this.timestamp, y: value });
}
function getPairPoints(collection, pair) {
    var allPairsPoints = collection.all || {};
    var pairPoints = collection[pair] || {};
    var chartNames = new Set(Object.keys(allPairsPoints).concat(Object.keys(pairPoints)));
    var chartPoints = {};
    chartNames.forEach(function (name) {
        chartPoints[name] = __assign(__assign({}, allPairsPoints[name]), pairPoints[name]);
    });
    return chartPoints;
}


/***/ }),

/***/ "../lambdas/_common/botRunner/botRunUtils.ts":
/*!***************************************************!*\
  !*** ../lambdas/_common/botRunner/botRunUtils.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.botRunUtils = void 0;
function getMiddle() {
    return (this.high + this.low) / 2;
}
function getAmplitude() {
    return (this.high - this.low) / this.low;
}
function isBullish() {
    return this.open < this.close;
}
exports.botRunUtils = {
    getCandle: toCandle,
    getCandles: function (candleData) {
        return candleData.map(toCandle);
    },
    getPairAssets: function (pair) {
        var _a = pair.split('/'), base = _a[0], quoted = _a[1];
        return { base: base, quoted: quoted };
    },
    isCrossOver: function (targetSeries, baseSeries) {
        return isCrossOver(targetSeries, baseSeries);
    },
    isCrossUnder: function (targetSeries, baseSeries) {
        return isCrossOver(baseSeries, targetSeries);
    }
};
function isCrossOver(targetSeries, baseSeries) {
    var maxLength = Math.max(targetSeries.length, baseSeries.length);
    var minLength = Math.min(targetSeries.length, baseSeries.length);
    var diff = maxLength - minLength;
    var results = new Array(maxLength);
    var target = targetSeries.slice(-minLength);
    var base = baseSeries.slice(-minLength);
    for (var i = 0; i < diff + 1; i++) {
        results[i] = false;
    }
    for (var i = 1; i < target.length; i++) {
        results[diff + i] = target[i - 1] < base[i - 1] && target[i] > base[i];
    }
    return results;
}
function toCandle(candleData) {
    return {
        date: candleData[0],
        open: candleData[1],
        close: candleData[2],
        high: candleData[3],
        low: candleData[4],
        volume: candleData[5],
        getMiddle: getMiddle,
        getAmplitude: getAmplitude,
        isBullish: isBullish
    };
}


/***/ }),

/***/ "../lambdas/_common/indicators/sma.ts":
/*!********************************************!*\
  !*** ../lambdas/_common/indicators/sma.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.smaArray = exports.sma = void 0;
var attributeIndex = {
    open: 1,
    close: 2,
    hight: 3,
    low: 4,
    volume: 5
};
function sma(data, period, attr) {
    if (attr === void 0) { attr = 'close'; }
    var sum = 0;
    var length = data.length;
    var values = new Array(length);
    var attrIndex = attributeIndex[attr];
    for (var i = 0; i < period; i++) {
        sum += data[i][attrIndex];
        values[i] = 0;
    }
    values[period - 1] = sum / period;
    for (var i = period; i < length; i++) {
        sum += data[i][attrIndex] - data[i - period][attrIndex];
        values[i] = sum / period;
    }
    return values;
}
exports.sma = sma;
function smaArray(data, period) {
    var sum = 0;
    var length = data.length;
    var values = new Array(length);
    for (var i = 0; i < period; i++) {
        sum += data[i];
        values[i] = 0;
    }
    values[period - 1] = sum / period;
    for (var i = period; i < length; i++) {
        sum += data[i] - data[i - period];
        values[i] = sum / period;
    }
    return values;
}
exports.smaArray = smaArray;


/***/ }),

/***/ "../lambdas/_common/patterns/hammer.ts":
/*!*********************************************!*\
  !*** ../lambdas/_common/patterns/hammer.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.hammer = void 0;
var bullishHammer_1 = __webpack_require__(/*! ./utils/bullishHammer */ "../lambdas/_common/patterns/utils/bullishHammer.ts");
// Simple definition:
// * without confimation:
//		- the current candle is a hammer whose low is lower than the previous one
// * with confirmation
// 		- the previous candle was an unconfirmed hammer and the current is upwards
function hammer(candles, isConfirmed) {
    if (isConfirmed === void 0) { isConfirmed = false; }
    return bullishHammer_1.bullishHammer(candles, isConfirmed, 'up');
}
exports.hammer = hammer;


/***/ }),

/***/ "../lambdas/_common/patterns/hangingMan.ts":
/*!*************************************************!*\
  !*** ../lambdas/_common/patterns/hangingMan.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.hangingMan = void 0;
var bearishHammer_1 = __webpack_require__(/*! ./utils/bearishHammer */ "../lambdas/_common/patterns/utils/bearishHammer.ts");
function hangingMan(candles, isConfirmed) {
    if (isConfirmed === void 0) { isConfirmed = false; }
    return bearishHammer_1.bearishHammer(candles, isConfirmed, 'up');
}
exports.hangingMan = hangingMan;


/***/ }),

/***/ "../lambdas/_common/patterns/inverseHammer.ts":
/*!****************************************************!*\
  !*** ../lambdas/_common/patterns/inverseHammer.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.inverseHammer = void 0;
var bullishHammer_1 = __webpack_require__(/*! ./utils/bullishHammer */ "../lambdas/_common/patterns/utils/bullishHammer.ts");
// Simple definition:
// * without confimation:
//		- the current candle is a hammer whose low is lower than the previous one
// * with confirmation
// 		- the previous candle was an unconfirmed hammer and the current is upwards
function inverseHammer(candles, isConfirmed) {
    if (isConfirmed === void 0) { isConfirmed = false; }
    return bullishHammer_1.bullishHammer(candles, isConfirmed, 'down');
}
exports.inverseHammer = inverseHammer;


/***/ }),

/***/ "../lambdas/_common/patterns/shootingStar.ts":
/*!***************************************************!*\
  !*** ../lambdas/_common/patterns/shootingStar.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.shootingStar = void 0;
var bearishHammer_1 = __webpack_require__(/*! ./utils/bearishHammer */ "../lambdas/_common/patterns/utils/bearishHammer.ts");
function shootingStar(candles, isConfirmed) {
    if (isConfirmed === void 0) { isConfirmed = false; }
    return bearishHammer_1.bearishHammer(candles, isConfirmed, 'down');
}
exports.shootingStar = shootingStar;


/***/ }),

/***/ "../lambdas/_common/patterns/utils/bearishHammer.ts":
/*!**********************************************************!*\
  !*** ../lambdas/_common/patterns/utils/bearishHammer.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.bearishHammer = void 0;
var getHammerType_1 = __webpack_require__(/*! ./getHammerType */ "../lambdas/_common/patterns/utils/getHammerType.ts");
// This function is used by the `hangingMan` and `shootingStar` indicators
// Simple definition:
// * without confimation:
//		- the current candle is a hammer whose high is higher than the previous one
// * with confirmation
// 		- the previous candle was an unconfirmed hammer and the current is bearish
function bearishHammer(candles, isConfirmed, hammerType) {
    var length = candles.length;
    var result = new Array(length);
    result[0] = false;
    if (isConfirmed) {
        result[1] = false;
        for (var i = 2; i < length; i++) {
            result[i] = candles[i - 2][3] < candles[i - 1][3] && candles[i][2] > candles[i][1] && getHammerType_1.getHammerType(candles[i]) === hammerType;
        }
    }
    else {
        for (var i = 1; i < length; i++) {
            result[i] = candles[i - 1][3] < candles[i][3] && getHammerType_1.getHammerType(candles[i]) === hammerType;
        }
    }
    return result;
}
exports.bearishHammer = bearishHammer;


/***/ }),

/***/ "../lambdas/_common/patterns/utils/bullishHammer.ts":
/*!**********************************************************!*\
  !*** ../lambdas/_common/patterns/utils/bullishHammer.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.bullishHammer = void 0;
var getHammerType_1 = __webpack_require__(/*! ./getHammerType */ "../lambdas/_common/patterns/utils/getHammerType.ts");
// This function is used by the `hammer` and `inverseHammer` indicators
// Simple definition:
// * without confimation:
//		- the current candle is a hammer whose low is lower than the previous one
// * with confirmation
// 		- the previous candle was an unconfirmed hammer and the current is upwards
function bullishHammer(candles, isConfirmed, hammerType) {
    var length = candles.length;
    var result = new Array(length);
    result[0] = false;
    if (isConfirmed) {
        result[1] = false;
        for (var i = 2; i < length; i++) {
            result[i] = candles[i - 2][4] > candles[i - 1][4] && candles[i][2] > candles[i][1] && getHammerType_1.getHammerType(candles[i]) === hammerType;
        }
    }
    else {
        for (var i = 1; i < length; i++) {
            result[i] = candles[i - 1][4] > candles[i][4] && getHammerType_1.getHammerType(candles[i]) === hammerType;
        }
    }
    return result;
}
exports.bullishHammer = bullishHammer;


/***/ }),

/***/ "../lambdas/_common/patterns/utils/getHammerType.ts":
/*!**********************************************************!*\
  !*** ../lambdas/_common/patterns/utils/getHammerType.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getHammerType = void 0;
// hammer rule, a candle with:
// - one stick that is at least the double than the other
// - other stick that is at most the half of the body
function getHammerType(candle) {
    // open < close
    var _a = candle[1] < candle[2] ?
        [candle[2], candle[1]] :
        [candle[1], candle[2]], bodyUp = _a[0], bodyDown = _a[1];
    var bodyHeight = bodyUp - bodyDown;
    // Exit earlier if it's obvious
    if (bodyHeight * 3 > candle[3] - candle[4]) {
        return 'none';
    }
    var upperStick = candle[3] - bodyUp;
    var lowerStick = bodyDown - candle[4];
    // The upper stick is the double of the body -> hammer down
    if (upperStick > 2 * bodyHeight && lowerStick < 0.5 * bodyHeight) {
        return 'down';
    }
    // the lower stick is the double of the body -> hammer up
    if (upperStick < .5 * bodyHeight && lowerStick > 0.5 * bodyHeight) {
        return 'up';
    }
    return 'none';
}
exports.getHammerType = getHammerType;


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

/***/ "../lambdas/_common/utils/pairs.ts":
/*!*****************************************!*\
  !*** ../lambdas/_common/utils/pairs.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getBase(pair) {
    return pair.split('/')[0];
}
function getQuoted(pair) {
    return pair.split('/')[1];
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
var pairs_1 = __webpack_require__(/*! ../_common/utils/pairs */ "../lambdas/_common/utils/pairs.ts");
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
        var order = __assign(__assign({ price: null }, orderInput), { id: uuid(), status: 'pending', foreignId: null, errorReason: null, executedPrice: null, createdAt: Date.now(), placedAt: null, closedAt: null, marketPrice: this.prices[orderInput.pair] });
        this.ordersToPlace.push(order);
        this.orders = __assign(__assign({}, this.orders), (_a = {}, _a[order.id] = order, _a));
        return __assign({}, order);
    };
    Trader.prototype.cancelOrder = function (orderId) {
        this.ordersToCancel.push(orderId);
    };
    Trader.prototype.getPortfolioValue = function () {
        var _this = this;
        var quotedAsset = pairs_1.default.getQuoted(Object.keys(this.prices)[0]);
        var quotedBalance = this.getBalance(quotedAsset);
        var total = quotedBalance.total;
        Object.keys(this.prices).forEach(function (pair) {
            var asset = pairs_1.default.getBase(pair);
            var balance = _this.getBalance(asset);
            if (asset === quotedAsset) {
                total += balance.total;
            }
            else {
                total += balance.total * _this.prices[pair];
            }
        });
        return total;
    };
    Trader.prototype.getPrice = function (pair) {
        return this.prices[pair];
    };
    return Trader;
}());
exports.default = Trader;
function getPrices(pairCandles) {
    var prices = {};
    Object.keys(pairCandles).forEach(function (pair) {
        prices[pair] = candles_1.default.getClose(candles_1.default.getLast(pairCandles[pair]));
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

/***/ "./src/utils/backtest/worker/botWorkerSource.ts":
/*!******************************************************!*\
  !*** ./src/utils/backtest/worker/botWorkerSource.ts ***!
  \******************************************************/
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
var botRunUtils_1 = __webpack_require__(/*! ../../../../../lambdas/_common/botRunner/botRunUtils */ "../lambdas/_common/botRunner/botRunUtils.ts");
var botRunIndicators_1 = __webpack_require__(/*! ../../../../../lambdas/_common/botRunner/botRunIndicators */ "../lambdas/_common/botRunner/botRunIndicators.ts");
var botRunPatterns_1 = __webpack_require__(/*! ../../../../../lambdas/_common/botRunner/botRunPatterns */ "../lambdas/_common/botRunner/botRunPatterns.ts");
var botRunPlotter_1 = __webpack_require__(/*! ../../../../../lambdas/_common/botRunner/botRunPlotter */ "../lambdas/_common/botRunner/botRunPlotter.ts");
// WARNING: This line will be replaced by the bot source code. DO NOT UPDATE
console.log("#BOT");
self.onmessage = function (msg) {
    var input = msg.data.input;
    var originalConsole = console;
    // @ts-ignore
    console = Consoler_1.default;
    var state = __assign({}, input.state);
    if (state.newState === 'stateNew') {
        state = {};
        // @ts-ignore
        if (typeof initializeState === 'function') {
            // @ts-ignore
            initializeState(input.config, state);
        }
    }
    var trader = new Trader_1.default(input.portfolio, input.orders, input.candleData);
    var _a = input.plotterData, points = _a.points, series = _a.series, ind = _a.indicators, patt = _a.candlestickPatterns;
    var indicators = new botRunIndicators_1.BotRunIndicators(ind);
    var candlestickPatterns = new botRunPatterns_1.BotRunPatterns(patt);
    var plotterInstance = new botRunPlotter_1.BotRunPlotter({
        points: points, series: series,
        timestamp: Date.now()
    });
    var plotter = {
        plotPoint: function (name, value, pair, chart) {
            return plotterInstance.plotPoint(name, value, pair, chart);
        },
        plotSeries: function (name, value, pair, chart) {
            return plotterInstance.plotSeries(name, value, pair, chart);
        }
    };
    // @ts-ignore
    onData({
        candleData: input.candleData,
        config: input.config,
        trader: trader,
        state: state,
        utils: botRunUtils_1.botRunUtils,
        indicators: indicators,
        candlestickPatterns: candlestickPatterns,
        plotter: plotter
    });
    // @ts-ignore
    self.postMessage({
        ordersToCancel: trader.ordersToCancel,
        ordersToPlace: trader.ordersToPlace,
        state: state,
        logs: Consoler_1.default.getEntries(),
        plotterData: {
            series: plotterInstance.series,
            points: plotterInstance.points,
            indicators: Object.keys(indicators.indicatorsUsed),
            candlestickPatterns: Object.keys(candlestickPatterns.patternsUsed)
        }
    });
    Consoler_1.default.clear();
    console = originalConsole;
};
function mock() {
    // This is needed just to not have rogue files
}
exports.default = mock;


/***/ })

/******/ });