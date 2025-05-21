import { v4 as uuidv4 } from 'uuid';
import { MockTimestamp } from './mockTimestamp';
import { 
  Order, 
  OrderStatus, 
  DepartmentType, 
  OrderProduct, 
  OrderTimeline,
  Unsubscribe,
  MockDocumentReference,
  MockDocumentSnapshot,
  MockQuerySnapshot,
  MockWriteBatch,
  PaymentStatus
} from './mockTypes';

// Mock orders data with realistic sample orders
let mockOrders: Order[] = [
  {
    id: "order-1",
    orderNumber: "ORD-2025-1001",
    clientName: "Rajesh Enterprises",
    orderAmount: 12500,
    status: "Order_Received",
    createdAt: MockTimestamp.fromDate(new Date("2025-05-01")),
    updatedAt: MockTimestamp.fromDate(new Date("2025-05-01")),
    createdBy: "sales-user-1",
    createdByName: "Sales User",
    assignedDept: "sales",
    paymentStatus: "unpaid",
    gstNumber: "22AAAAA0000A1Z5",
    contactNumber: "9876543210",
    deliveryDate: MockTimestamp.fromDate(new Date("2025-05-15")),
    deliveryAddress: "123 Business Park, Mumbai, MH 400001",
    products: [
      {
        id: "product-1-1",
        name: "Business Cards (Double Sided)",
        quantity: 1000,
        price: 2500
      },
      {
        id: "product-1-2",
        name: "Letterheads",
        quantity: 500,
        price: 10000
      }
    ],
    timeline: [
      {
        status: "Order_Received",
        date: MockTimestamp.fromDate(new Date("2025-05-01")),
        note: "Order received and confirmed"
      }
    ],
    remarks: "Need urgent delivery if possible"
  },
  {
    id: "order-2",
    orderNumber: "ORD-2025-1002",
    clientName: "Patel Fabrics",
    orderAmount: 45000,
    status: "Design_InProgress",
    createdAt: MockTimestamp.fromDate(new Date("2025-05-02")),
    updatedAt: MockTimestamp.fromDate(new Date("2025-05-03")),
    createdBy: "sales-user-1",
    createdByName: "Sales User",
    assignedDept: "design",
    paymentStatus: "unpaid",
    contactNumber: "8765432109",
    deliveryDate: MockTimestamp.fromDate(new Date("2025-05-20")),
    deliveryAddress: "456 Textile Market, Surat, GJ 395001",
    products: [
      {
        id: "product-2-1",
        name: "Product Catalog (32 pages)",
        quantity: 200,
        price: 30000,
        designStatus: "pending"
      },
      {
        id: "product-2-2",
        name: "Fabric Sample Cards",
        quantity: 300,
        price: 15000,
        designStatus: "pending"
      }
    ],
    timeline: [
      {
        status: "Order_Received",
        date: MockTimestamp.fromDate(new Date("2025-05-02")),
        note: "Order received and confirmed"
      },
      {
        status: "Design_InProgress",
        date: MockTimestamp.fromDate(new Date("2025-05-03")),
        note: "Assigned to design team"
      }
    ],
    remarks: "Please use textile color codes from previous catalog"
  },
  {
    id: "order-3",
    orderNumber: "ORD-2025-1003",
    clientName: "Sharma Pharmaceuticals",
    orderAmount: 87500,
    status: "Prepress_InProgress",
    createdAt: MockTimestamp.fromDate(new Date("2025-05-04")),
    updatedAt: MockTimestamp.fromDate(new Date("2025-05-06")),
    createdBy: "sales-user-1",
    createdByName: "Sales User",
    assignedDept: "prepress",
    paymentStatus: "paid",
    gstNumber: "09BBBBB0000B1Z8",
    contactNumber: "7654321098",
    deliveryDate: MockTimestamp.fromDate(new Date("2025-05-25")),
    deliveryAddress: "789 Pharma Complex, Delhi, DL 110001",
    products: [
      {
        id: "product-3-1",
        name: "Medicine Boxes (5 designs)",
        quantity: 10000,
        price: 50000,
        designStatus: "approved",
        prepressStatus: "pending"
      },
      {
        id: "product-3-2",
        name: "Product Inserts",
        quantity: 10000,
        price: 37500,
        designStatus: "approved",
        prepressStatus: "pending"
      }
    ],
    timeline: [
      {
        status: "Order_Received",
        date: MockTimestamp.fromDate(new Date("2025-05-04")),
        note: "Order received and confirmed"
      },
      {
        status: "Design_InProgress",
        date: MockTimestamp.fromDate(new Date("2025-05-05")),
        note: "Assigned to design team"
      },
      {
        status: "Prepress_InProgress",
        date: MockTimestamp.fromDate(new Date("2025-05-06")),
        note: "Designs approved, moving to prepress"
      }
    ],
    remarks: "FDA compliance required. All text must be legible at minimum 6pt font."
  },
  {
    id: "order-4",
    orderNumber: "ORD-2025-1004",
    clientName: "Verma Hotels",
    orderAmount: 125000,
    status: "Production_Printing",
    createdAt: MockTimestamp.fromDate(new Date("2025-05-05")),
    updatedAt: MockTimestamp.fromDate(new Date("2025-05-10")),
    createdBy: "sales-user-1",
    createdByName: "Sales User",
    assignedDept: "production",
    paymentStatus: "pending",
    gstNumber: "33CCCCC0000C1Z2",
    contactNumber: "6543210987",
    deliveryDate: MockTimestamp.fromDate(new Date("2025-05-28")),
    deliveryAddress: "101 Hospitality Avenue, Chennai, TN 600001",
    products: [
      {
        id: "product-4-1",
        name: "Hotel Menu Cards (Gold Foil)",
        quantity: 100,
        price: 25000,
        designStatus: "approved",
        prepressStatus: "approved",
        productionStatus: "inProcess",
        productionStages: {
          printing: true,
          foiling: false,
          cutting: false
        }
      },
      {
        id: "product-4-2",
        name: "Room Service Directory",
        quantity: 50,
        price: 50000,
        designStatus: "approved",
        prepressStatus: "approved",
        productionStatus: "inProcess",
        productionStages: {
          printing: true,
          binding: false,
          finishing: false,
          cutting: false,  // Adding the required properties
          foiling: false   // Adding the required properties
        }
      },
      {
        id: "product-4-3",
        name: "Welcome Brochures",
        quantity: 1000,
        price: 50000,
        designStatus: "approved",
        prepressStatus: "approved",
        productionStatus: "inProcess",
        productionStages: {
          printing: false,
          folding: false,
          cutting: false,  // Adding the required properties
          foiling: false   // Adding the required properties
        }
      }
    ],
    timeline: [
      {
        status: "Order_Received",
        date: MockTimestamp.fromDate(new Date("2025-05-05")),
        note: "Order received and confirmed"
      },
      {
        status: "Design_InProgress",
        date: MockTimestamp.fromDate(new Date("2025-05-06")),
        note: "Assigned to design team"
      },
      {
        status: "Prepress_InProgress",
        date: MockTimestamp.fromDate(new Date("2025-05-08")),
        note: "Designs approved, moving to prepress"
      },
      {
        status: "Production_Printing",
        date: MockTimestamp.fromDate(new Date("2025-05-10")),
        note: "Files approved, starting production"
      }
    ],
    remarks: "Gold foil only on cover page. Sample approved on 2025-05-07."
  },
  {
    id: "order-5",
    orderNumber: "ORD-2025-1005",
    clientName: "Singh Auto Parts",
    orderAmount: 18000,
    status: "Completed",
    createdAt: MockTimestamp.fromDate(new Date("2025-04-20")),
    updatedAt: MockTimestamp.fromDate(new Date("2025-05-05")),
    createdBy: "sales-user-1",
    createdByName: "Sales User",
    assignedDept: "sales",
    paymentStatus: "paid",
    gstNumber: "08DDDDD0000D1Z9",
    contactNumber: "5432109876",
    deliveryDate: MockTimestamp.fromDate(new Date("2025-05-01")),
    deliveryAddress: "202 Industrial Area, Ludhiana, PB 141001",
    products: [
      {
        id: "product-5-1",
        name: "Product Labels (Waterproof)",
        quantity: 5000,
        price: 15000,
        designStatus: "approved",
        prepressStatus: "approved",
        productionStatus: "complete"
      },
      {
        id: "product-5-2",
        name: "Warranty Cards",
        quantity: 1000,
        price: 3000,
        designStatus: "approved",
        prepressStatus: "approved",
        productionStatus: "complete"
      }
    ],
    timeline: [
      {
        status: "Order_Received",
        date: MockTimestamp.fromDate(new Date("2025-04-20")),
        note: "Order received and confirmed"
      },
      {
        status: "Design_InProgress",
        date: MockTimestamp.fromDate(new Date("2025-04-22")),
        note: "Assigned to design team"
      },
      {
        status: "Prepress_InProgress",
        date: MockTimestamp.fromDate(new Date("2025-04-25")),
        note: "Designs approved, moving to prepress"
      },
      {
        status: "Production_Printing",
        date: MockTimestamp.fromDate(new Date("2025-04-28")),
        note: "Files approved, starting production"
      },
      {
        status: "ReadyToDispatch",
        date: MockTimestamp.fromDate(new Date("2025-05-03")),
        note: "Production complete, ready for dispatch"
      },
      {
        status: "Completed",
        date: MockTimestamp.fromDate(new Date("2025-05-05")),
        note: "Order delivered and completed"
      }
    ],
    remarks: "Delivered on time. Customer satisfied."
  }
];

