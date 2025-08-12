
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { mockUsers } from "@/lib/user";
import { cn } from "@/lib/utils";
import { Award, DollarSign, Gift } from "lucide-react";

const mockActivities = [
    { id: 1, user: mockUsers[0], action: 'won', details: '40 Shots', time: '2m ago' },
    { id: 2, user: mockUsers[1], action: 'redeemed', details: '$1000 USD', time: '5m ago', highlight: true },
    { id: 3, user: mockUsers[2], action: 'won', details: '500 Shots', time: '12m ago' },
    { id: 4, user: mockUsers[3], action: 'traded', details: 'for 20 Luckshots', time: '25m ago' },
    { id: 5, user: mockUsers[4], action: 'won', details: '100 Shots', time: '45m ago' },
    { id: 6, user: mockUsers[5], action: 'redeemed', details: '$50 USD', time: '1h ago' },
];

const actionIcons = {
    'won': <Award className="h-4 w-4 text-accent" />,
    'redeemed': <DollarSign className="h-4 w-4 text-green-500" />,
    'traded': <Gift className="h-4 w-4 text-primary" />,
}

export function ActivityFeed() {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="divide-y">
                    {mockActivities.map(activity => (
                        <div key={activity.id} className={cn(
                            "flex items-center gap-3 p-3 transition-colors",
                            (activity as any).highlight && "bg-primary/10 border-l-4 border-primary"
                            )}>
                            <Avatar className="h-10 w-10 border-2 border-secondary">
                                <AvatarImage src={activity.user.avatarUrl} alt={activity.user.name} />
                                <AvatarFallback>{activity.user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <p className="text-sm">
                                    <span className="font-semibold">{activity.user.name}</span>
                                    {` ${activity.action} `}
                                    <span className="font-bold">{activity.details}</span>
                                </p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                            {actionIcons[activity.action as keyof typeof actionIcons]}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
