import {EventEmitter} from "events";
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

}