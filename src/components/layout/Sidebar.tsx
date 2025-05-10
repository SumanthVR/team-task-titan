
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  Calendar,
  CheckCheck,
  Home,
  List,
  Plus,
  Search,
  Users,
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/',
  },
  {
    title: 'My Tasks',
    icon: List,
    href: '/tasks',
  },
  {
    title: 'Calendar',
    icon: Calendar,
    href: '/calendar',
  },
  {
    title: 'Team',
    icon: Users,
    href: '/team',
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <aside 
      className={cn(
        "bg-white border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-center mb-6">
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? "→" : "←"}
          </Button>
        </div>
        
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100 hover:text-purple-700",
                location.pathname === item.href
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-700"
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            to="/tasks/create"
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-all"
            )}
          >
            <Plus className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
            {!collapsed && <span>New Task</span>}
          </Link>
        </div>

        {!collapsed && (
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="flex flex-col space-y-1">
              <div className="font-medium text-sm text-gray-700">Quick Stats</div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Overdue</span>
                <span className="text-red-500 font-medium">3</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Due Today</span>
                <span className="text-yellow-500 font-medium">2</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Completed</span>
                <span className="text-green-500 font-medium">12</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
