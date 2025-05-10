
import { useMemo } from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  trendValue?: number;
  trendDirection?: 'up' | 'down' | 'neutral';
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trendValue,
  trendDirection,
  className,
}) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trendValue !== undefined && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs font-medium",
                trendDirection === 'up' ? "text-green-600" : trendDirection === 'down' ? "text-red-600" : "text-gray-600"
              )}
            >
              {trendValue}% {trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : ''}
            </span>
            <span className="text-xs text-muted-foreground ml-1">vs last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  tasks: Task[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ tasks }) => {
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const today = new Date().toISOString().split('T')[0];
    
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    
    const overdueTasks = tasks.filter(t => 
      t.status !== 'done' && t.dueDate < today
    ).length;
    
    const dueTodayTasks = tasks.filter(t => 
      t.status !== 'done' && t.dueDate === today
    ).length;

    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      dueTodayTasks,
      completionRate,
    };
  }, [tasks]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Tasks"
        value={stats.totalTasks}
        description="All active and completed tasks"
        trendValue={5}
        trendDirection="up"
      />
      <StatsCard
        title="Completed Tasks"
        value={stats.completedTasks}
        description={`${stats.completionRate}% completion rate`}
        trendValue={2}
        trendDirection="up"
      />
      <StatsCard
        title="In Progress"
        value={stats.inProgressTasks}
        className="border-blue-200"
      />
      <StatsCard
        title="To Do"
        value={stats.todoTasks}
      />
      
      <div className="md:col-span-2 lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Task Progress Overview</CardTitle>
            <CardDescription>
              Track your team's task completion metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <div>To Do</div>
                <div className="text-muted-foreground">{stats.todoTasks} tasks</div>
              </div>
              <Progress value={stats.totalTasks > 0 ? (stats.todoTasks / stats.totalTasks) * 100 : 0} className="h-2 bg-gray-200" />
              
              <div className="flex justify-between text-sm">
                <div>In Progress</div>
                <div className="text-muted-foreground">{stats.inProgressTasks} tasks</div>
              </div>
              <Progress value={stats.totalTasks > 0 ? (stats.inProgressTasks / stats.totalTasks) * 100 : 0} className="h-2 bg-gray-200" />
              
              <div className="flex justify-between text-sm">
                <div>Completed</div>
                <div className="text-muted-foreground">{stats.completedTasks} tasks</div>
              </div>
              <Progress value={stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0} className="h-2 bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex flex-col p-4 bg-red-50 rounded-lg border border-red-100">
                <span className="text-sm text-muted-foreground">Overdue Tasks</span>
                <span className="text-2xl font-bold text-red-600">{stats.overdueTasks}</span>
              </div>
              <div className="flex flex-col p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <span className="text-sm text-muted-foreground">Due Today</span>
                <span className="text-2xl font-bold text-yellow-600">{stats.dueTodayTasks}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;
