
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/providers/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Menu, Moon, Sun, User } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

type TopBarProps = {
  toggleSidebar: () => void;
};

const TopBar = ({ toggleSidebar }: TopBarProps) => {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-background relative">
      <div className="flex items-center">
        {isMobile ? (
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="menu-toggle focus-ring mr-2 md:mr-4"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="menu-toggle focus-ring mr-2 md:mr-4"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {/* Logo centered on mobile, left-aligned on desktop */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none ${isMobile ? "flex justify-center" : "ml-0"}`}>
        <img 
          src={theme === "dark" ? "/logo-full-white.png" : "/logo-full.png"} 
          alt="Chhapai" 
          className="h-8 object-contain"
        />
        {!isMobile && (
          <h1 className="ml-3 text-lg font-semibold hidden md:block">
            Workflow Manager
          </h1>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="focus-ring"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="focus-ring"
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="focus-ring"
              aria-label="User menu"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {currentUser?.displayName || currentUser?.email}
            </DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground capitalize">
              Role: {currentUser?.role || "User"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
