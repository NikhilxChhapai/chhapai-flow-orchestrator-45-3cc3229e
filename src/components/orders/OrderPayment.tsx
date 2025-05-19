
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PaymentStatus } from "@/lib/firebase/types";
import { Loader2, DollarSign } from "lucide-react";

interface OrderPaymentProps {
  orderId: string;
  orderAmount: number;
  paymentStatus: PaymentStatus;
  canEditPayment?: boolean;
  canUpdatePayment?: boolean;
  updating?: boolean;
  onUpdatePaymentStatus?: (status: PaymentStatus) => Promise<void>;
}

const OrderPayment = ({ 
  orderId, 
  orderAmount, 
  paymentStatus,
  canEditPayment = false,
  canUpdatePayment = false,
  updating = false,
  onUpdatePaymentStatus
}: OrderPaymentProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(updating);
  const [receivedAmount, setReceivedAmount] = useState<number>(
    paymentStatus === "paid" ? orderAmount : 
    paymentStatus === "pending" ? orderAmount * 0.5 : 0
  );
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>(paymentStatus);

  const pendingAmount = orderAmount - receivedAmount;
  
  // Payment status styles
  const getStatusStyles = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "unpaid":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleUpdatePayment = async () => {
    if (!orderId || !onUpdatePaymentStatus) return;

    try {
      setIsUpdating(true);
      await onUpdatePaymentStatus(newPaymentStatus);
      
      toast({
        title: "Payment Updated",
        description: `Payment status updated to ${newPaymentStatus}`,
      });
    } catch (error) {
      console.error("Error updating payment:", error);
      toast({
        title: "Error",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Payment Information</CardTitle>
          <CardDescription>Track and update payment status</CardDescription>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(paymentStatus)}`}>
          {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold">₹{orderAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
            <div className="flex items-center gap-2">
              <DollarSign className={`h-5 w-5 ${paymentStatus === "paid" ? "text-green-500" : paymentStatus === "pending" ? "text-yellow-500" : "text-red-500"}`} />
              <span className="font-medium">
                {paymentStatus === "paid" ? "Fully Paid" : 
                 paymentStatus === "pending" ? "Partially Paid" : "Unpaid"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Received Amount</p>
            <p className="text-xl font-medium text-green-600">₹{receivedAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
            <p className="text-xl font-medium text-red-600">₹{pendingAmount.toLocaleString()}</p>
          </div>
        </div>

        {(canUpdatePayment || canEditPayment) && (
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-2">Update Payment</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="receivedAmount">Received Amount</Label>
                <Input 
                  id="receivedAmount" 
                  type="number" 
                  value={receivedAmount}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setReceivedAmount(value);
                    if (value >= orderAmount) {
                      setNewPaymentStatus("paid");
                    } else if (value > 0) {
                      setNewPaymentStatus("pending");
                    } else {
                      setNewPaymentStatus("unpaid");
                    }
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select 
                  value={newPaymentStatus} 
                  onValueChange={(value) => setNewPaymentStatus(value as PaymentStatus)}
                >
                  <SelectTrigger id="paymentStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="pending">Partially Paid</SelectItem>
                    <SelectItem value="paid">Fully Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {(canUpdatePayment || canEditPayment) && onUpdatePaymentStatus && (
        <CardFooter>
          <Button 
            onClick={handleUpdatePayment} 
            disabled={isUpdating || paymentStatus === newPaymentStatus}
            className="w-full"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Payment Status'
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default OrderPayment;
