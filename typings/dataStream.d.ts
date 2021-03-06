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
        losses: Record<string, number>,
        wins: Record<string, number>
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
    teams: Array<Team>
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
        eta: number
        iota: number
        theta: string
    }
}

interface Fights {
    bossFights: Array<Fight>
}

interface Fight extends Game {
    awayHp: number
    homeHp: number
    awayMaxHp: number
    homeMaxHp: number
    damageResults: string
}

interface RawUpdate {
    fights: Fights;
    games: Games;
    leagues: Leagues;
    temporal: Temporal;
}