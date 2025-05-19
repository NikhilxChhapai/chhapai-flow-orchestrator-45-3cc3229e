
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
import { DepartmentType } from "@/lib/firebase/types";

interface OrderSummaryProps {
  orderAmount: number;
  status: string;
  clientName: string;
  gstNumber?: string;
  createdDate: string;
  onStatusUpdate: (status: string) => void;
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
  // Define department-specific status buttons
  const getDepartmentStatusButtons = () => {
    switch (departmentType) {
      case "design":
        return (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Design_InProgress")}
              className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium"
            >
              In Progress
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Design_NeedsApproval")}
              className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
            >
              Needs Approval
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Design_Approved")}
              className="bg-green-50 text-green-700 hover:bg-green-100 font-medium"
            >
              Approve Design
            </Button>
          </>
        );
      case "prepress":
        return (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Prepress_InProgress")}
              className="bg-purple-50 text-purple-700 hover:bg-purple-100 font-medium"
            >
              In Progress
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Prepress_NeedsApproval")}
              className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
            >
              Needs Approval
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Prepress_Approved")}
              className="bg-green-50 text-green-700 hover:bg-green-100 font-medium"
            >
              Approve
            </Button>
          </>
        );
      case "production":
        return (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Production_Printing")}
              className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
            >
              Printing
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Production_Finishing")}
              className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
            >
              Finishing
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("ReadyToDispatch")}
              className="bg-green-50 text-green-700 hover:bg-green-100 font-medium"
            >
              Ready to Dispatch
            </Button>
          </>
        );
      case "sales":
      default:
        return (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Order_Received")}
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
            >
              Received
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Design_InProgress")}
              className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium"
            >
              Design
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("ReadyToDispatch")}
              className="bg-green-50 text-green-700 hover:bg-green-100 font-medium"
            >
              Ready to Dispatch
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Completed")}
              className="bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium"
            >
              Completed
            </Button>
          </>
        );
    }
  };

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
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
            <p className="text-lg font-semibold mt-1 text-foreground">
              ₹{typeof orderAmount === 'number' 
                  ? orderAmount.toLocaleString('en-IN')
                  : orderAmount}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
            <p className="mt-1 text-foreground">{clientName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">GST Number</h3>
            <p className="mt-1 text-foreground">{gstNumber || "Not provided"}</p>
          </div>
        </div>

        {!updating ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {getDepartmentStatusButtons()}
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
