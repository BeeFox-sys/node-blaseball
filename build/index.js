"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ready = exports.weatherCache = exports.modCache = exports.itemCache = exports.bloodCache = exports.coffeeCache = exports.gameCache = exports.playerNamesCache = exports.playerCache = exports.teamCache = exports.games = exports.sim = exports.events = void 0;
const caches_js_1 = require("./utils/caches.js");
Object.defineProperty(exports, "coffeeCache", { enumerable: true, get: function () { return caches_js_1.coffeeCache; } });
Object.defineProperty(exports, "playerCache", { enumerable: true, get: function () { return caches_js_1.playerCache; } });
Object.defineProperty(exports, "teamCache", { enumerable: true, get: function () { return caches_js_1.teamCache; } });
Object.defineProperty(exports, "gameCache", { enumerable: true, get: function () { return caches_js_1.gameCache; } });
Object.defineProperty(exports, "bloodCache", { enumerable: true, get: function () { return caches_js_1.bloodCache; } });
Object.defineProperty(exports, "itemCache", { enumerable: true, get: function () { return caches_js_1.itemCache; } });
Object.defineProperty(exports, "modCache", { enumerable: true, get: function () { return caches_js_1.modCache; } });
Object.defineProperty(exports, "weatherCache", { enumerable: true, get: function () { return caches_js_1.weatherCache; } });
Object.defineProperty(exports, "playerNamesCache", { enumerable: true, get: function () { return caches_js_1.playerNamesCache; } });
const events_js_1 = __importDefault(require("./endpoints/events.js"));
exports.events = events_js_1.default;
function sim() {
    return caches_js_1.StreamData.get("sim");
}
exports.sim = sim;
function games() {
    return caches_js_1.StreamData.get("games");
}
exports.games = games;
let ready = false;
exports.ready = ready;
(async () => {
    await Promise.all([
        caches_js_1.updatePlayerCache(),
        new Promise((resolve) => {
            events_js_1.default.once("open", resolve);
        }),
        new Promise((resolve) => {
            events_js_1.default.once("internalGamesUpdate", resolve);
        }),
        new Promise((resolve) => {
            events_js_1.default.once("internalTeamsUpdate", resolve);
        })
    ]);
    setInterval(caches_js_1.updatePlayerCache, 1000 * 60 * 5);
    exports.ready = ready = true;
    events_js_1.default.emit("ready");
})();
//# sourceMappingURL=index.js.map