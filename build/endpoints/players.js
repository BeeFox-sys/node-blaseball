"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayers = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const groupingSize = 180;
async function getPlayers(players) {
    const url = "https://www.blaseball.com/database/players?ids=";
    const groups = [];
    const array = players;
    while (array.length > groupingSize) {
        groups.push(array.splice(0, groupingSize));
    }
    const reqs = [];
    for await (const group of groups) {
        reqs.push(node_fetch_1.default(url + group.join(","), { headers: { "User-Agent": "npm-blaseball" } }).then(res => res.json()));
    }
    const res = await Promise.all(reqs);
    return res.flat();
}
exports.getPlayers = getPlayers;
//# sourceMappingURL=players.js.map