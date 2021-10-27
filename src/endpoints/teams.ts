import fetch from "node-fetch";

async function getTeams(teams:Array<string>): Promise<Array<Team>>{
    const req = "https://api.blaseball.com/database/team?id=";
    const reqs:Array<Promise<Team>> = [];
    for (const team of teams) {
        reqs.push(fetch(req+team,{headers: {"User-Agent":"node-blaseball"}}).then(async (res)=>{
            const body = await res.text();
            if(body == "" || body.startsWith("<")) return null;
            return JSON.parse(body);
        }));
    }
    const res = await Promise.all(reqs);
    return res;
}

export {getTeams};