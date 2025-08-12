
"use client";

import Link from "next/link";
import { Package, Target, BrainCircuit, Heart, Swords, Dice5, User as UserIcon, LogIn, LogOut } from "lucide-react";
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
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";


export function Header() {
  const { vault, luckshots } = useStore();
  const { isAuthenticated, user, logout, setIsLoggingIn } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const vaultItemCount = isClient ? vault.length : 0;
  const displayShots = isClient ? luckshots : 0;

  const navItems = [
    { href: "/luckshots", label: "Luckshots", icon: Dice5 },
    { href: "/brainshots", label: "Brainshots", icon: BrainCircuit },
    { href: "/pool-shot", label: "Pool Shot", icon: Swords },
    { href: "/luckgirls", label: "Luckgirls", icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
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
          <nav className="hidden md:flex items-center space-x-2">
             {navItems.map((item) => (
                <Button key={item.href} variant={pathname.startsWith(item.href) ? "secondary" : "ghost"} asChild>
                    <Link href={item.href} className="flex items-center">
                       <item.icon className="h-5 w-5 mr-2" />
                       {item.label}
                    </Link>
                </Button>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isAuthenticated && user && (
            <>
            <div className="hidden sm:flex items-center space-x-2 text-sm font-medium p-2 bg-secondary rounded-md">
                <Target className="h-5 w-5 text-accent" />
                <span>Luckshots: {displayShots}</span>
            </div>
            <Button variant="outline" asChild>
                <Link href="/vault" className="relative">
                <Package className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Vault</span> ({vaultItemCount})
                </Link>
            </Button>
            </>
          )}

          {isClient && isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                          {user.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="font-mono">{user.luckyNumber}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button onClick={() => setIsLoggingIn(true)}>
                <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

