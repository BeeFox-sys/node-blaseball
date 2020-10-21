"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sim = exports.events = void 0;
var caches_js_1 = require("./utils/caches.js");
var events_js_1 = __importDefault(require("./endpoints/events.js"));
exports.events = events_js_1.default;
function sim() {
    return caches_js_1.StreamData.get("sim");
}
exports.sim = sim;
