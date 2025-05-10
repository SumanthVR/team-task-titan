
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

// Mock users for the demo
const TEAM_MEMBERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Frontend Developer', avatarUrl: '', avatarFallback: 'JD' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Product Manager', avatarUrl: '', avatarFallback: 'JS' },
  { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'Team Lead', avatarUrl: '', avatarFallback: 'AU' },
];

const TeamPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { tasks } = useTasks();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const getMemberStats = (userId: string) => {
    const userTasks = tasks.filter(task => task.assignedToId === userId || task.createdById === userId);
    const totalTasks = userTasks.length;
    const completedTasks = userTasks.filter(task => task.status === 'done').length;
    const inProgressTasks = userTasks.filter(task => task.status === 'in-progress').length;
    const todoTasks = userTasks.filter(task => task.status === 'todo').length;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      completionRate,
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Members</h1>
        <p className="text-muted-foreground">
          Manage your team and track their progress
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TEAM_MEMBERS.map((member) => {
          const stats = getMemberStats(member.id);
          return (
            <Card key={member.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback className="bg-purple-200 text-purple-800">
                      {member.avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Task Completion</span>
                      <span>{stats.completionRate}%</span>
                    </div>
                    <Progress value={stats.completionRate} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-purple-50 p-2 rounded-md">
                      <p className="text-xs text-muted-foreground">Todo</p>
                      <p className="font-medium">{stats.todoTasks}</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-md">
                      <p className="text-xs text-muted-foreground">In Progress</p>
                      <p className="font-medium">{stats.inProgressTasks}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded-md">
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="font-medium">{stats.completedTasks}</p>
                    </div>
                  </div>
                  
                  <div className="pt-2 text-sm">
                    <p className="truncate">{member.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TeamPage;
