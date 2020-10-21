import NodeCache from "node-cache";

import events from "../endpoints/events.js";

const StreamData = new NodeCache();

events.on("raw",(data)=>{
    if(!data.games)return;
    StreamData.set("sim",data.games.sim);
});

export {StreamData};