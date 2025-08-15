
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceTable } from "@/components/performance-table";
import { Lightbulb, TrendingUp } from "lucide-react";
import { GamePerformanceData, mockPerformanceData } from "@/lib/performance-data";

export default function PerformancePage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-black">Game Performance Graphs</h1>
        <p className="text-muted-foreground">A master view of all game analytics and live statuses.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">All Systems Nominal</div>
              <p className="text-xs text-muted-foreground">
                All games are live and performing within expected parameters.
              </p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Highest Profit Game</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Crypto Luck</div>
              <p className="text-xs text-muted-foreground">
                +$1,204 profit in the last 24 hours.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shooter's Suggestion</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Boost 'Pool Shot'</div>
              <p className="text-xs text-muted-foreground">
                High engagement but low monetization. Consider a tournament.
              </p>
            </CardContent>
          </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Live Game Analytics</CardTitle>
            <CardDescription>An ongoing script collects this data and sends it to Shooter and admins.</CardDescription>
        </CardHeader>
        <CardContent>
            <PerformanceTable data={mockPerformanceData} />
        </CardContent>
      </Card>
    </div>
  );
}
