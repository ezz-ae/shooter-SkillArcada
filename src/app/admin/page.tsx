
"use client";

import { User, getUsers } from "@/lib/user";
import { Bot, Gamepad2, Settings, Users, BarChart3, List, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { AdminAIAgent } from "@/components/admin-ai-agent";
import { useGameSettingsStore, Game, GameStatus } from "@/lib/game-settings-store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { games, toggleFeatured, setStatus, initializeGames } = useGameSettingsStore();

  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        initializeGames(); // Ensure games are loaded dynamically
        const allUsers = await getUsers();
        setUsers(allUsers);
        setLoading(false);
    }
    fetchData();
  }, [initializeGames]);

  const getStatusColor = (status: GameStatus) => {
    switch (status) {
        case 'live': return 'bg-green-500';
        case 'maintenance': return 'bg-yellow-500';
        case 'disabled': return 'bg-red-500';
    }
  }

  return (
    <div className="h-full">
       <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-black">Admin Command Center</h1>
                <p className="text-muted-foreground">Manage and monitor the ShooterGun platform.</p>
            </div>
       </div>

       <Tabs defaultValue="overview" className="h-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview"><BarChart3 className="mr-2 h-4 w-4"/>Overview</TabsTrigger>
                <TabsTrigger value="users"><Users className="mr-2 h-4 w-4"/>User Management</TabsTrigger>
                <TabsTrigger value="games"><Gamepad2 className="mr-2 h-4 w-4"/>Game Control Room</TabsTrigger>
                <TabsTrigger value="ai-agent"><Bot className="mr-2 h-4 w-4"/>Shooter AI Agent</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Platform At a Glance</CardTitle>
                        <CardDescription>Key metrics for the entire platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Total Users" value={users.length} icon={Users} />
                        <StatCard title="Total Revenue (Mock)" value="$12,450" icon={BarChart3} />
                        <StatCard title="Active Games" value={games.filter(g => g.status === 'live').length} icon={Gamepad2} />
                        <StatCard title="AI Interactions (24h)" value="1,832" icon={Bot} />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>View and manage all registered users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? <p>Loading users...</p> : <DataTable columns={columns} data={users} />}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="games" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Game Control Room</CardTitle>
                        <CardDescription>Manage the status and visibility of all games on the platform.</CardDescription>
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
            </TabsContent>

            <TabsContent value="ai-agent" className="mt-6">
                <AdminAIAgent />
            </TabsContent>
       </Tabs>
    </div>
  );
}
