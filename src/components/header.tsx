
"use client";

import Link from "next/link";
import { Package, BrainCircuit, Heart, Swords, User, LogOut, BookOpen, Sparkles, LineChart } from "lucide-react";
import { Button } from "./ui/button";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
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
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";

export function Header() {
  const { shots } = useStore();
  const { isAuthenticated, user, logout, initializeAuth } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  const displayShots = isClient && typeof shots === 'number' ? shots.toFixed(2) : '0.00';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">ShoterShots</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-1">
             <Button variant="ghost" asChild>
                <Link href="/luckshots">Luckshots</Link>
             </Button>
             <Button variant="ghost" asChild>
                <Link href="/brainshots">Brainshots</Link>
             </Button>
              <Button variant="ghost" asChild>
                <Link href="/crypto-luck">Crypto Luck</Link>
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
            <div className="hidden sm:flex items-center space-x-2 text-sm font-medium p-2 bg-secondary rounded-md">
                <span>Shots: {displayShots}</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                          {user.uid.substring(0, 2).toUpperCase()}
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
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
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
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
