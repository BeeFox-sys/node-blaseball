"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGamesByDay = exports.getGameByID = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
async function getGameByID(id) {
    return await node_fetch_1.default("https://api.blaseball.com/database/gameById/" + id)
        .then(async (res) => {
        if (res.status == 400)
            return null;
        if (!res.ok)
            throw new Error(res.statusText);
        const gameData = await res.json();
        return gameData;
    })
        .catch(e => console.error("Error at endpoint /gameByID:", e.message));
}
exports.getGameByID = getGameByID;
async function getGamesByDay(season, day) {
    return await node_fetch_1.default("https://api.blaseball.com/database/games?season=" + season + "&day=" + day)
        .then(async (res) => {
        if (!res.ok)
            throw new Error(res.statusText);
        const dayData = await res.json();
        return dayData;
    })
        .catch(e => console.error("Error at endpoint /games:", e.message));
}
exports.getGamesByDay = getGamesByDay;
//# sourceMappingURL=games.js.map