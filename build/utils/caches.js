"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlayerCache = exports.teamCache = exports.playerCache = exports.StreamData = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const events_js_1 = __importDefault(require("../endpoints/events.js"));
const players_js_1 = require("../endpoints/players.js");
const node_fetch_1 = __importDefault(require("node-fetch"));
const StreamData = new node_cache_1.default();
exports.StreamData = StreamData;
// interface CacheOptions {
//     recache?: boolean
// }
// class PlayerCache extends NodeCache{
//     async fetch(id:string, options?:CacheOptions): Promise<Player|null>{
//         if(!id.match(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)) throw new Error("Invalid ID");
//         if(options.recache){
//             //updatePlayer
//         }
//         const player = await this.get<Player>(id);
//         return player;
//     }
// }
const playerCache = new node_cache_1.default();
exports.playerCache = playerCache;
const teamCache = new node_cache_1.default();
exports.teamCache = teamCache;
async function updatePlayerCache() {
    const allPlayerBasic = await node_fetch_1.default("https://api.blaseball-reference.com/v1/allPlayers?includeShadows=true").then(res => res.json());
    const allPlayers = await players_js_1.getPlayers(allPlayerBasic.map(p => p.player_id));
    playerCache.mset(allPlayers.map(p => { return { key: p.id, val: p }; }));
}
exports.updatePlayerCache = updatePlayerCache;
events_js_1.default.on("raw", (data) => {
    var _a;
    if (data.games) {
        StreamData.set("sim", data.games.sim);
        StreamData.set("standings", data.games.standings);
    }
    if ((_a = data.leagues) === null || _a === void 0 ? void 0 : _a.teams.length) {
        const teams = data.leagues.teams;
        teamCache.mset(teams.map(t => { return { key: t.id, val: t }; }));
    }
});
//# sourceMappingURL=caches.js.map