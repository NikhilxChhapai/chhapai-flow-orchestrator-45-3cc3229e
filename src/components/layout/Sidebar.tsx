
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar as SidebarComponent } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  Users, 
  BarChart2, 
  Settings, 
  Building2, 
  User, 
  ShieldAlert, 
  Inbox,
  Clock
} from "lucide-react";
import AdminAccessDropdown from "./AdminAccessDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

// Import logo images
const logoFull = "/logo-full.png"; // Path to your full logo
const logoIcon = "/logo-icon.png"; // Path to your icon-only logo (for collapsed state)

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({
  collapsed,
  setCollapsed
}: SidebarProps) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState<string>("admin"); // Will come from auth context
  const [pendingTasks, setPendingTasks] = useState<number>(5); // Mock data - would come from API

  // Get user role from auth context
  useEffect(() => {
    if (currentUser && currentUser.role) {
      setUserRole(currentUser.role);
    }
  }, [currentUser]);

  // Check if the current path matches the given path
  const isActive = (path: string) => location.pathname === path;
  
  // Check if path starts with the given prefix
  const isActivePrefix = (prefix: string) => location.pathname.startsWith(prefix);

  // Check if admin
  const isAdmin = userRole === "admin";
  const isSales = userRole === "sales" || userRole === "admin";

  // Department-specific colors
  const getDeptColor = (dept: string) => {
    switch(dept.toLowerCase()) {
      case 'design': return 'text-blue-600 hover:text-blue-800';
      case 'prepress': return 'text-purple-600 hover:text-purple-800';
      case 'production': return 'text-amber-600 hover:text-amber-800';
      case 'sales': return 'text-green-600 hover:text-green-800';
      default: return '';
    }
  };

  return (
    <aside className={cn("min-h-screen border-r bg-background transition-all duration-300 ease-in-out", collapsed ? "w-[80px]" : "w-[250px]")}>
      <div className="flex h-full flex-col">
        {/* Sidebar header with logo */}
        <div className={cn("flex h-16 items-center border-b px-4", collapsed ? "justify-center" : "justify-between")}>
          {/* Logo area - shows appropriate logo based on sidebar state */}
          <div className="flex items-center">
            {collapsed ? (
              <img src={logoIcon || "/logo-icon.png"} alt="Logo" className="h-8 w-8" />
            ) : (
              <img src={logoFull || "/logo-full.png"} alt="Chhapai" className="h-8" />
            )}
            {!collapsed && <span className="ml-2 text-xl font-semibold">Chhapai</span>}
          </div>
          
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
            {collapsed ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M9 3h6v11h2v-4l5 5-5 5v-4h-2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
                <path d="M3 3h6v2H3z" />
                <path d="M3 19h6v2H3z" />
              </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M15 3h6v11h-6z" />
                <path d="M9 3h6v11h2v-4l5 5-5 5v-4h-2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
                <path d="M3 3h6v2H3z" />
                <path d="M3 19h6v2H3z" />
              </svg>}
          </Button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-auto p-3">
          <ul className="space-y-1">
            {/* Dashboard */}
            <li>
              <Link to="/dashboard" className={cn("flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors", 
                isActive("/dashboard") 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                <div className="flex items-center">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  {!collapsed && <span>Dashboard</span>}
                </div>
              </Link>
            </li>

            {/* Orders with badge showing new orders */}
            <li>
              <Link to="/orders" className={cn("flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors", 
                isActivePrefix("/order") 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                <div className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  {!collapsed && <span>Orders</span>}
                </div>
                {pendingTasks > 0 && !collapsed && (
                  <Badge variant="secondary" className="ml-2">
                    {pendingTasks}
                  </Badge>
                )}
              </Link>
            </li>

            {/* Tasks */}
            <li>
              <Link to="/tasks" className={cn("flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors", 
                isActive("/tasks") 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  {!collapsed && <span>Tasks</span>}
                </div>
                {pendingTasks > 0 && !collapsed && (
                  <Badge variant="secondary" className="ml-2">
                    {pendingTasks}
                  </Badge>
                )}
              </Link>
            </li>

            {/* Approvals - for admin and sales only */}
            {isSales && (
              <li>
                <Link to="/approvals" className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", 
                  isActive("/approvals") 
                    ? "bg-secondary text-secondary-foreground" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  {!collapsed && <span>Approvals</span>}
                </Link>
              </li>
            )}

            {/* Analytics */}
            <li>
              <Link to="/analytics" className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", 
                isActive("/analytics") 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                <BarChart2 className="mr-2 h-5 w-5" />
                {!collapsed && <span>Analytics</span>}
              </Link>
            </li>

            {/* Department sections - only show if not collapsed */}
            {!collapsed && (
              <li className="pt-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="departments" className="border-none">
                    <AccordionTrigger className="py-1 text-sm text-muted-foreground">
                      Departments
                    </AccordionTrigger>
                    <AccordionContent className="pb-1">
                      <ul className="space-y-1">
                        {/* Design */}
                        <li>
                          <Link to="/departments/design" 
                            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium ${getDeptColor('design')} transition-colors`}>
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                            Design Department
                          </Link>
                        </li>
                        
                        {/* Prepress */}
                        <li>
                          <Link to="/departments/prepress" 
                            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium ${getDeptColor('prepress')} transition-colors`}>
                            <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                            Prepress Department
                          </Link>
                        </li>
                        
                        {/* Production */}
                        <li>
                          <Link to="/departments/production" 
                            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium ${getDeptColor('production')} transition-colors`}>
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                            Production Department
                          </Link>
                        </li>
                        
                        {/* Sales */}
                        <li>
                          <Link to="/departments/sales" 
                            className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium ${getDeptColor('sales')} transition-colors`}>
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            Sales Department
                          </Link>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </li>
            )}

            {/* Admin section */}
            {isAdmin && (
              <>
                <li className="pt-4">
                  {!collapsed && <div className="mb-2 px-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        Administration
                      </p>
                    </div>}
                </li>

                {/* Users */}
                <li>
                  <Link to="/users" className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", 
                    isActive("/users") 
                      ? "bg-secondary text-secondary-foreground" 
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                    <Users className="mr-2 h-5 w-5" />
                    {!collapsed && <span>Users</span>}
                  </Link>
                </li>

                {/* Departments */}
                <li>
                  <Link to="/departments" className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", 
                    isActive("/departments") 
                      ? "bg-secondary text-secondary-foreground" 
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                    <Building2 className="mr-2 h-5 w-5" />
                    {!collapsed && <span>Departments</span>}
                  </Link>
                </li>

                {/* Admin Dashboard */}
                <li>
                  <Link to="/admin" className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", 
                    isActive("/admin") 
                      ? "bg-secondary text-secondary-foreground" 
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    {!collapsed && <span>Admin Dashboard</span>}
                  </Link>
                </li>

                {/* Admin Panel */}
                <li>
                  <Link to="/admin/panel" className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", 
                    isActivePrefix("/admin/panel") 
                      ? "bg-secondary text-secondary-foreground" 
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                    <ShieldAlert className="mr-2 h-5 w-5" />
                    {!collapsed && <span>Admin Panel</span>}
                  </Link>
                </li>
              </>
            )}

            {/* Settings */}
            <li className="mt-auto pt-4">
              <Link to="/settings" className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", 
                isActive("/settings") 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                <Settings className="mr-2 h-5 w-5" />
                {!collapsed && <span>Settings</span>}
              </Link>
            </li>

            {/* Profile */}
            <li>
              <Link to="/profile" className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", 
                isActive("/profile") 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                <User className="mr-2 h-5 w-5" />
                {!collapsed && <span>Profile</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Admin quick access dropdown */}
        {!collapsed && isAdmin && <AdminAccessDropdown />}
      </div>
    </aside>
  );
};

export default Sidebar;
