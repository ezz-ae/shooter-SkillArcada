
"use client";

import { User, getUsers } from "@/lib/user";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "../data-table";
import { columns } from "../columns";
import { Users as UsersIcon } from "lucide-react";

export default function UsersPage() {
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
     <div className="space-y-8">
       <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-black">User Management</h1>
                <p className="text-muted-foreground">View and manage all registered users.</p>
            </div>
       </div>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UsersIcon /> All Users</CardTitle>
                <CardDescription>Browse and search the entire user database.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? <p>Loading users...</p> : <DataTable columns={columns} data={users} />}
            </CardContent>
        </Card>
    </div>
  );
}
