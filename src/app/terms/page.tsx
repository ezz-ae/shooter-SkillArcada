
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl">
            <FileText className="h-8 w-8 text-primary" />
            Terms of Service
          </CardTitle>
          <CardDescription>
            Last Updated: {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>Welcome to ShooterGun! By using our platform, you agree to these terms. Please read them carefully.</p>

          <h2>1. The "Shots" Currency</h2>
          <p>
            The platform uses a virtual currency called "Shots." Shots can be purchased, won in games, or acquired through trade-ins. 
            Shots have a real-world value and can be used to pay for items you win. The current conversion rate is approximately 1 Shot = $1 USD, though this may be subject to change.
          </p>

          <h2>2. Game Rules</h2>
          
          <h3>ShooterGuns (Dynamic Pricing)</h3>
          <ul>
            <li>The price of items in this category changes dynamically.</li>
            <li>Clicking the "Shot" button costs 1 Shot and captures the current price of the item.</li>
            <li>After capturing a price, you have the option to buy the item for that price or let it go.</li>
            <li>If you choose to buy, the captured price in Shots will be deducted from your balance, and the item will be moved to your Vault.</li>
          </ul>

          <h3>Brainshots (Skill Games)</h3>
          <ul>
            <li>These games require skill (e.g., solving riddles, timing puzzles) to unlock a low, fixed price.</li>
            <li>Starting a challenge costs a specified amount of Shots.</li>
            <li>If you successfully complete the challenge, you can purchase the item for the promotional price.</li>
            <li>If you fail, you forfeit the entry fee.</li>
          </ul>

          <h2>3. The Vault & Shipping</h2>
          <ul>
            <li>Won items are stored in your virtual "Vault."</li>
            <li>Items in the vault can be traded in for a fluctuating value in Shots or for a flat-rate amount of legacy "ShooterGun."</li>
            <li>You can select up to 3 items from your vault to move to your shipping cart.</li>
            <li>Once you confirm a shipment, the items are considered finalized and cannot be returned to the vault.</li>
          </ul>
          
          <h2>4. User Conduct</h2>
          <ul>
            <li>You must be of legal age in your jurisdiction to participate.</li>
            <li>Any use of bots, scripts, or other unfair methods will result in an immediate and permanent ban.</li>
            <li>Be respectful to other players in all chat and social features.</li>
          </ul>

          <h2>5. Limitation of Liability</h2>
          <p>
            ShooterGun is provided "as is." While we strive for a fair and fun environment, we are not responsible for any losses incurred. All transactions are final.
          </p>

          <p>
            <Link href="/">Back to Home</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
