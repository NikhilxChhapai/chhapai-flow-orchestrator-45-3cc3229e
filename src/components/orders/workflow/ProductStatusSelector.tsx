
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
  
  // Disable if product is already pending approval
  const isPendingApproval = product[statusField] === "pendingApproval";
  
  // Open remarks dialog when selecting special statuses
  const handleStatusSelect = (value: string) => {
    if (value === "pendingApproval" || value === "needsRevision") {
      setSelectedStatus(value);
      setShowRemarksDialog(true);
    } else {
      handleStatusChange(product.id, value);
    }
  };
  
  // Dialog title based on selected status
  const getDialogTitle = () => {
    if (selectedStatus === "pendingApproval") return "Send for Approval";
    if (selectedStatus === "needsRevision") return "Request Revisions";
    return "Add Notes";
  };
  
  // Submit status change with remarks
  const handleRemarksSubmit = () => {
    if (!selectedStatus || !product.id) return;
    
    // Include current user info in the approval request
    const userInfo = currentUser ? {
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email || "Unknown User",
      role: currentUser.role || "unknown"
    } : undefined;
    
    handleStatusChange(product.id, selectedStatus, remarks, userInfo);
    setShowRemarksDialog(false);
    setRemarks("");
  };

  // Handle status change for a product
  const handleStatusChange = async (
    productId: string | undefined, 
    newStatus: string, 
    note: string = "", 
    userInfo?: { userId: string; userName: string; role: string }
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
        userInfo
      );
      
      let successMessage = "";
      
      switch (newStatus) {
        case "pendingApproval":
          successMessage = "Product has been sent for approval.";
          break;
        case "approved":
          successMessage = "Product has been approved.";
          break;
        case "needsRevision":
          successMessage = "Product has been sent back for revisions.";
          break;
        default:
          successMessage = `Product status has been updated to ${newStatus}.`;
      }
      
      toast({
        title: "Status Updated",
        description: successMessage
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

  // If no status options or pending approval (and not admin), disable selector
  if ((statusOptions.length === 0) || (isPendingApproval && userRole !== 'admin')) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[180px] bg-card cursor-not-allowed opacity-70">
          <SelectValue>
            {isPendingApproval ? "Pending Approval" : "No Actions Available"}
          </SelectValue>
        </SelectTrigger>
      </Select>
    );
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
            <DialogTitle>{getDialogTitle()}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="remarks">Add remarks or notes {selectedStatus === "pendingApproval" ? "(optional)" : "(required)"}</Label>
              <Textarea
                id="remarks"
                placeholder={selectedStatus === "pendingApproval" 
                  ? "Add any notes about this product's status..." 
                  : "Please specify what needs to be revised..."}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required={selectedStatus === "needsRevision"}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemarksDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleRemarksSubmit}
              disabled={selectedStatus === "needsRevision" && !remarks}
            >
              {selectedStatus === "pendingApproval" ? "Send for Approval" : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductStatusSelector;
