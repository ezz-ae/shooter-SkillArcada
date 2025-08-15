export interface GamePerformanceData {
    id: string;
    status: {
        color: 'red' | 'purple' | 'yellow' | 'light-blue';
        tooltip: string;
    },
    game: string;
    gameLink: string;
    type: 'Luckshot' | 'Brainshot' | 'Challenge' | 'Social' | 'Hybrid';
    bounce: number;
    playedTimes: number;
    winLossRatio: number;
    winLossTrend: 'up' | 'down';
    bugs: number;
    avgTime: number; // in seconds
    income: number;
    cases: number;
    openNotes: string;
    shooterEyeStatus: 'Normal' | 'Concern' | 'Exploit Risk';
    lastShot: string;
    costPerEdit: number;
    directLanding: number;
    liveResults: {
        type: 'win' | 'loss';
        details: string;
    };
    ideas: string;
    termination: boolean;
    badClosing: number;
    userEnergyIn: number;
    userEnergyOut: number;
    bounceDestination: string;
    sessionTimeAnalysis: string;
    prizeType: 'Shots' | 'Item' | 'USD';
    totalPrizeToday: number;
    gameValueStatus: 'Hot' | 'Stable' | 'Fading';
    highestProfit: number;
    highestLoss: number;
    playerCountry: string;
    frequencyRate: number;
    availability: '24/7' | 'Scheduled';
    loadingStatus: 'Fast' | 'Optimal' | 'Slow';
    visitors: number;
    visitorsUnique: number;
    referralRegistrations: number;
    openTabs: number;
    idleTabs: number;
    chargeToPlay: number;
    lastGameEdit: string;
    gamesSinceEdit: number;
    roi: number; // return on investment
}

