
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskForm from '@/components/tasks/TaskForm';
import { useToast } from '@/components/ui/use-toast';
import { useNotifications } from '@/context/NotificationContext';

// Mock users for the demo
const MOCK_USERS = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Admin User' },
];

const CreateTaskPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { createTask } = useTasks();
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (taskData: any) => {
    createTask(taskData);
    
    // Create a notification if the task is assigned to someone else
    if (taskData.assignedToId !== user?.id) {
      addNotification({
        type: 'task_assigned',
        taskId: `task_${Date.now()}`,
        userId: taskData.assignedToId,
        isRead: false,
      });
    }
    
    toast({
      title: "Task created",
      description: "Your task has been successfully created",
    });
    
    navigate('/tasks');
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Task</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            users={MOCK_USERS}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTaskPage;
