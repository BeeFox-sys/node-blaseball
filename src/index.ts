import { StreamData } from "./utils/caches.js";
import events from "./endpoints/events.js";
export default {
    events,
    sim: ()=>{return StreamData.get("sim");}
};