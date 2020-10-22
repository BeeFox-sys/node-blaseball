"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeams = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
async function getTeams(teams) {
    const req = "https://www.blaseball.com/database/team?id=";
    const reqs = [];
    for (const team of teams) {
        console.log(team);
        reqs.push(node_fetch_1.default(req + team, { headers: { "User-Agent": "npm-blaseball" } }).then(res => res.json()));
    }
    const res = await Promise.all(reqs);
    return res;
}
exports.getTeams = getTeams;
//# sourceMappingURL=teams.js.map