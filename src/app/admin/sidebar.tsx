
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Gamepad2, Settings, Users, Bot, Shield, Home, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const adminNavItems = [
    { name: "Overview", href: "/admin", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Managers", href: "/admin/managers", icon: Users },
    { name: "Games", href: "/admin/games", icon: Gamepad2 },
    { name: "Performance", href: "/admin/performance", icon: TrendingUp },
    { name: "AI Agent", href: "/admin/ai-agent", icon: Bot },
]

export function AdminSidebar() {
    const pathname = usePathname();

    const isLinkActive = (href: string) => {
        // Exact match for overview page
        if (href === "/admin") {
            return pathname === href;
        }
        // Starts-with match for other pages
        return pathname.startsWith(href);
    };

    return (
        <aside className="w-64 flex-col border-r bg-background p-4 hidden md:flex">
            <div className="mb-8">
                <Link href="/admin" className="flex items-center gap-2">
                    <Shield className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold">Admin Panel</span>
                </Link>
            </div>
            <nav className="flex flex-col gap-2">
                {adminNavItems.map((item) => (
                    <Button 
                        key={item.name}
                        asChild
                        variant={isLinkActive(item.href) ? "secondary" : "ghost"}
                        className="justify-start"
                    >
                        <Link href={item.href}>
                           <item.icon className="mr-2 h-4 w-4" />
                           {item.name}
                        </Link>
                    </Button>
                ))}
            </nav>
            <div className="mt-auto">
                 <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4"/>
                        Back to Site
                    </Link>
                </Button>
            </div>
        </aside>
    )
}
