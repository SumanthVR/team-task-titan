
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from '../components/ui/use-toast';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
  getUserTasks: (userId: string) => Task[];
  getAssignedTasks: (userId: string) => Task[];
  getCreatedTasks: (userId: string) => Task[];
  getOverdueTasks: (userId: string) => Task[];
  searchTasks: (query: string, filters?: { status?: TaskStatus; priority?: TaskPriority; dueDate?: string }) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const generateMockTasks = (userId: string): Task[] => {
  const baseDate = new Date();
  const yesterday = new Date(baseDate);
  yesterday.setDate(baseDate.getDate() - 1);
  
  const tomorrow = new Date(baseDate);
  tomorrow.setDate(baseDate.getDate() + 1);
  
  const nextWeek = new Date(baseDate);
  nextWeek.setDate(baseDate.getDate() + 7);

  return [
    {
      id: '1',
      title: 'Complete project documentation',
      description: 'Write detailed documentation for the new API endpoints',
      dueDate: tomorrow.toISOString().split('T')[0],
      priority: 'high',
      status: 'todo',
      createdById: userId,
      assignedToId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Review pull requests',
      description: 'Review and approve team pull requests for the backend module',
      dueDate: nextWeek.toISOString().split('T')[0],
      priority: 'medium',
      status: 'todo',
      createdById: userId,
      assignedToId: '2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Fix login bug',
      description: 'Investigate and fix the authentication issue reported by QA team',
      dueDate: yesterday.toISOString().split('T')[0],
      priority: 'high',
      status: 'in-progress',
      createdById: '2',
      assignedToId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Update dependencies',
      description: 'Update project dependencies to latest versions',
      dueDate: tomorrow.toISOString().split('T')[0],
      priority: 'low',
      status: 'done',
      createdById: userId,
      assignedToId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Create presentation for client meeting',
      description: 'Prepare slides for the upcoming client demo',
      dueDate: yesterday.toISOString().split('T')[0],
      priority: 'medium',
      status: 'todo',
      createdById: '3',
      assignedToId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // In a real app, this would be an API call to fetch tasks
      const storedTasks = localStorage.getItem('taskapp_tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        const mockTasks = generateMockTasks(user.id);
        setTasks(mockTasks);
        localStorage.setItem('taskapp_tasks', JSON.stringify(mockTasks));
      }
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user && tasks.length > 0) {
      localStorage.setItem('taskapp_tasks', JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    // Show notification
    toast({
      title: "Task created",
      description: "Your task has been successfully created",
    });

    // If the task is assigned to someone else, show notification
    if (user && taskData.assignedToId !== user.id) {
      // In a real app, this would create a notification in the database
      console.log(`Task ${newTask.title} assigned to user ${taskData.assignedToId}`);
    }
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        return prevTasks;
      }
      
      const oldTask = prevTasks[taskIndex];
      const updatedTask = {
        ...oldTask,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      const newTasks = [...prevTasks];
      newTasks[taskIndex] = updatedTask;
      
      // Check if assignment changed
      if (updates.assignedToId && updates.assignedToId !== oldTask.assignedToId) {
        toast({
          title: "Task assigned",
          description: `Task "${updatedTask.title}" has been assigned`,
        });
        
        // In a real app, this would create a notification in the database
        console.log(`Task ${updatedTask.title} reassigned to user ${updates.assignedToId}`);
      }
      
      return newTasks;
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "The task has been successfully deleted",
    });
  };

  const getTaskById = (taskId: string) => {
    return tasks.find(task => task.id === taskId);
  };

  const getUserTasks = (userId: string) => {
    return tasks.filter(task => 
      task.assignedToId === userId || task.createdById === userId
    );
  };

  const getAssignedTasks = (userId: string) => {
    return tasks.filter(task => task.assignedToId === userId);
  };

  const getCreatedTasks = (userId: string) => {
    return tasks.filter(task => task.createdById === userId);
  };

  const getOverdueTasks = (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => 
      (task.assignedToId === userId || task.createdById === userId) &&
      task.dueDate < today &&
      task.status !== 'done'
    );
  };

  const searchTasks = (query: string, filters?: { status?: TaskStatus; priority?: TaskPriority; dueDate?: string }) => {
    let filteredTasks = [...tasks];
    
    // Apply search
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(lowerQuery) || 
        task.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply filters
    if (filters) {
      if (filters.status) {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status);
      }
      
      if (filters.priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
      }
      
      if (filters.dueDate) {
        filteredTasks = filteredTasks.filter(task => task.dueDate === filters.dueDate);
      }
    }
    
    return filteredTasks;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        createTask,
        updateTask,
        deleteTask,
        getTaskById,
        getUserTasks,
        getAssignedTasks,
        getCreatedTasks,
        getOverdueTasks,
        searchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
