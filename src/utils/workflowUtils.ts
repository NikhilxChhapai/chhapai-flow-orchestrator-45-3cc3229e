
import { User, Order, OrderStatus, DepartmentType } from "@/lib/firebase/types";

// Check if a user has permission to update order status
export const canUserUpdateOrderStatus = (user: User | null, order: Order): boolean => {
  if (!user) return false;
  
  // Admins and sales can update any order status
  if (user.role === 'admin' || user.role === 'sales') return true;
  
  // Department users can only update orders assigned to them
  if (user.department === order.assignedDept) {
    // They can only request approval or mark work as completed
    if (user.department === 'design' && 
        (order.status === 'Design_InProgress')) {
      return true;
    }
    
    if (user.department === 'prepress' && 
        (order.status === 'Prepress_InProgress')) {
      return true;
    }
    
    if (user.department === 'production' && 
        (order.status === 'Production_Printing' || 
         order.status === 'Production_Finishing')) {
      return true;
    }
  }
  
  return false;
};

// Get next possible statuses based on current status and user role
export const getNextStatuses = (currentStatus: OrderStatus, userRole: string, userDepartment: DepartmentType): OrderStatus[] => {
  const allStatuses: OrderStatus[] = [
    'Order_Received', 'Order_Confirmed',
    'Design_InProgress', 'Design_PendingApproval', 'Design_Approved', 'Design_Rejected',
    'Prepress_InProgress', 'Prepress_PendingApproval', 'Prepress_Approved', 'Prepress_Rejected',
    'Production_Printing', 'Production_Finishing', 'Production_Completed',
    'ReadyToDispatch', 'Dispatched', 'Completed', 'Cancelled'
  ];
  
  // Admin and sales can set any status
  if (userRole === 'admin' || userRole === 'sales') {
    switch (currentStatus) {
      case 'Order_Received':
        return ['Order_Confirmed', 'Design_InProgress', 'Cancelled'];
      case 'Order_Confirmed':
        return ['Design_InProgress', 'Cancelled'];
      case 'Design_InProgress':
        return ['Design_PendingApproval', 'Design_Approved', 'Design_Rejected', 'Cancelled'];
      case 'Design_PendingApproval':
        return ['Design_Approved', 'Design_Rejected', 'Cancelled'];
      case 'Design_Rejected':
        return ['Design_InProgress', 'Cancelled'];
      case 'Design_Approved':
        return ['Prepress_InProgress', 'Cancelled'];
      case 'Prepress_InProgress':
        return ['Prepress_PendingApproval', 'Prepress_Approved', 'Prepress_Rejected', 'Cancelled'];
      case 'Prepress_PendingApproval':
        return ['Prepress_Approved', 'Prepress_Rejected', 'Cancelled'];
      case 'Prepress_Rejected':
        return ['Prepress_InProgress', 'Cancelled'];
      case 'Prepress_Approved':
        return ['Production_Printing', 'Cancelled'];
      case 'Production_Printing':
        return ['Production_Finishing', 'Production_Completed', 'Cancelled'];
      case 'Production_Finishing':
        return ['Production_Completed', 'Cancelled'];
      case 'Production_Completed':
        return ['ReadyToDispatch', 'Cancelled'];
      case 'ReadyToDispatch':
        return ['Dispatched', 'Completed', 'Cancelled'];
      case 'Dispatched':
        return ['Completed', 'Cancelled'];
      default:
        return ['Cancelled'];
    }
  }
  
  // Department specific flows
  switch (userDepartment) {
    case 'design':
      if (currentStatus === 'Design_InProgress') {
        return ['Design_PendingApproval'];
      }
      break;
    case 'prepress':
      if (currentStatus === 'Prepress_InProgress') {
        return ['Prepress_PendingApproval'];
      }
      break;
    case 'production':
      if (currentStatus === 'Production_Printing') {
        return ['Production_Finishing'];
      }
      if (currentStatus === 'Production_Finishing') {
        return ['Production_Completed'];
      }
      break;
    default:
      return [];
  }
  
  return [];
};

// Check if user can access this order
export const canUserAccessOrder = (user: User | null, order: Order): boolean => {
  if (!user) return false;
  
  // Admin and sales can access all orders
  if (user.role === 'admin' || user.role === 'sales') return true;
  
  // Department users can only access orders assigned to their department
  return user.department === order.assignedDept;
};