// Helper function to find an order by ID
const findOrderById = (id: string): Order | undefined => {
  return mockOrders.find(order => order.id === id);
};

// Mock document reference generator
const createDocRef = (path: string, id: string): MockDocumentReference => {
  return { id, path: `${path}/${id}` };
};

// Mock document snapshot generator
const createDocSnapshot = <T>(id: string, data: T | undefined): MockDocumentSnapshot<T> => {
  return {
    id,
    exists: () => !!data,
    data: () => data
  };
};

// Mock listeners array to simulate Firestore's onSnapshot
const listeners: Array<{ query: any; callback: Function }> = [];

// Mock Firestore functions
export const createOrder = async (orderData: any): Promise<MockDocumentReference> => {
  const id = `order-${mockOrders.length + 1}`;
  const newOrder: Order = {
    id,
    ...orderData,
    createdAt: MockTimestamp.now(),
    updatedAt: MockTimestamp.now(),
    assignedDept: orderData.assignedDept || "sales",
    paymentStatus: orderData.paymentStatus || "unpaid",
    timeline: [
      {
        status: "Order_Received",
        date: MockTimestamp.now(),
        note: "Order received and confirmed"
      }
    ]
  };
  
  mockOrders.push(newOrder);
  
  // Notify listeners
  notifyOrderListeners();
  
  return createDocRef('orders', id);
};

