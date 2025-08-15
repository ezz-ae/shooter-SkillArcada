
"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameSettingsStore, GameStatus } from "@/lib/game-settings-store";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Gamepad2 } from "lucide-react";

export default function GamesPage() {
  const { games, toggleFeatured, setStatus, initializeGames } = useGameSettingsStore();

  useEffect(() => {
    initializeGames();
  }, [initializeGames]);

  const getStatusColor = (status: GameStatus) => {
    switch (status) {
        case 'live': return 'bg-green-500';
        case 'maintenance': return 'bg-yellow-500';
        case 'disabled': return 'bg-red-500';
    }
  }

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-black">Game Control Room</h1>
                <p className="text-muted-foreground">Manage the status and visibility of all games.</p>
            </div>
       </div>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gamepad2 /> Game Status & Features</CardTitle>
                <CardDescription>Enable, disable, or feature games across the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-lg border">
                    <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr className="border-b">
                            <th className="p-3 text-left font-semibold">Game</th>
                            <th className="p-3 text-left font-semibold">Description</th>
                            <th className="p-3 text-left font-semibold">Status</th>
                            <th className="p-3 text-center font-semibold">Is Featured</th>
                            <th className="p-3 text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {games.map((game) => (
                        <tr key={game.id} className="border-b last:border-0">
                            <td className="p-3 font-medium">{game.name}</td>
                            <td className="p-3 text-sm text-muted-foreground max-w-xs truncate">{game.description}</td>
                            <td className="p-3">
                                <Badge className="capitalize text-white" style={{ backgroundColor: getStatusColor(game.status) }}>
                                    {game.status}
                                </Badge>
                            </td>
                            <td className="p-3 text-center">
                                    <Switch
                                    checked={game.isFeatured}
                                    onCheckedChange={() => toggleFeatured(game.id)}
                                    aria-label={`Toggle featured status for ${game.name}`}
                                />
                            </td>
                            <td className="p-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => setStatus(game.id, 'live')}>Live</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setStatus(game.id, 'maintenance')}>Maintenance</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setStatus(game.id, 'disabled')} className="text-destructive focus:text-destructive">Disable</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
