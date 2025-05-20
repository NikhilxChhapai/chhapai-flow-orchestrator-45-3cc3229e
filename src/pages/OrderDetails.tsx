
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Pencil, ArrowLeft, Badge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getOrderWithRealTimeUpdates, updateOrderStatus, assignOrderToDepartment, updatePaymentStatus, updateOrder } from "@/lib/mockData";
import { Order, OrderStatus, PaymentStatus, TimelineEvent } from "@/lib/firebase/types";
import { useAuth } from "@/contexts/AuthContext";
import OrderAccessControl from "@/components/orders/OrderAccessControl";
import OrderDetailTabs from "@/components/orders/OrderDetailTabs";
import DepartmentAssignmentDialog from "@/components/orders/DepartmentAssignmentDialog";
import OrderStatusManager from "@/components/orders/OrderStatusManager";

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Get the user role for department-specific views
  const userRole = currentUser?.role || 'sales';

  useEffect(() => {
    let unsubscribe: () => void;

    if (orderId) {
      unsubscribe = getOrderWithRealTimeUpdates(orderId, (orderData) => {
        if (orderData) {
          // Format dates for display
          if (orderData.timeline) {
            const formattedTimeline = orderData.timeline.map(event => ({
              ...event,
              formattedDate: new Date(event.date.toDate()).toLocaleString(), 
              note: event.note || "" // Ensure note is always defined
            }));
            orderData.timeline = formattedTimeline;
          }
          
          // Make sure to set default values for required fields that might be missing
          const completeOrder: Order = {
            ...orderData,
            assignedDept: orderData.assignedDept || ('sales' as any),
            paymentStatus: orderData.paymentStatus || ('unpaid' as PaymentStatus),
            // Ensure all products have required fields
            products: orderData.products.map(product => ({
              ...product,
              quantity: product.quantity || 0,
              price: product.price || 0
            }))
          };
          
          setOrder(completeOrder);
        } else {
          toast({
            title: "Order Not Found",
            description: "The requested order could not be found.",
            variant: "destructive",
          });
        }
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [orderId, toast]);

  // Function to format order status for display
  const formatStatus = (status: string): string => {
    return status
      .replace(/_/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Function to get badge color based on status
  const getStatusBadge = (status: string): string => {
    if (status.startsWith("Order_")) return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    if (status.startsWith("Design_")) return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
    if (status.startsWith("Prepress_")) return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    if (status.startsWith("Production_")) return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    if (status === "ReadyToDispatch") return "bg-green-100 text-green-800 hover:bg-green-200";
    if (status === "Completed") return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!order || !orderId) return;
    
    setUpdatingStatus(true);
    try {
      await updateOrderStatus(orderId, newStatus, `Status updated to ${formatStatus(newStatus)}`);
      
      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${formatStatus(newStatus)}.`
      });
      
      // Auto-assign department based on status if enabled
      let department: any | undefined;
      if (newStatus.startsWith("Design_")) {
        department = "design";
      } else if (newStatus.startsWith("Prepress_")) {
        department = "prepress";
      } else if (newStatus.startsWith("Production_")) {
        department = "production";
      } else if (newStatus === "ReadyToDispatch" || newStatus === "Completed") {
        department = "sales";
      }
      
      if (department && department !== order.assignedDept) {
        await assignOrderToDepartment(orderId, department, newStatus);
        toast({
          title: "Department Updated",
          description: `Order has been assigned to ${department} department.`
        });
      }
      
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  // Handle payment status update
  const handlePaymentStatusUpdate = async (status: PaymentStatus) => {
    if (!order || !orderId) return;
    
    setUpdatingStatus(true);
    try {
      await updatePaymentStatus(orderId, status, `Payment status updated to ${status}`);
      
      toast({
        title: "Payment Status Updated",
        description: `Payment status has been updated to ${status}.`
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast({
        title: "Error",
        description: "Failed to update payment status.",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Format timeline events to ensure they have the required properties
  const timelineEvents: TimelineEvent[] = order?.timeline?.map(event => ({
    status: event.status,
    date: event.date,
    note: event.note || "",
    formattedDate: event.formattedDate || new Date(event.date.toDate()).toLocaleString()
  })) || [];

  return (
    <OrderAccessControl loading={loading} order={order} currentUser={currentUser}>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link to="/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold flex flex-col sm:flex-row sm:items-center gap-2">
              <span>Order #{order?.orderNumber}</span>
              <Badge className={`${order ? getStatusBadge(order.status) : ''} ml-0 sm:ml-3`}>
                {order ? formatStatus(order.status) : ''}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              Created on {order && new Date(order.createdAt.seconds * 1000).toLocaleString()}
            </p>
          </div>
          
          {(userRole === 'admin' || userRole === 'sales') && order && (
            <div className="flex flex-wrap gap-2">
              {order && (
                <DepartmentAssignmentDialog 
                  orderId={order.id} 
                  currentDepartment={order.assignedDept} 
                  remarks={order.remarks}
                />
              )}
              
              {userRole === 'admin' && (
                <Button variant="outline" asChild>
                  <Link to={`/orders/edit/${orderId}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Order
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
        
        {order && (
          <OrderDetailTabs 
            order={order}
            userRole={userRole}
            timelineEvents={timelineEvents}
            onStatusUpdate={handleStatusUpdate}
            onUpdatePaymentStatus={handlePaymentStatusUpdate}
            updatingStatus={updatingStatus}
            formatStatus={formatStatus}
            getStatusBadge={getStatusBadge}
          />
        )}
      </div>
    </OrderAccessControl>
  );
};

export default OrderDetails;