export const updateOrder = async (orderId: string, orderData: any): Promise<MockDocumentReference> => {
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex >= 0) {
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      ...orderData,
      updatedAt: MockTimestamp.now()
    };
    
    // Notify listeners
    notifyOrderListeners();
  }
  
  return createDocRef('orders', orderId);
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus, note: string = ""): Promise<void> => {
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex >= 0) {
    const order = mockOrders[orderIndex];
    const timeline = [...(order.timeline || [])];
    
    timeline.push({
      status,
      date: MockTimestamp.now(),
      note: note || `Status updated to ${status}`
    });
    
    mockOrders[orderIndex] = {
      ...order,
      status,
      updatedAt: MockTimestamp.now(),
      timeline
    };
    
    // Notify listeners
    notifyOrderListeners();
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const order = findOrderById(orderId);
  return order || null;
};

// Function to simulate Firestore's onSnapshot for getting all orders
export const getOrdersWithRealTimeUpdates = (callback: (orders: Order[]) => void): Unsubscribe => {
  const query = { collection: 'orders', orderBy: 'createdAt' };
  
  // Add listener
  listeners.push({ query, callback });
  
  // Initial callback with current data
  setTimeout(() => {
    callback([...mockOrders]);
  }, 100);
  
  // Return unsubscribe function
  return () => {
    const index = listeners.findIndex(listener => listener.query === query);
    if (index >= 0) {
      listeners.splice(index, 1);
    }
  };
};

