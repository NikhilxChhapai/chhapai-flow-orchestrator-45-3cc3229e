
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, Loader2, CheckCircle, Clock, FilePen, PenLine, Printer } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getOrderById, updateOrderStatus, db, OrderStatus, PaymentStatus } from "@/lib/firebase";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import refactored components
import OrderHeader from "@/components/orders/OrderHeader";
import OrderSummary from "@/components/orders/OrderSummary";
import OrderProducts from "@/components/orders/OrderProducts";
import OrderDelivery from "@/components/orders/OrderDelivery";
import OrderTimeline from "@/components/orders/OrderTimeline";
import OrderNotes from "@/components/orders/OrderNotes";
import OrderPayment from "@/components/orders/OrderPayment";
import OrderProductsWorkflow from "@/components/orders/OrderProductsWorkflow";

// Define Order type to fix TypeScript errors
interface OrderTimeline {
  status: string;
  date: any; // Use 'any' to support both Firebase and Mock Timestamp
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
  createdAt: any; // Use 'any' to support both Firebase and Mock Timestamp
  createdDate?: string;
  deliveryDate?: any; // Use 'any' to support both Firebase and Mock Timestamp
  formattedDeliveryDate?: string;
  contactNumber: string;
  deliveryAddress: string;
  paymentStatus?: PaymentStatus; // Added paymentStatus
  products: Array<{
    name: string; 
    quantity?: number; 
    price?: number;
    description?: string;
    designStatus?: string;
    prepressStatus?: string;
    productionStatus?: string;
    productionStages?: {
      [key: string]: boolean;
    };
  }>;
  timeline?: OrderTimeline[];
  remarks?: string;
  gstNumber?: string;
  assignedDept?: string;
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

// Department color mapping
const getDepartmentColor = (department: string) => {
  switch (department?.toLowerCase()) {
    case 'design': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'prepress': return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'production': return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'sales': return 'bg-green-100 text-green-800 border-green-300';
    case 'admin': return 'bg-gray-100 text-gray-800 border-gray-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user role for permissions (in a real app, this would come from auth context)
  // Define the user role as a union type of allowed values
  const userRole: "admin" | "sales" | "design" | "prepress" | "production" = "admin";

  const refreshOrderData = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // Set up real-time listener for the order
    const fetchOrder = async () => {
      try {
        console.log("Fetching order with ID:", orderId);
        const orderData = await getOrderById(orderId);
        
        if (orderData) {
          console.log("Order data found:", orderData);
          const processedOrder = { ...orderData as Order };
          
          // Format dates
          if (processedOrder.createdAt) {
            processedOrder.createdDate = format(
              processedOrder.createdAt.toDate(), 
              "yyyy-MM-dd"
            );
          }
          
          if (processedOrder.deliveryDate) {
            if (typeof processedOrder.deliveryDate.toDate === 'function') {
              processedOrder.formattedDeliveryDate = format(
                processedOrder.deliveryDate.toDate(),
                "yyyy-MM-dd"
              );
            }
          }

          // Format timeline dates
          if (processedOrder.timeline) {
            processedOrder.timeline = processedOrder.timeline.map((item: OrderTimeline) => ({
              ...item,
              formattedDate: format(item.date.toDate(), "yyyy-MM-dd"),
            }));
          }
          
          setOrder(processedOrder);
        } else {
          console.error("No order data found for ID:", orderId);
          setOrder(null);
        }
      } catch (error) {
        console.error("Error getting order:", error);
        toast({
          title: "Error",
          description: "Failed to load order details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, toast, refreshKey]);

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
      // Cast newStatus to OrderStatus type to fix TypeScript error
      await updateOrderStatus(orderId, newStatus as OrderStatus, `Status updated to ${formatStatus(newStatus)}`);
      toast({
        title: "Status Updated",
        description: `Order status updated to ${formatStatus(newStatus)}`,
      });
      refreshOrderData();
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

  // Function to check if current user can perform department-specific actions
  const canPerformAction = (requiredRole: string) => {
    if (userRole === "admin") return true;
    return userRole === requiredRole;
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

  // Check if user can edit payment status (sales or admin roles)
  const canEditPayment = userRole === "admin" || userRole === "sales";

  // Determine if the user can view/edit workflow based on assigned department
  const showWorkflow = true; // In a real app, this would check against user department

  // Get department-specific actions
  const getDepartmentActions = () => {
    const actions = [];
    
    // Design department actions
    if (canPerformAction("design") || userRole === "admin") {
      actions.push(
        <Button key="design-upload" className="bg-blue-600 hover:bg-blue-700">
          <PenLine className="mr-2 h-4 w-4" /> Upload Design
        </Button>
      );
    }
    
    // Prepress department actions
    if (canPerformAction("prepress") || userRole === "admin") {
      actions.push(
        <Button key="prepress-proof" className="bg-purple-600 hover:bg-purple-700">
          <FilePen className="mr-2 h-4 w-4" /> Generate Proof
        </Button>
      );
    }
    
    // Production department actions
    if (canPerformAction("production") || userRole === "admin") {
      actions.push(
        <Button key="production-schedule" className="bg-amber-600 hover:bg-amber-700">
          <Clock className="mr-2 h-4 w-4" /> Update Production
        </Button>
      );
    }
    
    // Sales department actions
    if (canPerformAction("sales") || userRole === "admin") {
      actions.push(
        <Button key="sales-invoice" className="bg-green-600 hover:bg-green-700">
          <Printer className="mr-2 h-4 w-4" /> Generate Invoice
        </Button>
      );
    }
    
    return actions;
  };

  return (
    <div className="space-y-6 animate-fade-in print:m-4">
      <OrderHeader
        orderNumber={order.orderNumber}
        clientName={order.clientName}
        orderId={order.id}
        onEdit={handleEdit}
        onPrint={handlePrint}
      />
      
      {/* Department Tag */}
      {order.assignedDept && (
        <div className="mt-2">
          <Badge className={`text-sm py-1 px-3 border ${getDepartmentColor(order.assignedDept)}`}>
            {order.assignedDept} Department
          </Badge>
        </div>
      )}

      {/* Department-specific actions */}
      <div className="flex flex-wrap gap-2 print:hidden">
        {getDepartmentActions()}
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full print:hidden">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
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
              
              <Card className="mt-6 border-t-4 border-t-blue-500 shadow-md">
                <CardContent className="pt-6">
                  <OrderProducts products={order.products} />
                </CardContent>
              </Card>
              
              <OrderPayment
                orderId={order.id}
                orderAmount={order.orderAmount}
                paymentStatus={order.paymentStatus || "unpaid"}
                canEditPayment={canEditPayment}
              />
            </div>

            <div className="space-y-6">
              <OrderDelivery
                deliveryDate={order.formattedDeliveryDate || ""}
                contactNumber={order.contactNumber}
                deliveryAddress={order.deliveryAddress}
              />
              
              {order.remarks && (
                <OrderNotes remarks={order.remarks} />
              )}

              {/* Department Assignment */}
              <Card className="border-l-4 border-l-blue-500 shadow-md">
                <CardContent className="pt-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Assigned Department</h3>
                    <p className="font-medium capitalize">{order.assignedDept || "Not assigned"}</p>
                    
                    {(userRole === "admin" || userRole === "sales") && (
                      <div className="mt-4 space-y-2">
                        <Button size="sm" variant="outline" className="mr-2 border-blue-500 text-blue-700 hover:bg-blue-50">
                          Design
                        </Button>
                        <Button size="sm" variant="outline" className="mr-2 border-purple-500 text-purple-700 hover:bg-purple-50">
                          Prepress
                        </Button>
                        <Button size="sm" variant="outline" className="mr-2 border-amber-500 text-amber-700 hover:bg-amber-50">
                          Production
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Status Update */}
              {(userRole === "admin" || userRole === order.assignedDept?.toLowerCase()) && (
                <Card className="border-l-4 border-l-green-500 shadow-md">
                  <CardContent className="pt-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Quick Status Update</h3>
                    <div className="space-y-2 mt-3">
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center">
                        <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        Request Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="workflow" className="mt-4">
          {showWorkflow && (
            <OrderProductsWorkflow
              orderId={order.id}
              products={order.products}
              department={userRole}
              onRefresh={refreshOrderData}
            />
          )}
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          {order.timeline && (
            <OrderTimeline 
              timeline={formattedTimeline} 
              formatStatus={formatStatus} 
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Always show these on print */}
      <div className="hidden print:block mt-6">
        <OrderProductsWorkflow
          orderId={order.id}
          products={order.products}
          department={userRole}
          onRefresh={refreshOrderData}
        />
        
        {order.timeline && (
          <OrderTimeline 
            timeline={formattedTimeline} 
            formatStatus={formatStatus} 
          />
        )}
      </div>

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
