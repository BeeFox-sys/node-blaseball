import fetch from "node-fetch";


async function getGameByID(id: string): Promise<Game>{
    return await fetch("https://api.blaseball.com/database/gameById/"+id)
        .then(async res => {
            if(res.status == 400) return null;
            if(!res.ok) throw new Error(res.statusText);
            const gameData = await res.json();
            return gameData;
        })
        .catch(e => console.error("Error at endpoint /gameByID:",e.message));
}

async function getGamesByDay(season:number,day:number): Promise<Array<Game>>{
    return await fetch("https://api.blaseball.com/database/games?season="+season+"&day="+day)
        .then(async res => {
            if(!res.ok) throw new Error(res.statusText);
            const dayData = await res.json();
            return dayData;
        })
        .catch(e => console.error("Error at endpoint /games:",e.message));
}

export {getGameByID, getGamesByDay};