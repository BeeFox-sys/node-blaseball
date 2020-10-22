import fetch from "node-fetch";

async function getTeams(teams:Array<string>): Promise<Array<Team>>{
    const req = "https://www.blaseball.com/database/team?id=";
    const reqs:Array<Promise<Team>> = [];
    for (const team of teams) {
        console.log(team);
        reqs.push(fetch(req+team,{headers: {"User-Agent":"npm-blaseball"}}).then(res=>res.json()));
    }
    const res = await Promise.all(reqs);
    return res;
}

export {getTeams};