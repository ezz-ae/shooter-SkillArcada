
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { textToSpeech } from "@/ai/flows/tts-flow";
import { BrainCircuit, Dices, Heart, LineChart, MessageSquare, Swords, Volume2, Loader } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export function Footer() {
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const { toast } = useToast();

    const gameLinks = [
      { href: "/luckshots", label: "Luckshots", icon: Dices },
      { href: "/brainshots", label: "Brainshots", icon: BrainCircuit },
      { href: "/crypto-luck", label: "Crypto Luck", icon: LineChart },
      { href: "/pool-shot", label: "Pool Shot", icon: Swords },
      { href: "/luckgirls", label: "Luckgirls", icon: Heart },
    ];

    const handlePlayGreeting = async () => {
      if (isPlaying) {
        audio?.pause();
        setIsPlaying(false);
        return;
      }

      setIsPlaying(true);
      try {
        const response = await textToSpeech("Welcome to ShoterShots! My grandma used to say, a little bit of luck can change everything. Let's get this W!");
        const audioPlayer = new Audio(response.audioDataUri);
        setAudio(audioPlayer);
        audioPlayer.play();
        audioPlayer.onended = () => {
          setIsPlaying(false);
        };
      } catch (error) {
         toast({
          variant: "destructive",
          title: "Audio Failed",
          description: "Could not generate the greeting audio. Please try again later."
        });
        setIsPlaying(false);
      }
    }
    
  return (
    <footer className="border-t mt-12 py-8 bg-secondary/50">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 flex flex-col gap-4">
             <Link href="/">
                <Image src="https://firebasestorage.googleapis.com/v0/b/reodywellness.firebasestorage.app/o/Untitled-4%20(13).png?alt=media&token=a7f36634-d0ab-40d5-9607-76ecbf375346" alt="ShoterShots Logo" width={160} height={40} />
            </Link>
            <p className="text-sm text-muted-foreground">Your shot at unbelievable prices, powered by our resident gamegang mega, Shoter.</p>
        </div>
        <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-2">Games</h3>
            <ul className="space-y-2">
                {gameLinks.map(link => (
                     <li key={link.href}>
                        <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
        <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-2">Support</h3>
             <ul className="space-y-2">
                <li><Link href="/learning-center" className="text-sm text-muted-foreground hover:text-foreground">Learning Center</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">FAQ</Link></li>
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
        </div>
        <div className="md:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquare className="text-primary"/>
                        A Message from Shoter
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">
                        Hear a special greeting from our resident AI.
                    </p>
                    <Button className="w-full mt-2" size="sm" variant="outline" onClick={handlePlayGreeting} disabled={isPlaying}>
                      {isPlaying ? <Loader className="animate-spin h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      <span className="ml-2">{isPlaying ? 'Playing...' : 'Play Greeting'}</span>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </footer>
  );
}