// Function to simulate Firestore's onSnapshot for a single order
export const getOrderWithRealTimeUpdates = (orderId: string, callback: (order: Order | null) => void): Unsubscribe => {
  const query = { collection: 'orders', doc: orderId };
  
  const listenerCallback = (orders: Order[]) => {
    const order = orders.find(o => o.id === orderId) || null;
    callback(order);
  };
  
  // Add listener
  listeners.push({ query, callback: listenerCallback });
  
  // Initial callback with current data
  setTimeout(() => {
    const order = findOrderById(orderId) || null;
    callback(order);
  }, 100);
  
  // Return unsubscribe function
  return () => {
    const index = listeners.findIndex(listener => listener.query === query);
    if (index >= 0) {
      listeners.splice(index, 1);
    }
  };
};

// Function to get orders by department
export const getOrdersByDepartment = (department: DepartmentType, callback: (orders: Order[]) => void): Unsubscribe => {
  const query = { collection: 'orders', where: { field: 'assignedDept', value: department } };
  
  const filteredCallback = () => {
    const filteredOrders = mockOrders.filter(order => order.assignedDept === department);
    callback(filteredOrders);
  };
  
  // Add listener
  listeners.push({ query, callback: filteredCallback });
  
  // Initial callback with current data
  setTimeout(filteredCallback, 100);
  
  // Return unsubscribe function
  return () => {
    const index = listeners.findIndex(listener => listener.query === query);
    if (index >= 0) {
      listeners.splice(index, 1);
    }
  };
};

// Function to get orders by status
export const getOrdersByStatus = async (status: string): Promise<Order[]> => {
  return mockOrders.filter(order => order.status === status);
};

// Function for bulk operations
export const getOrdersForBulkOperations = async (status?: string): Promise<Order[]> => {
  if (status) {
    return mockOrders.filter(order => order.status === status);
  }
  return [...mockOrders];
};

// Function to assign order to department and update status
export const assignOrderToDepartment = async (orderId: string, department: DepartmentType, newStatus: OrderStatus): Promise<void> => {
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex >= 0) {
    const order = mockOrders[orderIndex];
    const timeline = [...(order.timeline || [])];
    
    timeline.push({
      status: newStatus,
      date: MockTimestamp.now(),
      note: `Order assigned to ${department} department`
    });
    
    mockOrders[orderIndex] = {
      ...order,
      assignedDept: department,
      status: newStatus,
      updatedAt: MockTimestamp.now(),
      timeline
    };
    
    // Notify listeners
    notifyOrderListeners();
  }
};

// Function to update product status in an order
export const updateProductStatus = async (
  orderId: string, 
  productId: string, 
  statusType: "designStatus" | "prepressStatus" | "productionStatus",
  newStatus: string,
  note: string = "",
  updatedBy?: { userId: string; userName: string; role: string },
  originalRequester?: { userId: string; userName: string; role: string }
): Promise<void> => {
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex >= 0) {
    const order = mockOrders[orderIndex];
    const products = [...order.products];
    
    const productIndex = products.findIndex(product => product.id === productId);
    
    if (productIndex >= 0) {
      // Get department from status type
      const department = statusType === "designStatus" ? "design" : 
                         statusType === "prepressStatus" ? "prepress" : "production";
      
      // Store approval request information if sending for approval
      if (newStatus === "pendingApproval") {
        // Store the request information in the product
        products[productIndex] = {
          ...products[productIndex],
          [statusType]: newStatus,
          approvalRequest: {
            requestedBy: updatedBy || { 
              userId: "unknown", 
              userName: "Unknown user", 
              role: "unknown" 
            },
            department: department,
            requestDate: new Date(),
            status: "pending",
            note: note || `Requesting approval for ${products[productIndex].name}`
          }
        };
      } else {
        // For other status updates
        products[productIndex] = {
          ...products[productIndex],
          [statusType]: newStatus
        };
      }
      
      mockOrders[orderIndex] = {
        ...order,
        products,
        updatedAt: MockTimestamp.now()
      };
      
      // Add timeline entry
      const timeline = [...(order.timeline || [])];
      timeline.push({
        status: `Product_${statusType.replace('Status', '')}_${newStatus}`,
        date: MockTimestamp.now(),
        note: note || `Product "${products[productIndex].name}" ${statusType.replace('Status', '')} status updated to ${newStatus}`,
        requestedBy: updatedBy ? updatedBy.userName : undefined,
        assignedTo: originalRequester ? originalRequester.userName : undefined
      });
      
      mockOrders[orderIndex].timeline = timeline;
      
      // If this is an approval/rejection, handle department reassignment
      if ((newStatus === "approved" || newStatus === "needsRevision") && originalRequester) {
        const nextDeptMap: {[key: string]: string} = {
          "design": "prepress",
          "prepress": "production",
          "production": "sales"
        };
        
        // If approved, determine if we need to assign to next department
        if (newStatus === "approved") {
          const nextDept = nextDeptMap[department];
          if (nextDept && department !== "production") {
            // Only reassign if not in production (production goes back to sales when complete)
            mockOrders[orderIndex].assignedDept = nextDept as DepartmentType;
            
            timeline.push({
              status: `Assigned_To_${nextDept}`,
              date: MockTimestamp.now(),
              note: `Order assigned to ${nextDept} department after ${department} approval`,
              assignedBy: updatedBy ? updatedBy.userName : undefined
            });
          }
        } else if (newStatus === "needsRevision") {
          // If needs revision, assign back to the original department
          mockOrders[orderIndex].assignedDept = department as DepartmentType;
          
          timeline.push({
            status: `Assigned_Back_To_${department}`,
            date: MockTimestamp.now(),
            note: `Order assigned back to ${department} department for revisions`,
            assignedBy: updatedBy ? updatedBy.userName : undefined
          });
        }
      }
      
      // Notify listeners
      notifyOrderListeners();
    }
  }
};

