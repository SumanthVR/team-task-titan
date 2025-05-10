
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import TaskList from '@/components/tasks/TaskList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskStatus } from '@/types';

const TasksPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { 
    getAssignedTasks,
    getCreatedTasks,
    updateTask,
    deleteTask
  } = useTasks();
  const [activeTab, setActiveTab] = useState('assigned');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const assignedTasks = getAssignedTasks(user.id);
  const createdTasks = getCreatedTasks(user.id);

  const handleEdit = (taskId: string) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTask(taskId, { status });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks and track your progress
          </p>
        </div>
        <Button onClick={() => navigate('/tasks/create')}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <Tabs 
        defaultValue="assigned" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
          <TabsTrigger value="created">Created by Me</TabsTrigger>
        </TabsList>
        <TabsContent value="assigned" className="mt-4">
          <TaskList 
            tasks={assignedTasks} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
        <TabsContent value="created" className="mt-4">
          <TaskList 
            tasks={createdTasks} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksPage;
