
"use client";

import Link from "next/link";
import { Package, User, LogOut, MessageSquare, BarChart, Swords, Dices, LineChart, BrainCircuit, BookOpen, Flame, ShoppingCart, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ShooterWhisper } from "./shooter-whisper";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const { isAuthenticated, user, logout, initializeAuth } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [isWhisperOpen, setIsWhisperOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // This is a mock auth initialization
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-lilita text-4xl shimmer-text">ShooterGun</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-1">
             <Button variant="ghost" asChild>
                <Link href="/shoterday">Shoterday</Link>
             </Button>
             <Button variant="ghost" asChild>
                <Link href="/luckshots">ShooterGuns</Link>
             </Button>
             <Button variant="ghost" asChild>
                <Link href="/hit-or-miss">Hit or Miss</Link>
             </Button>
              <Button variant="ghost" asChild>
                <Link href="/shop-hunter">Shop Hunter</Link>
             </Button>
             <Button variant="ghost" asChild>
                <Link href="/shooter-man">ShooterMan</Link>
             </Button>
             <Button variant="ghost" asChild>
                <Link href="/crypto-luck">Crypto Luck</Link>
             </Button>
             <Button variant="ghost" asChild>
                <Link href="/puzzle-games">Puzzle Games</Link>
             </Button>
             <Button variant="ghost" asChild>
                <Link href="/pool-shot">Pool Shot</Link>
             </Button>
             <Button variant="ghost" asChild>
                <Link href="/ai-adventure">AI Adventure</Link>
             </Button>
              <Button variant="ghost" asChild>
                <Link href="/shots-hub">Shots Hub</Link>
             </Button>
             <Button variant="ghost" asChild>
                <Link href="/learning-center">How to Earn</Link>
             </Button>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isClient && isAuthenticated && user ? (
            <>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsWhisperOpen(true)}>
                <MessageSquare />
                <span className="sr-only">Whisper to Shooter</span>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="/vault">
                    <Package />
                    <span className="sr-only">Vault</span>
                </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="https://firebasestorage.googleapis.com/v0/b/reodywellness.firebasestorage.app/o/Untitled-4%20(14).png?alt=media&token=01417f92-30fc-4a5a-bb8a-69f3101811f0" alt="Shooter" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                            {user.uid.substring(0,2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                         <Link href="/vault">
                            <Package className="mr-2 h-4 w-4" />
                            <span>Vault & Wallet</span>
                         </Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                         <Link href="/dashboard">
                            <BarChart className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                         </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                    <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          ) : (
             <Button variant="outline" onClick={() => (window as any).location.reload() }>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
    <ShooterWhisper isOpen={isWhisperOpen} onOpenChange={setIsWhisperOpen} />
    </>
  );
}
