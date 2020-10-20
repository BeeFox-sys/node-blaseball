const NodeCache = require("node-cache");

const events = require("../endpoints/events.js");

const StreamData = new NodeCache();

events.on("raw",(data)=>{
    if(!data.games)return;
    StreamData.set("sim",data.games.sim);
});

module.exports = {
    StreamData
};