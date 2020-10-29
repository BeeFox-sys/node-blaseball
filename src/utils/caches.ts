import NodeCache from "node-cache";
import { StreamDataCache } from "../../typings/main.js";
import events from "../endpoints/events.js";
import { getPlayers } from "../endpoints/players.js";
import fetch from "node-fetch";
import { getTeams } from "../endpoints/teams.js";
const StreamData = new NodeCache() as StreamDataCache;

class TeamCache extends NodeCache{
    async fetch(id:string, cache = true):Promise<Team | null>{
        if(teamCache.has(id) && cache) return teamCache.get(id);
        if(!/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.test(id)) return undefined;
        const teams = await getTeams([id]);
        const team = teams[0];
        if(team != null) teamCache.set(team.id,team);
        return team;
    }
    async byPlayer(id:string){
        return this.get(playerTeamCache.get(id));
    }
}

class PlayerCache extends NodeCache{
    async fetch(id:string, cache = true):Promise<Player | null>{
        if(playerCache.has(id) && cache) return playerCache.get(id);
        if(!/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.test(id)) return undefined;
        const players = await getPlayers([id]);
        const player = players[0];
        if(player != null) playerCache.set(player.id,player);
        return player;
    }
    async byName(id:string){
        return this.get(playerNamesCache.get(id));
    }
}

const playerCache = new PlayerCache();
const playerNamesCache = new NodeCache();
const playerTeamCache = new NodeCache();
const teamCache = new TeamCache();

async function updatePlayerCache(): Promise<void>{
    const allPlayerBasic = await fetch("https://api.blaseball-reference.com/v1/allPlayers?includeShadows=true").then(res=>res.json());  
    playerTeamCache.mset(allPlayerBasic.map(p=>{return {key:p.player_id,val:p.team_id};}));
    // console.log(allPlayerBasic.map(p=>{return {key:p.player_id,val:p.team_id};}))
    const allPlayers = await getPlayers(allPlayerBasic.map(p=>p.player_id)).catch(err=>{console.error(err);return null;});
    if(allPlayers.some(e=>e==null)) return;
    playerCache.mset(allPlayers.map(p=>{return {key:p.id,val:p};}));
    playerNamesCache.mset(allPlayers.map(p=>{return {key:p.name,val:p.id};}));
}

events.on("internal",(data: RawUpdate)=>{
    if(data.games){
        StreamData.set("sim",data.games.sim);
        StreamData.set("standings",data.games.standings);
        StreamData.set("games",data.games);
        events.emit("internalGamesUpdate");
    }
    if(data.leagues?.teams.length){
        const teams = data.leagues.teams;
        teamCache.mset(teams.map(t=>{return {key:t.id, val:t};}));
        events.emit("internalTeamsUpdate");
    }
});

export {StreamData, playerCache, teamCache, updatePlayerCache, playerNamesCache, playerTeamCache};