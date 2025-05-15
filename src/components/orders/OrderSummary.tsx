
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
  getStatusBadge
}: OrderSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>
          Created on {createdDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <Badge className={`mt-1 ${getStatusBadge(status)}`}>
              {formatStatus(status)}
            </Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
            <p className="text-lg font-semibold mt-1">
              ₹{typeof orderAmount === 'number' 
                  ? orderAmount.toLocaleString('en-IN')
                  : orderAmount}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
            <p className="mt-1">{clientName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">GST Number</h3>
            <p className="mt-1">{gstNumber || "Not provided"}</p>
          </div>
        </div>

        {!updating ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Design_InProgress")}
              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              Design In Progress
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Prepress_InProgress")}
              className="bg-purple-50 text-purple-700 hover:bg-purple-100"
            >
              Prepress
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Production_Printing")}
              className="bg-amber-50 text-amber-700 hover:bg-amber-100"
            >
              Production
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("ReadyToDispatch")}
              className="bg-green-50 text-green-700 hover:bg-green-100"
            >
              Ready to Dispatch
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStatusUpdate("Completed")}
              className="bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              Completed
            </Button>
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
