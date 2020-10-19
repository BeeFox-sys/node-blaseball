const EventSource = require("eventsource");
var source = new EventSource("https://www.blaseball.com/events/streamData", {withCredentials: true, headers: {"User-Agent":"npm-blaseball"}});

const NodeCache = require("node-cache");
const deduplication = new NodeCache({stdTTL: 60, checkperiod: 60*5});

var {EventEmitter} = require("events");
/**
 * Event Stream Client
 * 
 * @fires rawGames
 * @fires rawLeagues
 * @fires rawFights
 * @fires rawTemporal
 * @fires gameUpdate
 * @fires gameComplete
 */
const updates = new EventEmitter();

source.once("open", (event) => {
    updates.emit("open", event);
});
source.on("error", (error) => console.error);

source.on("message", (message) => {
    let data = JSON.parse(message.data).value;

    //raw data events
    if(data.games && (deduplication.get("games") != data.games)){
        if(deduplication.has("games")) updates.emit("rawGames", data.games);
        deduplication.set("games",data.games);
    }
    if(data.leagues && (deduplication.get("leagues") != data.leagues)){
        if(deduplication.has("leagues")) updates.emit("rawLeagues", data.games);
        deduplication.set("leagues",data.games);
    }
    if(data.temporal && (deduplication.get("temporal") != data.temporal)){
        if(deduplication.has("temportal")) updates.emit("rawTemporal", data.games);
        deduplication.set("temporal",data.games);
    }
    if(data.fights && (deduplication.get("fights") != data.fights)){
        if(deduplication.has("fights")) updates.emit("rawFights", data.games);
        deduplication.set("fights",data.games);
    }
});

updates.on("rawGames",(data)=>{
    data.schedule.forEach(game => {
        if(deduplication.get(game.id) == game) return;
        updates.emit("gameUpdate",game,deduplication.get(game.id));

        if(game.gameStart && !deduplication.has(game.id)) updates.emit("gameStart",game);

        if(game.gameComplete && deduplication.get(game.id)?.gameComplete === false) updates.emit("gameComplete",game);

        deduplication.set(game.id, game);
    });
});

module.exports = updates;