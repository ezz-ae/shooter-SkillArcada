
"use client";

import Link from "next/link";
import { Package, Target, BrainCircuit, Heart, Swords, Dice5, User, LogOut, LineChart, Gamepad2, ChevronDown, DoorOpen, Grid } from "lucide-react";
import { Button } from "./ui/button";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaChess } from "react-icons/fa";

export function Header() {
  const { luckshots } = useStore();
  const { isAuthenticated, user, logout, initializeAuth } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  const displayShots = isClient ? luckshots.toFixed(2) : '0.00';

  const gameNavItems = [
    { href: "/luckshots", label: "Luckshots", icon: Dice5 },
    { href: "/brainshots", label: "Brainshots", icon: BrainCircuit },
    { href: "/crypto-luck", label: "Crypto Luck", icon: LineChart },
    { href: "/pool-shot", label: "Pool Shot", icon: Swords },
    { href: "/chess", label: "Chess", icon: FaChess as any },
    { href: "/board-games", label: "Board Games", icon: Grid },
    { href: "/luckgirls", label: "Luckgirls", icon: Heart },
  ];

  const challengeNavItems = [
    { href: "/pool-shot", label: "Pool Challenges", icon: Swords },
    { href: "/chess", label: "Chess Challenges", icon: FaChess as any },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="m15 9-6 6" />
              <path d="M9 9h.01" />
              <path d="M15 15h.01" />
            </svg>
            <span className="font-bold">Luckshots</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-1">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <Gamepad2 className="h-5 w-5 mr-2" />
                    Games
                    <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {gameNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} className="flex items-center gap-2">
                           <item.icon className="h-4 w-4" />
                           {item.label}
                        </Link>
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <Swords className="h-5 w-5 mr-2" />
                    Challenges
                    <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {challengeNavItems.map((item) => (
                    <DropdownMenuItem key={item.label} asChild>
                        <Link href={item.href} className="flex items-center gap-2">
                           <item.icon className="h-4 w-4" />
                           {item.label}
                        </Link>
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isClient && isAuthenticated && user ? (
            <>
            <div className="hidden sm:flex items-center space-x-2 text-sm font-medium p-2 bg-secondary rounded-md">
                <Target className="h-5 w-5 text-accent" />
                <span>Shots: {displayShots}</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                        {/* Fallback for anonymous users or users without avatar */}
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                          {user.uid.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="font-mono hidden md:inline">{user.uid.substring(0, 6)}...</span>
                    <ChevronDown className="h-4 w-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                         <Link href="/vault">
                            <Package className="mr-2 h-4 w-4" />
                            <span>Vault</span>
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
            <Button variant="outline">
              <DoorOpen className="mr-2" />
              Sign In
            </Button>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
