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
define("lambdas/lambda.types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TradeBot = void 0;
    var TradeBot = /** @class */ (function () {
        function TradeBot() {
        }
        TradeBot.prototype.extraConfiguration = function () {
            return {};
        };
        return TradeBot;
    }());
    exports.TradeBot = TradeBot;
});
define("lambdas/executor/Trader", ["require", "exports", "uuid"], function (require, exports, uuid_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Trader = /** @class */ (function () {
        function Trader(portfolio, orders) {
            this.portfolio = portfolio;
            this.orders = orders;
            this.ordersToPlace = [];
            this.ordersToCancel = [];
        }
        Trader.prototype.getPortfolio = function () {
            return this.portfolio;
        };
        Trader.prototype.getOrder = function (id) {
            return this.orders[id];
        };
        Trader.prototype.placeOrder = function (orderInput) {
            var order = __assign(__assign({ price: null }, orderInput), { id: uuid_1.v4(), status: 'pending', foreignId: null, errorReason: null, executedPrice: null, createdAt: Date.now(), placedAt: null, closedAt: null });
            this.ordersToPlace.push(order);
            return __assign({}, order);
        };
        Trader.prototype.cancelOrder = function (orderId) {
            this.ordersToCancel.push(orderId);
        };
        return Trader;
    }());
    exports.default = Trader;
});
define("lambdas/_common/utils/candles", ["require", "exports"], function (require, exports) {
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
});
define("lambdas/_common/utils/symbols", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getBase(symbol) {
        return symbol.split('/')[0];
    }
    function getQuoted(symbol) {
        return symbol.split('/')[1];
    }
    exports.default = { getBase: getBase, getQuoted: getQuoted };
});
define("lambdas/_common/utils/botUtils", ["require", "exports", "lambdas/_common/utils/candles", "lambdas/_common/utils/symbols"], function (require, exports, candles_1, symbols_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = { candles: candles_1.default, symbols: symbols_1.default };
});
define("apptrice/src/screens/botEditor/botWorker/botWorkerSource", ["require", "exports", "lambdas/executor/Trader", "lambdas/_common/utils/botUtils"], function (require, exports, Trader_1, botUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Bot = '#BOT#';
    var bot = new Bot();
    self.onmessage = function (msg) {
        var settings = msg.data;
        var trader = new Trader_1.default(settings.portfolio, settings.orders);
        var state = __assign({}, settings.state);
        bot.onData({
            candles: settings.candles,
            config: settings.config,
            trader: trader,
            state: state,
            utils: botUtils_1.default
        });
        // @ts-ignore
        self.postMessage({
            ordersToCancel: trader.ordersToCancel,
            ordersToPlace: trader.ordersToPlace,
            state: state
        });
    };
    function mock() {
        // This is needed just to not have rogue files
    }
    exports.default = mock;
});
