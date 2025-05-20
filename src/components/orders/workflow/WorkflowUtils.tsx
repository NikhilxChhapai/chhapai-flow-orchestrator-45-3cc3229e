
import { DepartmentType, OrderProduct, UserRole } from "@/lib/firebase/types";

// Format status display
export const formatStatus = (status: string | undefined): string => {
  if (!status) return "Not Set";
  
  return status
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, str => str.toUpperCase());
};

// Get status field name based on department
export const getStatusField = (department: DepartmentType): "designStatus" | "prepressStatus" | "productionStatus" => {
  switch (department) {
    case "design":
      return "designStatus";
    case "prepress":
      return "prepressStatus";
    case "production":
      return "productionStatus";
    default:
      return "designStatus";
  }
};

// Define appropriate status options based on department and user role
export const getStatusOptions = (department: DepartmentType, userRole: UserRole | DepartmentType) => {
  // Admin can update any status
  if (userRole === 'admin') {
    switch (department) {
      case "design":
        return [
          { value: "pending", label: "Pending" },
          { value: "inProgress", label: "In Progress" },
          { value: "pendingApproval", label: "Send for Approval" },
          { value: "approved", label: "Approved" },
          { value: "needsRevision", label: "Needs Revision" }
        ];
      case "prepress":
        return [
          { value: "pending", label: "Pending" },
          { value: "inProgress", label: "In Progress" },
          { value: "pendingApproval", label: "Send for Approval" },
          { value: "approved", label: "Approved" },
          { value: "needsRevision", label: "Needs Revision" }
        ];
      case "production":
        return [
          { value: "pending", label: "Pending" },
          { value: "inProcess", label: "In Process" },
          { value: "printing", label: "Printing" },
          { value: "finishing", label: "Finishing" },
          { value: "readyToDispatch", label: "Ready to Dispatch" },
          { value: "complete", label: "Complete" }
        ];
      default:
        return [];
    }
  }
  
  // Department-specific options
  switch (department) {
    case "design":
      return userRole === 'design' || userRole === 'sales' ? [
        { value: "pending", label: "Pending" },
        { value: "inProgress", label: "In Progress" },
        { value: "pendingApproval", label: "Send for Approval" }
      ] : (userRole === 'sales' ? [
        { value: "approved", label: "Approved" },
        { value: "needsRevision", label: "Needs Revision" }
      ] : []);
    case "prepress":
      return userRole === 'prepress' || userRole === 'sales' ? [
        { value: "pending", label: "Pending" },
        { value: "inProgress", label: "In Progress" },
        { value: "pendingApproval", label: "Send for Approval" }
      ] : (userRole === 'sales' ? [
        { value: "approved", label: "Approved" },
        { value: "needsRevision", label: "Needs Revision" }
      ] : []);
    case "production":
      return userRole === 'production' ? [
        { value: "inProcess", label: "In Process" },
        { value: "printing", label: "Printing" },
        { value: "finishing", label: "Finishing" },
        { value: "readyToDispatch", label: "Ready to Dispatch" }
      ] : (userRole === 'sales' ? [
        { value: "complete", label: "Complete" }
      ] : []);
    default:
      return [];
  }
};

// Filter products based on department workflow and user role
export const getRelevantProducts = (products: OrderProduct[], department: DepartmentType, userRole: UserRole | DepartmentType) => {
  // Admin can see all products
  if (userRole === 'admin') {
    return products;
  }

  // For sales, show all products for the current department
  if (userRole === 'sales') {
    return products;
  }
  
  // For other departments, filter based on their workflow
  return products.filter(product => {
    // For design, only show products that haven't been approved yet
    if (userRole === 'design' && department === 'design') {
      return product.designStatus !== "approved";
    }
    
    // For prepress, only show products with approved designs but not approved prepress
    if (userRole === 'prepress' && department === 'prepress') {
      return product.designStatus === "approved" && product.prepressStatus !== "approved";
    }
    
    // For production, only show products with approved prepress
    if (userRole === 'production' && department === 'production') {
      return product.prepressStatus === "approved";
    }
    
    return false;
  });
};

// Check if user can edit this department's workflow
export const canEditWorkflow = (userRole: UserRole | DepartmentType, department: DepartmentType): boolean => {
  if (userRole === 'admin') return true;
  if (userRole === 'sales') return true;
  return userRole === department;
};
