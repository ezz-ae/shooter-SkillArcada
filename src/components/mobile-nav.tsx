
"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Swords, Dices, LineChart, Heart, Bot, Flame, BookOpen, BrainCircuit, Gamepad2, Sun, HelpingHand, User, Sparkles, Layers, Grid, RectangleHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const gameLinks = [
    { href: "/shoterday", label: "Shoterday", icon: Sun },
    { href: "/luckshots", label: "ShooterGuns", icon: Dices },
    { href: "/luckgirls", label: "Luckgirls", icon: Heart },
    { href: "/crypto-luck", label: "Crypto Luck", icon: LineChart },
    { href: "/shooter-mirror", label: "Mirror Game", icon: HelpingHand },
    { href: "/pool-shot", label: "Pool Shot", icon: Gamepad2 },
    { href: "/ai-adventure", label: "AI Adventure", icon: Bot },
    { href: "/shots-hub", label: "Shots Hub", icon: Flame },
    { href: "/learning-center", label: "How to Earn", icon: BookOpen },
    { href: "/chess", label: "Chess", icon: BrainCircuit },
    { href: "/board-games", label: "Board Games", icon: Grid },
    { href: "/card-games", label: "Card Games", icon: Layers },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">A list of pages on the ShooterGun site.</SheetDescription>
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
              <span className="font-allura text-4xl text-foreground">ShooterGun</span>
          </Link>
        </SheetHeader>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
             {gameLinks.map(link => (
                <Link 
                    key={link.href} 
                    href={link.href} 
                    className={cn(
                        "flex items-center gap-3 text-lg font-semibold text-muted-foreground hover:text-foreground",
                        link.label === "Luckgirls" && "text-pink-500 hover:text-pink-600"
                    )}
                    onClick={() => setOpen(false)}
                >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                </Link>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
