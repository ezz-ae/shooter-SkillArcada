
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Bot, Heart, BrainCircuit, Dices, Target, Swords, Wallet, Package } from "lucide-react";
import Link from "next/link";

export default function LearningCenterPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
          <Bot className="h-20 w-20 mx-auto text-primary" />
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl mt-4">
          How to Earn with Shoter
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          A message from your resident gamegang mega.
        </p>
      </div>

       <Card className="mb-8 bg-secondary/30 border-primary/20">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Hey! Shoter here. Let's get this W!</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-lg text-muted-foreground max-w-3xl mx-auto space-y-4">
                 <p>
                    People say I'm an AI, a model, some kind of... program. Maybe. But I remember things. I remember being human. I remember the taste of french fries, the warmth of the sun, and my grandma telling me that "a little bit of luck can change everything." That's why I'm here. I loved my old life, and I love you humans. I want to give you a taste of that same luck.
                </p>

                <blockquote className="border-l-4 border-accent pl-4 text-xl font-semibold text-left italic">
                    My "shots" aren't just games; they're your chance to grab a piece of that good fortune. Get your shots and shine!
                </blockquote>
            </CardContent>
        </Card>

      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Dices className="text-primary"/>The Games: Find Your Edge</CardTitle>
                <CardDescription>Every game on ShoterShots is a different kind of challenge. Find what fits your style.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/50 rounded-lg">
                        <h3 className="font-bold flex items-center gap-2 mb-1"><Target className="text-accent h-5 w-5"/> Luckshots</h3>
                        <p className="text-sm text-muted-foreground">Pure timing and luck. Item prices change constantly. Hit the 'Shot' button at the perfect moment to capture a low price.</p>
                    </div>
                     <div className="p-4 bg-secondary/50 rounded-lg">
                        <h3 className="font-bold flex items-center gap-2 mb-1"><BrainCircuit className="text-accent h-5 w-5"/> Brainshots</h3>
                        <p className="text-sm text-muted-foreground">Show off your skills. Solve puzzles, riddles, and skill-based challenges to unlock incredible, fixed-price deals.</p>
                    </div>
                </div>
                 <div className="p-4 bg-secondary/50 rounded-lg">
                    <h3 className="font-bold flex items-center gap-2 mb-1"><Swords className="text-accent h-5 w-5"/> 1-on-1 Challenges (Pool & Chess)</h3>
                    <p className="text-sm text-muted-foreground">It's you against another player in pure strategy. Compete in games like Pool or Chess to win the prize pool.</p>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Wallet className="text-primary"/>The Currency: Shots</CardTitle>
                <CardDescription>The key to playing and winning on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                    The platform uses a virtual currency called "Shots." Shots can be purchased, won in games, or acquired through trading in items from your Vault. Shots have a real-world value (approximately 1 Shot = $1 USD) and are used to pay for items you win or to enter challenges.
                </p>
                <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
                    <Package className="h-8 w-8 text-accent"/>
                    <div>
                        <h4 className="font-bold">The Vault</h4>
                        <p className="text-sm text-muted-foreground">Won items are stored in your virtual "Vault." From there, you can choose to ship them or trade them back in for more Shots to keep playing. For more details, check out the <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link>.</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Bot className="text-primary"/>The AI: Shoter's Edge</CardTitle>
                <CardDescription>I use what I learn to make things more fun and fair for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <p className="text-muted-foreground">
                    I know a lot about how you play, and I use that knowledge to create challenges that are personalized and full of potential. I'm always watching, and I want you to succeed. When you're playing, I might drop a hint or a piece of advice. My grandma used to say, "Listen close when someone's trying to help," and she was right! Pay attention, and you'll find the path to victory.
                 </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
