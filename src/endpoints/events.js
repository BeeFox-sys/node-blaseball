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

    if(data && (JSON.stringify(deduplication.get("raw")) != JSON.stringify(data))){
        if(deduplication.has("raw")) updates.emit("rawUpdate", data);
        deduplication.set("raw",data);
    }
    //raw data events
    if(data.games && (JSON.stringify(deduplication.get("games")) != JSON.stringify(data.games))){
        if(deduplication.has("games")) updates.emit("rawGames", data.games);
        deduplication.set("games",data.games);
    }
    if(data.leagues && (JSON.stringify(deduplication.get("leagues")) != JSON.stringify(data.leagues))){
        if(deduplication.has("leagues")) updates.emit("rawLeagues", data.games);
        deduplication.set("leagues",data.games);
    }
    if(data.temporal && (JSON.stringify(deduplication.get("temporal")) != JSON.stringify(data.temporal))){
        if(deduplication.has("temportal")) updates.emit("rawTemporal", data.games);
        deduplication.set("temporal",data.games);
    }
    if(data.fights && (JSON.stringify(deduplication.get("fights")) != JSON.stringify(data.fights))){
        if(deduplication.has("fights")) updates.emit("rawFights", data.games);
        deduplication.set("fights",data.games);
    }
});

updates.on("rawGames",(data)=>{
    data.tomorrowSchedule.forEach(game=>{
        deduplication.set(game.id,game);
    });
    data.schedule.forEach(game => {
        if(deduplication.get(game.id) == game) return;
        updates.emit("gameUpdate",game,deduplication.get(game.id));

        if(game.gameStart && deduplication.get(game.id)?.gameStart === false) updates.emit("gameStart",game);

        if(game.gameComplete && deduplication.get(game.id)?.gameComplete === false) updates.emit("gameComplete",game);

        deduplication.set(game.id, game);
    });
    
    if(data.schedule.every(g=>g.gameComplete) && deduplication.get("games")?.schedule.every(g=>g.gameComplete) === false) updates.emit("gamesFinished", data.schedule, data.tomorrowSchedule);
});

module.exports = updates;