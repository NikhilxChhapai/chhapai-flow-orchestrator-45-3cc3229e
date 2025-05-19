
import React, { useState } from "react";
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
} from "lucide-react";
import AdminAccessDropdown from "./AdminAccessDropdown";
import { useAuth } from "@/contexts/AuthContext";

// Import logo images
const logoFull = "/logo-full.png"; // Path to your full logo
const logoIcon = "/logo-icon.png"; // Path to your icon-only logo (for collapsed state)

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState<string>("admin"); // Mock role - would come from auth context

  // Check if the current path matches the given path
  const isActive = (path: string) => location.pathname === path;

  // Check if admin
  const isAdmin = userRole === "admin";

  return (
    <aside
      className={cn(
        "min-h-screen border-r bg-background transition-all duration-300 ease-in-out",
        collapsed ? "w-[80px]" : "w-[250px]"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar header with logo */}
        <div
          className={cn(
            "flex h-16 items-center border-b px-4",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {/* Logo area - shows appropriate logo based on sidebar state */}
          <div className="flex items-center">
            <img 
              src={collapsed ? logoIcon : logoFull} 
              alt="Chhapai" 
              className={cn(
                "transition-all duration-300",
                collapsed ? "h-8 w-8" : "h-8"
              )}
            />
            {!collapsed && <span className="ml-2 text-xl font-semibold">Chhapai</span>}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M9 3h6v11h2v-4l5 5-5 5v-4h-2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
                <path d="M3 3h6v2H3z" />
                <path d="M3 19h6v2H3z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M15 3h6v11h-6z" />
                <path d="M9 3h6v11h2v-4l5 5-5 5v-4h-2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
                <path d="M3 3h6v2H3z" />
                <path d="M3 19h6v2H3z" />
              </svg>
            )}
          </Button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-auto p-3">
          <ul className="space-y-1">
            {/* Dashboard */}
            <li>
              <Link
                to="/dashboard"
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                  isActive("/dashboard")
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                {!collapsed && <span>Dashboard</span>}
              </Link>
            </li>

            {/* Orders */}
            <li>
              <Link
                to="/orders"
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                  isActive("/orders")
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <FileText className="mr-2 h-5 w-5" />
                {!collapsed && <span>Orders</span>}
              </Link>
            </li>

            {/* Approvals */}
            {(userRole === "admin" || userRole === "sales") && (
              <li>
                <Link
                  to="/approvals"
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                    isActive("/approvals")
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  {!collapsed && <span>Approvals</span>}
                </Link>
              </li>
            )}

            {/* Tasks */}
            <li>
              <Link
                to="/tasks"
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                  isActive("/tasks")
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                {!collapsed && <span>Tasks</span>}
              </Link>
            </li>

            {/* Analytics */}
            <li>
              <Link
                to="/analytics"
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                  isActive("/analytics")
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <BarChart2 className="mr-2 h-5 w-5" />
                {!collapsed && <span>Analytics</span>}
              </Link>
            </li>

            {/* Admin section */}
            {isAdmin && (
              <>
                <li className="pt-4">
                  {!collapsed && (
                    <div className="mb-2 px-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        Administration
                      </p>
                    </div>
                  )}
                </li>

                {/* Users */}
                <li>
                  <Link
                    to="/users"
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                      isActive("/users")
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    {!collapsed && <span>Users</span>}
                  </Link>
                </li>

                {/* Departments */}
                <li>
                  <Link
                    to="/departments"
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                      isActive("/departments")
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <Building2 className="mr-2 h-5 w-5" />
                    {!collapsed && <span>Departments</span>}
                  </Link>
                </li>

                {/* Admin Dashboard */}
                <li>
                  <Link
                    to="/admin"
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                      isActive("/admin")
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    {!collapsed && <span>Admin Dashboard</span>}
                  </Link>
                </li>

                {/* Admin Panel */}
                <li>
                  <Link
                    to="/admin/panel"
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                      isActive("/admin/panel")
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <ShieldAlert className="mr-2 h-5 w-5" />
                    {!collapsed && <span>Admin Panel</span>}
                  </Link>
                </li>
              </>
            )}

            {/* Settings */}
            <li className="mt-auto pt-4">
              <Link
                to="/settings"
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                  isActive("/settings")
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <Settings className="mr-2 h-5 w-5" />
                {!collapsed && <span>Settings</span>}
              </Link>
            </li>

            {/* Profile */}
            <li>
              <Link
                to="/profile"
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                  isActive("/profile")
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
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
