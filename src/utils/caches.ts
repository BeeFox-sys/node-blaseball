import NodeCache from "node-cache";
import { item, mod, StreamDataCache, weather } from "../../typings/main.js";
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

import {getGameByID, getGamesByDay} from "../endpoints/games";
class GameCache extends NodeCache{
    dayCache = new NodeCache();
    async fetch(id:string, cache = true):Promise<Game | null>{
        if(this.has(id) && cache) return this.get(id);
        if(!/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.test(id)) return undefined;
        const game = await getGameByID(id);
        if(game != null) this.set(game.id,game);
        return game;
    }
    async fetchByDay(day: number, season: number, cache = true){
        if(this.dayCache.has(`${season},${day}`) && cache) return this.dayCache.get(`${season},${day}`);
        const games = await getGamesByDay(season,day);
        if(games != null){
            this.dayCache.set(`${season},${day}`,games);
            for(const game of games){
                this.set(game.id,game);
            }
        }
        return games;
    }
}

class CoffeeCache extends NodeCache{

    constructor(){
        super();
        fetch("https://www.blaseball.com/database/coffee?ids=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20").then(b=>b.json()).then((coffee)=>{
            this.mset(coffee.map((v,i)=>{return{key:i,val:v};}));
        });
    }

    async fetch(id:number, cache = true):Promise<string>{
        if(this.has(id) && cache) return this.get(id);
        const coffee = await fetch("https://www.blaseball.com/database/coffee?ids="+id).then(b=>b.json()).then(c=>c[0]);
        this.set(id,coffee);
        return coffee;
    }
}
class BloodCache extends NodeCache{

    constructor(){
        super();
        fetch("https://www.blaseball.com/database/blood?ids=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20").then(b=>b.json()).then((blood)=>{
            this.mset(blood.map((v,i)=>{return{key:i,val:v};}));
        });
    }

    async fetch(id:number, cache = true):Promise<string>{
        if(this.has(id) && cache) return this.get(id);
        const blood = await fetch("https://www.blaseball.com/database/blood?ids="+id).then(b=>b.json()).then(c=>c[0]);
        this.set(id,blood);
        return blood;
    }
}

class ModsCache extends NodeCache{

    async fetch(id:string, cache = true):Promise<mod>{
        if(this.has(id) && cache) return this.get(id);
        const mod = await fetch("https://www.blaseball.com/database/mods?ids="+id).then(b=>b.json()).then(c=>c[0]);
        this.set(id,mod);
        return mod;
    }
}

class ItemsCache extends NodeCache{
    async fetch(id:string, cache = true):Promise<item>{
        if(this.has(id) && cache) return this.get(id);
        const mod = await fetch("https://www.blaseball.com/database/items?ids="+id).then(b=>b.json()).then(c=>c[0]);
        this.set(id,mod);
        return mod;
    }
}

class WeatherCache extends NodeCache{

    constructor () {
        super();
        fetch("https://raw.githubusercontent.com/xSke/blaseball-site-files/main/data/weather.json").then(b=>b.json()).then((weather)=>{
            this.mset(weather.map((v,i)=>{return{key:i,val:v};}));
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async fetch(id:string, cache = true):Promise<weather>{
        return this.get(id);
    }
}


const playerCache = new PlayerCache();
const playerNamesCache = new NodeCache();
const playerTeamCache = new NodeCache();
const teamCache = new TeamCache();
const gameCache = new GameCache();
const coffeeCache = new CoffeeCache();
const bloodCache = new BloodCache();
const itemCache = new ItemsCache();
const modCache = new ModsCache();
const weatherCache = new WeatherCache();

async function updatePlayerCache(): Promise<void>{
    const allPlayerBasic = await fetch("https://www.blaseball.com/database/playerNamesIds").then(res=>res.json());
    const allPlayers = await getPlayers(allPlayerBasic.map(p=>p.id)).catch(err=>{console.error(err);return null;});
    if(allPlayers.some(e=>e==null)) return;
    playerCache.mset(allPlayers.map(p=>{return {key:p.id,val:p};}));
    playerNamesCache.mset(allPlayerBasic.map(p=>{return {key:p.name,val:p.id};}));
}

events.on("internal",(data: RawUpdate)=>{
    if(data.games){
        StreamData.set("sim",data.games.sim);
        StreamData.set("standings",data.games.standings);
        StreamData.set("games",data.games);
        events.emit("internalGamesUpdate");
        for(const game of data.games.schedule){
            gameCache.set(game.id,game);
        }
        gameCache.dayCache.set(`${data.games.sim.season},${data.games.sim.day}`,data.games.schedule);
    }
    if(data.leagues?.teams.length){
        const teams = data.leagues.teams;
        teamCache.mset(teams.map(t=>{return {key:t.id, val:t};}));
        events.emit("internalTeamsUpdate");
    }
});

setInterval(updatePlayerCache, 5*60*100);

export {
    StreamData,
    playerCache,
    teamCache,
    updatePlayerCache,
    playerNamesCache,
    playerTeamCache,
    gameCache,
    coffeeCache,
    bloodCache,
    itemCache,
    modCache,
    weatherCache
};