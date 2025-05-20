
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DepartmentType, OrderStatus } from "@/lib/firebase/types";
import { useAuth } from "@/contexts/AuthContext";

interface OrderSummaryProps {
  orderAmount: number;
  status: string;
  clientName: string;
  gstNumber?: string;
  createdDate: string;
  onStatusUpdate: (status: OrderStatus) => void;
  updating: boolean;
  formatStatus: (status: string) => string;
  getStatusBadge: (status: string) => string;
  departmentType?: DepartmentType;
}

const OrderSummary = ({
  orderAmount,
  status,
  clientName,
  gstNumber,
  createdDate,
  onStatusUpdate,
  updating,
  formatStatus,
  getStatusBadge,
  departmentType = "sales"
}: OrderSummaryProps) => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.role || 'sales';

  // Define department-specific status buttons based on user role and order department
  const getStatusButtons = () => {
    // Admin can update to any status
    if (userRole === 'admin') {
      switch (departmentType) {
        case "design":
          return (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Design_InProgress" as OrderStatus)}
                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium"
              >
                In Progress
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Design_PendingApproval" as OrderStatus)}
                className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
              >
                Pending Approval
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Design_Approved" as OrderStatus)}
                className="bg-green-50 text-green-700 hover:bg-green-100 font-medium"
              >
                Approve Design
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Design_Rejected" as OrderStatus)}
                className="bg-red-50 text-red-700 hover:bg-red-100 font-medium"
              >
                Reject Design
              </Button>
            </>
          );
        case "prepress":
          return (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Prepress_InProgress" as OrderStatus)}
                className="bg-purple-50 text-purple-700 hover:bg-purple-100 font-medium"
              >
                In Progress
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Prepress_PendingApproval" as OrderStatus)}
                className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
              >
                Pending Approval
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Prepress_Approved" as OrderStatus)}
                className="bg-green-50 text-green-700 hover:bg-green-100 font-medium"
              >
                Approve
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Prepress_Rejected" as OrderStatus)}
                className="bg-red-50 text-red-700 hover:bg-red-100 font-medium"
              >
                Reject
              </Button>
            </>
          );
        case "production":
          return (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Production_Printing" as OrderStatus)}
                className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
              >
                Printing
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Production_Finishing" as OrderStatus)}
                className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
              >
                Finishing
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Production_Completed" as OrderStatus)}
                className="bg-green-50 text-green-700 hover:bg-green-100 font-medium"
              >
                Production Complete
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("ReadyToDispatch" as OrderStatus)}
                className="bg-green-50 text-green-700 hover:bg-green-100 font-medium"
              >
                Ready to Dispatch
              </Button>
            </>
          );
        default:
          return (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Order_Received" as OrderStatus)}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
              >
                Received
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Order_Confirmed" as OrderStatus)}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
              >
                Confirmed
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Design_InProgress" as OrderStatus)}
                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium"
              >
                To Design
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Dispatched" as OrderStatus)}
                className="bg-green-50 text-green-700 hover:bg-green-100 font-medium"
              >
                Dispatched
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Completed" as OrderStatus)}
                className="bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium"
              >
                Completed
              </Button>
            </>
          );
      }
    }

    // Sales can update to specific statuses
    if (userRole === 'sales') {
      switch (departmentType) {
        case "design":
          return (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Design_Approved" as OrderStatus)}
                className="bg-green-50 text-green-700 hover:bg-green-100 font-medium"
              >
                Approve Design
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Design_Rejected" as OrderStatus)}
                className="bg-red-50 text-red-700 hover:bg-red-100 font-medium"
              >
                Request Changes
              </Button>
            </>
          );
        case "prepress":
          return (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Prepress_Approved" as OrderStatus)}
                className="bg-green-50 text-green-700 hover:bg-green-100 font-medium"
              >
                Approve Prepress
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Prepress_Rejected" as OrderStatus)}
                className="bg-red-50 text-red-700 hover:bg-red-100 font-medium"
              >
                Request Changes
              </Button>
            </>
          );
        case "production":
          return (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("ReadyToDispatch" as OrderStatus)}
                className="bg-green-50 text-green-700 hover:bg-green-100 font-medium"
              >
                Ready to Dispatch
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Dispatched" as OrderStatus)}
                className="bg-purple-50 text-purple-700 hover:bg-purple-100 font-medium"
              >
                Dispatched
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Completed" as OrderStatus)}
                className="bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium"
              >
                Mark Complete
              </Button>
            </>
          );
        default:
          return (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Order_Received" as OrderStatus)}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
              >
                Received
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Order_Confirmed" as OrderStatus)}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
              >
                Confirmed
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusUpdate("Design_InProgress" as OrderStatus)}
                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium"
              >
                To Design
              </Button>
            </>
          );
      }
    }

    // Design department can only update design statuses
    if (userRole === 'design' && departmentType === 'design') {
      return (
        <>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onStatusUpdate("Design_InProgress" as OrderStatus)}
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium"
          >
            In Progress
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onStatusUpdate("Design_PendingApproval" as OrderStatus)}
            className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
          >
            Send for Approval
          </Button>
        </>
      );
    }

    // Prepress department can only update prepress statuses
    if (userRole === 'prepress' && departmentType === 'prepress') {
      return (
        <>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onStatusUpdate("Prepress_InProgress" as OrderStatus)}
            className="bg-purple-50 text-purple-700 hover:bg-purple-100 font-medium"
          >
            In Progress
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onStatusUpdate("Prepress_PendingApproval" as OrderStatus)}
            className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
          >
            Send for Approval
          </Button>
        </>
      );
    }

    // Production department can only update production statuses
    if (userRole === 'production' && departmentType === 'production') {
      return (
        <>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onStatusUpdate("Production_Printing" as OrderStatus)}
            className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
          >
            Printing
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onStatusUpdate("Production_Finishing" as OrderStatus)}
            className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
          >
            Finishing
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onStatusUpdate("Production_Completed" as OrderStatus)}
            className="bg-green-50 text-green-700 hover:bg-green-100 font-medium"
          >
            Production Complete
          </Button>
        </>
      );
    }

    // No buttons for other roles/departments
    return null;
  };

  // Only show financial information to admin and sales
  const showFinancialInfo = userRole === 'admin' || userRole === 'sales';

  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-muted/30">
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>
          Created on {createdDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <Badge className={`mt-1 ${getStatusBadge(status)}`}>
              {formatStatus(status)}
            </Badge>
          </div>
          {showFinancialInfo && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
              <p className="text-lg font-semibold mt-1 text-foreground">
                ₹{typeof orderAmount === 'number' 
                    ? orderAmount.toLocaleString('en-IN')
                    : orderAmount}
              </p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
            <p className="mt-1 text-foreground">{clientName}</p>
          </div>
          {showFinancialInfo && gstNumber && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">GST Number</h3>
              <p className="mt-1 text-foreground">{gstNumber || "Not provided"}</p>
            </div>
          )}
        </div>

        {!updating ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {getStatusButtons()}
          </div>
        ) : (
          <div className="mt-6 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
