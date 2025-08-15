
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskManager } from "@/components/task-manager";
import { Users } from "lucide-react";

export default function ManagersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black">Manager & Task Dashboard</h1>
        <p className="text-muted-foreground">Oversee your team, assign tasks, and communicate with Shooter.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users /> Team Management</CardTitle>
          <CardDescription>Promote users to managers and oversee team activities.</CardDescription>
        </CardHeader>
        <CardContent>
            {/* In a real app, a table of users with a "Promote" button would go here */}
            <div className="p-8 text-center border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">User promotion functionality coming soon.</p>
            </div>
        </CardContent>
      </Card>
      
      <TaskManager />
      
    </div>
  );
}
