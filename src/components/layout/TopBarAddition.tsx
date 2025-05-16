
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import AdminAccessDropdown from "./AdminAccessDropdown";

const TopBarAddition = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="flex items-center gap-4">
      {currentUser?.role === "admin" && (
        <Link to="/admin/dashboard">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Admin Panel
          </Button>
        </Link>
      )}
      <AdminAccessDropdown />
    </div>
  );
};

export default TopBarAddition;
