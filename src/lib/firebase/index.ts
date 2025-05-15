
// Import the functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, User } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, addDoc, query, where, getDocs, onSnapshot, Timestamp, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

import { firebaseConfig } from "./config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

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
        ...additionalData
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

export const updateOrderStatus = async (orderId: string, status: string, note: string = "") => {
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

export const getOrderById = async (orderId: string) => {
  const orderRef = doc(db, "orders", orderId);
  const orderDoc = await getDoc(orderRef);
  
  if (orderDoc.exists()) {
    return { id: orderDoc.id, ...orderDoc.data() };
  } else {
    return null;
  }
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

export const getOrdersByStatus = async (status: string) => {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("status", "==", status));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// File upload function
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
};
