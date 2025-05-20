
import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { getOrdersWithRealTimeUpdates } from "@/lib/firebase";
import { Order } from "@/lib/firebase/types";
import { Loader2 } from "lucide-react";

// Function to determine badge color based on status
const getStatusBadge = (status: string) => {
  if (status.includes("Design")) return "bg-blue-500";
  if (status.includes("Prepress")) return "bg-purple-500";
  if (status.includes("Production")) return "bg-amber-500";
  if (status === "ReadyToDispatch") return "bg-green-500";
  if (status === "Completed") return "bg-gray-500";
  return "bg-gray-500";
};

// Function to convert status to a more readable format
const formatStatus = (status: string) => {
  return status
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim();
};

// Format date function
const formatDate = (timestamp: any) => {
  if (!timestamp || !timestamp.toDate) return "N/A";
  return new Date(timestamp.toDate()).toLocaleDateString();
};

const RecentOrders = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = getOrdersWithRealTimeUpdates((fetchedOrders) => {
      // Only show the 5 most recent orders
      const recentOrders = fetchedOrders.slice(0, 5);
      setOrders(recentOrders);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Client</TableHead>
                {!isMobile && <TableHead>Amount</TableHead>}
                <TableHead>Status</TableHead>
                {!isMobile && <TableHead>Date</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium whitespace-nowrap">{order.orderNumber}</TableCell>
                    <TableCell className="max-w-[180px] truncate">{order.clientName}</TableCell>
                    {!isMobile && <TableCell>₹{order.orderAmount.toLocaleString()}</TableCell>}
                    <TableCell>
                      <Badge className={getStatusBadge(order.status)}>
                        {isMobile ? formatStatus(order.status).split(' ')[0] : formatStatus(order.status)}
                      </Badge>
                    </TableCell>
                    {!isMobile && <TableCell>{formatDate(order.createdAt)}</TableCell>}
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isMobile ? 4 : 6} className="text-center py-4">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate('/orders')}
          >
            View All Orders
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
