
// Main exports for the mock Firebase implementation
import { v4 as uuidv4 } from 'uuid';
import { MockTimestamp } from './mockTimestamp';
import { mockAuth, getUserDoc, createUserDoc, updateUserDoc } from './mockUsers';
import {
  createOrder,
  updateOrder,
  updateOrderStatus,
  getOrderById,
  getOrdersWithRealTimeUpdates,
  getOrdersByDepartment,
  getOrdersByStatus,
  getOrdersForBulkOperations,
  createWriteBatch,
  mockQuery,
  mockCollection,
  mockDoc,
  mockGetDocs
} from './mockOrders';
import { ref, uploadBytes, getDownloadURL } from './mockStorage';

// Re-export types
export * from './mockTypes';
export { MockTimestamp as Timestamp } from './mockTimestamp';

// Firebase app and services
export const auth = mockAuth;
export const db = {
  collection: mockCollection,
  doc: mockDoc,
  getDoc: async (docRef: any) => {
    const { path } = docRef;
    if (path.startsWith('users/')) {
      const userId = path.split('/').pop();
      return await getUserDoc(userId);
    }
    if (path.startsWith('orders/')) {
      const orderId = path.split('/').pop();
      const order = await getOrderById(orderId);
      return {
        exists: () => !!order,
        data: () => order,
        id: orderId
      };
    }
    return {
      exists: () => false,
      data: () => undefined,
      id: docRef.id
    };
  },
  getDocs: mockGetDocs,
  setDoc: async (docRef: any, data: any) => {
    const { path } = docRef;
    if (path.startsWith('users/')) {
      const userId = path.split('/').pop();
      return await updateUserDoc(userId, data);
    }
    return Promise.resolve();
  },
  updateDoc: async (docRef: any, data: any) => {
    const { path } = docRef;
    if (path.startsWith('users/')) {
      const userId = path.split('/').pop();
      return await updateUserDoc(userId, data);
    }
    if (path.startsWith('orders/')) {
      const orderId = path.split('/').pop();
      return await updateOrder(orderId, data);
    }
    return Promise.resolve();
  },
  addDoc: async (collectionRef: any, data: any) => {
    if (collectionRef === 'orders') {
      return await createOrder(data);
    }
    const id = uuidv4();
    return { id, path: `${collectionRef}/${id}` };
  },
  query: mockQuery,
  where: (field: string, operator: string, value: any) => ({ 
    type: 'where', 
    field, 
    operator, 
    value 
  }),
  orderBy: (field: string, direction: 'asc' | 'desc' = 'asc') => ({ 
    type: 'orderBy', 
    field, 
    direction 
  }),
  onSnapshot: (query: any, callback: Function) => {
    if (typeof query === 'function') {
      // Mock real-time updates
      setTimeout(() => {
        callback({ 
          docs: [],
          forEach: () => {}
        });
      }, 100);
      return () => {};
    }
    
    // Simulate real-time updates for collections
    if (query === 'orders') {
      return getOrdersWithRealTimeUpdates(orders => {
        callback({
          docs: orders.map(order => ({
            id: order.id,
            data: () => order,
            exists: () => true
          })),
          forEach: (cb: Function) => {
            orders.forEach(order => {
              cb({
                id: order.id,
                data: () => order,
                exists: () => true
              });
            });
          }
        });
      });
    }
    
    return () => {}; // Unsubscribe function
  },
  writeBatch: createWriteBatch
};

export const storage = {
  ref,
  uploadBytes,
  getDownloadURL
};

// Firebase analytics (mock)
export const analytics = {
  logEvent: (name: string, params: any) => {
    console.log(`Analytics event: ${name}`, params);
  }
};

// Auth functions
export const loginUser = async (email: string, password: string) => {
  return await mockAuth.signInWithEmailAndPassword(email, password);
};

export const registerUser = async (email: string, password: string) => {
  const user = {
    uid: uuidv4(),
    email,
    displayName: email.split('@')[0],
    photoURL: null
  };
  mockAuth.currentUser = user;
  
  // Save to local storage
  localStorage.setItem("mock-auth-user", JSON.stringify(user));
  
  return { user };
};

export const logoutUser = async () => {
  return await mockAuth.signOut();
};

export const updateUserProfile = async (user: any, data: { displayName?: string, photoURL?: string }) => {
  return await mockAuth.updateProfile(user, data);
};

// User data management
export const createUserDocument = async (user: any, additionalData?: Record<string, any>) => {
  return await createUserDoc(user, additionalData);
};

// Order management functions
export {
  createOrder,
  updateOrder,
  updateOrderStatus,
  getOrderById,
  getOrdersWithRealTimeUpdates,
  getOrdersByDepartment,
  getOrdersByStatus,
  getOrdersForBulkOperations
};

// Function to assign order to department
export const assignOrderToDepartment = async (orderId: string, department: string, newStatus: string) => {
  const order = await getOrderById(orderId);
  
  if (order) {
    const timeline = [...(order.timeline || [])];
    
    timeline.push({
      status: newStatus,
      date: MockTimestamp.now(),
      note: `Order assigned to ${department} department`
    });
    
    await updateOrder(orderId, {
      assignedDept: department,
      status: newStatus,
      timeline
    });
  }
};

// File upload function
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
};
