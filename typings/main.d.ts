interface Game {
    id: string,
    basesOccupied: Array<number>,
    baseRunners: Array<string>,
    baseRunnerNames: Array<string>,
    outcomes: Array<string>,
    terminology: string,
    lastUpdate: string,
    rules: string,
    statsheet: string,
    awayPitcher: string,
    awayPitcherName: string,
    awayBatter: string | null,
    awayBatterName: string | null,
    awayTeam: string,
    awayTeamName: string,
    awayTeamNickname: string,
    awayTeamColor: string,
    awayTeamEmoji: number | string,
    awayOdds: number,
    awayStrikes: number,
    awayScore: number,
    awayTeamBatterCount: number,
    homePitcher: string,
    homePitcherName: string,
    homeBatter: string | null,
    homeBatterName: string | null,
    homeTeam: string,
    homeTeamName: string,
    homeTeamNickname: string,
    homeTeamColor: string,
    homeTeamEmoji: number | string,
    homeOdds: number,
    homeStrikes: number,
    homeScore: number,
    homeTeamBatterCount: number,
    season: number,
    isPostseason: boolean,
    day: number,
    phase: number,
    gameComplete: boolean,
    finalized: boolean,
    gameStart: boolean,
    halfInningOuts: number,
    halfInningScore: number,
    inning: number,
    topOfInning: boolean,
    atBatBalls: number,
    atBatStrikes: number,
    seriesIndex: number,
    seriesLength: number,
    shame: boolean,
    weather: number,
    baserunnerCount: number,
    homeBases: number,
    awayBases: number,
    repeatCount: number,
    awayTeamSecondaryColor: string,
    homeTeamSecondaryColor: string,
    homeBalls: number,
    awayBalls: number,
    homeOuts: number,
    awayOuts: number,
    playCount: number
}

interface Team {
    id: string,
    lineup: Array<string>,
    rotation: Array<string>,
    bullpen: Array<string>,
    bench: Array<string>,
    seasAttr: Array<string>,
    permAttr: Array<string>,
    fullName: string,
    location: string,
    mainColor: string,
    nickname: string,
    secondaryColor: string,
    shorthand: string,
    emoji: number | string,
    slogan: string,
    shameRuns: number,
    totalShames: number,
    totalShamings: number,
    seasonShames: number,
    seasonShamings: number,
    championships: number,
    weekAttr: Array<string>,
    gameAttr: Array<string>,
    rotationSlot: number,
    teamSpirit: number
}


interface Games {
    sim: {
        id: string,
        day: number,
        league: string,
        nextElectionEnd: Date,
        nextPhaseTime: Date,
        nextSeasonStart: Date,
        phase: number,
        playOffRound: number,
        playoffs: string,
        rules: string,
        season: number,
        seasonId: string,
        terminology: string,
        eraColor: string,
        eraTitle: string,
        twgo: string,
        subEraColor: string,
        subEraTitle: string,
        attr: Array<string>,
        agitations: number,
        salutations: number
    },
    season: {
        id: string,
        league: string,
        rules: string,
        schedule: string,
        seasonNumber: number,
        standings: string,
        stats: string,
        terminology: string
    },
    standings: {
        id: string,
        losses: {[id: string]: number},
        wins: {[id: string]: number}
    },
    schedule: Array<Game>,
    tomorrowSchedule: Array<Game>
    postseason: {
        id: string
        name: string
        numberOfRounds: number
        playoffDay: number
        rounds: Array<string>
        season: number
        tomorrowRound: number
    }
}

interface Division {
    id: string
    name: string
    teams: Array<string>
}

interface League {
    id: string
    name: string
    subleagues: Array<string>
    tiebreakers: string
}

interface Subleague {
    id: string
    name: string
    divisions: Array<string>
}



interface Leagues {
    divisions: Array<Division>
    leagues: Array<League>
    subleagues: Array<Subleague>
    teams: Array<Teams>
    tiebreakers: Array<{
        id: string
        order: Array<string>
    }>
}

interface Temporal {
    doc: {
        alpha: number
        beta: number
        delta: boolean
        epsilon: boolean
        gamma: number
        id: string
        zeta: string
    }
}

interface Fights {
    bossFights: Array<>
}

interface RawUpdate {
    fights: Fights;
    games: Games;
    leagues: Leagues;
    temporal: Temporal;
}


import {EventEmitter} from "events";
/**
 * Recieves Events from blaseball.com
 * 
 * @fires Events#raw
 */
class Events extends EventEmitter {

    on(event: "raw", listener: (raw:RawUpdate)=>void): this;
    on(event: "rawGames", listener: (games:Games)=>void): this;
    on(event: "rawTemporal", listener: (temporal:Temporal)=>void): this;
    on(event: "rawLeagues", listener: (leagues: Leagues)=>void): this;
    on(event: "rawFights", listener: (fights: Fights)=>void): this;

    on(event: "gameUpdate", listener: (newGame:Game,oldGame:Game)=>void): this;
    on(event: "gameStart", listener: (game:Game)=>void): this;
    on(event: "gameComplete", listener: (game:Game)=>void): this;
    on(event: "gamesFinished", listener: (schedule:Array<Game>, tomorrowSchedule:Array<Game>)=>void): this;

    on(event: "open"): this;

}