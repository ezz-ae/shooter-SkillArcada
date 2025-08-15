
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Bot, GripVertical, Plus, UserCircle } from "lucide-react";

type User = {
    id: string;
    name: string;
    avatar: string;
    role: 'Admin' | 'Manager' | 'AI';
};

type Task = {
    id: string;
    title: string;
    assignee: User;
    status: 'To Do' | 'In Progress' | 'Done';
    dueDate: string;
};

const team: User[] = [
    { id: 'admin', name: 'Admin', avatar: '/avatars/admin.png', role: 'Admin' },
    { id: 'manager1', name: 'QuantumQueen', avatar: 'https://i.pravatar.cc/100?u=user4', role: 'Manager' },
    { id: 'shooter-ai', name: 'Shooter AI', avatar: '/logos/shooter-icon.png', role: 'AI' }
];

const initialTasks: Task[] = [
    { id: 'task1', title: 'Review Q3 engagement metrics for Pool Shot', assignee: team[1], status: 'In Progress', dueDate: '2024-08-15' },
    { id: 'task2', title: 'Draft proposal for new "AI Adventure" game prizes', assignee: team[0], status: 'To Do', dueDate: '2024-08-10' },
    { id: 'task3', title: 'Analyze user drop-off in the "Crypto Luck" game and suggest improvements', assignee: team[2], status: 'To Do', dueDate: '2024-08-12' },
    { id: 'task4', title: 'Finalize the design for the new "Luckgirls" social feature', assignee: team[1], status: 'Done', dueDate: '2024-07-30' },
];

const TaskCard = ({ task }: { task: Task }) => (
    <Card className="p-3 mb-2 bg-secondary">
        <p className="font-semibold text-sm mb-2">{task.title}</p>
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assignee.avatar} />
                    <AvatarFallback>{task.assignee.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{task.dueDate}</span>
        </div>
    </Card>
);

export function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    
    // Add logic for creating/moving tasks here

    return (
        <Card>
            <CardHeader>
                <CardTitle>Internal Task Manager</CardTitle>
                <CardDescription>Coordinate with your team and the Shooter AI.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-6">
                {/* Create Task Form */}
                <div className="md:col-span-1 space-y-4 p-4 bg-secondary rounded-lg">
                    <h3 className="font-bold">New Task</h3>
                    <Input placeholder="Task Title" />
                    <Textarea placeholder="Description..." />
                    <Select>
                        <SelectTrigger><SelectValue placeholder="Assign To..." /></SelectTrigger>
                        <SelectContent>
                            {team.map(member => (
                                <SelectItem key={member.id} value={member.id}>
                                    <div className="flex items-center gap-2">
                                        {member.role === 'AI' ? <Bot className="h-4 w-4" /> : <UserCircle className="h-4 w-4" />}
                                        {member.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input type="date" />
                    <Button className="w-full"><Plus className="mr-2 h-4 w-4" /> Add Task</Button>
                </div>

                {/* Task Columns */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['To Do', 'In Progress', 'Done'].map(status => (
                        <div key={status} className="p-3 bg-muted/50 rounded-lg">
                            <h3 className="font-bold mb-3">{status}</h3>
                            <div className="min-h-[200px]">
                                {tasks
                                    .filter(task => task.status === status)
                                    .map(task => <TaskCard key={task.id} task={task} />)
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
