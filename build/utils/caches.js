"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerTeamCache = exports.playerNamesCache = exports.updatePlayerCache = exports.teamCache = exports.playerCache = exports.StreamData = void 0;
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
        if (team != null)
            teamCache.set(team.id, team);
        return team;
    }
    async byPlayer(id) {
        return this.get(playerTeamCache.get(id));
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
        return this.get(playerNamesCache.get(id));
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
async function updatePlayerCache() {
    const allPlayerBasic = await node_fetch_1.default("https://api.blaseball-reference.com/v1/allPlayers?includeShadows=true").then(res => res.json());
    playerTeamCache.mset(allPlayerBasic.map(p => { return { key: p.player_id, val: p.team_id }; }));
    // console.log(allPlayerBasic.map(p=>{return {key:p.player_id,val:p.team_id};}))
    const allPlayers = await players_js_1.getPlayers(allPlayerBasic.map(p => p.player_id)).catch(err => { console.error(err); return null; });
    if (allPlayers.some(e => e == null))
        return;
    playerCache.mset(allPlayers.map(p => { return { key: p.id, val: p }; }));
    playerNamesCache.mset(allPlayers.map(p => { return { key: p.name, val: p.id }; }));
}
exports.updatePlayerCache = updatePlayerCache;
events_js_1.default.on("internal", (data) => {
    var _a;
    if (data.games) {
        StreamData.set("sim", data.games.sim);
        StreamData.set("standings", data.games.standings);
        StreamData.set("games", data.games);
        events_js_1.default.emit("internalGamesUpdate");
    }
    if ((_a = data.leagues) === null || _a === void 0 ? void 0 : _a.teams.length) {
        const teams = data.leagues.teams;
        teamCache.mset(teams.map(t => { return { key: t.id, val: t }; }));
        events_js_1.default.emit("internalTeamsUpdate");
    }
});
//# sourceMappingURL=caches.js.map