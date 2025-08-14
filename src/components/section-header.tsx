
"use client";

import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
    return (
        <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight lg:text-4xl flex items-center justify-center gap-3">
                <Icon className="h-8 w-8 text-primary"/> {title}
            </h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
            </p>
        </div>
    );
}
