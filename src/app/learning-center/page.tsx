
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Gamepad2, Wallet, Users, Shield, Trophy } from "lucide-react";

export default function LearningCenterPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl">
            <BookOpen className="h-8 w-8 text-primary" />
            Learning Center
          </CardTitle>
          <CardDescription>
            Your complete guide to understanding ShoterShots.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-bold">
                <div className="flex items-center gap-3">
                    <Gamepad2 className="h-6 w-6 text-accent"/>
                    The Games
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose dark:prose-invert max-w-none pl-12 space-y-4">
                <h4>ShoterShots (Dynamic Pricing)</h4>
                <p>This is the classic game mode. The price of an item changes rapidly. Your goal is to "shot" the price at the perfect moment to capture the best deal. The lower you can capture it, the better. It costs 1 Shot to play.</p>
                
                <h4>Brainshots (Skill Games)</h4>
                <p>These games test your skill. Instead of a fluctuating price, you must complete a challenge (like solving a riddle, pausing a reel, or drawing a pattern) to unlock a very low, fixed price for an item. There is an entry fee in Shots to attempt the challenge.</p>
                
                <h4>Crypto Luck</h4>
                <p>A prediction game. You have 3 minutes to guess what the price of Bitcoin will be. You must also predict whether the final price will be higher (Up) or lower (Down) than the starting price. If you guess the direction correctly, you win. The player with the closest guess wins the grand prize.</p>

                <h4>Pool Shot</h4>
                 <p>A 1-on-1 game of skill. Place your cue ball, aim, and set your power to sink the 8-ball. The game is physics-based, so precision is key. It's not about luck, but about your ability to line up the perfect shot.</p>

                <h4>Luckgirls Games</h4>
                 <p>A collection of fun, social, and fast-paced games designed to be played with friends or a live audience. These games often involve timed puzzles, quick-eye challenges, or social board games with integrated chat features.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-bold">
                <div className="flex items-center gap-3">
                    <Wallet className="h-6 w-6 text-accent"/>
                    Your Account & Currency
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose dark:prose-invert max-w-none pl-12 space-y-4">
                 <h4>"Shots" Currency</h4>
                <p>Shots are the main currency of the platform. You use Shots to pay for items you win and to enter skill-based challenges. 1 Shot is approximately equal to $1 USD. You can deposit funds to get more Shots or trade-in items from your Vault.</p>

                <h4>The Vault</h4>
                <p>When you successfully win an item, it's placed in your Vault. Items in your vault are yours. From here, you have two options: move them to shipping or trade them in.</p>

                <h4>Trade-In System</h4>
                <p>Don't want an item? You can trade it in for currency. There are two trade-in options:</p>
                <ul>
                  <li><strong>Market Value:</strong> Trade the item for its current value in Shots. This value fluctuates based on a simulated market.</li>
                  <li><strong>Flat Rate:</strong> Trade any item for a flat-rate of 20 Shots. This is a reliable way to get more Shots if you're running low.</li>
                </ul>

                <h4>Shipping</h4>
                <p>You can select up to 3 items from your Vault to move to your shipping cart. Once you confirm a shipment, we will process the order and send the items to you. This action is final and items cannot be returned to the vault after shipment is confirmed.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-bold">
                 <div className="flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-accent"/>
                    Pool Leagues & Challenges
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose dark:prose-invert max-w-none pl-12 space-y-4">
                 <h4>Public Challenges</h4>
                <p>Any player can create a public Pool Shot challenge for a specific entry fee and prize. These challenges are open for anyone to accept. It's a great way to find a quick match against a random opponent.</p>
                
                <h4>Leagues</h4>
                <p>Leagues are high-stakes, scheduled tournaments with a large grand prize. Players must register to join a league season. They compete against other registered players in a structured format. Leagues often have a live audience and chat, creating an exciting event-like atmosphere.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-xl font-bold">
                 <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-accent"/>
                    Chat & Social Features
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose dark:prose-invert max-w-none pl-12 space-y-4">
                <p>Many of our games, especially in the Pool Shot and Luckgirls categories, feature live chat. You can communicate with your opponent, interact with the audience watching your game, and even call an admin for help if you encounter any issues. We expect all players to be respectful and maintain a positive environment.</p>
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-5">
              <AccordionTrigger className="text-xl font-bold">
                <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-accent"/>
                    Our Commitment to Fairness
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose dark:prose-invert max-w-none pl-12">
                <blockquote>
                  "Shoter sells his shots because he loves his old life in the universe, but he is not an easy opponent. The challenges are real, but they are fair. We do not and cannot control the outcome of any game. Our role is to provide a stable and secure platform for these exciting challenges."
                  <cite>- Fon, CEO of ShoterShots</cite>
                </blockquote>
                <p>
                  We are committed to providing a transparent gaming experience. The outcomes of our games are determined by either real-time data (in price-based games) or by player skill (in challenge-based games).
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
