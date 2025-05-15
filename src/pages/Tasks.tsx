
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Clock, Filter, Plus, Search } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string;
}

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Review Q2 sales report",
      description: "Analyze Q2 sales data and prepare summary for management.",
      completed: false,
      priority: "high",
      dueDate: "2025-05-20",
      assignedTo: "John Doe"
    },
    {
      id: 2,
      title: "Update inventory system",
      description: "Update the inventory tracking system with new products.",
      completed: true,
      priority: "medium",
      dueDate: "2025-05-10",
      assignedTo: "Jane Smith"
    },
    {
      id: 3,
      title: "Client meeting preparation",
      description: "Prepare presentation and materials for the client meeting.",
      completed: false,
      priority: "high",
      dueDate: "2025-05-18",
      assignedTo: "John Doe"
    },
    {
      id: 4,
      title: "Staff training session",
      description: "Conduct training session on new ordering procedures.",
      completed: false,
      priority: "medium",
      dueDate: "2025-05-25",
      assignedTo: "Jane Smith"
    },
    {
      id: 5,
      title: "Update website content",
      description: "Update product descriptions and pricing on the website.",
      completed: false,
      priority: "low",
      dueDate: "2025-05-30",
      assignedTo: "John Doe"
    }
  ]);

  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    completed: false,
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const toggleTaskStatus = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const addTask = () => {
    const id = Math.max(0, ...tasks.map(t => t.id)) + 1;
    setTasks([...tasks, { ...newTask, id }]);
    setNewTask({
      title: '',
      description: '',
      completed: false,
      priority: 'medium',
      dueDate: '',
      assignedTo: ''
    });
  };
  
  const filteredTasks = tasks
    .filter(task => showCompleted || !task.completed)
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track your team's tasks.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus size={16} />
              <span>New Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select 
                    id="priority" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input 
                    id="dueDate" 
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input 
                  id="assignedTo" 
                  placeholder="Enter assignee name"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and filter section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="show-completed" 
              checked={showCompleted} 
              onCheckedChange={(checked) => setShowCompleted(!!checked)} 
            />
            <label
              htmlFor="show-completed"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show Completed Tasks
            </label>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No tasks found. Create a new task to get started.
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className={`transition-opacity ${task.completed ? "opacity-60" : ""}`}>
              <CardContent className="p-0">
                <div className="flex items-start p-4 md:p-6">
                  <Checkbox 
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskStatus(task.id)}
                    className="mt-1"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                      <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={priorityColors[task.priority]}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(task.dueDate)}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Assigned to: {task.assignedTo}
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-xs" 
                            onClick={() => setSelectedTask(task)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          {selectedTask && (
                            <>
                              <DialogHeader>
                                <div className="flex items-center justify-between">
                                  <DialogTitle>{selectedTask.title}</DialogTitle>
                                  <Badge className={priorityColors[selectedTask.priority]}>
                                    {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                                  </Badge>
                                </div>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Description</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedTask.description}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">Due Date</h4>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Clock className="h-3.5 w-3.5" />
                                      {formatDate(selectedTask.dueDate)}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">Assigned To</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedTask.assignedTo}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="task-status"
                                    checked={selectedTask.completed}
                                    onCheckedChange={() => {
                                      toggleTaskStatus(selectedTask.id);
                                      setSelectedTask({
                                        ...selectedTask,
                                        completed: !selectedTask.completed
                                      });
                                    }}
                                  />
                                  <label
                                    htmlFor="task-status"
                                    className="text-sm font-medium leading-none"
                                  >
                                    Mark as {selectedTask.completed ? "incomplete" : "complete"}
                                  </label>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  variant={selectedTask.completed ? "secondary" : "default"}
                                  onClick={() => {
                                    toggleTaskStatus(selectedTask.id);
                                    setSelectedTask({
                                      ...selectedTask,
                                      completed: !selectedTask.completed
                                    });
                                  }}
                                >
                                  {selectedTask.completed ? "Mark as Incomplete" : "Mark as Complete"}
                                </Button>
                              </DialogFooter>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
