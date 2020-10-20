const {StreamData} = require("./utils/caches.js")
module.exports = {
    events: require("./endpoints/events.js"),
    sim: ()=>{return StreamData.get("sim");}
};