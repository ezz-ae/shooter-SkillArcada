
"use client";

import Link from "next/link";
import { Package, User, LogOut, MessageSquare, BarChart, Swords, Dices, LineChart, BrainCircuit, BookOpen, Flame, ShoppingCart, Shield, Heart, Repeat, Menu } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ShooterWhisper } from "./shooter-whisper";
import { ThemeToggle } from "./theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinks = [
    { href: "/shoterday", label: "Shoterday" },
    { href: "/luckshots", label: "ShooterGuns" },
    { href: "/luckgirls", label: "Luckgirls" },
    { href: "/hit-or-miss", label: "Hit or Miss" },
    { href: "/shop-hunter", label: "Shop Hunter" },
    { href: "/puzzle-games", label: "Puzzle Games" },
    { href: "/pool-shot", label: "Pool Shot" },
    { href: "/chess", label: "Chess" },
    { href: "/ai-adventure", label: "AI Adventure" },
    { href: "/shots-hub", label: "Shots Hub" },
    { href: "/learning-center", label: "Learning Center" },
];

export function Header() {
  const { isAuthenticated, user, logout, initializeAuth } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [isWhisperOpen, setIsWhisperOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsClient(true);
    // This is a mock auth initialization
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  const renderNavLinks = (isMobileLayout = false) => (
    <nav className={isMobileLayout ? "flex flex-col gap-2" : "hidden md:flex items-center space-x-1"}>
      {navLinks.map((link) => (
        isMobileLayout ? (
          <SheetClose asChild key={link.href}>
            <Button variant="ghost" className="justify-start text-lg" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          </SheetClose>
        ) : (
          <Button variant="ghost" asChild key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </Button>
        )
      ))}
    </nav>
  );

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-lilita text-4xl shimmer-text">ShooterGun</span>
          </Link>
          {!isMobile && renderNavLinks(false)}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isClient && isAuthenticated && user ? (
            <>
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu />
                    <span className="sr-only">Open Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-sm">
                   <div className="p-4">
                     {renderNavLinks(true)}
                   </div>
                </SheetContent>
              </Sheet>
            )}
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
                        <AvatarImage src="https://firebasestorage.googleapis.com/v0/b/reodywellness.firebasestorage.app/o/Untitled-4%20(14).png?alt=media&amp;token=01417f92-30fc-4a5a-bb8a-69f3101811f0" alt="Shooter" />
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
                            <span>Vault &amp; Wallet</span>
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
