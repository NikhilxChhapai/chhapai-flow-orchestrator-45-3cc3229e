
import { DepartmentType, OrderProduct } from "@/lib/firebase/types";

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
      return "designStatus"; // Default to design if unknown
  }
};

// Format status string for display
export const formatStatus = (status: any): string => {
  if (!status) return "Not Set";
  
  return status
    .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Get status options based on department and user role
export const getStatusOptions = (department: DepartmentType, userRole: string): { value: string, label: string }[] => {
  // Admin can update to any status
  if (userRole === "admin") {
    return getStatusOptionsForDepartment(department);
  }
  
  // Department users can only update status if it matches their role
  if (userRole === department) {
    return getStatusOptionsForDepartment(department);
  }
  
  // Sales can approve or request changes for items pending approval
  if (userRole === "sales" && department !== "sales") {
    return [
      { value: "approved", label: "Approve" },
      { value: "needsRevision", label: "Needs Revision" }
    ];
  }
  
  // No options for other cases
  return [];
};

// Get department-specific status options
const getStatusOptionsForDepartment = (department: DepartmentType): { value: string, label: string }[] => {
  switch (department) {
    case "design":
      return [
        { value: "pending", label: "Pending" },
        { value: "inProgress", label: "In Progress" },
        { value: "pendingApproval", label: "Send for Approval" },
        { value: "needsRevision", label: "Needs Revision" },
        { value: "approved", label: "Approved" }
      ];
    case "prepress":
      return [
        { value: "pending", label: "Pending" },
        { value: "inProgress", label: "In Progress" },
        { value: "pendingApproval", label: "Send for Approval" },
        { value: "needsRevision", label: "Needs Revision" },
        { value: "approved", label: "Approved" }
      ];
    case "production":
      return [
        { value: "pending", label: "Pending" },
        { value: "inProcess", label: "In Process" },
        { value: "onHold", label: "On Hold" },
        { value: "readyToDispatch", label: "Ready to Dispatch" },
        { value: "complete", label: "Complete" }
      ];
    default:
      return [];
  }
};

// Return relevant products for workflow
export const getRelevantProducts = (
  products: OrderProduct[], 
  department: DepartmentType, 
  userRole: string
): OrderProduct[] => {
  // Admin and sales can see all products
  if (userRole === "admin" || userRole === "sales") {
    return products;
  }
  
  // Department users see only products assigned to their department
  if (userRole === department) {
    return products;
  }
  
  // No products for other cases
  return [];
};

// Check if the user can edit the workflow
export const canEditWorkflow = (userRole: string, department: DepartmentType): boolean => {
  // Admin can edit all workflows
  if (userRole === "admin") {
    return true;
  }
  
  // Department users can edit their own department's workflow
  if (userRole === department) {
    return true;
  }
  
  // Sales users can approve items pending approval from any department
  if (userRole === "sales") {
    return true;
  }
  
  // No edit access for other cases
  return false;
};

// Get next department in workflow
export const getNextDepartment = (currentDepartment: DepartmentType): DepartmentType => {
  switch (currentDepartment) {
    case "sales":
      return "design";
    case "design":
      return "prepress";
    case "prepress":
      return "production";
    case "production":
      return "sales";
    default:
      return "sales";
  }
};

// Get previous department in workflow
export const getPreviousDepartment = (currentDepartment: DepartmentType): DepartmentType => {
  switch (currentDepartment) {
    case "sales":
      return "production";
    case "design":
      return "sales";
    case "prepress":
      return "design";
    case "production":
      return "prepress";
    default:
      return "sales";
  }
};
