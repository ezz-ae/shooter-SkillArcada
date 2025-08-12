
"use client";

import Link from "next/link";
import { Package, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";

export function Header() {
  const { vault, walletBalance } = useStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const vaultItemCount = isClient ? vault.length : 0;
  const displayBalance = isClient ? walletBalance.toFixed(2) : "0.00";

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
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center space-x-2 text-sm font-medium p-2 bg-secondary rounded-md">
            <Wallet className="h-5 w-5 text-primary" />
            <span>Wallet: ${displayBalance}</span>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/vault" className="relative flex items-center space-x-2 text-sm font-medium p-2 bg-secondary rounded-md">
              <Package className="h-5 w-5" />
              <span>Vault ({vaultItemCount})</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
