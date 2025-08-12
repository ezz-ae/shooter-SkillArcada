
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/lib/user";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

interface LuckiestUsersProps {
    users: User[];
}

export function LuckiestUsers({ users }: LuckiestUsersProps) {
    const [luckyUsers, setLuckyUsers] = useState<any[]>([]);

    useEffect(() => {
        if (users.length > 5) {
            setLuckyUsers([
                { rank: 1, user: users[2], prize: '500 Shots' },
                { rank: 2, user: users[1], prize: '$1000 USD' },
                { rank: 3, user: users[4], prize: '100 Shots' },
                { rank: 4, user: users[0], prize: 'iPhone 16 Pro' },
                { rank: 5, user: users[3], prize: '75 Shots' },
                { rank: 6, user: users[5], prize: '$50 USD' },
            ]);
        }
    }, [users]);
    
    if (!luckyUsers.length) {
        return (
            <Card>
                <CardContent className="p-4 text-center text-muted-foreground">
                    Loading user rankings...
                </CardContent>
            </Card>
        );
    }

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