export const mockPerformanceData: GamePerformanceData[] = [
    {
        id: 'crypto-luck',
        status: { color: 'light-blue', tooltip: 'Performing well, no issues.' },
        game: 'Crypto Luck',
        gameLink: '/crypto-luck',
        type: 'Hybrid',
        bounce: 12,
        playedTimes: 1203,
        winLossRatio: 55,
        winLossTrend: 'up',
        bugs: 0,
        avgTime: 175,
        income: 1204,
        cases: 1,
        openNotes: 'Consider adding more crypto options.',
        shooterEyeStatus: 'Normal',
        lastShot: '2m ago',
        costPerEdit: 5,
        directLanding: 45,
        liveResults: { type: 'win', details: 'Won 100 Shots' },
        ideas: 'Add ETH/SOL pairs.',
        termination: false,
        badClosing: 3,
        userEnergyIn: 88,
        userEnergyOut: 75,
        bounceDestination: '/luckshots',
        sessionTimeAnalysis: 'Most users finish the game.',
        prizeType: 'Shots',
        totalPrizeToday: 5500,
        gameValueStatus: 'Hot',
        highestProfit: 100,
        highestLoss: -1,
        playerCountry: 'USA',
        frequencyRate: 8.5,
        availability: '24/7',
        loadingStatus: 'Fast',
        visitors: 2500,
        visitorsUnique: 1800,
        referralRegistrations: 5,
        openTabs: 150,
        idleTabs: 20,
        chargeToPlay: 1,
        lastGameEdit: '2 weeks ago',
        gamesSinceEdit: 15000,
        roi: 120300,
    },
    {
        id: 'pool-shot',
        status: { color: 'yellow', tooltip: 'High engagement, low monetization.' },
        game: 'Pool Shot',
        gameLink: '/pool-shot',
        type: 'Challenge',
        bounce: 8,
        playedTimes: 850,
        winLossRatio: 68,
        winLossTrend: 'up',
        bugs: 1,
        avgTime: 320,
        income: 150,
        cases: 5,
        openNotes: 'Players request tournaments.',
        shooterEyeStatus: 'Normal',
        lastShot: '5m ago',
        costPerEdit: 0,
        directLanding: 20,
        liveResults: { type: 'loss', details: 'Lost 10 Shots' },
        ideas: 'Weekly tournaments with ETH prizes.',
        termination: false,
        badClosing: 1,
        userEnergyIn: 95,
        userEnergyOut: 90,
        bounceDestination: '/chess',
        sessionTimeAnalysis: 'Long session times indicate high engagement.',
        prizeType: 'Shots',
        totalPrizeToday: 8000,
        gameValueStatus: 'Stable',
        highestProfit: 500,
        highestLoss: -50,
        playerCountry: 'DE',
        frequencyRate: 6.2,
        availability: '24/7',
        loadingStatus: 'Optimal',
        visitors: 1500,
        visitorsUnique: 900,
        referralRegistrations: 2,
        openTabs: 100,
        idleTabs: 5,
        chargeToPlay: 10,
        lastGameEdit: '1 month ago',
        gamesSinceEdit: 10000,
        roi: 1400,
    },
    {
        id: 'higher-or-lower',
        status: { color: 'red', tooltip: 'Potential exploit detected in puzzle sequence.' },
        game: 'Higher or Lower',
        gameLink: '/higher-or-lower',
        type: 'Brainshot',
        bounce: 25,
        playedTimes: 300,
        winLossRatio: 85,
        winLossTrend: 'down',
        bugs: 3,
        avgTime: 45,
        income: -50,
        cases: 12,
        openNotes: 'User PixelPioneer won 5 times in a row.',
        shooterEyeStatus: 'Exploit Risk',
        lastShot: '1h ago',
        costPerEdit: 0,
        directLanding: 10,
        liveResults: { type: 'win', details: 'Won 20 Shots' },
        ideas: 'Randomize the card sequence from a larger pool.',
        termination: false,
        badClosing: 8,
        userEnergyIn: 70,
        userEnergyOut: 50,
        bounceDestination: '/',
        sessionTimeAnalysis: 'Short sessions, likely due to puzzle being too easy/exploitable.',
        prizeType: 'Shots',
        totalPrizeToday: 2550,
        gameValueStatus: 'Fading',
        highestProfit: 20,
        highestLoss: 0,
        playerCountry: 'UK',
        frequencyRate: 2.1,
        availability: '24/7',
        loadingStatus: 'Fast',
        visitors: 500,
        visitorsUnique: 400,
        referralRegistrations: 0,
        openTabs: 30,
        idleTabs: 10,
        chargeToPlay: 0,
        lastGameEdit: '3 months ago',
        gamesSinceEdit: 5000,
        roi: -100,
    },
    {
        id: 'shop-hunter',
        status: { color: 'purple', tooltip: 'New game, requires monitoring.' },
        game: 'Shop Hunter',
        gameLink: '/shop-hunter',
        type: 'Luckshot',
        bounce: 18,
        playedTimes: 250,
        winLossRatio: 40,
        winLossTrend: 'up',
        bugs: 0,
        avgTime: 60,
        income: 250,
        cases: 0,
        openNotes: 'Monitor pricing algorithm for fairness.',
        shooterEyeStatus: 'Normal',
        lastShot: '10m ago',
        costPerEdit: 1,
        directLanding: 60,
        liveResults: { type: 'win', details: 'Won iPhone for $120' },
        ideas: 'Introduce time-limited product hunts.',
        termination: false,
        badClosing: 2,
        userEnergyIn: 80,
        userEnergyOut: 78,
        bounceDestination: '/vault',
        sessionTimeAnalysis: 'Users spend time selecting product.',
        prizeType: 'Item',
        totalPrizeToday: 12000,
        gameValueStatus: 'Hot',
        highestProfit: 1179,
        highestLoss: -1,
        playerCountry: 'CA',
        frequencyRate: 9.1,
        availability: '24/7',
        loadingStatus: 'Optimal',
        visitors: 1000,
        visitorsUnique: 850,
        referralRegistrations: 8,
        openTabs: 200,
        idleTabs: 15,
        chargeToPlay: 1,
        lastGameEdit: '1 day ago',
        gamesSinceEdit: 250,
        roi: 9900,
    },
];
