import fetch from "node-fetch";
const groupingSize = 180;

async function getPlayers(players:Array<string>): Promise<Array<Player>>{
    const url = "https://www.blaseball.com/database/players?ids=";
    const groups = [];
    const array = players;
    while(array.length > groupingSize){
        groups.push(array.splice(0,groupingSize));
    }
    const reqs:Array<Promise<Array<Player>>> = [];
    for await (const group of groups) {
        reqs.push(fetch(url+group.join(","),{headers: {"User-Agent":"npm-blaseball"}}).then(res=>res.json()));
    }
    
    const res = await Promise.all(reqs);
    return res.flat();
}

export {getPlayers};