import NodeCache from "node-cache";
import { StreamDataCache } from "../../typings/main.js";
import events from "../endpoints/events.js";
import { getPlayers } from "../endpoints/players.js";
import fetch from "node-fetch";
const StreamData = new NodeCache() as StreamDataCache;

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

const playerCache = new NodeCache();
const teamCache = new NodeCache();

async function updatePlayerCache(): Promise<void>{
    const allPlayerBasic = await fetch("https://api.blaseball-reference.com/v1/allPlayers?includeShadows=true").then(res=>res.json());    
    const allPlayers = await getPlayers(allPlayerBasic.map(p=>p.player_id));
    playerCache.mset(allPlayers.map(p=>{return {key:p.id,val:p};}));
}

events.on("raw",(data: RawUpdate)=>{
    if(data.games){
        StreamData.set("sim",data.games.sim);
        StreamData.set("standings",data.games.standings);
    }
    if(data.leagues?.teams.length){
        const teams = data.leagues.teams;
        teamCache.mset(teams.map(t=>{return {key:t.id, val:t};}));
    }
});

export {StreamData, playerCache, teamCache, updatePlayerCache};