
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left side - Auth forms */}
      <div className="sm:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {showLogin ? (
            <LoginForm 
              onSuccess={() => navigate('/dashboard')}
              onRegisterClick={() => setShowLogin(false)}
            />
          ) : (
            <RegisterForm 
              onSuccess={() => navigate('/dashboard')}
              onLoginClick={() => setShowLogin(true)}
            />
          )}
        </div>
      </div>
      
      {/* Right side - Hero section */}
      <div className="sm:w-1/2 bg-gradient-to-br from-purple-500 to-blue-600 text-white flex flex-col justify-center p-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-white text-purple-600 text-xl font-bold h-10 w-10 rounded-lg flex items-center justify-center">
              TM
            </div>
            <h1 className="text-2xl font-bold">TaskMaster</h1>
          </div>
          
          <h2 className="text-4xl font-bold">Manage your team's tasks efficiently</h2>
          
          <p className="text-lg opacity-90">
            TaskMaster helps teams organize, track, and manage their work in a simple and efficient way.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-white bg-opacity-20 rounded-full p-1.5 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Task Assignment</h3>
                <p className="text-sm opacity-80">Easily assign tasks to team members</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-white bg-opacity-20 rounded-full p-1.5 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Real-time Updates</h3>
                <p className="text-sm opacity-80">Stay informed with task notifications</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-white bg-opacity-20 rounded-full p-1.5 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Progress Tracking</h3>
                <p className="text-sm opacity-80">Monitor task progress in real-time</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={() => setShowLogin(false)}
              variant="outline" 
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
