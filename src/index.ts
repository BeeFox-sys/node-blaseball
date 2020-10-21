import { StreamData } from "./utils/caches.js";
import events from "./endpoints/events.js";

function sim(){
    return StreamData.get("sim");
}

export {
    events,
    sim
};