
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
  Clock
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SidebarNavProps {
  collapsed: boolean;
  isMobile: boolean;
  userRole: string;
  pendingTasks: number;
}

const SidebarNav = ({ 
  collapsed, 
  isMobile, 
  userRole, 
  pendingTasks 
}: SidebarNavProps) => {
  const location = useLocation();
  
  // Check if the current path matches the given path
  const isActive = (path: string) => location.pathname === path;
  
  // Check if path starts with the given prefix
  const isActivePrefix = (prefix: string) => location.pathname.startsWith(prefix);

  // Check admin permissions
  const isAdmin = userRole === "admin";
  const isSales = userRole === "sales" || userRole === "admin";

  // Department-specific colors
  const getDeptColor = (dept: string) => {
    switch(dept.toLowerCase()) {
      case 'design': return 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300';
      case 'prepress': return 'text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300';
      case 'production': return 'text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300';
      case 'sales': return 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300';
      default: return '';
    }
  };

  return (
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
              {(!collapsed || isMobile) && <span>Dashboard</span>}
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
              {(!collapsed || isMobile) && <span>Orders</span>}
            </div>
            {pendingTasks > 0 && (!collapsed || isMobile) && (
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
              {(!collapsed || isMobile) && <span>Tasks</span>}
            </div>
            {pendingTasks > 0 && (!collapsed || isMobile) && (
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
              {(!collapsed || isMobile) && <span>Approvals</span>}
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
            {(!collapsed || isMobile) && <span>Analytics</span>}
          </Link>
        </li>

        {/* Department sections - only show if not collapsed or on mobile */}
        {(!collapsed || isMobile) && (
          <li className="pt-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="departments" className="border-none">
                <AccordionTrigger className="py-1 text-sm text-muted-foreground">
                  Departments
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <ul className="space-y-1">
                    {/* Department links */}
                    <li>
                      <Link to="/departments/design" 
                        className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium ${getDeptColor('design')} transition-colors`}>
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                        Design Department
                      </Link>
                    </li>
                    
                    <li>
                      <Link to="/departments/prepress" 
                        className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium ${getDeptColor('prepress')} transition-colors`}>
                        <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                        Prepress Department
                      </Link>
                    </li>
                    
                    <li>
                      <Link to="/departments/production" 
                        className={`flex items-center rounded-md px-2 py-1.5 text-xs font-medium ${getDeptColor('production')} transition-colors`}>
                        <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                        Production Department
                      </Link>
                    </li>
                    
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
              {(!collapsed || isMobile) && <div className="mb-2 px-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Administration
                  </p>
                </div>}
            </li>

            {/* Admin links */}
            <li>
              <Link to="/users" className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", 
                isActive("/users") 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                <Users className="mr-2 h-5 w-5" />
                {(!collapsed || isMobile) && <span>Users</span>}
              </Link>
            </li>

            <li>
              <Link to="/departments" className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", 
                isActive("/departments") 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                <Building2 className="mr-2 h-5 w-5" />
                {(!collapsed || isMobile) && <span>Departments</span>}
              </Link>
            </li>

            <li>
              <Link to="/admin" className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", 
                isActive("/admin") 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                <LayoutDashboard className="mr-2 h-5 w-5" />
                {(!collapsed || isMobile) && <span>Admin Dashboard</span>}
              </Link>
            </li>

            <li>
              <Link to="/admin/panel" className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", 
                isActivePrefix("/admin/panel") 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
                <ShieldAlert className="mr-2 h-5 w-5" />
                {(!collapsed || isMobile) && <span>Admin Panel</span>}
              </Link>
            </li>
          </>
        )}

        {/* Settings and Profile */}
        <li className="mt-auto pt-4">
          <Link to="/settings" className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", 
            isActive("/settings") 
              ? "bg-secondary text-secondary-foreground" 
              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
            <Settings className="mr-2 h-5 w-5" />
            {(!collapsed || isMobile) && <span>Settings</span>}
          </Link>
        </li>

        <li>
          <Link to="/profile" className={cn("flex items-center rounded-md px-3 py-2 text-sm transition-colors", 
            isActive("/profile") 
              ? "bg-secondary text-secondary-foreground" 
              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground")}>
            <User className="mr-2 h-5 w-5" />
            {(!collapsed || isMobile) && <span>Profile</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default SidebarNav;
