
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ShieldCheck, UserX } from "lucide-react";
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
            Shots do not have a real-world monetary value and cannot be redeemed for cash. They are used to pay for items you win and to enter challenges.
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

          <h2>3. The Vault, Shipping, & Trade-Ins</h2>
          <ul>
            <li>Won items are stored in your virtual "Vault."</li>
            <li>Items in the vault can be traded in for a fluctuating market value in Shots, or for a flat-rate amount of Shots.</li>
            <li>You can select up to 3 items from your vault to move to your shipping cart.</li>
            <li>Once you confirm a shipment, the items are considered finalized and cannot be returned to the vault.</li>
          </ul>
          
          <h2>4. User Conduct</h2>
          <ul>
            <li>Be respectful to other players in all chat and social features.</li>
            <li>Any use of bots, scripts, or other unfair methods will result in an immediate and permanent ban.</li>
          </ul>

          <h2 id="age-restriction" className="flex items-center gap-2"><UserX /> Age Restriction</h2>
          <p>
            You must be at least 18 years old, or the age of legal majority in your jurisdiction, to create an account and participate in any games on ShooterGun. By creating an account, you represent that you meet this minimum age requirement. We reserve the right to suspend any account that is found to be in violation of this policy.
          </p>
          
          <h2 id="privacy-policy" className="flex items-center gap-2"><ShieldCheck /> Privacy Policy</h2>
          <p>
            We respect your privacy. As this is a demonstration application, we do not collect or store any personally identifiable information (PII) from our users. The authentication system uses an anonymous, temporary ID that is reset when you log out. All user data, such as items in your vault and your "Shots" balance, is stored locally in your browser and is not transmitted to our servers.
          </p>
          <ul>
              <li><strong>Data We Do Not Collect:</strong> We do not collect your name, email address, IP address, or any other personal information.</li>
              <li><strong>Local Storage:</strong> All game progress and session data is stored on your own device and is under your control. Clearing your browser's storage will reset your account on this platform.</li>
              <li><strong>Third-Party Services:</strong> This platform does not integrate with any third-party analytics or advertising services.</li>
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
