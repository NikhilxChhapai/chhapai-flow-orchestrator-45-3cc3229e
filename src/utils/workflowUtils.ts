
import { OrderStatus } from "@/lib/firebase/types";

// Determine if the current status is a design status
export const isDesignStatus = (status: OrderStatus): boolean => {
  return status.startsWith('Design_');
};

// Determine if the current status is a prepress status
export const isPrepressStatus = (status: OrderStatus): boolean => {
  return status.startsWith('Prepress_');
};

// Determine if the current status is a production status
export const isProductionStatus = (status: OrderStatus): boolean => {
  return status.startsWith('Production_');
};

// Get next stage in the workflow based on current status
export const getNextWorkflowStage = (currentStatus: OrderStatus): OrderStatus => {
  // Order received flow
  if (currentStatus === 'Order_Received') {
    return 'Design_InProgress';
  }
  
  // Design flow
  if (currentStatus === 'Design_InProgress') {
    return 'Design_PendingApproval';
  }
  if (currentStatus === 'Design_PendingApproval') {
    return 'Design_InProgress'; // Back to design if changes requested
  }
  if (currentStatus === 'Design_InProgress' && isDesignApproved()) {
    return 'Prepress_InProgress';
  }
  
  // Prepress flow
  if (currentStatus === 'Prepress_InProgress') {
    return 'Prepress_PendingApproval';
  }
  if (currentStatus === 'Prepress_PendingApproval') {
    return 'Prepress_InProgress'; // Back to prepress if changes requested
  }
  if (currentStatus === 'Prepress_InProgress' && isPrepressApproved()) {
    return 'Production_Printing';
  }
  
  // Production flow
  if (currentStatus === 'Production_Printing') {
    return 'Production_Finishing';
  }
  if (currentStatus === 'Production_Finishing') {
    return 'ReadyToDispatch';
  }
  if (currentStatus === 'ReadyToDispatch') {
    return 'Completed';
  }
  
  // Default: stay in current status
  return currentStatus;
};

// Helper function to check if design is approved across all products
// This would typically check if all products have designStatus === 'approved'
const isDesignApproved = (): boolean => {
  return false; // In a real implementation, you'd check all products
};

// Helper function to check if prepress is approved across all products
// This would typically check if all products have prepressStatus === 'approved'
const isPrepressApproved = (): boolean => {
  return false; // In a real implementation, you'd check all products
};

// Get status label for display
export const getStatusLabel = (status: OrderStatus): string => {
  return status
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Extend the OrderStatus type in the future for more status types
// For now, the enum in types.ts contains all valid statuses
