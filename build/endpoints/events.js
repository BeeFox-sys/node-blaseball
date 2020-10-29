"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventsource_1 = __importDefault(require("eventsource"));
const source = new eventsource_1.default("http://localhost:8000/v1/replay?from=2020-10-25T19:00:00.000Z", { withCredentials: true, headers: { "User-Agent": "node-blaseball" } });
const node_cache_1 = __importDefault(require("node-cache"));
const deduplication = new node_cache_1.default();
const events_1 = require("events");
const updates = new events_1.EventEmitter();
const index_1 = require("../index");
source.onopen = () => {
    updates.emit("open");
};
source.onerror = (error) => {
    if (error.message == undefined)
        return;
    console.error(error);
};
source.onmessage = (message) => {
    if (message.data.startsWith("<"))
        return;
    let data;
    try {
        data = JSON.parse(message.data).value;
    }
    catch (e) {
        return console.error("Invalid Json Recieved:", message.data);
    }
    if (data && (JSON.stringify(deduplication.get("raw")) != JSON.stringify(data))) {
        if (index_1.ready)
            updates.emit("raw", data);
        updates.emit("internal", data);
        deduplication.set("raw", data);
    }
    //raw data events
    if (data.games && (JSON.stringify(deduplication.get("games")) != JSON.stringify(data.games))) {
        if (deduplication.has("games") && index_1.ready)
            updates.emit("rawGames", data.games);
        deduplication.set("games", data.games);
    }
    if (data.leagues && (JSON.stringify(deduplication.get("leagues")) != JSON.stringify(data.leagues))) {
        if (deduplication.has("leagues") && index_1.ready)
            updates.emit("rawLeagues", data.leagues);
        deduplication.set("leagues", data.leagues);
    }
    if (data.temporal && (JSON.stringify(deduplication.get("temporal")) != JSON.stringify(data.temporal))) {
        if (deduplication.has("temporal") && index_1.ready)
            updates.emit("rawTemporal", data.temporal);
        deduplication.set("temporal", data.temporal);
    }
    if (data.fights && (JSON.stringify(deduplication.get("fights")) != JSON.stringify(data.fights))) {
        if (deduplication.has("fights") && index_1.ready)
            updates.emit("rawFights", data.fights);
        deduplication.set("fights", data.fights);
    }
};
updates.on("rawGames", (data) => {
    var _a;
    data.tomorrowSchedule.forEach((game) => {
        deduplication.set(game.id, game);
    });
    data.schedule.forEach((game) => {
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
    if (data.schedule.every((g) => g.gameComplete) && ((_a = deduplication.get("games")) === null || _a === void 0 ? void 0 : _a.schedule.every((g) => g.gameComplete)) === false)
        updates.emit("gamesFinished", data.schedule, data.tomorrowSchedule);
});
exports.default = updates;
//# sourceMappingURL=events.js.map