// Add new function to get approvals pending for the current user
export const getApprovalsPendingByUser = async (userId: string) => {
  const pendingApprovals: any[] = [];
  
  // Loop through all orders to find products pending approval
  for (const order of mockOrders) {
    // Check if order was created or assigned by this user
    const isCreatorOrAssigner = order.createdBy === userId || order.assignedByUser === userId;
    
    // If this user didn't create the order and isn't assigned to it, skip
    if (!isCreatorOrAssigner && !(order.assignedDept === 'sales' && userId === 'admin')) {
      continue;
    }
    
    // Check all products for pending approvals
    for (const product of order.products) {
      // Check for design approval requests
      if (product.designStatus === "pendingApproval" && product.approvalRequest) {
        pendingApprovals.push({
          id: `${order.id}-${product.id}-design`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          productId: product.id,
          productName: product.name,
          type: "pendingApproval",
          department: "design",
          requestedBy: product.approvalRequest.requestedBy,
          requestDate: product.approvalRequest.requestDate,
          status: "pending",
          description: product.approvalRequest.note || `Requesting approval for design of ${product.name}`
        });
      }
      
      // Check for prepress approval requests
      if (product.prepressStatus === "pendingApproval" && product.approvalRequest) {
        pendingApprovals.push({
          id: `${order.id}-${product.id}-prepress`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          productId: product.id,
          productName: product.name,
          type: "pendingApproval",
          department: "prepress",
          requestedBy: product.approvalRequest.requestedBy,
          requestDate: product.approvalRequest.requestDate,
          status: "pending",
          description: product.approvalRequest.note || `Requesting approval for prepress of ${product.name}`
        });
      }
      
      // Check for production completion approvals
      if (product.productionStatus === "readyToDispatch" && product.approvalRequest) {
        pendingApprovals.push({
          id: `${order.id}-${product.id}-production`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          productId: product.id,
          productName: product.name,
          type: "pendingApproval",
          department: "production",
          requestedBy: product.approvalRequest.requestedBy,
          requestDate: product.approvalRequest.requestDate,
          status: "pending",
          description: product.approvalRequest.note || `Ready for final approval of ${product.name}`
        });
      }
    }
  }
  
  return pendingApprovals;
};

// Get all approvals (approved, rejected, pending) - useful for admin views
export const getApprovals = async () => {
  const allApprovals: any[] = [];
  
  // Implementation similar to getApprovalsPendingByUser but including all statuses
  
  return allApprovals;
};

export const updatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus, note: string = ""): Promise<void> => {
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex >= 0) {
    const order = mockOrders[orderIndex];
    const timeline = [...(order.timeline || [])];
    
    timeline.push({
      status: `Payment_${paymentStatus}`,
      date: MockTimestamp.now(),
      note: note || `Payment status updated to ${paymentStatus}`
    });
    
    mockOrders[orderIndex] = {
      ...order,
      paymentStatus,
      updatedAt: MockTimestamp.now(),
      timeline
    };
    
    // Notify listeners
    notifyOrderListeners();
  }
};

