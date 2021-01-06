/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {EventEmitter} from "events";
import NodeCache from "node-cache";
/**
 * Recieves Events from blaseball.com
 * 
 * @fires Events#raw
 */
class Events extends EventEmitter {

    on(event: "raw", listener: (raw:RawUpdate)=>void): this;
    on(event: "rawGames", listener: (games:Games)=>void): this;
    on(event: "rawTemporal", listener: (temporal:Temporal)=>void): this;
    on(event: "rawLeagues", listener: (leagues: Leagues)=>void): this;
    on(event: "rawFights", listener: (fights: Fights)=>void): this;

    on(event: "gameUpdate", listener: (newGame:Game,oldGame:Game)=>void): this;
    on(event: "gameStart", listener: (game:Game)=>void): this;
    on(event: "gameComplete", listener: (game:Game)=>void): this;
    on(event: "gamesFinished", listener: (schedule:Array<Game>, tomorrowSchedule:Array<Game>)=>void): this;

    on(event: "open"): this;
    on(event: "ready"): this;

    private on(event: "internal", listener: (data:RawUpdate)=>void): this;
}

class StreamDataCache extends NodeCache {
    get(key: "sim"): Games["sim"];
    get(key: "standings"): Games["standings"]
    get(key: "games"): Games
}

class item {
    id: string
    name: string
    attr: string
}

class mod {
    id: string//	"FIREPROOF"
    color: string//	"#a5c5f0"
    textColor:string//	"#a5c5f0"
    background:string//	"#4c77b0"
    title:string//	"Fireproof"
    description:string//	"A Fireproof player can not be incinerated."
}

class weather {
    background:string
    color:string
    name:string
}