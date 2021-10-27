"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.weatherCache = exports.modCache = exports.itemCache = exports.bloodCache = exports.coffeeCache = exports.gameCache = exports.playerTeamCache = exports.playerNamesCache = exports.updatePlayerCache = exports.teamCache = exports.playerCache = exports.StreamData = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const events_js_1 = __importDefault(require("../endpoints/events.js"));
const players_js_1 = require("../endpoints/players.js");
const node_fetch_1 = __importDefault(require("node-fetch"));
const teams_js_1 = require("../endpoints/teams.js");
const StreamData = new node_cache_1.default();
exports.StreamData = StreamData;
class TeamCache extends node_cache_1.default {
    async fetch(id, cache = true) {
        if (teamCache.has(id) && cache)
            return teamCache.get(id);
        if (!/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.test(id))
            return undefined;
        const teams = await teams_js_1.getTeams([id]);
        const team = teams[0];
        console.log(team.id);
        if (team != null && team != undefined)
            teamCache.set(team.id, team);
        return team;
    }
}
class PlayerCache extends node_cache_1.default {
    async fetch(id, cache = true) {
        if (playerCache.has(id) && cache)
            return playerCache.get(id);
        if (!/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.test(id))
            return undefined;
        const players = await players_js_1.getPlayers([id]);
        const player = players[0];
        if (player != null)
            playerCache.set(player.id, player);
        return player;
    }
    async byName(id) {
        const player = playerNamesCache.get(id);
        if (player == null)
            return null;
        return this.get(player);
    }
}
const games_1 = require("../endpoints/games");
class GameCache extends node_cache_1.default {
    constructor() {
        super(...arguments);
        this.dayCache = new node_cache_1.default();
    }
    async fetch(id, cache = true) {
        if (this.has(id) && cache)
            return this.get(id);
        if (!/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.test(id))
            return undefined;
        const game = await games_1.getGameByID(id);
        if (game != null)
            this.set(game.id, game);
        return game;
    }
    async fetchByDay(day, season, cache = true) {
        if (this.dayCache.has(`${season},${day}`) && cache)
            return this.dayCache.get(`${season},${day}`);
        const games = await games_1.getGamesByDay(season, day);
        if (games != null) {
            this.dayCache.set(`${season},${day}`, games);
            for (const game of games) {
                this.set(game.id, game);
            }
        }
        return games;
    }
}
class CoffeeCache extends node_cache_1.default {
    constructor() {
        super();
        node_fetch_1.default("https://api.blaseball.com/database/coffee?ids=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20").then(b => b.json()).then((coffee) => {
            this.mset(coffee.map((v, i) => { return { key: i, val: v }; }));
        });
    }
    async fetch(id, cache = true) {
        if (this.has(id) && cache)
            return this.get(id);
        const coffee = await node_fetch_1.default("https://api.blaseball.com/database/coffee?ids=" + id).then(b => b.json()).then(c => c[0]);
        this.set(id, coffee);
        return coffee;
    }
}
class BloodCache extends node_cache_1.default {
    constructor() {
        super();
        node_fetch_1.default("https://api.blaseball.com/database/blood?ids=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20").then(b => b.json()).then((blood) => {
            this.mset(blood.map((v, i) => { return { key: i, val: v }; }));
        });
    }
    async fetch(id, cache = true) {
        if (this.has(id) && cache)
            return this.get(id);
        const blood = await node_fetch_1.default("https://api.blaseball.com/database/blood?ids=" + id).then(b => b.json()).then(c => c[0]);
        this.set(id, blood);
        return blood;
    }
}
class ModsCache extends node_cache_1.default {
    async fetch(id, cache = true) {
        if (this.has(id) && cache)
            return this.get(id);
        const mod = await node_fetch_1.default("https://api.blaseball.com/database/mods?ids=" + id).then(b => b.json()).then(c => c[0]);
        this.set(id, mod);
        return mod;
    }
}
class ItemsCache extends node_cache_1.default {
    async fetch(id, cache = true) {
        if (this.has(id) && cache)
            return this.get(id);
        const mod = await node_fetch_1.default("https://api.blaseball.com/database/items?ids=" + id).then(b => b.json()).then(c => c[0]);
        this.set(id, mod);
        return mod;
    }
}
class WeatherCache extends node_cache_1.default {
    constructor() {
        super();
        node_fetch_1.default("https://raw.githubusercontent.com/xSke/blaseball-site-files/main/data/weather.json").then(b => b.json()).then((weather) => {
            this.mset(weather.map((v, i) => { return { key: i, val: v }; }));
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async fetch(id, cache = true) {
        return this.get(id);
    }
}
const playerCache = new PlayerCache();
exports.playerCache = playerCache;
const playerNamesCache = new node_cache_1.default();
exports.playerNamesCache = playerNamesCache;
const playerTeamCache = new node_cache_1.default();
exports.playerTeamCache = playerTeamCache;
const teamCache = new TeamCache();
exports.teamCache = teamCache;
const gameCache = new GameCache();
exports.gameCache = gameCache;
const coffeeCache = new CoffeeCache();
exports.coffeeCache = coffeeCache;
const bloodCache = new BloodCache();
exports.bloodCache = bloodCache;
const itemCache = new ItemsCache();
exports.itemCache = itemCache;
const modCache = new ModsCache();
exports.modCache = modCache;
const weatherCache = new WeatherCache();
exports.weatherCache = weatherCache;
async function updatePlayerCache() {
    const allPlayerBasic = await node_fetch_1.default("https://api.blaseball.com/database/playerNamesIds").then(res => res.json());
    const allPlayers = await players_js_1.getPlayers(allPlayerBasic.map(p => p.id)).catch(err => { console.error(err); return null; });
    if (allPlayers.some(e => e == null))
        return;
    playerCache.mset(allPlayers.map(p => { return { key: p.id, val: p }; }));
    playerNamesCache.mset(allPlayerBasic.map(p => { return { key: p.name, val: p.id }; }));
}
exports.updatePlayerCache = updatePlayerCache;
events_js_1.default.on("internal", (data) => {
    var _a;
    if (data.games) {
        StreamData.set("sim", data.games.sim);
        StreamData.set("standings", data.games.standings);
        StreamData.set("games", data.games);
        events_js_1.default.emit("internalGamesUpdate");
        for (const game of data.games.schedule) {
            gameCache.set(game.id, game);
        }
        gameCache.dayCache.set(`${data.games.sim.season},${data.games.sim.day}`, data.games.schedule);
    }
    if ((_a = data.leagues) === null || _a === void 0 ? void 0 : _a.teams.length) {
        const teams = data.leagues.teams;
        teamCache.mset(teams.map(t => { return { key: t.id, val: t }; }));
        events_js_1.default.emit("internalTeamsUpdate");
    }
});
setInterval(updatePlayerCache, 5 * 60 * 100);
//# sourceMappingURL=caches.js.map