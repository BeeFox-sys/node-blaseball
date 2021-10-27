import fetch from "node-fetch";
const groupingSize = 180;

async function getPlayers(players:Array<string>): Promise<Array<Player>>{
    const url = "https://api.blaseball.com/database/players?ids=";
    const groups = [];
    const array = players;
    while(array.length > groupingSize){
        groups.push(array.splice(0,groupingSize));
    }
    groups.push(array);
    const reqs:Array<Promise<Array<Player>>> = [];
    for await (const group of groups) {
        reqs.push(fetch(url+group.join(","),{headers: {"User-Agent":"npm-blaseball"}}).then(async res=>{
            const body:string = await res.text();
            if(body == "" || body.startsWith("<")) return null;
            return JSON.parse(body);
        }).catch(err=>{throw new Error(err);}));
    }
    
    const res = await Promise.all(reqs);
    return res.flat();
}

export {getPlayers};