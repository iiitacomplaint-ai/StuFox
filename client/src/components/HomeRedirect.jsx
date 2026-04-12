/**
 * HomeRedirect Component
 * UPDATED: Converted from crime reporting to college complaint system
 * UPDATED: Changed role names (citizen→user, police→worker)
 * UPDATED: Updated dashboard routes to match complaint system
 * UPDATED: Changed landing page route
 * 
 * @description Redirects authenticated users to their respective dashboards based on role
 * @version 2.0.0 (Updated for complaint management)
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole, isValidToken } from '../utils/utils';

const HomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isValidToken()) {
      const role = getRole();
      switch (role) {
        case 'admin':
          navigate('/admindashboard', { replace: true });
          break;
        case 'user':
          navigate('/user/dashboard', { replace: true });
          break;
        case 'worker':
          navigate('/worker/dashboard', { replace: true });
          break;
        default:
          // If no valid role, remove token and redirect to landing page
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/landingpage', { replace: true });
      }
    } else {
      // No token, go to landing page
      navigate('/landingpage', { replace: true });
    }
  }, [navigate]);

  // Show loading spinner while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default HomeRedirect;