
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Package, 
  Plus, 
  CheckSquare, 
  Users, 
  Layers, 
  BarChart, 
  Settings 
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
};

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || "sales";

  // Define navigation items based on user role
  const getNavItems = () => {
    const items = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <Home className="h-5 w-5" />,
        roles: ["admin", "sales", "design", "prepress", "production"],
      },
      {
        name: "All Orders",
        path: "/orders",
        icon: <Package className="h-5 w-5" />,
        roles: ["admin", "sales", "design", "prepress", "production"],
      },
      {
        name: "Create Order",
        path: "/orders/create",
        icon: <Plus className="h-5 w-5" />,
        roles: ["admin", "sales"],
      },
      {
        name: "My Tasks",
        path: "/tasks",
        icon: <CheckSquare className="h-5 w-5" />,
        roles: ["admin", "sales", "design", "prepress", "production"],
      },
      {
        name: "Approvals",
        path: "/approvals",
        icon: <CheckSquare className="h-5 w-5" />,
        roles: ["admin", "sales"],
      },
      {
        name: "Users",
        path: "/users",
        icon: <Users className="h-5 w-5" />,
        roles: ["admin"],
      },
      {
        name: "Departments",
        path: "/departments",
        icon: <Layers className="h-5 w-5" />,
        roles: ["admin"],
      },
      {
        name: "Analytics",
        path: "/analytics",
        icon: <BarChart className="h-5 w-5" />,
        roles: ["admin", "sales"],
      },
      {
        name: "Settings",
        path: "/settings",
        icon: <Settings className="h-5 w-5" />,
        roles: ["admin"],
      },
    ];

    return items.filter(item => item.roles.includes(role));
  };

  const navItems = getNavItems();

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center">
          <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center text-primary-foreground font-bold">
            C
          </div>
          {isOpen && (
            <span className="ml-2 text-xl font-bold text-sidebar-foreground transition-opacity duration-300">
              Chhapai
            </span>
          )}
        </div>
      </div>

      <nav className="space-y-1 px-2 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                !isOpen && "justify-center"
              )
            }
          >
            {item.icon}
            {isOpen && <span className="ml-3">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
