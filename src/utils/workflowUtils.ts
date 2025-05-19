
import { OrderStatus, DepartmentType, DesignStatus, PrepressStatus, ProductionStatus } from "@/lib/firebase/types";

// Helper function to determine the appropriate department based on order status
export const getDepartmentFromStatus = (status: OrderStatus): DepartmentType => {
  if (status.startsWith("Design_")) {
    return "design";
  } else if (status.startsWith("Prepress_")) {
    return "prepress";
  } else if (status.startsWith("Production_")) {
    return "production";
  } else {
    return "sales"; // Default to sales for other statuses
  }
};

// Helper function to determine the appropriate status based on department assignment
export const getStatusFromDepartment = (department: DepartmentType): OrderStatus => {
  switch (department) {
    case "design":
      return "Design_InProgress";
    case "prepress":
      return "Prepress_InProgress";
    case "production":
      return "Production_Printing";
    default:
      return "Order_Received"; // Default status
  }
};

// Format status for display
export const formatOrderStatus = (status: string): string => {
  return status
    .replace(/_/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Get badge color based on status
export const getStatusBadgeColor = (status: string): string => {
  if (status.startsWith("Order_")) return "bg-blue-100 text-blue-800 hover:bg-blue-200";
  if (status.startsWith("Design_")) return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
  if (status.startsWith("Prepress_")) return "bg-purple-100 text-purple-800 hover:bg-purple-200";
  if (status.startsWith("Production_")) return "bg-amber-100 text-amber-800 hover:bg-amber-200";
  if (status === "ReadyToDispatch") return "bg-green-100 text-green-800 hover:bg-green-200";
  if (status === "Completed") return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  return "bg-gray-100 text-gray-800 hover:bg-gray-200";
};

// Get next status in workflow
export const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
  switch (currentStatus) {
    case "Order_Received":
      return "Design_InProgress";
    case "Design_InProgress":
      return "Design_Approved";
    case "Design_Approved":
      return "Prepress_InProgress";
    case "Prepress_InProgress":
      return "Prepress_Approved";
    case "Prepress_Approved":
      return "Production_Printing";
    case "Production_Printing":
      return "ReadyToDispatch";
    case "ReadyToDispatch":
      return "Completed";
    default:
      return null;
  }
};

// Get product status display information
export const getProductStatusInfo = (
  type: "design" | "prepress" | "production",
  status?: DesignStatus | PrepressStatus | ProductionStatus
): { label: string; color: string } => {
  if (!status) {
    return { label: "Not Started", color: "bg-gray-100 text-gray-800" };
  }
  
  switch (type) {
    case "design":
      switch (status) {
        case "pending":
          return { label: "Pending", color: "bg-blue-100 text-blue-800" };
        case "pendingApproval":
          return { label: "Waiting Approval", color: "bg-amber-100 text-amber-800" };
        case "approved":
          return { label: "Approved", color: "bg-green-100 text-green-800" };
        case "needsRevision":
          return { label: "Needs Revision", color: "bg-red-100 text-red-800" };
        default:
          return { label: "Unknown", color: "bg-gray-100 text-gray-800" };
      }
    case "prepress":
      switch (status) {
        case "pending":
          return { label: "Pending", color: "bg-blue-100 text-blue-800" };
        case "pendingApproval":
          return { label: "Waiting Approval", color: "bg-amber-100 text-amber-800" };
        case "approved":
          return { label: "Approved", color: "bg-green-100 text-green-800" };
        case "needsRevision":
          return { label: "Needs Revision", color: "bg-red-100 text-red-800" };
        default:
          return { label: "Unknown", color: "bg-gray-100 text-gray-800" };
      }
    case "production":
      switch (status) {
        case "inProcess":
          return { label: "In Process", color: "bg-blue-100 text-blue-800" };
        case "readyToDispatch":
          return { label: "Ready for Dispatch", color: "bg-amber-100 text-amber-800" };
        case "complete":
          return { label: "Completed", color: "bg-green-100 text-green-800" };
        default:
          return { label: "Unknown", color: "bg-gray-100 text-gray-800" };
      }
    default:
      return { label: "Unknown", color: "bg-gray-100 text-gray-800" };
  }
};

// Check if user has permission for specific action
export const checkPermission = (
  userRole: string, 
  userDepartment: string,
  orderDepartment: string | undefined,
  permission: string
): boolean => {
  // Admin has all permissions
  if (userRole === "admin") return true;
  
  // Sales has many permissions
  if (userRole === "sales") {
    if (["view_all_orders", "create_orders", "edit_orders", "approve_designs", "approve_prepress"].includes(permission)) {
      return true;
    }
  }
  
  // Department-specific permissions
  if (userDepartment === orderDepartment) {
    switch (userRole) {
      case "design":
        return ["view_department_orders", "update_design_status"].includes(permission);
      case "prepress":
        return ["view_department_orders", "update_prepress_status"].includes(permission);
      case "production":
        return ["view_department_orders", "update_production_status"].includes(permission);
      default:
        return false;
    }
  }
  
  return false;
};
