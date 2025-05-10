
import { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete,
  onStatusChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityClass = (priority: TaskPriority) => {
    return `task-priority-${priority}`;
  };

  const getStatusClass = (status: TaskStatus) => {
    return `task-status-${status}`;
  };

  const isOverdue = () => {
    const today = new Date().toISOString().split('T')[0];
    return task.status !== 'done' && task.dueDate < today;
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md",
      isOverdue() ? "border-red-300" : ""
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <Badge className={getPriorityClass(task.priority)}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </Badge>
          <Badge className={getStatusClass(task.status)}>
            {task.status === 'todo' ? 'To Do' : task.status === 'in-progress' ? 'In Progress' : 'Done'}
          </Badge>
        </div>
        <CardTitle className="text-lg">{task.title}</CardTitle>
        <CardDescription className="flex items-center mt-1">
          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
          <span className={cn("text-xs", isOverdue() ? "text-red-500 font-medium" : "text-gray-500")}>
            {isOverdue() ? 'Overdue' : ''} Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className={cn(
          "text-sm text-gray-600 line-clamp-2 transition-all duration-300",
          isExpanded ? "line-clamp-none" : ""
        )}>
          {task.description}
        </p>
        {task.description.length > 100 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-xs text-purple-600 mt-1 hover:underline"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(task.id)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
        {onStatusChange && task.status !== 'done' && (
          <Button 
            size="sm" 
            variant="outline" 
            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700" 
            onClick={() => onStatusChange(task.id, 'done')}
          >
            <Check className="h-4 w-4 mr-1" />
            Complete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
