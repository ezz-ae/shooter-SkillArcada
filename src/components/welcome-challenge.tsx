"use client";

import { useState } from "react";
import { DiceGame } from "./dice-game";
import { LuckAnalysis } from "./luck-analysis";

type WelcomeState = 'dice' | 'luck';

export function WelcomeChallenge() {
    const [welcomeState, setWelcomeState] = useState<WelcomeState>('dice');

    if (welcomeState === 'dice') {
        return <DiceGame onComplete={() => setWelcomeState('luck')} />
    }

    if (welcomeState === 'luck') {
        return <LuckAnalysis onBack={() => setWelcomeState('dice')} />
    }

    return null;
}
