const { events } = require("../src");

events.on("rawGames",()=>{console.log("Raw Games Update");});
events.on("rawTemporal",()=>{console.log("Raw Temporal Update");});
events.on("rawLeagues",()=>{console.log("Raw Leagues Update");});
events.on("rawFights",()=>{console.log("Raw Fights Update");});
events.once("open",()=>{console.log("Connected");});
events.on("gameUpdate",(game)=>{console.log("Game Update:",game.awayTeamNickname,"@",game.homeTeamNickname);});
events.on("gameComplete",(game)=>{console.log("Game Complete:",game.awayTeamNickname,"@",game.homeTeamNickname);});
events.on("gameStart",(game)=>{console.log("Game Start:",game.awayTeamNickname,"@",game.homeTeamNickname);});