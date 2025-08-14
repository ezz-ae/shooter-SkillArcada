
"use client";

import { User, getUsers } from "@/lib/user";
import { BarChart, Bot, Gamepad2, Settings, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AdminAIAgent } from "@/components/admin-ai-agent";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        const allUsers = await getUsers();
        setUsers(allUsers);
        setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-black">Admin Command Center</h1>
                <p className="text-muted-foreground">Manage and monitor the ShooterGun platform.</p>
            </div>
       </div>

       <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview"><BarChart className="mr-2 h-4 w-4"/>Overview</TabsTrigger>
                <TabsTrigger value="users"><Users className="mr-2 h-4 w-4"/>User Management</TabsTrigger>
                <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4"/>Platform Settings</TabsTrigger>
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
                        <StatCard title="Total Revenue (Mock)" value="$12,450" icon={BarChart} />
                        <StatCard title="Active Games" value="15" icon={Gamepad2} />
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

            <TabsContent value="settings" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Platform Settings</CardTitle>
                        <CardDescription>Control global game settings and platform features.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-4 p-4 border rounded-lg">
                            <h3 className="text-lg font-semibold">Game Availability</h3>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="crypto-luck-switch">Crypto Luck Game</Label>
                                <Switch id="crypto-luck-switch" defaultChecked/>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="pool-shot-switch">Pool Shot Challenges</Label>
                                <Switch id="pool-shot-switch" defaultChecked/>
                            </div>
                             <div className="flex items-center justify-between">
                                <Label htmlFor="luckgirls-switch">Luckgirls Games</Label>
                                <Switch id="luckgirls-switch" />
                            </div>
                        </div>
                        <div className="space-y-4 p-4 border rounded-lg">
                            <h3 className="text-lg font-semibold">Global Modifiers</h3>
                             <div className="flex items-center justify-between">
                                <Label htmlFor="prize-multiplier">Global Prize Multiplier</Label>
                                <p className="text-sm text-muted-foreground">Set to 1.0x (Normal)</p>
                            </div>
                            <Button variant="outline">Adjust Multiplier</Button>
                        </div>
                         <div className="flex justify-end gap-2 mt-4">
                            <Button variant="destructive">Discard Changes</Button>
                            <Button>Save Settings</Button>
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
