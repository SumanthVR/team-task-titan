
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const EditTaskPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const { getTaskById, updateTask } = useTasks();
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const task = taskId ? getTaskById(taskId) : undefined;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
    
    if (!task) {
      toast({
        title: "Task not found",
        description: "The requested task could not be found",
        variant: "destructive",
      });
      navigate('/tasks');
    }
  }, [isAuthenticated, navigate, task, toast]);

  const handleSubmit = (taskData: any) => {
    if (taskId) {
      const oldAssignedId = task?.assignedToId;
      updateTask(taskId, taskData);
      
      // Create a notification if the task assignment changed
      if (taskData.assignedToId !== oldAssignedId) {
        addNotification({
          type: 'task_assigned',
          taskId,
          userId: taskData.assignedToId,
          isRead: false,
        });
      }
      
      toast({
        title: "Task updated",
        description: "Your task has been successfully updated",
      });
      
      navigate('/tasks');
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  if (!user || !task) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Task</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            task={task}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            users={MOCK_USERS}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTaskPage;
