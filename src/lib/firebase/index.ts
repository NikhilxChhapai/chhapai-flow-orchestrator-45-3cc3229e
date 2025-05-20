// Import the functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, User } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  Timestamp, 
  orderBy,
  CollectionReference
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

import { firebaseConfig } from "./config";
import { 
  Order, 
  OrderStatus, 
  DepartmentType, 
  OrderProduct, 
  DesignStatus, 
  PrepressStatus,
  ProductionStatus,
  PaymentStatus
} from "./types";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Re-export types for use in other files
export * from "./types";

// User management functions
export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const updateUserProfile = async (user: User, data: { displayName?: string, photoURL?: string }) => {
  await updateProfile(user, data);
  
  // Also update the user document in Firestore
  if (user.uid) {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, data);
  }
};

// User data management in Firestore
export const createUserDocument = async (user: User, additionalData?: Record<string, any>) => {
  if (!user.uid) return;

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = Timestamp.now();

    try {
      await setDoc(userRef, {
        uid: user.uid,
        email,
        displayName,
        photoURL,
        createdAt,
        role: additionalData?.role || "sales", // Default role
        ...(additionalData || {}) // Fix: Use additionalData only if it exists, otherwise empty object
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }

  return userRef;
};

// Order management functions
export const createOrder = async (orderData: any) => {
  const ordersRef = collection(db, "orders");
  const newOrder = {
    ...orderData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    assignedDept: "sales", // Default department
    paymentStatus: "unpaid", // Default payment status
    timeline: [
      {
        status: "Order_Received",
        date: Timestamp.now(),
        note: "Order received and confirmed"
      }
    ]
  };
  
  const docRef = await addDoc(ordersRef, newOrder);
  return docRef;
};

export const updateOrder = async (orderId: string, orderData: any) => {
  const orderRef = doc(db, "orders", orderId);
  
  await updateDoc(orderRef, {
    ...orderData,
    updatedAt: Timestamp.now()
  });
  
  return orderRef;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus, note: string = "") => {
  const orderRef = doc(db, "orders", orderId);
  const orderDoc = await getDoc(orderRef);
  
  if (orderDoc.exists()) {
    const orderData = orderDoc.data();
    const timeline = orderData.timeline || [];
    
    timeline.push({
      status,
      date: Timestamp.now(),
      note: note || `Status updated to ${status}`
    });
    
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now(),
      timeline
    });
  }
};

// New function to update department assignment
export const assignOrderToDepartment = async (orderId: string, department: DepartmentType, newStatus: OrderStatus) => {
  const orderRef = doc(db, "orders", orderId);
  const orderDoc = await getDoc(orderRef);
  
  if (orderDoc.exists()) {
    const orderData = orderDoc.data();
    const timeline = orderData.timeline || [];
    
    timeline.push({
      status: newStatus,
      date: Timestamp.now(),
      note: `Order assigned to ${department} department`
    });
    
    await updateDoc(orderRef, {
      assignedDept: department,
      status: newStatus,
      updatedAt: Timestamp.now(),
      timeline
    });
  }
};

// New function to update product design status
export const updateProductDesignStatus = async (
  orderId: string, 
  productIndex: number, 
  designStatus: DesignStatus,
  note: string = ""
) => {
  const orderRef = doc(db, "orders", orderId);
  const orderDoc = await getDoc(orderRef);
  
  if (orderDoc.exists()) {
    const orderData = orderDoc.data();
    const products = [...orderData.products];
    
    if (products[productIndex]) {
      products[productIndex] = {
        ...products[productIndex],
        designStatus
      };
      
      const timeline = orderData.timeline || [];
      timeline.push({
        status: `Design_${designStatus}`,
        date: Timestamp.now(),
        note: note || `Product ${products[productIndex].name} design status updated to ${designStatus}`
      });
      
      await updateDoc(orderRef, {
        products,
        updatedAt: Timestamp.now(),
        timeline
      });
    }
  }
};

