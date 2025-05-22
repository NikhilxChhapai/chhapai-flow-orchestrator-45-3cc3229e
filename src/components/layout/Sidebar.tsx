
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/providers/ThemeProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import AdminAccessDropdown from "./AdminAccessDropdown";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";

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
  const { theme } = useTheme();
  const [userRole, setUserRole] = useState<string>("admin");
  const [pendingTasks, setPendingTasks] = useState<number>(5);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get user role from auth context
  useEffect(() => {
    if (currentUser && currentUser.role) {
      setUserRole(currentUser.role);
    }
  }, [currentUser]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Handler to close mobile menu
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Common sidebar content component
  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <SidebarHeader 
        collapsed={collapsed} 
        isMobile={isMobile} 
        setCollapsed={setCollapsed}
        closeMobileMenu={closeMobileMenu}
      />

      <SidebarNav
        collapsed={collapsed}
        isMobile={isMobile}
        userRole={userRole}
        pendingTasks={pendingTasks}
      />

      {/* Admin quick access dropdown - only show if not collapsed */}
      {!collapsed && !isMobile && userRole === "admin" && <AdminAccessDropdown />}
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar (Sheet component) */}
      {isMobile && (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-[85%] max-w-[300px]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className={`min-h-screen border-r bg-background animate-sidebar ${
          collapsed ? "w-[80px]" : "w-[250px]"
        }`}>
          <SidebarContent />
        </aside>
      )}
    </>
  );
};

export default Sidebar;
