
import { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getApprovalsPendingByUser, updateProductStatus } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ApprovalItem {
  id: string;
  orderId: string;
  orderNumber: string;
  productId: string;
  productName: string;
  type: string;
  requestedBy: {
    userId: string;
    userName: string;
    role: string;
  };
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  department: string;
}

const Approvals = () => {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [processingAction, setProcessingAction] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Fetch approvals when component mounts
  useEffect(() => {
    const fetchApprovals = async () => {
      if (currentUser) {
        try {
          const fetchedApprovals = await getApprovalsPendingByUser(currentUser.uid);
          setApprovals(fetchedApprovals);
        } catch (error) {
          console.error("Error fetching approvals:", error);
          toast({
            title: "Error",
            description: "Failed to load approvals data",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchApprovals();
  }, [currentUser, toast]);

  const handleViewDetails = (approval: ApprovalItem) => {
    setSelectedApproval(approval);
    setFeedbackText("");
    setDialogOpen(true);
  };

  const handleApprove = async (approval: ApprovalItem) => {
    setProcessingAction(true);
    try {
      // Update the product status to approved
      const statusField = getStatusFieldFromDepartment(approval.department);
      
      // Different status value based on department
      const newStatus = approval.department === 'design' ? 'approved' : 
                        approval.department === 'prepress' ? 'approved' : 'complete';
      
      await updateProductStatus(
        approval.orderId,
        approval.productId,
        statusField,
        newStatus,
        feedbackText || "Approved",
        currentUser ? {
          userId: currentUser.uid,
          userName: currentUser.displayName || currentUser.email || "Unknown User",
          role: currentUser.role
        } : undefined,
        approval.requestedBy // Pass original requester info
      );

      // Update local state
      setApprovals(prev => prev.filter(item => 
        !(item.orderId === approval.orderId && item.productId === approval.productId)
      ));

      toast({
        title: "Approval Granted",
        description: `The ${approval.department} work has been approved.`,
      });
    } catch (error) {
      console.error("Error approving item:", error);
      toast({
        title: "Error",
        description: "Failed to process approval",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(false);
      setDialogOpen(false);
    }
  };

  const handleReject = async (approval: ApprovalItem) => {
    if (!feedbackText) {
      toast({
        title: "Feedback Required",
        description: "Please provide feedback about what needs to be revised.",
        variant: "destructive"
      });
      return;
    }
    
    setProcessingAction(true);
    try {
      // Update the product status to needs revision
      const statusField = getStatusFieldFromDepartment(approval.department);
      await updateProductStatus(
        approval.orderId,
        approval.productId,
        statusField,
        'needsRevision',
        feedbackText,
        currentUser ? {
          userId: currentUser.uid,
          userName: currentUser.displayName || currentUser.email || "Unknown User",
          role: currentUser.role
        } : undefined,
        approval.requestedBy // Pass original requester info
      );

      // Update local state
      setApprovals(prev => prev.filter(item => 
        !(item.orderId === approval.orderId && item.productId === approval.productId)
      ));

      toast({
        title: "Changes Requested",
        description: `Feedback has been sent to the ${approval.department} team.`,
      });
    } catch (error) {
      console.error("Error rejecting item:", error);
      toast({
        title: "Error",
        description: "Failed to process rejection",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(false);
      setDialogOpen(false);
    }
  };

  // Helper function to get the correct status field based on department
  const getStatusFieldFromDepartment = (department: string): "designStatus" | "prepressStatus" | "productionStatus" => {
    switch (department) {
      case 'design':
        return "designStatus";
      case 'prepress':
        return "prepressStatus";
      case 'production':
        return "productionStatus";
      default:
        return "designStatus";
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
    }
  };

  const formatDepartmentName = (dept: string) => {
    return dept.charAt(0).toUpperCase() + dept.slice(1);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Approvals</h1>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="hidden md:table-cell">Requested By</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.length > 0 ? (
              approvals.map((approval) => (
                <TableRow key={`${approval.orderId}-${approval.productId}`}>
                  <TableCell>
                    <Link to={`/orders/${approval.orderId}`} className="text-primary hover:underline">
                      {approval.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{approval.productName}</TableCell>
                  <TableCell>{formatDepartmentName(approval.department)}</TableCell>
                  <TableCell className="hidden md:table-cell">{approval.requestedBy.userName}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {approval.requestDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(approval)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No approvals pending at this time.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedApproval && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Approval Request Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium">Order:</span>
                <span className="col-span-2">
                  <Link to={`/orders/${selectedApproval.orderId}`} className="text-primary hover:underline">
                    {selectedApproval.orderNumber}
                  </Link>
                </span>
                
                <span className="font-medium">Product:</span>
                <span className="col-span-2">{selectedApproval.productName}</span>
                
                <span className="font-medium">Department:</span>
                <span className="col-span-2">{formatDepartmentName(selectedApproval.department)}</span>
                
                <span className="font-medium">Requested By:</span>
                <span className="col-span-2">{selectedApproval.requestedBy.userName}</span>
                
                <span className="font-medium">Role:</span>
                <span className="col-span-2">{selectedApproval.requestedBy.role}</span>
                
                <span className="font-medium">Date:</span>
                <span className="col-span-2">{selectedApproval.requestDate.toLocaleDateString()}</span>
                
                <span className="font-medium">Notes:</span>
                <span className="col-span-2">{selectedApproval.description}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Add comments or feedback here..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {selectedApproval.type === 'pendingApproval' ? 
                    "Feedback is required if you're requesting changes." : 
                    "Add any additional notes here."}
                </p>
              </div>
            </div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button 
                variant="outline" 
                onClick={() => handleReject(selectedApproval)}
                className="flex items-center gap-1"
                disabled={processingAction}
              >
                {processingAction ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                Request Changes
              </Button>
              <Button 
                onClick={() => handleApprove(selectedApproval)}
                className="flex items-center gap-1"
                disabled={processingAction}
              >
                {processingAction ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Approvals;
