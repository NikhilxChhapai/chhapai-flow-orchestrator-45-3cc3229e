
import { MockTimestamp } from './mockTimestamp';

// First import the types so they're available for use within this file
import { OrderStatus, DepartmentType, PaymentStatus, DesignStatus, PrepressStatus, ProductionStatus, UserRole } from '../firebase/types';

// Re-export types correctly with 'export type'
export type { OrderStatus, DepartmentType, PaymentStatus, DesignStatus, PrepressStatus, ProductionStatus, UserRole } from '../firebase/types';

// Approval request type
export interface ApprovalRequest {
  requestedBy: {
    userId: string;
    userName: string;
    role: string;
  };
  department: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
}

// Product in an order
export interface OrderProduct {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  designStatus?: DesignStatus;
  prepressStatus?: PrepressStatus;
  productionStatus?: ProductionStatus;
  productionStages?: {
    [key: string]: boolean;
    printing: boolean;
    cutting: boolean;
    foiling: boolean;
  };
  // New fields for approval workflow
  approvalRequest?: ApprovalRequest;
}

// Timeline event for an order
export interface OrderTimeline {
  status: string;
  date: MockTimestamp;
  note: string;
  formattedDate?: string;
  requestedBy?: string;
  assignedBy?: string;
  assignedTo?: string;
}

// Order data structure
export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  orderAmount: number;
  status: OrderStatus;
  createdAt: MockTimestamp;
  updatedAt?: MockTimestamp;
  createdBy: string;
  createdByName?: string;
  updatedBy?: string;
  assignedDept: DepartmentType;
  assignedByUser?: string;
  assignedByName?: string;
  paymentStatus: PaymentStatus;
  gstNumber?: string;
  contactNumber: string;
  deliveryDate?: MockTimestamp;
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
  role: UserRole | DepartmentType;
  department?: string;
  createdAt: MockTimestamp;
}

// Mock unsubscribe function
export type Unsubscribe = () => void;

// Mock document reference type
export interface MockDocumentReference {
  id: string;
  path: string;
}

// Mock document snapshot type
export interface MockDocumentSnapshot<T = any> {
  id: string;
  exists: () => boolean;
  data: () => T | undefined;
}

// Mock query snapshot type
export interface MockQuerySnapshot<T = any> {
  docs: MockDocumentSnapshot<T>[];
  forEach: (callback: (doc: MockDocumentSnapshot<T>) => void) => void;
}

// Mock batch type
export interface MockWriteBatch {
  set: (ref: MockDocumentReference, data: any) => MockWriteBatch;
  update: (ref: MockDocumentReference, data: any) => MockWriteBatch;
  delete: (ref: MockDocumentReference) => MockWriteBatch;
  commit: () => Promise<void>;
}
