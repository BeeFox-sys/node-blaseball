"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ready = exports.playerCache = exports.teamCache = exports.sim = exports.events = void 0;
const caches_js_1 = require("./utils/caches.js");
Object.defineProperty(exports, "playerCache", { enumerable: true, get: function () { return caches_js_1.playerCache; } });
Object.defineProperty(exports, "teamCache", { enumerable: true, get: function () { return caches_js_1.teamCache; } });
const events_js_1 = __importDefault(require("./endpoints/events.js"));
exports.events = events_js_1.default;
function sim() {
    return caches_js_1.StreamData.get("sim");
}
exports.sim = sim;
let ready = false;
exports.ready = ready;
(async () => {
    await Promise.all([
        caches_js_1.updatePlayerCache(),
        new Promise((resolve) => {
            events_js_1.default.once("open", resolve);
        })
    ]);
    setTimeout(caches_js_1.updatePlayerCache, 1000 * 60 * 5);
    exports.ready = ready = true;
    events_js_1.default.emit("ready");
})();
//# sourceMappingURL=index.js.map