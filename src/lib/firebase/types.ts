
import { Timestamp } from "firebase/firestore";

// Order status types
export type OrderStatus = 
  | "Order_Received" 
  | "Design_InProgress" 
  | "Prepress_InProgress" 
  | "Production_Printing" 
  | "ReadyToDispatch" 
  | "Completed";

export type DepartmentType = "sales" | "design" | "prepress" | "production" | "admin";

export type DesignStatus = "pending" | "pendingApproval" | "approved" | "needsRevision";
export type PrepressStatus = "pending" | "pendingApproval" | "approved" | "needsRevision";
export type ProductionStatus = "inProcess" | "readyToDispatch" | "complete";
export type PaymentStatus = "unpaid" | "pending" | "paid";

// Product in an order
export interface OrderProduct {
  id?: string;
  name: string;
  quantity?: number;
  price?: number;
  designStatus?: DesignStatus;
  prepressStatus?: PrepressStatus;
  productionStatus?: ProductionStatus;
  productionStages?: {
    printing: boolean;
    cutting: boolean;
    foiling: boolean;
    [key: string]: boolean;
  };
}

// Timeline event for an order
export interface OrderTimeline {
  status: string;
  date: Timestamp;
  note: string;
  formattedDate?: string;
}

// Order data structure
export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  orderAmount: number;
  status: OrderStatus;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: string;
  createdByName?: string;
  updatedBy?: string;
  assignedDept?: DepartmentType;
  paymentStatus?: PaymentStatus;
  gstNumber?: string;
  contactNumber: string;
  deliveryDate?: Timestamp;
  deliveryAddress: string;
  products: OrderProduct[];
  timeline?: OrderTimeline[];
  remarks?: string;
}

// User data structure
export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: DepartmentType;
  department?: string;
  createdAt: Timestamp;
}
