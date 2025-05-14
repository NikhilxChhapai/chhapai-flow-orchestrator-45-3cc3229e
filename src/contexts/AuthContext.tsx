
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the User type
type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: string;
};

// Define the context type
type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      // Simulating authentication
      console.log(`Logging in with ${email} and password`);
      
      // Mock user based on email (for demo purposes)
      let role = "sales";
      if (email.includes("admin")) role = "admin";
      if (email.includes("design")) role = "design";
      if (email.includes("prepress")) role = "prepress";
      if (email.includes("production")) role = "production";
      
      const mockUser: User = {
        uid: `mock-uid-${Date.now()}`,
        email,
        displayName: email.split("@")[0],
        role,
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem("chhapai-user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Mock logout function
  const logout = async () => {
    try {
      // Simulating logout
      setCurrentUser(null);
      localStorage.removeItem("chhapai-user");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  useEffect(() => {
    // Check if there's a user in localStorage (for demonstration)
    const savedUser = localStorage.getItem("chhapai-user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
