
import { useState } from "react";
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
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock approval data - would come from API in a real implementation
const approvalsMock = [
  { 
    id: "AP001", 
    orderId: "ORD-2023-1001", 
    type: "Design", 
    requestedBy: "John Smith",
    department: "Sales", 
    requestDate: "2025-05-10", 
    status: "pending",
    description: "Approval needed for logo placement on custom t-shirt design"
  },
  { 
    id: "AP002", 
    orderId: "ORD-2023-1005", 
    type: "Quote", 
    requestedBy: "Maria Lopez",
    department: "Sales", 
    requestDate: "2025-05-12", 
    status: "pending",
    description: "Price quote exceeds standard limits, needs manager approval"
  },
  { 
    id: "AP003", 
    orderId: "ORD-2023-1012", 
    type: "Production", 
    requestedBy: "Robert Johnson",
    department: "Design", 
    requestDate: "2025-05-13", 
    status: "pending",
    description: "Special material request for banner production"
  }
];

const Approvals = () => {
  const [approvals, setApprovals] = useState(approvalsMock);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleViewDetails = (approval: any) => {
    setSelectedApproval(approval);
    setDialogOpen(true);
  };

  const handleApprove = (id: string) => {
    // In a real app, this would call an API to update the approval status
    setApprovals(approvals.map(item => 
      item.id === id ? { ...item, status: 'approved' } : item
    ));
    setDialogOpen(false);
    toast({
      title: "Approval Granted",
      description: `Approval ${id} has been approved successfully.`,
    });
  };

  const handleReject = (id: string) => {
    // In a real app, this would call an API to update the approval status
    setApprovals(approvals.map(item => 
      item.id === id ? { ...item, status: 'rejected' } : item
    ));
    setDialogOpen(false);
    toast({
      title: "Approval Rejected",
      description: `Approval ${id} has been rejected.`,
      variant: "destructive"
    });
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Approvals</h1>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Requested By</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.length > 0 ? (
              approvals.map((approval) => (
                <TableRow key={approval.id}>
                  <TableCell>{approval.id}</TableCell>
                  <TableCell>{approval.orderId}</TableCell>
                  <TableCell>{approval.type}</TableCell>
                  <TableCell className="hidden md:table-cell">{approval.requestedBy}</TableCell>
                  <TableCell className="hidden md:table-cell">{approval.department}</TableCell>
                  <TableCell className="hidden md:table-cell">{approval.requestDate}</TableCell>
                  <TableCell>{getStatusBadge(approval.status)}</TableCell>
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
                <TableCell colSpan={8} className="text-center py-8">
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
              <DialogTitle>Approval Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium">Approval ID:</span>
                <span className="col-span-2">{selectedApproval.id}</span>
                
                <span className="font-medium">Order ID:</span>
                <span className="col-span-2">{selectedApproval.orderId}</span>
                
                <span className="font-medium">Type:</span>
                <span className="col-span-2">{selectedApproval.type}</span>
                
                <span className="font-medium">Requested By:</span>
                <span className="col-span-2">{selectedApproval.requestedBy}</span>
                
                <span className="font-medium">Department:</span>
                <span className="col-span-2">{selectedApproval.department}</span>
                
                <span className="font-medium">Date:</span>
                <span className="col-span-2">{selectedApproval.requestDate}</span>
                
                <span className="font-medium">Status:</span>
                <span className="col-span-2">{getStatusBadge(selectedApproval.status)}</span>
                
                <span className="font-medium">Description:</span>
                <span className="col-span-2">{selectedApproval.description}</span>
              </div>
            </div>
            {selectedApproval.status === 'pending' && (
              <DialogFooter className="flex justify-between sm:justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => handleReject(selectedApproval.id)}
                  className="flex items-center gap-1"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  onClick={() => handleApprove(selectedApproval.id)}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
              </DialogFooter>
            )}
            {selectedApproval.status !== 'pending' && (
              <DialogFooter>
                <div className="text-sm text-muted-foreground">
                  This approval has already been {selectedApproval.status}.
                </div>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Approvals;
