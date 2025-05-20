
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
export const getStatusOptions = (department: DepartmentType, userRole: string) => {
  // Convert userRole string to UserRole type for proper type checking
  const role = userRole as UserRole | DepartmentType;
  
  // Admin can update any status
  if (role === 'admin') {
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
      return role === 'design' || role === 'sales' ? [
        { value: "pending", label: "Pending" },
        { value: "inProgress", label: "In Progress" },
        { value: "pendingApproval", label: "Send for Approval" }
      ] : (role === 'sales' ? [
        { value: "approved", label: "Approved" },
        { value: "needsRevision", label: "Needs Revision" }
      ] : []);
    case "prepress":
      return role === 'prepress' || role === 'sales' ? [
        { value: "pending", label: "Pending" },
        { value: "inProgress", label: "In Progress" },
        { value: "pendingApproval", label: "Send for Approval" }
      ] : (role === 'sales' ? [
        { value: "approved", label: "Approved" },
        { value: "needsRevision", label: "Needs Revision" }
      ] : []);
    case "production":
      return role === 'production' ? [
        { value: "inProcess", label: "In Process" },
        { value: "printing", label: "Printing" },
        { value: "finishing", label: "Finishing" },
        { value: "readyToDispatch", label: "Ready to Dispatch" }
      ] : (role === 'sales' ? [
        { value: "complete", label: "Complete" }
      ] : []);
    default:
      return [];
  }
};

// Filter products based on department workflow and user role
export const getRelevantProducts = (products: OrderProduct[], department: DepartmentType, userRole: string) => {
  // Convert userRole string to UserRole type for proper type checking
  const role = userRole as UserRole | DepartmentType;
  
  // Admin can see all products
  if (role === 'admin') {
    return products;
  }

  // For sales, show all products for the current department
  if (role === 'sales') {
    return products;
  }
  
  // For other departments, filter based on their workflow
  return products.filter(product => {
    // For design, only show products that haven't been approved yet
    if (role === 'design' && department === 'design') {
      return product.designStatus !== "approved";
    }
    
    // For prepress, only show products with approved designs but not approved prepress
    if (role === 'prepress' && department === 'prepress') {
      return product.designStatus === "approved" && product.prepressStatus !== "approved";
    }
    
    // For production, only show products with approved prepress
    if (role === 'production' && department === 'production') {
      return product.prepressStatus === "approved";
    }
    
    return false;
  });
};

// Check if user can edit this department's workflow
export const canEditWorkflow = (userRole: string, department: DepartmentType): boolean => {
  // Convert userRole string to UserRole type for proper type checking
  const role = userRole as UserRole | DepartmentType;
  
  if (role === 'admin') return true;
  if (role === 'sales') return true;
  return role === department;
};
