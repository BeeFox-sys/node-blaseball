"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventsource_1 = __importDefault(require("eventsource"));
var source = new eventsource_1.default("https://www.blaseball.com/events/streamData", { withCredentials: true, headers: { "User-Agent": "npm-blaseball" } });
var node_cache_1 = __importDefault(require("node-cache"));
var deduplication = new node_cache_1.default({ stdTTL: 60, checkperiod: 60 * 5 });
var events_1 = require("events");
var updates = new events_1.EventEmitter();
source.onopen = function (event) {
    updates.emit("open", event);
};
source.onerror = function (error) {
    if (error.message == undefined)
        return;
    console.error(error);
};
source.onmessage = function (message) {
    var data = JSON.parse(message.data).value;
    if (data && (JSON.stringify(deduplication.get("raw")) != JSON.stringify(data))) {
        updates.emit("raw", data);
        deduplication.set("raw", data);
    }
    //raw data events
    if (data.games && (JSON.stringify(deduplication.get("games")) != JSON.stringify(data.games))) {
        if (deduplication.has("games"))
            updates.emit("rawGames", data.games);
        deduplication.set("games", data.games);
    }
    if (data.leagues && (JSON.stringify(deduplication.get("leagues")) != JSON.stringify(data.leagues))) {
        if (deduplication.has("leagues"))
            updates.emit("rawLeagues", data.leagues);
        deduplication.set("leagues", data.leagues);
    }
    if (data.temporal && (JSON.stringify(deduplication.get("temporal")) != JSON.stringify(data.temporal))) {
        if (deduplication.has("temportal"))
            updates.emit("rawTemporal", data.temporal);
        deduplication.set("temporal", data.temporal);
    }
    if (data.fights && (JSON.stringify(deduplication.get("fights")) != JSON.stringify(data.fights))) {
        if (deduplication.has("fights"))
            updates.emit("rawFights", data.fights);
        deduplication.set("fights", data.fights);
    }
};
updates.on("rawGames", function (data) {
    var _a;
    data.tomorrowSchedule.forEach(function (game) {
        deduplication.set(game.id, game);
    });
    data.schedule.forEach(function (game) {
        var _a, _b;
        if (deduplication.get(game.id) == game)
            return;
        updates.emit("gameUpdate", game, deduplication.get(game.id));
        if (game.gameStart && ((_a = deduplication.get(game.id)) === null || _a === void 0 ? void 0 : _a.gameStart) === false)
            updates.emit("gameStart", game);
        if (game.gameComplete && ((_b = deduplication.get(game.id)) === null || _b === void 0 ? void 0 : _b.gameComplete) === false)
            updates.emit("gameComplete", game);
        deduplication.set(game.id, game);
    });
    if (data.schedule.every(function (g) { return g.gameComplete; }) && ((_a = deduplication.get("games")) === null || _a === void 0 ? void 0 : _a.schedule.every(function (g) { return g.gameComplete; })) === false)
        updates.emit("gamesFinished", data.schedule, data.tomorrowSchedule);
});
exports.default = updates;
//# sourceMappingURL=events.js.map