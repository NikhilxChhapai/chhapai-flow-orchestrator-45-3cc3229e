
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";
import { X } from "lucide-react";

interface SidebarHeaderProps {
  collapsed: boolean;
  isMobile: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  closeMobileMenu?: () => void;
}

const SidebarHeader = ({ 
  collapsed, 
  isMobile, 
  setCollapsed,
  closeMobileMenu
}: SidebarHeaderProps) => {
  const { theme } = useTheme();

  return (
    <div className={cn("flex h-16 items-center border-b px-4", collapsed && !isMobile ? "justify-center" : "justify-between")}>
      {/* Logo area */}
      <div className="flex items-center">
        {collapsed && !isMobile ? (
          <img 
            src={theme === "dark" ? "/logo-icon-white.png" : "/logo-icon.png"} 
            alt="Logo" 
            className="h-8 w-8" 
          />
        ) : (
          <div className="flex items-center">
            <img 
              src={theme === "dark" ? "/logo-full-white.png" : "/logo-full.png"} 
              alt="Chhapai" 
              className="h-8" 
            />
            {!isMobile && <span className="ml-2 text-xl font-semibold">Chhapai</span>}
          </div>
        )}
      </div>
      
      {/* Close button for mobile / collapse button for desktop */}
      {isMobile ? (
        <Button variant="ghost" size="icon" onClick={closeMobileMenu} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 focus-ring">
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M9 3h6v11h2v-4l5 5-5 5v-4h-2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
              <path d="M3 3h6v2H3z" />
              <path d="M3 19h6v2H3z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M15 3h6v11h-6z" />
              <path d="M9 3h6v11h2v-4l5 5-5 5v-4h-2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
              <path d="M3 3h6v2H3z" />
              <path d="M3 19h6v2H3z" />
            </svg>
          )}
        </Button>
      )}
    </div>
  );
};

export default SidebarHeader;
