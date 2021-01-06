import EventSource from "eventsource";
const source:EventSource = new EventSource(process.env.STREAMDATA||"https://www.blaseball.com/events/streamData", {withCredentials: true, headers: {"User-Agent":"node-blaseball"}});

import NodeCache from "node-cache";
const deduplication:NodeCache = new NodeCache();

import {EventEmitter} from "events";
import { Events } from "../../typings/main";
const updates:Events = new EventEmitter() as Events;

import {ready} from "../index";

source.onopen = () => {
    updates.emit("open");
};
source.onerror = (error)=>{
    // console.log(error);
    if(error.message == undefined) return;
    console.error(error);
};

source.onmessage = (message) => {
    if(message.data.startsWith("<")) return;
    let data;
    try{
        data = JSON.parse(message.data).value;
    } catch (e) {
        return console.error("Invalid Json Recieved:",message.data);
    }
    if(data && (JSON.stringify(deduplication.get("raw")) != JSON.stringify(data))){
        if(ready) updates.emit("raw", data);
        updates.emit("internal", data);
        deduplication.set("raw",data);
    }
    //raw data events
    if(data.games && (JSON.stringify(deduplication.get("games")) != JSON.stringify(data.games))){
        if(deduplication.has("games") && ready) updates.emit("rawGames", data.games);
        deduplication.set("games",data.games);
    }
    if(data.leagues && (JSON.stringify(deduplication.get("leagues")) != JSON.stringify(data.leagues))){
        if(deduplication.has("leagues") && ready) updates.emit("rawLeagues", data.leagues);
        deduplication.set("leagues",data.leagues);
    }
    if(data.temporal && (JSON.stringify(deduplication.get("temporal")) != JSON.stringify(data.temporal))){
        if(deduplication.has("temporal") && ready) updates.emit("rawTemporal", data.temporal);
        deduplication.set("temporal",data.temporal);
    }
    if(data.fights && (JSON.stringify(deduplication.get("fights")) != JSON.stringify(data.fights))){
        if(deduplication.has("fights") && ready) updates.emit("rawFights", data.fights);
        deduplication.set("fights",data.fights);
    }
};

updates.on("rawGames",(data:Games)=>{
    data.tomorrowSchedule.forEach((game:Game)=>{
        deduplication.set(game.id,game);
    });
    data.schedule.forEach((game:Game) => {
        if(deduplication.get<Game>(game.id) == game) return;
        updates.emit("gameUpdate",game,deduplication.get(game.id));

        if(game.gameStart && deduplication.get<Game>(game.id)?.gameStart === false) updates.emit("gameStart",game);

        if(game.gameComplete && deduplication.get<Game>(game.id)?.gameComplete === false) updates.emit("gameComplete",game);

        deduplication.set(game.id, game);
    });
    
    if(data.schedule.every((g:Game)=>g.gameComplete) && deduplication.get<Games>("games")?.schedule.every((g:Game)=>g.gameComplete) === false) updates.emit("gamesFinished", data.schedule, data.tomorrowSchedule);
});


export default updates;