
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  auth, 
  db, 
  loginUser, 
  logoutUser, 
  createUserDocument, 
  updateUserProfile 
} from "@/lib/mockData"; // Updated import path
import { useToast } from "@/hooks/use-toast";

// Define the User type
type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: string;
  photoURL?: string | null;
  department?: string;
};

// Define the context type
type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { displayName?: string, photoURL?: string, role?: string, department?: string }) => Promise<void>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Login function using mock Auth
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await loginUser(email, password);
      const user = userCredential.user;
      
      // Get additional user data 
      let role = "sales"; // Default role
      let department = "";
      
      // Determine role based on email
      if (email.includes("admin")) {
        role = "admin";
        department = "Administration";
      } else if (email.includes("sales")) {
        role = "sales";
        department = "Sales";
      } else if (email.includes("design")) {
        role = "design";
        department = "Design";
      } else if (email.includes("prepress")) {
        role = "prepress";
        department = "Prepress";
      } else if (email.includes("production")) {
        role = "production";
        department = "Production";
      }
      
      if (user) {
        // Check if user has a role in mock storage
        const savedUser = localStorage.getItem("mock-auth-user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          role = userData.role || role;
          department = userData.department || department;
        } else {
          // If user document doesn't exist, create it
          await createUserDocument(user, { role, department });
        }
        
        const updatedUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || email.split("@")[0],
          photoURL: user.photoURL,
          role,
          department
        };
        
        setCurrentUser(updatedUser);
        
        localStorage.setItem("chhapai-user", JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Failed to log in. Please check your credentials.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      localStorage.removeItem("chhapai-user");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: error.message || "Failed to log out. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (data: { displayName?: string, photoURL?: string, role?: string, department?: string }) => {
    try {
      if (!auth.currentUser) {
        throw new Error("No user is currently logged in");
      }
      
      await updateUserProfile(auth.currentUser, data);
      
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          ...data
        };
        setCurrentUser(updatedUser);
        localStorage.setItem("chhapai-user", JSON.stringify(updatedUser));
        
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    // Check for saved user data in localStorage instead of Firebase auth state
    const savedUser = localStorage.getItem("chhapai-user");
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      setCurrentUser(null);
    }
    
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
