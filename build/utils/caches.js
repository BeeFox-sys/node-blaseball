"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamData = void 0;
var node_cache_1 = __importDefault(require("node-cache"));
var events_js_1 = __importDefault(require("../endpoints/events.js"));
var StreamData = new node_cache_1.default();
exports.StreamData = StreamData;
events_js_1.default.on("raw", function (data) {
    if (!data.games)
        return;
    StreamData.set("sim", data.games.sim);
});