// Mock write batch
export const createWriteBatch = (): MockWriteBatch => {
  const batch: { operations: Array<{ type: string; ref: MockDocumentReference; data?: any }> } = {
    operations: []
  };
  
  const mockBatch: MockWriteBatch = {
    set: (ref: MockDocumentReference, data: any) => {
      batch.operations.push({ type: 'set', ref, data });
      return mockBatch;
    },
    update: (ref: MockDocumentReference, data: any) => {
      batch.operations.push({ type: 'update', ref, data });
      return mockBatch;
    },
    delete: (ref: MockDocumentReference) => {
      batch.operations.push({ type: 'delete', ref });
      return mockBatch;
    },
    commit: async () => {
      for (const op of batch.operations) {
        if (op.type === 'delete' && op.ref.path.startsWith('orders/')) {
          const orderId = op.ref.id;
          mockOrders = mockOrders.filter(order => order.id !== orderId);
        } else if (op.type === 'update' && op.ref.path.startsWith('orders/')) {
          const orderId = op.ref.id;
          const orderIndex = mockOrders.findIndex(order => order.id === orderId);
          if (orderIndex >= 0) {
            mockOrders[orderIndex] = {
              ...mockOrders[orderIndex],
              ...op.data,
              updatedAt: MockTimestamp.now()
            };
          }
        } else if (op.type === 'set' && op.ref.path.startsWith('orders/')) {
          const orderId = op.ref.id;
          const orderIndex = mockOrders.findIndex(order => order.id === orderId);
          if (orderIndex >= 0) {
            mockOrders[orderIndex] = {
              ...op.data,
              id: orderId,
              updatedAt: MockTimestamp.now()
            };
          } else {
            mockOrders.push({
              ...op.data,
              id: orderId,
              createdAt: MockTimestamp.now(),
              updatedAt: MockTimestamp.now()
            });
          }
        }
      }
      
      // Notify listeners
      notifyOrderListeners();
      
      return Promise.resolve();
    }
  };
  
  return mockBatch;
};

// Helper to notify all order-related listeners
const notifyOrderListeners = () => {
  // Delay the notification to simulate async behavior
  setTimeout(() => {
    listeners.forEach(listener => {
      if (listener.query.collection === 'orders') {
        if (listener.query.where) {
          const { field, value } = listener.query.where;
          const filteredOrders = mockOrders.filter(order => {
            // Handle field access to avoid undefined errors
            const orderField = order[field as keyof Order];
            return orderField === value;
          });
          listener.callback(filteredOrders);
        } else if (listener.query.doc) {
          const orderId = listener.query.doc;
          const order = findOrderById(orderId);
          listener.callback(order ? [order] : []);
        } else {
          listener.callback([...mockOrders]);
        }
      }
    });
  }, 100);
};

// Mock query function
export const mockQuery = <T>(
  collection: any,
  ...queryConstraints: any[]
): { docs: MockDocumentSnapshot<T>[]; forEach: (callback: (doc: MockDocumentSnapshot<T>) => void) => void } => {
  let filteredData: T[] = [];
  
  if (collection === 'orders') {
    filteredData = mockOrders as unknown as T[];
    
    // Apply query constraints
    for (const constraint of queryConstraints) {
      if (constraint.type === 'where') {
        const { field, operator, value } = constraint;
        filteredData = filteredData.filter((item: any) => {
          if (operator === '==') {
            return item[field] === value;
          }
          return true;
        });
      }
    }
  }
  
  const docs = filteredData.map((data: any) => createDocSnapshot(data.id, data));
  
  return {
    docs,
    forEach: (callback: (doc: MockDocumentSnapshot<T>) => void) => {
      docs.forEach(callback);
    }
  };
};

// Create a mock collection function
export const mockCollection = (path: string) => {
  return path;
};

// Create a mock document function
export const mockDoc = (collection: any, id: string) => {
  return { id, path: `${collection}/${id}` };
};

// Mock getDocs function
export const mockGetDocs = async <T>(query: any): Promise<MockQuerySnapshot<T>> => {
  if (typeof query === 'function') {
    return query();
  }
  
  return {
    docs: [],
    forEach: () => {}
  };
};

// Export additional helper functions for easier order workflow testing
export { 
  findOrderById, 
  createDocRef,
  createDocSnapshot
};
