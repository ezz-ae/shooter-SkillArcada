
"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameLinkCardProps {
    href: string;
    icon: LucideIcon;
    label: string;
    description: string;
    className?: string;
}

export function GameLinkCard({ href, icon: Icon, label, description, className }: GameLinkCardProps) {
    return (
        <Link href={href} className={cn("group", className)}>
            <Card className="hover:bg-secondary/50 transition-colors h-full">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-8 w-8 text-primary"/>
                    </div>
                    <div className="flex-grow">
                        <CardTitle className="text-xl">{label}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardHeader>
            </Card>
        </Link>
    );
}
