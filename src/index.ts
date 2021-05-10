import { 
    coffeeCache,
    playerCache,
    StreamData,
    teamCache,
    updatePlayerCache,
    gameCache,
    bloodCache,
    itemCache,
    modCache,
    weatherCache, 
    playerNamesCache} from "./utils/caches.js";
import events from "./endpoints/events.js";


function sim(): Games["sim"]{
    return StreamData.get("sim");
}

function games(): Games{
    return StreamData.get("games");
}

let ready = false;

(async ()=>{
    await Promise.all<void,void,void,void>([
        updatePlayerCache(),
        new Promise<void>((resolve)=>{
            events.once("open",resolve);
        }),
        new Promise<void>((resolve)=>{
            events.once("internalGamesUpdate",resolve);
        }),
        new Promise<void>((resolve)=>{
            events.once("internalTeamsUpdate",resolve);
        })
    ]);
    setInterval(updatePlayerCache,1000*60*5);
    ready = true;
    events.emit("ready");
})();

export {
    events,
    sim,
    games,
    teamCache,
    playerCache,
    playerNamesCache,
    gameCache,
    coffeeCache,
    bloodCache,
    itemCache,
    modCache,
    weatherCache,
    ready
};