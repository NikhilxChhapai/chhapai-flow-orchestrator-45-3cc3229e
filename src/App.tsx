
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./providers/ThemeProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateOrder from "./pages/CreateOrder";
import OrderDetails from "./pages/OrderDetails";
import Approvals from "./pages/Approvals";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Departments from "./pages/Departments";
import Users from "./pages/Users";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import Orders from "./pages/Orders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/orders" element={<Orders />} />
                  
                  {/* Orders routes */}
                  <Route path="/order/:orderId" element={<OrderDetails />} />
                  
                  {/* Routes for Admin and Sales only */}
                  <Route element={<ProtectedRoute requiredRoles={["admin", "sales"]} />}>
                    <Route path="/orders/create" element={<CreateOrder />} />
                    <Route path="/approvals" element={<Approvals />} />
                    {/* Add other routes that require admin/sales role */}
                  </Route>
                  
                  {/* Routes for Admin only */}
                  <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
                    <Route path="/departments" element={<Departments />} />
                    <Route path="/users" element={<Users />} />
                  </Route>
                </Route>
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
