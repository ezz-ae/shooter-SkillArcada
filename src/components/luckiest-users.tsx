
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { mockUsers } from "@/lib/user";
import { Trophy } from "lucide-react";

const luckyUsers = [
    { rank: 1, user: mockUsers[2], prize: '500 Shots' },
    { rank: 2, user: mockUsers[1], prize: '$1000 USD' },
    { rank: 3, user: mockUsers[4], prize: '100 Shots' },
];


export function LuckiestUsers() {
    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                 {luckyUsers.map(item => (
                    <div key={item.rank} className="flex items-center gap-3">
                        <div className="flex items-center justify-center font-bold text-lg w-6">
                           {item.rank === 1 ? <Trophy className="h-5 w-5 text-yellow-400"/> : item.rank}
                        </div>
                        <Avatar className="h-10 w-10 border-2 border-secondary">
                            <AvatarImage src={item.user.avatarUrl} alt={item.user.name} />
                            <AvatarFallback>{item.user.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <p className="text-sm font-semibold">{item.user.name}</p>
                            <p className="text-xs text-muted-foreground font-bold">{item.prize}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
