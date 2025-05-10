
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import TaskCard from '@/components/tasks/TaskCard';
import DashboardStats from '@/components/dashboard/DashboardStats';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { 
    getUserTasks, 
    getAssignedTasks,
    getCreatedTasks,
    getOverdueTasks,
    updateTask,
    deleteTask
  } = useTasks();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const userTasks = getUserTasks(user.id);
  const assignedTasks = getAssignedTasks(user.id);
  const createdTasks = getCreatedTasks(user.id);
  const overdueTasks = getOverdueTasks(user.id);

  const handleEdit = (taskId: string) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleStatusChange = (taskId: string, status: 'done') => {
    updateTask(taskId, { status });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>
      </div>

      <DashboardStats tasks={userTasks} />

      <div className="space-y-6">
        {overdueTasks.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-red-600">Overdue Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {overdueTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold mb-4">Tasks Assigned to You</h2>
          {assignedTasks.length === 0 ? (
            <p className="text-gray-500">You don't have any assigned tasks.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedTasks.slice(0, 3).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Tasks Created by You</h2>
          {createdTasks.length === 0 ? (
            <p className="text-gray-500">You haven't created any tasks yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdTasks.slice(0, 3).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
