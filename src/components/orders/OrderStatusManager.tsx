import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateOrderStatus } from "@/lib/mockData";
import { Order, OrderStatus, UserRole, DepartmentType } from "@/lib/firebase/types";
import { formatStatus } from "./workflow/WorkflowUtils";
import { useToast } from "@/hooks/use-toast";
import { canUserUpdateOrderStatus, getNextStatuses } from "@/utils/workflowUtils";

interface OrderStatusManagerProps {
  order: Order;
  currentUser: {
    uid: string;
    email: string | null;
    displayName: string | null;
    role: string;
  } | null;
  onSuccess?: () => void;
}

const OrderStatusManager = ({ order, currentUser, onSuccess }: OrderStatusManagerProps) => {
  const { toast } = useToast();
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Format status display
  const formatStatusDisplay = (status: string): string => {
    return status
      .replace(/_/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get badge color based on status
  const getStatusBadge = (status: string): string => {
    if (status.startsWith("Order_")) return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    if (status.startsWith("Design_")) return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
    if (status.startsWith("Prepress_")) return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    if (status.startsWith("Production_")) return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    if (status === "ReadyToDispatch") return "bg-green-100 text-green-800 hover:bg-green-200";
    if (status === "Completed") return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!order || !order.id) return;
    
    setUpdatingStatus(true);
    try {
      await updateOrderStatus(order.id, newStatus, `Status updated to ${formatStatusDisplay(newStatus)}`);
      
      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${formatStatusDisplay(newStatus)}.`
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Convert string role to proper type
  const userRoleTyped = (currentUser?.role || 'sales') as UserRole;
  const userDept = (currentUser?.role || 'sales') as DepartmentType;
  
  // Check if user can update this order
  const canUpdateOrder = currentUser ? canUserUpdateOrderStatus({
    id: currentUser.uid,
    email: currentUser.email || "",
    name: currentUser.displayName || "",
    role: userRoleTyped,
    department: userDept,
    createdAt: new Date()
  }, order) : false;

  // Get next available statuses - passing all three required parameters
  const nextStatuses = getNextStatuses(order.status, userRoleTyped, userDept);

  if (!canUpdateOrder || nextStatuses.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-3">
      <h4 className="text-sm font-medium">Update Status</h4>
      <div className="flex flex-row items-center gap-2">
        <Select
          value=""
          onValueChange={(value) => handleStatusUpdate(value as OrderStatus)}
          disabled={updatingStatus}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Change status..." />
          </SelectTrigger>
          <SelectContent>
            {nextStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {formatStatusDisplay(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {updatingStatus && (
          <Button disabled variant="ghost" size="icon">
            <Loader2 className="h-4 w-4 animate-spin" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderStatusManager;
