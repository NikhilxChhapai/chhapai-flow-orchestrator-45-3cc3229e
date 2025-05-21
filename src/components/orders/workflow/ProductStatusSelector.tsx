
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { OrderProduct, DepartmentType } from "@/lib/firebase/types";
import { updateProductStatus } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";

interface ProductStatusSelectorProps {
  product: OrderProduct;
  orderId: string;
  department: DepartmentType;
  statusOptions: { value: string; label: string }[];
  statusField: "designStatus" | "prepressStatus" | "productionStatus";
  userRole: string;
  assignedBy?: string;
}

const ProductStatusSelector = ({
  product,
  orderId,
  department,
  statusOptions,
  statusField,
  userRole,
  assignedBy,
}: ProductStatusSelectorProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [showRemarksDialog, setShowRemarksDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [remarks, setRemarks] = useState("");
  
  // Open remarks dialog when selecting "pendingApproval" status
  const handleStatusSelect = (value: string) => {
    if (value === "pendingApproval") {
      setSelectedStatus(value);
      setShowRemarksDialog(true);
    } else {
      handleStatusChange(product.id, value);
    }
  };
  
  // Submit status change with remarks
  const handleRemarksSubmit = () => {
    if (!selectedStatus || !product.id) return;
    
    // Include current user info in the approval request
    const assignedByInfo = currentUser ? {
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email || "Unknown User",
      role: currentUser.role || "unknown"
    } : undefined;
    
    handleStatusChange(product.id, selectedStatus, remarks, assignedByInfo);
    setShowRemarksDialog(false);
    setRemarks("");
  };

  // Handle status change for a product
  const handleStatusChange = async (
    productId: string | undefined, 
    newStatus: string, 
    note: string = "", 
    assignInfo?: { userId: string; userName: string; role: string }
  ) => {
    if (!productId || !orderId) return;
    
    setUpdating(true);
    
    try {
      await updateProductStatus(
        orderId,
        productId,
        statusField,
        newStatus,
        note,
        assignInfo
      );
      
      toast({
        title: "Status Updated",
        description: newStatus === "pendingApproval" 
          ? "Product has been sent for approval." 
          : `Product status has been updated to ${newStatus}.`
      });
    } catch (error) {
      console.error("Error updating product status:", error);
      toast({
        title: "Error",
        description: "Failed to update product status.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  if (statusOptions.length === 0) {
    return <span className="text-sm text-muted-foreground">No actions available</span>;
  }

  return (
    <>
      <Select
        value={product[statusField] || ""}
        onValueChange={handleStatusSelect}
        disabled={updating}
      >
        <SelectTrigger className="w-[180px] bg-card">
          <SelectValue placeholder="Update status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Remarks Dialog */}
      <Dialog open={showRemarksDialog} onOpenChange={setShowRemarksDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send for Approval</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="remarks">Add remarks or notes (optional)</Label>
              <Textarea
                id="remarks"
                placeholder="Add any notes about this product's status..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemarksDialog(false)}>Cancel</Button>
            <Button onClick={handleRemarksSubmit}>Send for Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductStatusSelector;
