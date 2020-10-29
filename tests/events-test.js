const { events, sim, teamCache, playerCache } = require("..");

// events.on("raw",(rawData)=>{console.log("Raw Data Update,Season",sim().season,"Day", sim().day)});
// events.on("rawGames",(rawGames)=>{console.log("Raw Games Update");});
events.on("rawTemporal",(rawTemporal)=>{console.log(rawTemporal.doc.zeta);});
// events.on("rawLeagues",(rawLeagues)=>{console.log("Raw Leagues Update");});
// events.on("rawFights",(rawFights)=>{console.log("Raw Fights Update");});


// events.on("gameUpdate",(newGame, oldGame)=>{console.log("Game Update:",newGame.awayTeamNickname,"@",newGame.homeTeamNickname);});
// events.on("gameComplete",(game)=>{console.log("Game Complete:",game.awayTeamNickname,"@",game.homeTeamNickname);});
// events.on("gameStart",(game)=>{console.log("Game Start:",game.awayTeamNickname,"@",game.homeTeamNickname);});
// events.on("gamesFinished",(today,tomorrow)=>{console.log("All Games Finished");});

events.once("open",()=>{console.log("Connected");});
events.once("ready",async ()=>{
    console.log("ready")
    // console.log(await teamCache.byPlayer("34267632-8c32-4a8b-b5e6-ce1568bb0639"))
    // console.log(await playerCache.byName("Gunther O'Brian"))    
});