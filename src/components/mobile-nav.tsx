
"use client"

import { useState } from "react"
import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Swords, Dices, LineChart, Heart, Bot, Flame, BookOpen, BrainCircuit, Gamepad2, Sun, HelpingHand, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const gameLinks = [
    { href: "/shoterday", label: "Shooterday", icon: Sun },
    { href: "/luckshots", label: "ShooterGuns", icon: Dices },
    { href: "/luckgirls", label: "Luckgirls", icon: Heart },
    { href: "/crypto-luck", label: "Crypto Luck", icon: LineChart },
    { href: "/shooter-mirror", label: "Mirror Game", icon: HelpingHand },
    { href: "/pool-shot", label: "Pool Shot", icon: Gamepad2 },
    { href: "/ai-adventure", label: "AI Adventure", icon: Bot },
    { href: "/shots-hub", label: "Shots Hub", icon: Flame },
    { href: "/learning-center", label: "How to Earn", icon: BookOpen },
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
        <Link href="/" className="flex items-center">
            <span className="font-allura text-4xl text-foreground">ShooterGun</span>
        </Link>
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
