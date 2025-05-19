
import { Timestamp } from "firebase/firestore";

// User role types
export type UserRole = 'admin' | 'manager' | 'sales' | 'design' | 'prepress' | 'production';

// Department types
export type DepartmentType = 'sales' | 'design' | 'prepress' | 'production';

// Product status types
export type ProductStatus = 'pending' | 'inProgress' | 'approved' | 'rejected' | 'completed';

// Payment status
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded' | 'pending';

// Order status types
export type OrderStatus = 
  // Initial order status
  | 'Order_Received'
  | 'Order_Confirmed'
  
  // Design statuses
  | 'Design_InProgress'
  | 'Design_PendingApproval'
  | 'Design_Approved'
  | 'Design_Rejected'
  
  // Prepress statuses
  | 'Prepress_InProgress'
  | 'Prepress_PendingApproval'
  | 'Prepress_Approved'
  | 'Prepress_Rejected'
  
  // Production statuses
  | 'Production_Printing'
  | 'Production_Finishing'
  | 'Production_Completed'
  
  // Final statuses
  | 'ReadyToDispatch'
  | 'Dispatched'
  | 'Completed'
  | 'Cancelled';

// Order product type
export interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
  designStatus?: string;
  prepressStatus?: string;
  productionStatus?: string;
  productionStages?: {
    printing?: boolean;
    cutting?: boolean;
    binding?: boolean;
    finishing?: boolean;
    folding?: boolean;
    foiling?: boolean;
  };
}

// Order timeline event
export interface OrderTimeline {
  status: string;
  date: any; // Timestamp
  note?: string;
  formattedDate?: string;
}

// Timeline event (for display)
export interface TimelineEvent {
  status: string;
  date: any; // Timestamp
  note?: string;
  formattedDate: string; // Required for display
}

// Order type
export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  gstNumber?: string;
  contactNumber: string;
  orderAmount: number;
  status: OrderStatus;
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
  createdBy: string;
  createdByName: string;
  assignedDept: DepartmentType;
  paymentStatus: PaymentStatus;
  deliveryDate?: any; // Timestamp
  deliveryAddress: string;
  products: OrderProduct[];
  timeline?: OrderTimeline[];
  remarks?: string;
}

// User type
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: DepartmentType;
  avatar?: string;
  createdAt: any; // Timestamp
  permissions?: string[];
}

// Permission type
export interface Permission {
  id: string;
  name: string;
  description: string;
}

// Common props for components
export interface OrderHeaderProps {
  clientName: string;
}

export interface OrderDeliveryProps {
  deliveryDate: string;
  deliveryAddress: string;
  contactNumber: string;
}

export interface OrderPaymentProps {
  paymentStatus: PaymentStatus;
}

export interface OrderProductsWorkflowProps {
  products: OrderProduct[];
  orderId: string;
  department: DepartmentType;
}
