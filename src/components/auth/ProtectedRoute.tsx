
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  requiredRoles?: string[];
}

const ProtectedRoute = ({ requiredRoles }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();
  
  // If authentication is still loading, you could show a loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If user is not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // If specific roles are required and the user doesn't have one of them, redirect to dashboard
  if (requiredRoles && !requiredRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated and has the required role, render the outlet
  return <Outlet />;
};

export default ProtectedRoute;
