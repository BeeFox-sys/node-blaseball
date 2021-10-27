"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeams = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
async function getTeams(teams) {
    const req = "https://api.blaseball.com/database/team?id=";
    const reqs = [];
    for (const team of teams) {
        reqs.push(node_fetch_1.default(req + team, { headers: { "User-Agent": "node-blaseball" } }).then(async (res) => {
            const body = await res.text();
            if (body == "" || body.startsWith("<"))
                return null;
            return JSON.parse(body);
        }));
    }
    const res = await Promise.all(reqs);
    return res;
}
exports.getTeams = getTeams;
//# sourceMappingURL=teams.js.map