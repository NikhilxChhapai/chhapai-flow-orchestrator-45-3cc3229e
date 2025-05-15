import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getOrderById, updateOrderStatus, db } from "@/lib/firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { format } from "date-fns";

// Import refactored components
import OrderHeader from "@/components/orders/OrderHeader";
import OrderSummary from "@/components/orders/OrderSummary";
import OrderProducts from "@/components/orders/OrderProducts";
import OrderDelivery from "@/components/orders/OrderDelivery";
import OrderTimeline from "@/components/orders/OrderTimeline";
import OrderNotes from "@/components/orders/OrderNotes";

// Define Order type to fix TypeScript errors
interface OrderTimeline {
  status: string;
  date: Timestamp;
  note: string;
  formattedDate?: string;
}

// Define a separate TimelineEvent type to match the OrderTimeline component
interface TimelineEvent {
  status: string;
  formattedDate: string;
  note: string;
}

interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  orderAmount: number;
  status: string;
  createdAt: Timestamp;
  createdDate?: string;
  deliveryDate?: Timestamp;
  formattedDeliveryDate?: string;
  contactNumber: string;
  deliveryAddress: string;
  products: Array<{name: string; quantity?: number; price?: number}>;
  timeline?: OrderTimeline[];
  remarks?: string;
  gstNumber?: string;
}

// Order status mapping for badge colors
const getStatusBadge = (status: string) => {
  if (status.includes("Design")) return "bg-blue-500";
  if (status.includes("Prepress")) return "bg-purple-500";
  if (status.includes("Production")) return "bg-amber-500";
  if (status === "ReadyToDispatch") return "bg-green-500";
  if (status === "Completed") return "bg-gray-500";
  return "bg-gray-500";
};

// Format status text
const formatStatus = (status: string) => {
  return status
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim();
};

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // Set up real-time listener for the order
    const orderRef = doc(db, "orders", orderId);
    const unsubscribe = onSnapshot(
      orderRef, 
      (doc) => {
        if (doc.exists()) {
          const orderData = { id: doc.id, ...doc.data() } as Order;
          
          // Format dates
          if (orderData.createdAt) {
            orderData.createdDate = format(
              orderData.createdAt.toDate(), 
              "yyyy-MM-dd"
            );
          }
          
          if (orderData.deliveryDate) {
            if (typeof orderData.deliveryDate.toDate === 'function') {
              orderData.formattedDeliveryDate = format(
                orderData.deliveryDate.toDate(),
                "yyyy-MM-dd"
              );
            }
          }

          // Format timeline dates
          if (orderData.timeline) {
            orderData.timeline = orderData.timeline.map((item: OrderTimeline) => ({
              ...item,
              formattedDate: format(item.date.toDate(), "yyyy-MM-dd"),
            }));
          }
          
          setOrder(orderData);
        } else {
          setOrder(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error getting order:", error);
        toast({
          title: "Error",
          description: "Failed to load order details. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [orderId, toast]);

  const handleEdit = () => {
    navigate(`/orders/edit/${orderId}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!orderId || !order) return;
    
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus, `Status updated to ${formatStatus(newStatus)}`);
      toast({
        title: "Status Updated",
        description: `Order status updated to ${formatStatus(newStatus)}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/orders')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Loading...</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/orders')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Order Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold">Order Not Found</h2>
              <p className="text-muted-foreground mt-2 mb-4">
                The order you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => navigate('/orders')}>
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Convert OrderTimeline[] to TimelineEvent[] to match the expected type in OrderTimeline component
  const formattedTimeline: TimelineEvent[] = order.timeline ? 
    order.timeline.map(item => ({
      status: item.status,
      formattedDate: item.formattedDate || format(item.date.toDate(), "yyyy-MM-dd"),
      note: item.note
    })) : [];

  return (
    <div className="space-y-6 animate-fade-in print:m-4">
      <OrderHeader
        orderNumber={order.orderNumber}
        clientName={order.clientName}
        orderId={order.id}
        onEdit={handleEdit}
        onPrint={handlePrint}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <OrderSummary
            orderAmount={order.orderAmount}
            status={order.status}
            clientName={order.clientName}
            gstNumber={order.gstNumber}
            createdDate={order.createdDate || ""}
            onStatusUpdate={handleUpdateStatus}
            updating={updating}
            formatStatus={formatStatus}
            getStatusBadge={getStatusBadge}
          />
          
          <Card className="mt-6">
            <CardContent className="pt-6">
              <OrderProducts products={order.products} />
            </CardContent>
          </Card>
        </div>

        <OrderDelivery
          deliveryDate={order.formattedDeliveryDate || ""}
          contactNumber={order.contactNumber}
          deliveryAddress={order.deliveryAddress}
        />
      </div>

      {order.timeline && (
        <OrderTimeline 
          timeline={formattedTimeline} 
          formatStatus={formatStatus} 
        />
      )}

      {order.remarks && (
        <OrderNotes remarks={order.remarks} />
      )}

      <div className="print:hidden">
        <Button 
          variant="outline" 
          onClick={() => navigate('/orders')}
          className="mr-2"
        >
          Back to Orders
        </Button>
        <Button onClick={handleEdit}>
          Edit Order
        </Button>
      </div>
    </div>
  );
};

export default OrderDetails;