// New function to update product prepress status
export const updateProductPrepressStatus = async (
  orderId: string, 
  productIndex: number, 
  prepressStatus: PrepressStatus,
  note: string = ""
) => {
  const orderRef = doc(db, "orders", orderId);
  const orderDoc = await getDoc(orderRef);
  
  if (orderDoc.exists()) {
    const orderData = orderDoc.data();
    const products = [...orderData.products];
    
    if (products[productIndex]) {
      products[productIndex] = {
        ...products[productIndex],
        prepressStatus
      };
      
      const timeline = orderData.timeline || [];
      timeline.push({
        status: `Prepress_${prepressStatus}`,
        date: Timestamp.now(),
        note: note || `Product ${products[productIndex].name} prepress status updated to ${prepressStatus}`
      });
      
      await updateDoc(orderRef, {
        products,
        updatedAt: Timestamp.now(),
        timeline
      });
    }
  }
};

// New function to update production status and stages
export const updateProductionStatus = async (
  orderId: string, 
  productIndex: number, 
  productionStatus: ProductionStatus,
  stage?: string,
  note: string = ""
) => {
  const orderRef = doc(db, "orders", orderId);
  const orderDoc = await getDoc(orderRef);
  
  if (orderDoc.exists()) {
    const orderData = orderDoc.data();
    const products = [...orderData.products];
    
    if (products[productIndex]) {
      // Update production status
      products[productIndex] = {
        ...products[productIndex],
        productionStatus
      };
      
      // Update production stage if provided
      if (stage) {
        if (!products[productIndex].productionStages) {
          products[productIndex].productionStages = {};
        }
        
        // Fix: Use type assertion to ensure productionStages is treated as an object
        const stages = products[productIndex].productionStages as Record<string, boolean>;
        stages[stage] = true;
        products[productIndex].productionStages = stages;
      }
      
      const timeline = orderData.timeline || [];
      timeline.push({
        status: `Production_${productionStatus}`,
        date: Timestamp.now(),
        note: note || `Product ${products[productIndex].name} production status updated to ${productionStatus}${stage ? ` (${stage} completed)` : ''}`
      });
      
      await updateDoc(orderRef, {
        products,
        updatedAt: Timestamp.now(),
        timeline
      });
    }
  }
};

// New function to update payment status
export const updatePaymentStatus = async (
  orderId: string, 
  paymentStatus: PaymentStatus, 
  note: string = ""
) => {
  const orderRef = doc(db, "orders", orderId);
  const orderDoc = await getDoc(orderRef);
  
  if (orderDoc.exists()) {
    const orderData = orderDoc.data();
    const timeline = orderData.timeline || [];
    
    timeline.push({
      status: `Payment_${paymentStatus}`,
      date: Timestamp.now(),
      note: note || `Payment status updated to ${paymentStatus}`
    });
    
    await updateDoc(orderRef, {
      paymentStatus,
      updatedAt: Timestamp.now(),
      timeline
    });
  }
};

export const getOrderById = async (orderId: string) => {
  const orderRef = doc(db, "orders", orderId);
  const orderDoc = await getDoc(orderRef);
  
  if (orderDoc.exists()) {
    return { id: orderDoc.id, ...orderDoc.data() };
  } else {
    return null;
  }
};

// New function to get a single order with real-time updates
export const getOrderWithRealTimeUpdates = (orderId: string, callback: (order: Order | null) => void) => {
  const orderRef = doc(db, "orders", orderId);
  
  return onSnapshot(orderRef, (snapshot) => {
    if (snapshot.exists()) {
      const orderData = { 
        id: snapshot.id,
        ...snapshot.data()
      } as Order;
      callback(orderData);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error getting order with real-time updates:", error);
    callback(null);
  });
};

export const getOrdersWithRealTimeUpdates = (callback: (orders: any[]) => void) => {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(orders);
  });
};

// Get orders by assigned department
export const getOrdersByDepartment = (department: DepartmentType, callback: (orders: any[]) => void) => {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("assignedDept", "==", department), orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(orders);
  });
};

export const getOrdersByStatus = async (status: string) => {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("status", "==", status));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Fix for the TypeScript error in BulkOrderOperations.tsx
export const getOrdersForBulkOperations = async (status?: string) => {
  const ordersRef = collection(db, "orders");
  let ordersQuery;
  
  if (status) {
    ordersQuery = query(ordersRef, where("status", "==", status));
  } else {
    ordersQuery = query(ordersRef);
  }
  
  const snapshot = await getDocs(ordersQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    // Fix: Handle spread type by explicitly defining the return type
    ...(doc.data() as Record<string, any>)
  }));
};

// File upload function
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
};
