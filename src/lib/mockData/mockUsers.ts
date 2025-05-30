
import { MockTimestamp } from './mockTimestamp';
import { UserData, DepartmentType } from './mockTypes';

// Mock users data
const mockUsers: UserData[] = [
  {
    uid: "admin-user-1",
    email: "hi@chhapai.in",
    displayName: "Rajesh Ji",
    role: "admin",
    department: "admin",
    createdAt: MockTimestamp.fromDate(new Date("2025-01-01"))
  },
  {
    uid: "sales-user-1",
    email: "chd@chhapai.in",
    displayName: "Nikhil",
    role: "sales",
    department: "sales",
    createdAt: MockTimestamp.fromDate(new Date("2025-01-02"))
  },
  {
    uid: "sales-user-2",
    email: "vanika@chhapai.in",
    displayName: "Vanika",
    role: "sales",
    department: "sales",
    createdAt: MockTimestamp.fromDate(new Date("2025-01-03"))
  },
  {
    uid: "sales-user-3",
    email: "saleschd@chhapai.in",
    displayName: "Harish",
    role: "sales",
    department: "sales",
    createdAt: MockTimestamp.fromDate(new Date("2025-01-04"))
  },
  {
    uid: "sales-user-4",
    email: "rohini@chhapai.in",
    displayName: "Rohini",
    role: "sales",
    department: "sales",
    createdAt: MockTimestamp.fromDate(new Date("2025-01-05"))
  },
  {
    uid: "design-user-1",
    email: "smo@chhapai.in",
    displayName: "Hritik",
    role: "design",
    department: "design",
    createdAt: MockTimestamp.fromDate(new Date("2025-01-06"))
  },
  {
    uid: "prepress-user-1",
    email: "orders@chhapai.in",
    displayName: "Yashpal Ji",
    role: "prepress",
    department: "prepress",
    createdAt: MockTimestamp.fromDate(new Date("2025-01-07"))
  },
  {
    uid: "production-user-1",
    email: "sanjay@chhapai.in",
    displayName: "Sanjay",
    role: "production",
    department: "production",
    createdAt: MockTimestamp.fromDate(new Date("2025-01-08"))
  }
];

// Define password map for mock authentication
const mockPasswords: Record<string, string> = {
  "hi@chhapai.in": "Admin@123",
  "chd@chhapai.in": "Nikhil@123",
  "vanika@chhapai.in": "vanika@123",
  "saleschd@chhapai.in": "harish@123",
  "rohini@chhapai.in": "rohini@123", 
  "smo@chhapai.in": "Hritik@123",
  "orders@chhapai.in": "Yashpal@123",
  "sanjay@chhapai.in": "sanjay@123"
};

// Mock auth user class
export class MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;

  constructor(userData: Partial<UserData>) {
    this.uid = userData.uid || "";
    this.email = userData.email || null;
    this.displayName = userData.displayName || null;
    this.photoURL = userData.photoURL || null;
  }
}

// Mock auth functions
export const mockAuth = {
  currentUser: null as MockUser | null,
  
  // Log in user
  signInWithEmailAndPassword: async (email: string, password: string) => {
    const user = mockUsers.find(u => u.email === email);
    const correctPassword = mockPasswords[email];
    
    if (!user || password !== correctPassword) {
      throw new Error("Invalid email or password");
    }
    
    const mockUser = new MockUser(user);
    mockAuth.currentUser = mockUser;
    
    // Save to local storage for persistence
    localStorage.setItem("mock-auth-user", JSON.stringify(user));
    
    return { user: mockUser };
  },
  
  // Sign out user
  signOut: async () => {
    mockAuth.currentUser = null;
    localStorage.removeItem("mock-auth-user");
    return Promise.resolve();
  },
  
  // Load user from local storage
  loadUserFromStorage: () => {
    const savedUser = localStorage.getItem("mock-auth-user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      mockAuth.currentUser = new MockUser(userData);
      return mockAuth.currentUser;
    }
    return null;
  },
  
  // Update user profile
  updateProfile: async (user: MockUser, data: { displayName?: string, photoURL?: string }) => {
    if (!user) {
      throw new Error("No user is currently logged in");
    }
    
    if (data.displayName) user.displayName = data.displayName;
    if (data.photoURL) user.photoURL = data.photoURL;
    
    // Update in local storage
    const savedUser = localStorage.getItem("mock-auth-user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      localStorage.setItem("mock-auth-user", JSON.stringify({
        ...userData,
        ...data
      }));
    }
    
    return Promise.resolve();
  }
};

// Mock Firestore user functions
export const getUserDoc = async (uid: string) => {
  const user = mockUsers.find(u => u.uid === uid);
  return {
    exists: () => !!user,
    data: () => user,
    id: uid
  };
};

export const createUserDoc = async (user: MockUser, additionalData?: Record<string, any>) => {
  const newUser: UserData = {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    photoURL: user.photoURL || undefined,
    role: additionalData?.role || "sales",
    createdAt: MockTimestamp.now(),
    ...additionalData
  };
  
  // Add to mock users array
  mockUsers.push(newUser);
  
  return {
    id: user.uid,
    path: `users/${user.uid}`
  };
};

export const updateUserDoc = async (uid: string, data: Record<string, any>) => {
  const userIndex = mockUsers.findIndex(u => u.uid === uid);
  
  if (userIndex >= 0) {
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...data
    };
  }
  
  return {
    id: uid,
    path: `users/${uid}`
  };
};

// Initialize - try to load user from storage at startup
mockAuth.loadUserFromStorage();
