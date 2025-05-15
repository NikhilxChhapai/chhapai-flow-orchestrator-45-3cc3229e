
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  auth, 
  db, 
  loginUser, 
  logoutUser, 
  createUserDocument, 
  updateUserProfile 
} from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

// Define the User type
type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: string;
  photoURL?: string | null;
};

// Define the context type
type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { displayName?: string, photoURL?: string }) => Promise<void>;
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

  // Login function using Firebase
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await loginUser(email, password);
      const user = userCredential.user;
      
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      let role = "sales"; // Default role
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        role = userData.role || role;
      } else {
        // If user document doesn't exist in Firestore, create it
        await createUserDocument(user, { role });
      }
      
      setCurrentUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role,
      });
      
      localStorage.setItem("chhapai-user", JSON.stringify({ 
        uid: user.uid, 
        email: user.email, 
        displayName: user.displayName,
        role,
      }));
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
  const updateProfile = async (data: { displayName?: string, photoURL?: string }) => {
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
    // Check Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        let role = "sales"; // Default role
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          role = userData.role || role;
        } else {
          // If user document doesn't exist in Firestore, create it
          await createUserDocument(user, { role });
        }
        
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role,
        });
      } else {
        // Check if there's a user in localStorage (for demonstration)
        const savedUser = localStorage.getItem("chhapai-user");
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        } else {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
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
