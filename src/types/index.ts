
export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
};

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdById: string;
  assignedToId: string;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  type: 'task_assigned' | 'task_updated' | 'task_completed';
  taskId: string;
  userId: string;
  isRead: boolean;
  createdAt: string;
};
