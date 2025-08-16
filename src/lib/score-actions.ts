
'use server';

import { z } from 'zod';
import { useStore } from './store';
import { mockProducts } from './products';

// Define a schema for the input of the submitScore action
const ScoreInputSchema = z.object({
  gameId: z.string(),
  actions: z.any(), // This will be game-specific, e.g., { playerPattern: number[], shooterPattern: number[] }
});

export type ScoreInput = z.infer<typeof ScoreInputSchema>;

interface ScoreResult {
    isWinner: boolean;
    prizeAwarded: number;
    newBalance?: number; // Send the new authoritative balance back to the client
}

/**
 * A server-authoritative action to process a game's outcome.
 * It re-validates the win condition on the server to prevent cheating.
 *
 * @param input - The player's actions and game identifier.
 * @returns A result object indicating if the player won and their prize.
 */
export async function submitScore(input: ScoreInput): Promise<ScoreResult> {
  const { gameId, actions } = ScoreInputSchema.parse(input);

  let isWinner = false;
  let prizeAwarded = 0;
  
  // Get the current state of the store on the server.
  // NOTE: In a real multi-user app, you would fetch this from a database like Firestore
  // using the authenticated user's ID. For this prototype, we read from the Zustand state.
  const { shots, addShots, addToVault } = useStore.getState();

  switch (gameId) {
    case 'shooter-mirror':
      const { playerPattern, shooterPattern } = actions as { playerPattern: number[], shooterPattern: number[] };
      
      const sortedPlayer = [...playerPattern].sort((a, b) => a - b);
      const sortedShooter = [...shooterPattern].sort((a, b) => a - b);

      if (JSON.stringify(sortedShooter) === JSON.stringify(sortedPlayer)) {
        isWinner = true;
        prizeAwarded = 10; // The prize for winning this game
        
        // Add prize to balance
        addShots(prizeAwarded);
        
        // Add the specific item prize to the vault
        const mirrorProduct = mockProducts.find(p => p.game === 'mirror-game');
        if (mirrorProduct) {
          // This addToVault is a mock that doesn't charge shots
          addToVault({ ...mirrorProduct, pricePaid: 0, purchaseTimestamp: Date.now() });
        }
      }
      break;

    // TODO: Add cases for other games like 'higher-or-lower', 'chess-mate', etc.
    
    default:
      throw new Error(`Unknown gameId: ${gameId}`);
  }

  // Return the result, including the new authoritative balance
  return {
    isWinner,
    prizeAwarded,
    newBalance: useStore.getState().shots, // Get the updated balance
  };
}
