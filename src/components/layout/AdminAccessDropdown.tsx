
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Settings, Users } from "lucide-react";

const AdminAccessDropdown = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  
  if (!isAdmin) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Admin
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link to="/admin/dashboard" className="flex items-center cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Admin Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/admin/users" className="flex items-center cursor-pointer">
            <Users className="w-4 h-4 mr-2" />
            User Management
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/admin/departments" className="flex items-center cursor-pointer">
            <Users className="w-4 h-4 mr-2" />
            Departments
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminAccessDropdown;
