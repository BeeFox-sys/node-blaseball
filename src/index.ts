import { playerCache, StreamData, teamCache, updatePlayerCache } from "./utils/caches.js";
import events from "./endpoints/events.js";

function sim(): Games["sim"]{
    return StreamData.get("sim");
}

let ready = false;

(async ()=>{
    await Promise.all<void,void>([
        updatePlayerCache(),
        new Promise<void>((resolve)=>{
            events.once("open",resolve);
        })
    ]);
    setTimeout(updatePlayerCache,1000*60*5);
    ready = true;
    events.emit("ready");
})();


export {
    events,
    sim,
    teamCache,
    playerCache,
    ready
};